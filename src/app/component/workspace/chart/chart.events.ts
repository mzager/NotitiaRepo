import { WorkspaceLayoutEnum } from './../../../model/enum.model';
import { GraphEnum } from 'app/model/enum.model';
import { VisualizationView } from './../../../model/chart-view.model';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { WorkspaceConfigModel } from 'app/model/workspace.model';

export class ChartEvent {
    public event: Event;
    public mouse: { x: number, y: number, xs: number, ys: number };
    public chart: GraphEnum;
    constructor(event: Event, mouse: { x: number, y: number, xs: number, ys: number }, chart?: GraphEnum) {
        this.event = event;
        this.mouse = mouse;
        this.chart = chart;
    }
}

export class ChartEvents {

    public dimensions: ClientRect;
    public chartFocus: Observable<ChartEvent>;
    public chartMouseMove: Observable<ChartEvent>;
    public chartMouseDown: Observable<ChartEvent>;
    public chartMouseUp: Observable<ChartEvent>;
    public isMouseDown: Boolean;

    public mouseUp: Observable<MouseEvent>;
    public mouseMove: Observable<MouseEvent>;
    public mouseDown: Observable<MouseEvent>;
    private mouse: { x: number, y: number, xs: number, ys: number };
    public chart: GraphEnum;

    public workspaceConfig: WorkspaceConfigModel;

    constructor(container: HTMLElement) {

        this.chart = GraphEnum.GRAPH_A;
        this.mouse = { x: 0, y: 0, xs: 0, ys: 0 };
        this.dimensions = container.getBoundingClientRect();

        // Low Level Dom Events
        this.mouseUp = Observable.fromEvent(container, 'mouseup');
        this.mouseMove = Observable.fromEvent(container, 'mousemove');
        this.mouseDown = Observable.fromEvent(container, 'mousedown');

        // Higher Order Chart Events
        this.chartMouseUp = this.mouseUp.map(e => new ChartEvent(e, this.mouse, this.chart));
        this.chartMouseDown = this.mouseDown.map(e => new ChartEvent(e, this.mouse, this.chart));
        this.chartMouseMove = this.mouseMove
            .map((event: MouseEvent) => {
                return new ChartEvent(event, this.mouse, this.chart);
            });
        this.chartFocus = this.mouseMove
            .map((event: MouseEvent) => {

                if (this.workspaceConfig.layout === WorkspaceLayoutEnum.HORIZONTAL) {
                    this.mouse.x = (event.clientX / this.dimensions.width * 2) * 2 - 1;
                    if (this.mouse.x > 1) { this.mouse.x -= 2; }  // Assumes Left Right Orientation
                    this.mouse.y = - (event.clientY / this.dimensions.height) * 2 + 1;
                    this.chart = event.clientX < Math.floor(this.dimensions.width * 0.5) ? GraphEnum.GRAPH_A : GraphEnum.GRAPH_B;
                } else if (this.workspaceConfig.layout === WorkspaceLayoutEnum.VERTICAL) {
                    this.mouse.x = (event.clientX / this.dimensions.width) * 2 + 1;
                    if (this.mouse.x > 1) { this.mouse.x -= 2; }
                    this.mouse.y = (event.clientY / this.dimensions.height * 2) * 2 - 1;
                    if (this.mouse.y > 1) { this.mouse.y -= 2; }
                    this.chart = event.clientY < Math.floor(this.dimensions.height * 0.5) ? GraphEnum.GRAPH_A : GraphEnum.GRAPH_B;
                } else if (this.workspaceConfig.layout === WorkspaceLayoutEnum.SINGLE) {
                    this.mouse.y = - (event.clientY / this.dimensions.height) * 2 + 1;
                    this.mouse.x = (event.clientX / this.dimensions.width) * 2 + 1;
                    if (this.mouse.x > 1) { this.mouse.x -= 2; }
                    this.chart = GraphEnum.GRAPH_A;
                }

                this.mouse.xs = event.clientX;
                this.mouse.ys = event.clientY;

                return new ChartEvent(event, this.mouse, this.chart);
            })
            .distinctUntilChanged((a, b) => a.chart === b.chart);

        // Mouse State
        this.mouseDown.subscribe(v => { this.isMouseDown = true; });
        this.mouseUp.subscribe(v => { this.isMouseDown = false; });
    }
}
