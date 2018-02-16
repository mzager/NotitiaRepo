import { DataFieldFactory } from './../../../model/data-field.model';
import { PcaIncrementalConfigModel, PcaIncrementalDataModel } from './../../visualization/pcaincremental/pcaincremental.model';
import { PcaIncrementalCompleteAction } from './../../../action/compute.action';
import { Store } from '@ngrx/store';
import { getGraphAData } from './../../../reducer/index.reducer';
import { GraphData } from './../../../model/graph-data.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from './../../../service/data.service';
import { GraphConfig } from './../../../model/graph-config.model';
import { EntityTypeEnum } from './../../../model/enum.model';
import { DataField } from 'app/model/data-field.model';
import {
  Component, Input, Output, EventEmitter, AfterViewInit,
  OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { LegendPanelEnum, VisualizationEnum, DirtyEnum, GraphEnum } from 'app/model/enum.model';
import { Legend } from 'app/model/legend.model';
declare var $: any;
declare var ML: any;

@Component({
  selector: 'app-workspace-clustering-algorithm-panel',
  template: `
  <div class="card" style="width:225px;margin-top:60px;margin-left:20px;">
    <div class="card-tabs">
        <ul class="tabs tabs-fixed-width" #tabs>
            <li class="tab">
                <a class="active" href="#cohort-panel" style="padding:0px;">Clustering Algorithm</a>
            </li>
        </ul>
    </div>
  <div class="card-content">
    <form [formGroup]="form" novalidate>
      <div class="form-group">
        <label class="center-block"><span class="form-label">Graph</span>
          <select class="browser-default" materialize="material_select"
            [materializeSelectOptions]="graphOptions"
            formControlName="graph">
              <option *ngFor="let options of graphOptions">{{options}}</option>
          </select>
        </label>
      </div>
      <div class="form-group">
        <label class="center-block">
        <span class="form-label">N Clusters</span>
          <p class="range-field">
            <input type="range" min="2" max="20" formControlName="nClusters" />
          </p>
        </label>
      </div>
      <div class="form-group">
        <label class="center-block"><span class="form-label" style="width:100%;padding-bottom:5px;">Select Pattern To Apply</span></label>
          <a class="waves-effect waves-light white" style="width:15%;padding:1%;height:auto;"
            (click)="applyCluster('dbScan')">
          <img src="/assets/clusters/cluster6.png" style="width:100%"></a>
          <a class="waves-effect waves-light white" style="width:15%;padding:1%;height:auto;"
            (click)="applyCluster('agglomerativeClustering')">
          <img src="/assets/clusters/cluster5.png" style="width:100%"></a>
          <a class="waves-effect waves-light white" style="width:15%;padding:1%;height:auto;"
            (click)="applyCluster('gaussianMixture')">
          <img src="/assets/clusters/cluster1.png" style="width:100%"></a>
          <a class="waves-effect waves-light white" style="width:15%;padding:1%;height:auto;"
            (click)="applyCluster('miniBatchKMeans')">
          <img src="/assets/clusters/cluster4.png" style="width:100%"></a>
          <a class="waves-effect waves-light white" style="width:15%;padding:1%;height:auto;"
            (click)="applyCluster('spectralClustering')">
          <img src="/assets/clusters/cluster3.png" style="width:100%"></a>
          <a class="waves-effect waves-light white" style="width:15%;padding:1%;height:auto;"
          (click)="applyCluster('ward')">
          <img src="/assets/clusters/cluster2.png" style="width:100%"></a>
      </div>
    </form>
  </div>`,
  changeDetection: ChangeDetectionStrategy.Default
})
export class ClusteringAlgorithmPanelComponent implements AfterViewInit {

  form: FormGroup;

  graphOptions = ['Graph A', 'Graph B'];

  @ViewChild('tabs') tabs: ElementRef;
  @Input() bounds: ElementRef;

  @Input() configA: GraphConfig;
  @Input() configB: GraphConfig;
  @Input() graphAData: GraphData;
  @Input() graphBData: GraphData;

  @Output() configChange = new EventEmitter<GraphConfig>();

  applyCluster(type: string) {
    const f = this.form;
    const a = getGraphAData;
    const data = this.graphAData.result.result;

    const kmeans = ML.Clust.kmeans(data, this.form.getRawValue().nClusters);
    const clusts = kmeans.clusters;

    const colors =  [0x039BE5, 0x4A148C, 0x880E4F, 0x0D47A1, 0x00B8D4,
      0xAA00FF, 0x6200EA, 0x304FFE, 0x2196F3, 0x0091EA,
      0x00B8D4, 0x00BFA5, 0x64DD17, 0xAEEA00, 0xFFD600, 0xFFAB00, 0xFF6D00, 0xDD2C00,
      0x5D4037, 0x455A64];
    this.configA.dirtyFlag = DirtyEnum.COLOR;

    this.graphAData.pointColor = this.graphAData.patientIds.reduce( (p, c, i) => { p[c] = colors[clusts[i]]; return p; }, {});
    const action = new PcaIncrementalCompleteAction({
        config: (this.configA as PcaIncrementalConfigModel),
        data: (this.graphAData as PcaIncrementalDataModel)
        });

    this.store.dispatch( action );
  }

  ngAfterViewInit(): void {
    $(this.tabs.nativeElement).tabs();
  }


  byName(p1: any, p2: any) {
    if (p2 === null) { return false; }
    return p1.name === p2.name;
  }

  constructor(private store: Store<any>, private cd: ChangeDetectorRef, private fb: FormBuilder, private dataService: DataService) {

    this.form = this.fb.group({
      nClusters: 3,
      graph: GraphEnum.GRAPH_A
    });

    this.form.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .subscribe(data => {
        const form = this.form;
        // this.configChange.emit(this.configB);
      });
  }

}
