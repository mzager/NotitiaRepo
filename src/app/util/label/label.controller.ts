import { Subject } from 'rxjs/subject';
import { Observable } from 'rxjs/Observable';
import { LabelForce } from './../../util/label/label.force';
import { VisualizationView } from './../../model/chart-view.model';
import * as THREE from 'three';
import * as _ from 'lodash';

export class LabelController {

    private _view: VisualizationView;
    private _onShow: Function;
    private _onHide: Function;
    private _onEnable: Function;
    private _onDisable: Function;
    private _debounce: number;
    private _debounceFn: Function;


    private _enabled: boolean = false;
    public get enable(): boolean { return this._enabled; }
    public set enable(value: boolean) {
        if (value === this._enabled) { return; }
        if (value) {
            // this._onEnable();
            this._view.controls.addEventListener('change', this._debounceFn.bind(this));

        } else {
            // this._onDisable();
            this._view.controls.removeEventListener('change', this._debounceFn.bind(this));
        }
    }

    public customDebounce(leading: Function, trailing: Function, time: number): Function {
        let timeout: any;
        return () => {
            const context = this;
            const later = () => {
                timeout = null;
                leading.apply(context);
            }
            let callNow = !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, time);
            if (callNow) {
                trailing.apply(context);
            }
        };
    }
    constructor(view: VisualizationView, onShow: Function, onHide: Function, onEnable: Function, onDisable: Function, debounce: number = 300, align: 'RIGHT' | 'LEFT' = 'RIGHT') {
        this._view = view;
        this._onHide = onHide;
        this._onShow = onShow;
        this._onEnable = onEnable;
        this._onDisable = onDisable;
        this._debounce = debounce;
        this._debounceFn = this.customDebounce(onShow, onHide, debounce);
    }

    static generateHtmlLabels(objects: Array<THREE.Object3D>, view: VisualizationView, limit: number = 50, iterations: number = 200, radius: number = 3, align: 'RIGHT' | 'LEFT' = 'LEFT'): string {
        const objs = LabelController.filterObjectsInFrustum(objects, view);
        const pts = LabelController.mapLabelForces(objs, view, limit, iterations, radius);
        return LabelController.reduceHtml(pts, align);
    }

    static filterObjectsInFrustum(objs: Array<THREE.Object3D>, view: VisualizationView): Array<THREE.Object3D> {
        const frustum = new THREE.Frustum();
        frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices(view.camera.projectionMatrix, view.camera.matrixWorldInverse));
        return objs.filter(obj => frustum.containsPoint(obj.position));
    }
    static mapLabelForces(objs: Array<THREE.Object3D>, view: VisualizationView, limit: number = 50, iterations: number = 200, radius: number = 3):
        Array<{ x: number, y: number, name: string }> {
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
        // if (data.length > limit) {
        //     data.length = limit;
        // }
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

    static reduceHtml(data: Array<{ x: number, y: number, name: string }>, align: 'RIGHT' | 'LEFT' = 'LEFT'): string {
        return (align === 'LEFT') ?
            data.reduce((p, c) => { return p += '<div class="z-tooltip" style="left:' + c.x + 'px;top:' + c.y + 'px;">' + c.name + '</div>'; }, '') :
            data.reduce((p, c) => { return p += '<div class="z-tooltip" style="text-align:right;left:' + (c.x - 60) + 'px;top:' + c.y + 'px;">' + c.name + '</div>'; }, '');


    }
}
