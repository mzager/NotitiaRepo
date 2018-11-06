import { Renderer3 } from '@angular/core/src/render3/interfaces/renderer';
import { DataDecorator, DataDecoratorTypeEnum } from './../../../model/data-map.model';
import { combineLatest as observableCombineLatest, Subject, Subscription } from 'rxjs';

import { debounceTime } from 'rxjs/operators';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewEncapsulation,
  ViewChild,
  Renderer2
} from '@angular/core';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Observable } from 'rxjs/Rx';
import { GraphConfig } from './../../../model/graph-config.model';
import { GraphData } from './../../../model/graph-data.model';
import { Stat } from './../../../model/stat.model';
import { DataService } from './../../../service/data.service';
import { StatFactory } from './../../../service/stat.factory';
import { StatVegaFactory } from './../../../service/stat.vega.factory';

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

  chartStats: Array<Stat> = [];
  statFactory: StatFactory;
  statVegaFactory: StatVegaFactory;

  public $configChange: Subject<GraphConfig> = new Subject();
  public $dataChange: Subject<GraphData> = new Subject();
  public $typeChange: Subject<GraphData> = new Subject();

  $statsChange: Subscription;
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
  private addStat(stat) {
    const id =
      'cc' +
      Math.random()
        .toString(36)
        .substring(7);

    const div = this.renderer.createElement('div');
    div.setAttribute('id', id);
    div.className = 'statItemContainer';
    div.style.setProperty('padding-bottom', '20px');
    this.renderer.appendChild(this._rootDiv, div);
    this.statVegaFactory.drawChartObject(stat, stat.charts[0], id, div);
  }

  public update(): void {
    console.log('!!!!UPDATE BI');
    if (this._config === null || this._data === null || this._type === null) {
      return;
    }
    if (this._rootDiv !== null) {
      this.renderer.removeChild(this.elRef.nativeElement, this._rootDiv);
    }
    this._rootDiv = this.renderer.createElement('div');
    this.renderer.appendChild(this.elRef.nativeElement, this._rootDiv);
    // this.renderer.
    // this.container.empty();
    if (this._type === 'TOOL') {
      this.statFactory.getComputeStats(this._data, this._config).then(stats => {
        stats.forEach(this.addStat.bind(this));
      });
    } else if (this._type === 'SELECTION') {
      console.log('UPDATE BI');

      const ids = this._selectionDecorator === null ? [] : this._selectionDecorator.values.map(v => v.pid);

      this.statFactory.getPatientStats(ids, this._config).then(stats => {
        stats.forEach(this.addStat.bind(this));
      });
    }
  }

  // Ng After View Init get's called after the dom has been constructed
  ngAfterViewInit() {
    this.statFactory = StatFactory.getInstance(this.dataService);
    this.statVegaFactory = StatVegaFactory.getInstance();

    // this.container = $(this.elRef.nativeElement);
    this.$statsChange = observableCombineLatest(this.$configChange, this.$dataChange, this.$typeChange)
      .pipe(debounceTime(300))
      .subscribe(this.update.bind(this));
    this.update();
  }

  ngOnDestroy() {
    // TODO: Revisit
    // this.$dataChange.complete();
    // this.$configChange.complete();
    // this.$decoratorChange.complete();
    this.$statsChange.unsubscribe();
  }

  constructor(public elementRef: ElementRef, public renderer: Renderer2, public dataService: DataService) {}
}
