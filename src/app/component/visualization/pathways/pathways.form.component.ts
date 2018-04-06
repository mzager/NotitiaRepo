import { DataTable } from 'app/model/data-field.model';
import { PathwaysConfigModel } from './pathways.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { DimensionEnum, DataTypeEnum, VisualizationEnum, DirtyEnum, CollectionTypeEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory } from './../../../model/data-field.model';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as _ from 'lodash';

@Component({
  selector: 'app-pathways-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
<form [formGroup]='form' novalidate>
  <div class='form-group'>
    <label class='center-block'><span class='form-label'>Pathway</span>
      <select materialize='material_select'
          [materializeSelectOptions]='pathwayOptions'
          formControlName='pathway'>
          <option *ngFor='let option of pathwayOptions' [value]='option'>{{option.name}}</option>
      </select>
    </label>
  </div>
</form>
  `
})
export class PathwaysFormComponent {

  @Input() set tables(tables: Array<DataTable>) {
    this.dataOptions = tables.filter(v => ((v.ctype & CollectionTypeEnum.MOLECULAR) > 0));
  }

  @Input() set fields(fields: Array<DataField>) {
    if (fields === null) { return; }
    if (fields.length === 0) { return; }
    const defaultDataField: DataField = DataFieldFactory.getUndefined();
    this.colorOptions = DataFieldFactory.getSampleColorFields(fields);
  }


  private _config: PathwaysConfigModel;
  get config(): PathwaysConfigModel { return this._config; }
  @Input() set config(v: PathwaysConfigModel) {
    if (v === null) { return; }
    this._config = v;
    this.form.patchValue(v, { emitEvent: false });
    this.setPathwayOptions();
  }

  // @Input() pathwayOptions: Array<string> = [];
  public pathwayOptions: Array<any> = [];


  public setPathwayOptions(): void {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept-Encoding', 'gzip');
    const requestInit: RequestInit = {
      method: 'GET',
      headers: headers,
      mode: 'cors',
      cache: 'default'
    };

    // http://www.pathwaycommons.org/pc2/search.json?q=(BRCA2%20and%20IDH1)%20and%20size%3E3&type=Pathway&organism=homo%20sapiens
    // fetch('https://s3-us-west-2.amazonaws.com/notitia/reactome/manifest.json.gz', requestInit)

    fetch('http://www.pathwaycommons.org/pc2/search.json?q=(BRCA2%20and%20IDH1)%20and%20size%3E3&type=Pathway&organism=homo%20sapiens&datasource=reactome', requestInit)
      .then(response => response.json())
      .then(response => {
        // 'https://s3-us-west-2.amazonaws.com/notitia/pwc/'
        // debugger;
        this.pathwayOptions = response.searchHit.map(v => {
          return Object.assign(v, { url: v.uri.substr(response.searchHit[0].uri.lastIndexOf('/') + 1).toLowerCase() + '.json.gz' })
        })

        // https://s3-us-west-2.amazonaws.com/notitia/pwc/r-hsa-2978092.json.gz
        fetch('https://s3-us-west-2.amazonaws.com/notitia/pwc/' +
          response.searchHit[0].url, requestInit)
          .then(response => response.json())
          .then(response => {
            debugger;
          });
        // this.pathwayOptions = this.pathwayOptions.slice(0, 100);
        this.cd.detectChanges();
      });

  }

  @Output() configChange = new EventEmitter<GraphConfig>();

  form: FormGroup;
  colorOptions: Array<DataField>;
  dataOptions: Array<DataTable>;

  byKey(p1: DataField, p2: DataField) {
    if (p2 === null) { return false; }
    return p1.key === p2.key;
  }

  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) {



    // Init Form
    this.form = this.fb.group({
      dirtyFlag: [0],
      visualization: [],
      graph: [],
      database: [],
      entity: [],
      markerFilter: [],
      markerSelect: [],
      sampleFilter: [],
      sampleSelect: [],
      patientFilter: [],
      patientSelect: [],
      table: [],
      pointColor: [],
      pathway: []
    });

    // Update When Form Changes
    this.form.valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .subscribe(data => {
        let dirty = 0;
        const form = this.form;

        form.markAsPristine();
        data.dirtyFlag = dirty;
        this.configChange.emit(data);
      });
  }
}
