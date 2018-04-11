import { ILabel } from './label.controller';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Rx';
import { EventEmitter } from '@angular/core';
import { Subject } from 'rxjs/subject';
import { LabelForce } from './../../util/label/label.force';
import { VisualizationView } from './../../model/chart-view.model';
import * as THREE from 'three';
import * as _ from 'lodash';
import { debounceTime, skipWhile } from 'rxjs/operators';

export interface ILabel {
    position: THREE.Vector3;
    userData: { tooltip: string };
}

export class LabelController {

    public generateLabels(objects: Array<ILabel>, view: VisualizationView, generator: 'FORCE' | 'GRID' | 'PIXEL' = 'FORCE', options: any = {}): string {
        let pts;
        const objs = LabelController.filterObjectsInFrustum(objects, view, options);
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

    static reduceHtml(data: Array<{ x: number, y: number, name: string }>, align: 'RIGHT' | 'LEFT' | 'CENTER' = 'LEFT'): string {
        return (align === 'LEFT') ? data.reduce((p, c) => { return p += '<div class="z-tooltip" style="left:' + c.x + 'px;top:' + c.y + 'px;">' + c.name + '</div>'; }, '') :
            (align === 'RIGHT') ? data.reduce((p, c) => { return p += '<div class="z-tooltip" style="text-align:right; width:300px; display:inline-block; left:' + (c.x - 300) + 'px;top:' + c.y + 'px;">' + c.name + '</div>'; }, '') :
                data.reduce((p, c) => { return p += '<div class="z-tooltip" style="text-align:center; width:300px; display:inline-block; left:' + (c.x - 150) + 'px;top:' + c.y + 'px;">' + c.name + '</div>'; }, '');
    }
    // Get Objects In Frustum
    static filterObjectsInFrustum(objs: Array<ILabel>, view: VisualizationView, options: any): Array<ILabel> {
        const frustum = new THREE.Frustum();
        frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices(view.camera.projectionMatrix, view.camera.matrixWorldInverse));

        const yUnlimited = options.hasOwnProperty('yUnlimited');
        const xUnlimited = options.hasOwnProperty('xUnlimited');
        return objs.filter(obj => {
            const pt = obj.position.clone();
            if (xUnlimited) {
                pt.setZ(-3000);
                pt.setX(0);
            }
            if (yUnlimited) {
                pt.setZ(-3000);
                pt.setY(0);
            }
            pt.setY(0);
            return frustum.containsPoint(pt);
        });
    }

    // Options..
    //  ???? CSS CLASS
    // If yPos & xPos Specified Overide Postion With VAlue
    // If yUnlimited & xUnlimited The Ignore When Frustrum Culling 
    // If yOffset & xOffset Adjust Placement By Value
    // Prefix & Suffix (Copy)
    // Align = 'RIGHT' | 'LEFT' | 'CENTER'
    static pixelLayout(objs: Array<ILabel>, view: VisualizationView, options: any):
        Array<{ x: number, y: number, name: string }> {
        const w = view.viewport.width * .5;
        const h = view.viewport.height * .5;
        const xPos = options.hasOwnProperty('xPos');
        const yPos = options.hasOwnProperty('yPos');
        const xOffset = options.hasOwnProperty('xOffset');
        const yOffset = options.hasOwnProperty('yOffset');
        const prefix = options.hasOwnProperty('prefix');
        const suffix = options.hasOwnProperty('suffix');
        return objs.map(mesh => {
            const vector = mesh.position.clone().project(view.camera)
            vector.y = -(vector.y * h) + h - 6;
            vector.x = (vector.x * w) + w - 6;
            const rv = {
                x: (xPos) ? options.xPos : vector.x,
                y: (yPos) ? options.yPos : vector.y,
                z: vector.z,
                name: mesh.userData.tooltip,
                width: 70,
                height: 10
            };
            if (yOffset) {
                rv.y += options.yOffset;
            }
            if (xOffset) {
                rv.x += options.xOffset;
            }
            if (prefix) {
                rv.name = options.prefix + name;
            }
            if (suffix) {
                rv.name += options.suffix;
            }
            return rv;
        });
    }

    // Force Directed Map Layout In Quarters
    static forceLayout(objs: Array<ILabel>, view: VisualizationView, options: any):
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

    // State
    protected _view: VisualizationView;
    protected _enabled: boolean;
    protected _debounce: number;
    protected _timeout;
    protected _then: number;
    protected _debouncing: boolean;

    public onShow: EventEmitter<any>;
    public onHide: EventEmitter<any>;

    constructor(view: VisualizationView, debounce: number = 300) {
        this._view = view;
        this._enabled = this._enabled;
        this._debounce = debounce;
        this._debouncing = false;
        this._then = new Date().getTime();
        this.onShow = new EventEmitter();
        this.onHide = new EventEmitter();
    }

    public onChange(e: THREE.Event): void {
        const now = new Date().getTime();
        const elapsed = now - this._then;
        this._then = now;

        // Time Elapsed Exceeds Debounce
        if (elapsed > this._debounce) {
            this.onHide.emit();
        } else {
            clearTimeout(this._timeout);
        }
        this._timeout = setTimeout(this.tick.bind(this), this._debounce);
    }

    public tick(): void {
        this.onShow.emit();
    }
    public destroy(): void {
        this._view.controls.removeEventListener('change', this.onChange);
        clearTimeout(this._timeout);
        this.onHide.emit();
    }
    public get enable(): boolean { return this._enabled; }
    public set enable(value: boolean) {
        if (value === this._enabled) {
            return;
        }
        if (value) {
            this._view.controls.addEventListener('change', this.onChange.bind(this));
            this.onShow.emit();
        } else {
            this._view.controls.removeEventListener('change', this.onChange);
            clearTimeout(this._timeout);
            this.onHide.emit();
        }

    }
}
