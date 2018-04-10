import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Rx';
import { EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/subject';
import { LabelForce } from './../../util/label/label.force';
import { VisualizationView } from './../../model/chart-view.model';
import * as THREE from 'three';
import * as _ from 'lodash';
import { debounceTime } from 'rxjs/operators';

export class LabelController {

    static reduceHtml(data: Array<{ x: number, y: number, name: string }>, align: 'RIGHT' | 'LEFT' = 'LEFT'): string {
        return (align === 'LEFT') ?
            data.reduce((p, c) => { return p += '<div class="z-tooltip" style="left:' + c.x + 'px;top:' + c.y + 'px;">' + c.name + '</div>'; }, '') :
            data.reduce((p, c) => { return p += '<div class="z-tooltip" style="text-align:right; width:300px; display:inline-block; left:' + (c.x - 300) + 'px;top:' + c.y + 'px;">' + c.name + '</div>'; }, '');


    }
    // Get Objects In Frustum
    static filterObjectsInFrustum(objs: Array<THREE.Object3D>, view: VisualizationView): Array<THREE.Object3D> {
        const frustum = new THREE.Frustum();
        frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices(view.camera.projectionMatrix, view.camera.matrixWorldInverse));
        return objs.filter(obj => frustum.containsPoint(obj.position));
    }

    static pixelLayout(objs: Array<THREE.Object3D>, view: VisualizationView, options: any):
        Array<{ x: number, y: number, name: string }> {
        const w = view.viewport.width * .5;
        const h = view.viewport.height * .5;
        return objs.map(mesh => {
            const vector = mesh.position.clone().project(view.camera)
            vector.y = -(vector.y * h) + h - 6;
            vector.x = (vector.x * w) + w - 6;
            return { x: vector.x, y: vector.y, z: vector.z, name: mesh.userData.tooltip, width: 70, height: 10 };
        });
    }

    // Force Directed Map Layout In Quarters
    static forceLayout(objs: Array<THREE.Object3D>, view: VisualizationView, options: any):
        Array<{ x: number, y: number, name: string }> {

        let limit: number = options.limit || 50;
        const iterations: number = options.iterations || 200;
        const radius: number = options.radius || 3;

        const qlimit = Math.floor(limit /= 4);
        const limits = {
            tl: qlimit,
            tr: qlimit,
            bl: qlimit,
            br: qlimit
        }
        const w = view.viewport.width * .5;
        const h = view.viewport.height * .5;
        let data = objs.map(mesh => {
            const vector = mesh.position.clone().project(view.camera)
            vector.y = -(vector.y * h) + h;
            vector.x = (vector.x * w) + w;
            return { x: vector.x, y: vector.y, z: vector.z, name: mesh.userData.tooltip, width: 70, height: 10 };
        }).sort((a, b) => a.z - b.z);
        // Sep into quartiles
        data = data.filter(v => {
            if (v.y < h) {
                if (v.x < w) {
                    limits.tl -= 1;
                    return (limits.tl > 0);
                }
                limits.tr -= 1;
                return (limits.tr > 0);
            } else {
                if (v.x < w) {
                    limits.bl -= 1;
                    return (limits.bl > 0);
                }
                limits.br -= 1;
                return (limits.br > 0);
            }
        });

        const anchors = data.map(datum => ({
            x: datum.x,
            y: datum.y,
            r: radius
        }));

        new LabelForce()
            .label(data)
            .anchor(anchors)
            .width(view.viewport.width)
            .height(view.viewport.width)
            .start(iterations);

        return data;
    }

    protected _view: VisualizationView;
    public change: Subject<any>;
    public onShow: EventEmitter<any>;
    public $onShow: Subscription;
    public onHide: EventEmitter<any>;
    public $onHide: Subscription;
    public onEnable: EventEmitter<any>;
    public $onEnable: Subscription;
    public onDisable: EventEmitter<any>;
    public $onDisable: Subscription;
    public hidden = false;

    constructor(view: VisualizationView, debounce: number = 300, align: 'RIGHT' | 'LEFT' = 'RIGHT') {
        this._view = view;
        this.onShow = new EventEmitter();
        this.onHide = new EventEmitter();
        this.onEnable = new EventEmitter();
        this.onDisable = new EventEmitter();
        this.change = new Subject();
        this.$onShow = this.change.pipe(debounceTime(300)).subscribe(e => {
            console.log('show');
            this.hidden = false;
            this.onShow.emit(e);
        });
        this.$onHide = this.change.subscribe(e => {
            if (this.hidden) { return }
            console.log('hide');
            this.hidden = true;
            this.onHide.emit(e);
        });
    }

    private _enabled: boolean = false;
    public get enable(): boolean { return this._enabled; }
    public set enable(value: boolean) {
        if (value === this._enabled) { return; }
        if (value) {
            this.onEnable.emit();
            this._view.controls.addEventListener('change', this.onChange.bind(this));
        } else {
            this.onDisable.emit();
            this._view.controls.removeEventListener('change', this.onChange.bind(this));
        }
    }

    private onChange(): void {
        this.change.next();
    }

    // limit: number = 50, iterations: number = 200, radius: number = 3, align: 'RIGHT' | 'LEFT' = 'LEFT'
    public generateLabels(objects: Array<THREE.Object3D>, view: VisualizationView, generator: 'FORCE' | 'GRID' | 'PIXEL' = 'FORCE', options: any = {}): string {
        let pts;
        const objs = LabelController.filterObjectsInFrustum(objects, view);
        switch (generator) {
            case 'FORCE':
                pts = LabelController.forceLayout(objs, view, options);
                break;
            case 'PIXEL':
                pts = LabelController.pixelLayout(objs, view, options);
                break;
            case 'GRID':
                pts = LabelController.forceLayout(objs, view, options);
                break;
        }

        return LabelController.reduceHtml(pts, options.align || 'RIGHT');
    }
}
