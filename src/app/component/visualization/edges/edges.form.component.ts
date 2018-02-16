import { getGraphBConfig } from './../../../reducer/index.reducer';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';
import { EdgeConfigModel } from './edges.model';
import { DimensionEnum, GraphEnum, MutationTypeEnum } from './../../../model/enum.model';
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
<form [formGroup]='form' novalidate>
  <div class='form-group'>
    <label class='center-block'><span class='form-label'>Edges</span>
      <select materialize='material_select'
          [materializeSelectOptions]='edgeOptions' multiple='true'
          materialize='material_select'
          formControlName='edgeOption'>
          <option *ngFor='let option of edgeOptions'
            [ngValue]='option'>{{option}}</option>
      </select>
    </label>
  </div>
  <!--
  <div class='form-group'>
    <label class='center-block'><span class='form-label'>Intersection</span>
      <select materialize='material_select'
          [compareWith]='byKey'
          [materializeSelectOptions]='colorOptions' formControlName='pointIntersect'>
          <option *ngFor='let option of intersectOptions'
            [ngValue]='option'>{{option.label}}</option>
      </select>
    </label>
  </div>
  -->
</form>
  `
})
export class EdgesFormComponent {

  $tables: Subject<Array<DataTable>> = new Subject();
  $fields: Subject<Array<DataField>> = new Subject();
  $config: Subject<EdgeConfigModel> = new Subject();
  $graphAConfig: Subject<GraphConfig> = new Subject();
  $graphBConfig: Subject<GraphConfig> = new Subject();
  $latest: Observable<any>;

  form: FormGroup;
  edgeOptions: Array<string> = [];
  mutationOptions: Array<string> = [
    MutationTypeEnum.COPY_NUMBER_GAIN_HIGH,
    MutationTypeEnum.COPY_NUMBER_GAIN_LOW,
    MutationTypeEnum.COPY_NUMBER_LOSS_HIGH,
    MutationTypeEnum.COPY_NUMBER_LOSS_LOW,
    MutationTypeEnum.DE_NOVO_START_INFRAME,
    MutationTypeEnum.DE_NOVO_START_OUTOFFRAME,
    MutationTypeEnum.FIVE_PRIME_FLANK,
    MutationTypeEnum.FIVE_PRIME_UTR,
    MutationTypeEnum.FRAME_SHIFT_DEL,
    MutationTypeEnum.IGR,
    MutationTypeEnum.IN_FRAME_INS,
    MutationTypeEnum.IN_FRAME_DEL,
    MutationTypeEnum.INDEL,
    MutationTypeEnum.INTRON,
    MutationTypeEnum.MISSENSE,
    MutationTypeEnum.NONSENSE_MUTATION,
    MutationTypeEnum.NONSTOP_MUTATION,
    MutationTypeEnum.READ_THROUGH,
    MutationTypeEnum.RNA,
    MutationTypeEnum.SILENT,
    MutationTypeEnum.SPLICE_SITE,
    MutationTypeEnum.SPLICE_SITE_DEL,
    MutationTypeEnum.SPLICE_SITE_INS,
    MutationTypeEnum.SPLICE_SITE_SNP,
    MutationTypeEnum.TARGETED_REGION,
    MutationTypeEnum.THREE_PRIME_FLANK,
    MutationTypeEnum.THREE_PRIME_UTR
  ];

  @Input() set tables(v: Array<DataTable>) { this.$tables.next(v); }
  @Input() set fields(v: Array<DataField>) { this.$fields.next(v); }
  @Input() set config(v: EdgeConfigModel) { this.$config.next(v); }
  @Input() set graphAConfig(v: GraphConfig) { this.$graphAConfig.next(v); }
  @Input() set graphBConfig(v: GraphConfig) { this.$graphBConfig.next(v); }
  @Output() configChange = new EventEmitter<GraphConfig>();

  constructor(private fb: FormBuilder) {

    this.form = this.fb.group({
      visualization: [],
      graph: [],
      database: [],
      isVisible: [],
      entityA: [],
      entityB: [],
      patientFilter: [],
      markerFilter: [],
      markerSelect: [],
      sampleFilter: [],
      sampleSelect: [],
      pointColor: [],
      pointShape: [],
      pointSize: [],
      edgeOption: []
    });

    // Update When Form Changes
    this.form.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .subscribe(data => {
        let dirty = 0;
        const form = this.form;
        data.graph = GraphEnum.EDGES;
        // if (form.get('pointColor').dirty) { dirty |= DirtyEnum.COLOR; }
        // if (form.get('pointIntersect').dirty) { dirty |= DirtyEnum.INTERSECT; 
        if (dirty === 0) { dirty |= DirtyEnum.LAYOUT; }
        form.markAsPristine();
        data.dirtyFlag = dirty;
        // data.isVisible = (data.pointIntersect.key !== 'None' || data.pointColor.key !== 'None');
        this.configChange.emit(data);
      });

      this.$latest = Observable.combineLatest([
          this.$tables,
          this.$fields,
          this.$config,
          this.$graphAConfig,
          this.$graphBConfig
        ]);

      this.$latest.subscribe( this.update.bind(this) );
  }

  update(v: any): void {
    const me = this;
    const tables: Array<DataTable> = v[0];
    const fields: Array<DataField> = v[1];
    const config: EdgeConfigModel = v[2];
    const graphAConfig: GraphConfig = v[3];
    const graphBConfig: GraphConfig = v[4];

    // this.form.setValue({'markerFilter':
    //   Array.from(new Set(graphAConfig.markerFilter.concat(graphBConfig.markerFilter)))},
    //   {emitEvent: false});

    if ((graphAConfig.entity !== config.entityA) || (graphBConfig !== config.entityB)) {
      this.reset();
      this['set' + [graphAConfig.entity, graphBConfig.entity].sort().join('')]();
    }
  }
  setEventsEvents(): void {

  }
  setEventsGenes(): void {

  }
  setEventsPatients(): void {

  }
  setEventsSamples(): void {

  }
  setGenesGenes(): void {
    this.edgeOptions = ['None', 'Genes'];
    
  }
  setGenesPatients(): void {
    this.edgeOptions = ['None', ...this.mutationOptions];
  }
  setGenesSamples(): void {
    this.edgeOptions = ['None', ...this.mutationOptions];
  }
  setPatientsPatients(): void {
    this.edgeOptions = ['None', 'Patients'];
  }
  setPatientsSamples(): void {
    this.edgeOptions = ['None', 'Patient - Sample'];
  }
  setSamplesSamples(): void {
    this.edgeOptions = ['None', 'Samples'];
  }
  reset(): void {

  }
}
