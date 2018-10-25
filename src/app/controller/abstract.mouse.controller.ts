
import {debounceTime} from 'rxjs/operators';
import { Object3D, Raycaster } from 'three';
import { Subscription } from 'rxjs';
import { ChartEvent, ChartEvents } from './../component/workspace/chart/chart.events';
import { VisualizationView } from './../model/chart-view.model';

export class AbstractMouseController {

    protected data: any = {};
    protected _view: VisualizationView;
    protected _enabled: boolean;
    protected _debounce: number;
    protected _mouseOver: boolean;
    protected _events: ChartEvents;
    protected _keyDownSubscription: Subscription;
    protected _keyUpSubscription: Subscription;
    protected _mouseMoveSubscription: Subscription;
    protected _mouseDownSubscription: Subscription;
    protected _mouseUpSubscription: Subscription;
    protected _targets: Array<Object3D>;
    protected _raycaster: THREE.Raycaster;

    public getIntersects(
        view: VisualizationView,
        pos: { x: number, y: number, xs: number, ys: number },
        objects: Array<THREE.Object3D>): Array<THREE.Intersection> {
        this._raycaster.setFromCamera(pos, view.camera);
        return this._raycaster.intersectObjects(objects, false);
    }
    public get enable(): boolean { return this._enabled; }
    public set enable(value: boolean) {
        if (value === this._enabled) {
            return;
        }
        this._enabled = value;
        if (value) {
            this._keyUpSubscription = this._events.chartKeyUp.subscribe(this.onKeyUp.bind(this));
            this._keyDownSubscription = this._events.chartKeyDown.subscribe(this.onKeyDown.bind(this));
            this._mouseUpSubscription = this._events.chartMouseUp.subscribe(this.onMouseUp.bind(this));
            this._mouseDownSubscription = this._events.chartMouseDown.subscribe(this.onMouseDown.bind(this));
            this._mouseMoveSubscription = this._events.chartMouseMove.pipe(
                debounceTime(this._debounce))
                .subscribe(this.onMouseMove.bind(this));
        } else {
            this._keyUpSubscription.unsubscribe();
            this._keyDownSubscription.unsubscribe();
            this._mouseUpSubscription.unsubscribe();
            this._mouseDownSubscription.unsubscribe();
            this._mouseMoveSubscription.unsubscribe();
        }
    }

    public get targets(): Array<Object3D> { return this._targets; }
    public set targets(value: Array<Object3D>) {
        this._targets = value;
    }

    public onKeyUp(e: KeyboardEvent): void { }
    public onKeyDown(e: KeyboardEvent): void { }
    public onMouseMove(e: ChartEvent): void { }
    public onMouseDown(e: ChartEvent): void { }
    public onMouseUp(e: ChartEvent): void { }

    public destroy(): void {
        this._events = null;
        try {
            this._keyUpSubscription.unsubscribe();
        } catch (e) { }
        try {
            this._keyDownSubscription.unsubscribe();
        } catch (e) { }
        try {
            this._mouseUpSubscription.unsubscribe();
        } catch (e) { }
        try {
            this._mouseDownSubscription.unsubscribe();
        } catch (e) { }
        try {
            this._mouseMoveSubscription.unsubscribe();
        } catch (e) { }
        this._targets = null;
    }

    constructor(view: VisualizationView, events: ChartEvents, debounce: number = 10) {
        this._view = view;
        this._enabled = this._enabled;
        this._events = events;
        this._targets = [];
        this._debounce = debounce;
        this._mouseOver = false;
        this._raycaster = new Raycaster();

    }
}
