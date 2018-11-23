import { Renderer3 } from '@angular/core/src/render3/interfaces/renderer';
import { DataDecorator, DataDecoratorTypeEnum } from './../../../model/data-map.model';
import { combineLatest as observableCombineLatest, Subject, Subscription, timer } from 'rxjs';

import { debounceTime } from 'rxjs/operators';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewEncapsulation,
  ViewChild,
  Renderer2,
  ChangeDetectorRef
} from '@angular/core';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Observable } from 'rxjs/Rx';
import { GraphConfig } from './../../../model/graph-config.model';
import { GraphData } from './../../../model/graph-data.model';
import { Stat } from './../../../model/stat.model';
import { DataService } from './../../../service/data.service';
import { StatFactory } from './../../../service/stat.factory';
import { StatPanelGraphicComponent, StatPanelGraphicOptions } from './stat-panel-graphic.component';
import { StatTypeEnum } from 'app/model/enum.model';

declare var $: any;
declare var vega: any;
declare var vegaTooltip: any;

@Component({
  selector: 'app-workspace-stat-panel',
  templateUrl: './stat-panel.component.html',
  styleUrls: ['./stat-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class StatPanelComponent implements AfterViewInit, OnDestroy {
  @ViewChild('container')
  elRef: ElementRef;

  public options: StatPanelGraphicOptions;
  public metrics: Array<any>;
  public metricSelected: any;
  public visible = false;
  public statComponent: StatPanelGraphicComponent;

  chartStats: Array<Stat> = [];
  statFactory: StatFactory;

  public timerPaused = false;
  public timer: any;
  public $timerChange: Subscription;
  public $configChange: Subject<GraphConfig> = new Subject();
  public $dataChange: Subject<GraphData> = new Subject();
  public $typeChange: Subject<GraphData> = new Subject();
  public $statsChange: Subscription;

  _selectionDecorator: DataDecorator = null;
  _config: GraphConfig;
  _data: GraphData;
  _type: 'TOOL' | 'SELECTION';
  _rootDiv: any = null;
  public get type(): 'TOOL' | 'SELECTION' {
    return this._type;
  }

  @Input()
  set decorators(values: Array<DataDecorator>) {
    if (values === null) {
      return;
    }
    this._selectionDecorator = values.filter(v => v.type === DataDecoratorTypeEnum.SELECT)[0];

    this.update();

    console.log('decorators set');
  }
  @Input()
  public set type(value: 'TOOL' | 'SELECTION') {
    if (value === null) {
      return;
    }
    this._type = value;
    this.$typeChange.next();
  }
  @Input()
  set config(value: GraphConfig) {
    if (value === null) {
      return;
    }
    this._config = value;
    this.$configChange.next();
  }
  @Input()
  set graphData(value: GraphData) {
    if (value === null) {
      return;
    }
    this._data = value;
    this.$dataChange.next();
  }
  byName(p1: any, p2: any) {
    if (p2 === null) {
      return false;
    }
    return p1.name === p2.name;
  }
  metricChangeManual(value: any): void {
    if (!this.timerPaused) {
      this.toggleTimer();
    }
    this.setMetricSelected(value);
  }
  toggleTimer(): void {
    if (this.timerPaused) {
      this.timerPaused = false;
      this.$timerChange = this.timer.subscribe(this.showNextMetric.bind(this));
    } else {
      this.timerPaused = true;
      this.$timerChange.unsubscribe();
    }
  }
  setMetricSelected(value: any): void {
    if (value === undefined) {
      this.visible = false;
      this.cd.markForCheck();
      return;
    }
    this.visible = true;
    this.metricSelected = value;
    this.options.data = value.data.map(v => ({ name: v.mylabel, value: v.myvalue }));
    this.options.type = value.charts[0] === 'Histogram' ? 'BAR' : 'PIE';
    // TODO: Allow for Label Type
    this.statComponent.options = this.options;
    this.cd.markForCheck();
  }

  public update(): void {
    if (this._config === null || this._data === null || this._type === null) {
      return;
    }
    if (this._rootDiv !== null) {
      this.renderer.removeChild(this.elRef.nativeElement, this._rootDiv);
    }
    this._rootDiv = this.renderer.createElement('div');
    this.renderer.appendChild(this.elRef.nativeElement, this._rootDiv);

    if (this._type === 'TOOL') {
      this.statFactory.getComputeStats(this._data, this._config).then(stats => {
        this.metrics = stats;
        this.setMetricSelected(this.metrics[0]);
      });
    } else if (this._type === 'SELECTION') {
      const ids =
        this._selectionDecorator === undefined
          ? []
          : this._selectionDecorator === null
          ? []
          : this._selectionDecorator.values.map(v => v.pid);
      this.statFactory.getPatientStats(ids, this._config).then(stats => {
        this.metrics = stats;
        this.setMetricSelected(this.metrics[0]);
      });
    }
  }

  // Ng After View Init get's called after the dom has been constructed
  ngAfterViewInit() {
    this.timer = timer(5000, 5000);
    this.$timerChange = this.timer.subscribe(this.showNextMetric.bind(this));

    this.statFactory = StatFactory.getInstance(this.dataService);
    this.options = new StatPanelGraphicOptions();
    this.statComponent = new StatPanelGraphicComponent(this.elRef.nativeElement, this.options);
    this.$statsChange = observableCombineLatest(this.$configChange, this.$dataChange, this.$typeChange)
      .pipe(debounceTime(300))
      .subscribe(this.update);
    this.update();
  }
  showNextMetric(): void {
    let nextMetricIndex = this.metrics.indexOf(this.metricSelected) + 1;
    if (nextMetricIndex >= this.metrics.length) {
      nextMetricIndex = 0;
    }
    this.setMetricSelected(this.metrics[nextMetricIndex]);
  }

  ngOnDestroy() {
    this.$dataChange.complete();
    this.$configChange.complete();
    this.$typeChange.complete();
    this.$timerChange.unsubscribe();
    this.$statsChange.unsubscribe();
  }

  constructor(
    public cd: ChangeDetectorRef,
    public elementRef: ElementRef,
    public renderer: Renderer2,
    public dataService: DataService
  ) {}
}
