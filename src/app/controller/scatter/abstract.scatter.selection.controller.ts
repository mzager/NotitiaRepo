import { EventEmitter } from '@angular/core';
import { AbstractMouseController } from './../abstract.mouse.controller';
import { Points, Raycaster, Mesh, Geometry } from 'three';
import { VisualizationView } from 'app/model/chart-view.model';
import { ChartEvents } from 'app/component/workspace/chart/chart.events';
export class AbstractScatterSelectionController extends AbstractMouseController {
  public onSelect: EventEmitter<Array<number>> = new EventEmitter();
  public onDeselect: EventEmitter<Array<number>> = new EventEmitter();

  protected mesh: Mesh;
  protected highlightIndexes = [];
  protected geometry: Geometry;
  protected raycaster: Raycaster;

  protected _points: Points;
  public get points(): Points {
    return this._points;
  }
  public set points(p: Points) {
    this._points = p;
  }
  private _tooltips: Array<string> = [];
  public getTooltip(index: number): string {
    return this._tooltips.length > index ? this._tooltips[index] : 'Unknown';
  }
  public set tooltips(value: Array<string>) {
    this._tooltips = value;
  }

  constructor(
    public view: VisualizationView,
    public events: ChartEvents,
    public debounce: number = 10
  ) {
    super(view, events, debounce);
    this.raycaster = new Raycaster();
    this.raycaster.params.Points.threshold = 5;
  }

  public destroy(): void {
    this.points = null;
    if (this.mesh !== null) {
      this.mesh.parent.remove(this.mesh);
    }
    this.enable = false;
  }
}
