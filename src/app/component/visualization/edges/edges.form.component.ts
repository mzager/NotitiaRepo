import { getGraphBConfig } from './../../../reducer/index.reducer';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';
import { EdgeConfigModel } from './edges.model';
import { DimensionEnum, GraphEnum } from './../../../model/enum.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataTypeEnum, GraphActionEnum, VisualizationEnum, CollectionTypeEnum, DirtyEnum, EntityTypeEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory, DataTable } from './../../../model/data-field.model';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-edges-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
<form [formGroup]="form" novalidate>
  <div class="form-group">
    <label class="center-block"><span class="form-label">Color</span>
      <select class="browser-default" materialize="material_select"
          [compareWith]="byKey"
          [materializeSelectOptions]="colorOptions"
          formControlName="pointColor">
          <option *ngFor="let option of colorOptions"
            [ngValue]="option">{{option.label}}</option>
      </select>
    </label>
  </div>
  <div class="form-group">
    <label class="center-block"><span class="form-label">Intersection</span>
      <select class="browser-default" materialize="material_select"
          [compareWith]="byKey"
          [materializeSelectOptions]="colorOptions" formControlName="pointIntersect">
          <option *ngFor="let option of intersectOptions"
            [ngValue]="option">{{option.label}}</option>
      </select>
    </label>
  </div>
</form>
  `
})
export class EdgesFormComponent {

  $tables: Subject<Array<DataTable>>;
  $fields: Subject<Array<DataField>>;
  $config: Subject<EdgeConfigModel>;
  $graphAConfig: Subject<GraphConfig>;
  $graphBConfig: Subject<GraphConfig>;
  $latest: Observable<any>;
  

  @Input() set tables(v: Array<DataTable>) {
    this.$tables.next(v); }
  @Input() set fields(v: Array<DataField>) { this.$fields.next(v); }
  @Input() set config(v: EdgeConfigModel) { this.$config.next(v); }
  @Input() set graphAConfig(v: GraphConfig) { this.$graphAConfig.next(v); }
  @Input() set graphBConfig(v: GraphConfig) { this.$graphBConfig.next(v); }

  //   if (this.form.value.visualization === null) {
  //     this.form.patchValue(v, { emitEvent: false });
  //   }
  // }


  @Output() configChange = new EventEmitter<GraphConfig>();

  form: FormGroup;
  colorOptions: Array<DataField>;
  intersectOptions: Array<DataField>;
  dataOptions: Array<DataTable>;

  byKey(p1: DataField, p2: DataField) {
    if (p2 === null) { return false; }
    return p1.key === p2.key;
  }

  constructor(private fb: FormBuilder) {

    this.$tables = new Subject();
    this.$fields = new Subject();
    this.$config = new Subject();
    this.$graphAConfig = new Subject();
    this.$graphBConfig = new Subject();

    this.$tables.subscribe( v => {
      console.dir(v);
    });

    this.form = this.fb.group({

      visualization: [],
      graph: [],
      database: [],
      isVisible: [],
      entityA: [],
      entityB: [],
      table: [],
      markerFilter: [],
      markerSelect: [],
      sampleFilter: [],
      sampleSelect: [],
      pointColor: [],
      pointShape: [],
      pointSize: [],
      pointIntersect: []

    });

    // Update When Form Changes
    this.form.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .subscribe(data => {
        let dirty = 0;
        const form = this.form;
        data.graph = GraphEnum.EDGES;
        if (form.get('pointColor').dirty) { dirty |= DirtyEnum.COLOR; }
        if (form.get('pointIntersect').dirty) { dirty |= DirtyEnum.INTERSECT; }
        if (dirty === 0) { dirty |= DirtyEnum.LAYOUT; }
        form.markAsPristine();
        data.dirtyFlag = dirty;
        data.isVisible = (data.pointIntersect.key !== 'None' || data.pointColor.key !== 'None');
        this.configChange.emit(data);
      });

      this.$latest = Observable.combineLatest(
        [
          this.$tables,
          this.$fields,
          this.$config,
          this.$graphAConfig,
          this.$graphBConfig
        ]
      );

      this.$latest.subscribe( v => {
        const tables: Array<DataTable> = v[0];
        const fields: Array<DataField> = v[1];
        const config: EdgeConfigModel = v[2];
        const graphAConfig: GraphConfig = v[3];
        const graphBConfig: GraphConfig = v[4];

        // If The Entity Type Changed.. All Bets Are Off Clear The Edges And Reset Options
        if ( (graphAConfig.entity !== config.entityA) || (graphBConfig.entity !== config.entityB) ) {

          const geneOptions: Array<DataField> = fields.filter( field => (field.tbl !== 'patient'  && field.type === 'STRING' ) );
          geneOptions.unshift(DataFieldFactory.defaultDataField);

          // Gene + Sample
          if ( (graphAConfig.entity === EntityTypeEnum.GENE && graphBConfig.entity === EntityTypeEnum.SAMPLE) ||
              (graphAConfig.entity === EntityTypeEnum.SAMPLE && graphBConfig.entity === EntityTypeEnum.GENE) ) {
                console.log('GENE + SAMPLE');
                this.intersectOptions = geneOptions;
                this.colorOptions = geneOptions;
          }

          // Gene + Gene
          if ( (graphAConfig.entity === EntityTypeEnum.GENE) && (graphBConfig.entity === EntityTypeEnum.GENE) ) {
            console.log('GENE');
            this.intersectOptions = geneOptions;
            this.colorOptions = geneOptions;
          }

          // Sample + Sample
          if ( (graphAConfig.entity === EntityTypeEnum.SAMPLE) && (graphBConfig.entity === EntityTypeEnum.SAMPLE) ) {
            this.intersectOptions = DataFieldFactory.getColorFields(fields);
            this.colorOptions = DataFieldFactory.getColorFields(fields);
          }

          // Reset Options
          config.entityA = graphAConfig.entity;
          config.entityB = graphBConfig.entity;
          config.pointColor = DataFieldFactory.getUndefined();
          config.pointIntersect = DataFieldFactory.getUndefined();
          config.isVisible = false;
          this.form.patchValue(config); //, { emitEvent: false }

        }
      });
  }
}
