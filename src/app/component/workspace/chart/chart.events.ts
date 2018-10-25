
import {fromEvent as observableFromEvent} from 'rxjs';

import {distinctUntilChanged, map} from 'rxjs/operators';
import { GraphEnum } from 'app/model/enum.model';
import { WorkspaceConfigModel } from 'app/model/workspace.model';
import { Observable } from 'rxjs/Rx';
import { WorkspaceLayoutEnum } from './../../../model/enum.model';

export class ChartEvent {
  public event: MouseEvent;
  public mouse: { x: number; y: number; xs: number; ys: number };
  public chart: GraphEnum;
  constructor(
    event: MouseEvent,
    mouse: { x: number; y: number; xs: number; ys: number },
    chart?: GraphEnum
  ) {
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
  public chartKeyPress: Observable<KeyboardEvent>;
  public chartKeyDown: Observable<KeyboardEvent>;
  public chartKeyUp: Observable<KeyboardEvent>;
  public isMouseDown: Boolean;

  public mouseUp: Observable<MouseEvent>;
  public mouseMove: Observable<MouseEvent>;
  public mouseDown: Observable<MouseEvent>;
  public keyPress: Observable<KeyboardEvent>;
  public keyDown: Observable<KeyboardEvent>;
  public keyUp: Observable<KeyboardEvent>;
  private mouse: { x: number; y: number; xs: number; ys: number };
  public chart: GraphEnum;

  private container: HTMLElement;
  public workspaceConfig: WorkspaceConfigModel;

  onKeyPress(e: any): void {}

  onResize(e: any): void {
    this.dimensions = this.container.getBoundingClientRect();
  }

  constructor(container: HTMLElement) {
    this.container = container;
    this.chart = GraphEnum.GRAPH_A;
    this.mouse = { x: 0, y: 0, xs: 0, ys: 0 };
    this.dimensions = container.getBoundingClientRect();

    // window.addEventListener('resize', this.onResize.bind(this));

    // Low Level Dom Events
    this.mouseUp = observableFromEvent<MouseEvent>(container, 'mouseup');
    this.mouseMove = observableFromEvent<MouseEvent>(container, 'mousemove');
    this.mouseDown = observableFromEvent<MouseEvent>(container, 'mousedown');
    this.keyPress = observableFromEvent<KeyboardEvent>(window, 'keypres');
    this.keyDown = observableFromEvent<KeyboardEvent>(window, 'keydown');
    this.keyUp = observableFromEvent<KeyboardEvent>(window, 'keyup');

    // Higher Order Chart Events
    this.chartKeyPress = this.keyPress;
    this.chartKeyDown = this.keyDown;
    this.chartKeyUp = this.keyUp;
    this.chartMouseUp = this.mouseUp.pipe(map(
      e => new ChartEvent(e, this.mouse, this.chart)
    ));
    this.chartMouseDown = this.mouseDown.pipe(map(
      e => new ChartEvent(e, this.mouse, this.chart)
    ));
    this.chartMouseMove = this.mouseMove.pipe(map((event: MouseEvent) => {
      return new ChartEvent(event, this.mouse, this.chart);
    }));
    this.chartFocus = this.mouseMove.pipe(
      map((event: MouseEvent) => {
        if (this.workspaceConfig.layout === WorkspaceLayoutEnum.HORIZONTAL) {
          this.mouse.x = (event.clientX / this.dimensions.width) * 2 * 2 - 1;
          if (this.mouse.x > 1) {
            this.mouse.x -= 2;
          } // Right
          this.mouse.y = -(event.clientY / this.dimensions.height) * 2 + 1;
          this.chart =
            event.clientX < Math.floor(this.dimensions.width * 0.5)
              ? GraphEnum.GRAPH_A
              : GraphEnum.GRAPH_B;
        } else if (
          this.workspaceConfig.layout === WorkspaceLayoutEnum.VERTICAL
        ) {
          this.mouse.x = (event.clientX / this.dimensions.width) * 2 + 1;
          if (this.mouse.x > 1) {
            this.mouse.x -= 2;
          }
          this.mouse.y = (event.clientY / this.dimensions.height) * 2 * 2 - 1;
          this.mouse.y *= -1;
          if (this.mouse.y < -1) {
            this.mouse.y += 2;
          } // Bottom
          this.chart =
            event.clientY < Math.floor(this.dimensions.height * 0.5)
              ? GraphEnum.GRAPH_A
              : GraphEnum.GRAPH_B;
        } else if (this.workspaceConfig.layout === WorkspaceLayoutEnum.SINGLE) {
          this.mouse.y = -(event.clientY / this.dimensions.height) * 2 + 1;
          this.mouse.x = (event.clientX / this.dimensions.width) * 2 + 1;
          if (this.mouse.x > 1) {
            this.mouse.x -= 2;
          }
          this.chart = GraphEnum.GRAPH_A;
        }

        this.mouse.xs = event.clientX;
        this.mouse.ys = event.clientY;
        if (this.chart === GraphEnum.GRAPH_B) {
          if (this.workspaceConfig.layout === WorkspaceLayoutEnum.HORIZONTAL) {
            this.mouse.xs -= this.dimensions.width * 0.5;
          }
          if (this.workspaceConfig.layout === WorkspaceLayoutEnum.VERTICAL) {
            this.mouse.xs -= this.dimensions.width * 0.5;
          }
        }
        return new ChartEvent(event, this.mouse, this.chart);
      }),
      distinctUntilChanged((a, b) => a.chart === b.chart),);

    // Mouse State
    this.mouseDown.subscribe(v => {
      this.isMouseDown = true;
    });
    this.mouseUp.subscribe(v => {
      this.isMouseDown = false;
    });
  }
}
