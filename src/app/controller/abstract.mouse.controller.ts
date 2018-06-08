import { Object3D, Raycaster } from 'three';
import { Subscription } from 'rxjs';
import { ChartEvent, ChartEvents } from './../component/workspace/chart/chart.events';
import { VisualizationView } from './../model/chart-view.model';

export class AbstractMouseController {

    protected _view: VisualizationView;
    protected _enabled: boolean;
    protected _debounce: number;
    protected _mouseOver: boolean;
    protected _events: ChartEvents;
    protected _mouseMoveSubscription: Subscription;
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
            this._mouseMoveSubscription = this._events.chartMouseMove
                .debounceTime(this._debounce)
                .subscribe(this.onMouseMove.bind(this));
        } else {
            this._mouseMoveSubscription.unsubscribe();
        }
    }

    public get targets(): Array<Object3D> { return this._targets; }
    public set targets(value: Array<Object3D>) {
        this._targets = value;
    }

    public onMouseMove(e: ChartEvent): void {
    }

    public destroy(): void {
        this._events = null;
        this._mouseMoveSubscription.unsubscribe();
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
