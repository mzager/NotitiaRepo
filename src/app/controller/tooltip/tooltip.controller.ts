import { Object3D, Vector3 } from 'three';
import { IToolTip } from './tooltip.controller';
import { Subscription } from 'rxjs/Subscription';
import { ChartEvent, ChartEvents } from './../../component/workspace/chart/chart.events';
import { VisualizationView } from './../../model/chart-view.model';
import { EventEmitter } from '@angular/core';
import * as THREE from 'three';

export interface IToolTip {
    position: THREE.Vector3;
    userData: { tooltip: string, color: string };
}
export class TooltipOptions {

    classes: Array<string> = [];    // CSS Classes To Apply
    fontsize = 12;
    offsetX = 0;                    // Offset Computed X Position By Amount After 2D Transform
    offsetY = 0;                    // Offset Computed Y Position By Amount After 2D Transform
    offsetX3d = 1;                  // Offset Computed X Position By Amount Before 2D Transform
    offsetY3d = 0;                  // Offset Computed Y Position By Amount Before 2D Transform
    offsetZ3d = 0;                  // Offset Computed Y Position By Amount Before 2D Transform
    absoluteX: number = null;       // Replace Computed X Position By Amount
    absoluteY: number = null;       // Replace Computed Y Position By Amount
    rotate = 0;                       // Degrees To Rotate Text
    origin: 'LEFT' | 'CENTER' | 'RIGHT' = 'RIGHT';   // Origin For Transforms + Positions
    prefix = '';                    // Copy To Add Before Label
    postfix = '';                   // Copy To Add After Label
    align: 'LEFT' | 'RIGHT' | 'CENTER' | 'JUSTIFIED' = 'LEFT';    // Text Alignment

    generateCss(): string {
        let css = '';
        css += 'font-size:' + this.fontsize + 'px;';
        css += 'transform-origin: ' + ((this.origin === 'LEFT') ? '0%' : (this.origin === 'RIGHT') ? '100%' : '50%') + ' 50%';
        css += ';text-align: ' + this.align.toLocaleLowerCase();
        css += ';transform: rotate(' + this.rotate + 'deg) ';
        css += ';position:absolute;';
        return css;
    }
}

export class TooltipController {

    // State
    protected _view: VisualizationView;
    protected _enabled: boolean;
    protected _debounce: number;
    protected _mouseOver: boolean;
    protected _events: ChartEvents;
    protected _mouseMoveSubscription: Subscription;
    protected _targets: Array<Object3D>;
    protected _options; TooltipOptions;
    protected _hoverObjectId: number;
    protected _raycaster: THREE.Raycaster;
    public onShow: EventEmitter<{ text: string, color: string, event: ChartEvent }>;
    public onHide: EventEmitter<any>;

    public static generateHtml(object: IToolTip, options: TooltipOptions): string {

        const css = 'border-right-color:' + object.userData.color + ';' + options.generateCss();
        const alignmentOffset = (options.align === 'LEFT') ? 0 : (options.align === 'CENTER') ? 50 : -100;
        const translate = 'left:' +
            Math.round(object.position.x + alignmentOffset + options.offsetX) + 'px; top:' +
            Math.round(object.position.y + options.offsetY) + 'px;';
        const html = '<div class="z-tooltip" style="' +
            css + translate + '"><span class="copy">' +
            options.prefix + object.userData.tooltip + options.postfix +
            '</span></div>';
        return html;
    }



    constructor(view: VisualizationView, events: ChartEvents, debounce: number = 10) {
        this._events = events;
        this._targets = [];
        this._view = view;
        this._options = new TooltipOptions();
        this.onShow = new EventEmitter();
        this.onHide = new EventEmitter();
        this._enabled = this._enabled;
        this._debounce = debounce;
        this._mouseOver = false;
        this._hoverObjectId = -1;
        this._raycaster = new THREE.Raycaster();
    }

    public get targets(): Array<Object3D> { return this._targets; }
    public set targets(value: Array<Object3D>) {
        this._targets = value;
    }
    public get options(): TooltipOptions { return this._options; }
    public set options(value: TooltipOptions) {
        this._options = value;
    }


    public destroy(): void {
        this._events = null;
        this._mouseMoveSubscription.unsubscribe();
        this.onShow.unsubscribe();
        this.onHide.unsubscribe();
        this._targets = null;
        this._options = null;
    }
    public get enable(): boolean { return this._enabled; }
    public set enable(value: boolean) {
        if (value === this._enabled) {
            return;
        }
        this._enabled = value;
        if (value) {
            this._mouseMoveSubscription = this._events.chartMouseMove
                .debounceTime(this._debounce)
                .subscribe(this.onMouseMove.bind(this));
        } else {
            this._mouseMoveSubscription.unsubscribe();
        }
    }
    public getIntersects(
        view: VisualizationView,
        pos: { x: number, y: number, xs: number, ys: number },
        objects: Array<THREE.Object3D>): Array<THREE.Intersection> {
        this._raycaster.setFromCamera(pos, view.camera);
        return this._raycaster.intersectObjects(objects, false);
    }

    public onMouseMove(e: ChartEvent): void {
        const intersects = this.getIntersects(this._view, e.mouse, this._targets);

        if (intersects.length === 0) {
            if (this._hoverObjectId !== -1) { this.onHide.emit(); }
            this._hoverObjectId = -1;
            return;
        }
        if (this._hoverObjectId === intersects[0].object.id) { return; }
        this._hoverObjectId = intersects[0].object.id;
        const data = intersects[0].object.userData;
        const text = data.tooltip;
        const color = data.hasOwnProperty('color') ? data.color : 0xFFFFFF;
        if (text === '') { return; }
        const hex = '#' + (0xffffff + color + 1).toString(16).substr(1);
        this.onShow.emit({
            text: text,
            color: hex,
            event: e
        });
    }
}
