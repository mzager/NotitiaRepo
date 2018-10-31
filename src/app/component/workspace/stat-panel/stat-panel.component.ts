import { combineLatest as observableCombineLatest, Subject, Subscription } from 'rxjs';

import { debounceTime } from 'rxjs/operators';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewEncapsulation,
  ViewChild
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

  container: any;

  chartStats: Array<Stat> = [];
  statFactory: StatFactory;
  statVegaFactory: StatVegaFactory;

  $configChange: Subject<GraphConfig> = new Subject();
  $dataChange: Subject<GraphData> = new Subject();
  $typeChange: Subject<GraphData> = new Subject();
  $statsChange: Subscription;

  _config: GraphConfig;
  _data: GraphData;
  _type: 'TOOL' | 'SELECTION';

  @Input()
  set type(value: 'TOOL' | 'SELECTION') {
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

  update(): void {
    if (this._config === null || this._data === null || this._type === null) {
      return;
    }
    this.container.empty();
    if (this._type === 'TOOL') {
      this.statFactory.getComputeStats(this._data, this._config).then(stats => {
        stats.forEach(stat => {
          const id =
            'cc' +
            Math.random()
              .toString(36)
              .substring(7);
          const div = this.container.append(
            '<div id="' + id + '" class="statItemContainer" style="padding-bottom:20px;"></div>'
          );
          this.statVegaFactory.drawChartObject(stat, stat.charts[0], id, div);
        });
      });
    } else if (this._type === 'SELECTION') {
      this.statFactory.getPatientStats(this._config.sampleSelect, this._config).then(stats => {
        stats.forEach(stat => {
          const id =
            'cc' +
            Math.random()
              .toString(36)
              .substring(7);
          const div = this.container.append(
            '<div id="' + id + '" class="statItemContainer" style="padding-bottom:20px;"></div>'
          );
          this.statVegaFactory.drawChartObject(stat, stat.charts[0], id, div);
        });
      });
    }
  }

  // Ng After View Init get's called after the dom has been constructed
  ngAfterViewInit() {
    this.statFactory = StatFactory.getInstance(this.dataService);
    this.statVegaFactory = StatVegaFactory.getInstance();

    this.container = $(this.elRef.nativeElement);
    this.$statsChange = observableCombineLatest(this.$configChange, this.$dataChange, this.$typeChange)
      .pipe(debounceTime(300))
      .subscribe(this.update.bind(this));
    this.update();
  }

  ngOnDestroy() {
    this.$dataChange.complete();
    this.$configChange.complete();
    this.$statsChange.unsubscribe();
  }

  constructor(public elementRef: ElementRef, public dataService: DataService) {}
}
