import {StatsInterface} from '../../../model/stats.interface';
import { VegaFactory } from './../../../service/vega.factory';
import { GraphConfig } from 'app/model/graph-config.model';
import { DataField } from './../../../model/data-field.model';
import { KmeansConfigModel, KmeansDataModel } from './kmeans.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ChangeDetectionStrategy, Component, Input, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';
declare var vega: any;

@Component({
    selector: 'app-kmeans-stats',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
<div id="chart" #chart></div>
<form [formGroup]="form" novalidate>
  <div class="form-group">
    <label class="center-block" style="margin-bottom:10px;">
      <select class="browser-default" materialize="material_select"
          [materializeSelectOptions]="statOptions"
          formControlName="stat">
          <option *ngFor="let option of statOptions">{{option}}</option>
      </select>
    </label>
  </div>`
})
export class KmeansStatsComponent {
    @ViewChild('chart') private chart: ElementRef;
    @Input() set molecularData(tables: Array<string>) {}
    @Input() set clinicalFields(fields: Array<DataField>) {}
    @Input() set config(v: KmeansConfigModel) {
        if (v === null) { return; }
    }

    @Output() configChange = new EventEmitter<GraphConfig>();

    _config: KmeansConfigModel;
    vega: VegaFactory;
    form: FormGroup;
    statOptions: Array<string>;

    setConfig(v: any): void {
        // debugger;
        // if (v instanceof PcaConfigModel) {
            this._config = v;
            this.update();
        // }
    }

    private update(): void {
        if (this._config === null) { return; }
        switch (this.form.controls.stat.value) {
            case 'Eigen Vectors':

                const chart = this.vega.createBarChart();
                //chart.data[0].values = this._config['loadings'];
                this.updateVega(chart);
                break;
        }
    }

    private updateVega(v: any): void {
        const view = new vega.View(vega.parse(v), {
            renderer: 'canvas'
        }).initialize('#chart').hover().run();
    }
    constructor(private fb: FormBuilder) {
        this.fb = new FormBuilder();
        this.vega = VegaFactory.getInstance();

        this.statOptions = ['Eigen Values', 'Eigen Vectors', 'Loadings',
            'Explained Variance', 'Cumulative Variance', 'Standard Deviations'];
        this.form = this.fb.group({
            stat: this.statOptions[0]
        });

        // Update When Form Changes
        this.form.valueChanges
            .debounceTime(200)
            .distinctUntilChanged()
            .subscribe(data => {
                this.update();
                //this.configChange.emit(data);
            });
    }
}
