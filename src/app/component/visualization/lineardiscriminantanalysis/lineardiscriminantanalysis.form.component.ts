import { DimensionEnum, EntityTypeEnum, CollectionTypeEnum } from './../../../model/enum.model';
import { AbstractScatterForm } from './../visualization.abstract.scatter.form';
import { GraphConfig } from './../../../model/graph-config.model';
// tslint:disable-next-line:max-line-length
import { LinearDiscriminantAnalysisConfigModel, LinearDiscriminantAnalysisSolver, LinearDiscriminantAnalysisShrinkage } from './lineardiscriminantanalysis.model';
import { DataTypeEnum, DirtyEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory, DataTable } from './../../../model/data-field.model';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import * as _ from 'lodash';
import { SvmCompleteAction } from '../../../action/compute.action';

@Component({
  selector: 'app-lineardiscriminantanalysis-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './lineardiscriminantanalysis.form.component.html'
})
export class LinearDiscriminantAnalysisFormComponent extends AbstractScatterForm {

  @Input() set config(v: LinearDiscriminantAnalysisConfigModel) {
    if (v === null) { return; }
    if (this.form.value.visualization === null) {
      this.form.patchValue(v, { emitEvent: false });
    }
  }

  LinearDiscriminantAnalysisSolverOptions = [
    LinearDiscriminantAnalysisSolver.SVD,
    LinearDiscriminantAnalysisSolver.LSQR,
    LinearDiscriminantAnalysisSolver.EIGEN,

  ];

  LinearDiscriminantAnalysisShrinkageOptions = [
    LinearDiscriminantAnalysisShrinkage.NONE,
    LinearDiscriminantAnalysisShrinkage.AUTO,
    LinearDiscriminantAnalysisShrinkage.FLOAT,

  ];

  constructor(private fb: FormBuilder) {

    super();

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
      pcx: [],
      pcy: [],
      pcz: [],

      n_components: [],
      dimension: [],
      solver: [],
      shrinkage: [],
      // priors =
      store_covariance: [],
      tol: [],

      enableCohorts: [],
      enableGenesets: [],
      enablePathways: [],
      enableSupplemental: [],
      enableLabel: [],
      enableColor: [],
      enableShape: []
    });

    this.registerFormChange();
  }
}
