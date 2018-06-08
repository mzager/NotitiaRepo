import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AbstractScatterForm } from '../visualization.abstract.scatter.form';
import { FastIcaAlgorithm, FastIcaConfigModel, FastIcaFunction } from './fastica.model';


@Component({
  selector: 'app-fastica-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './fastica.form.component.html'
})
export class FastIcaFormComponent extends AbstractScatterForm {

  @Input() set config(v: FastIcaConfigModel) {
    if (v === null) { return; }
    if (this.form.value.visualization === null) {
      this.form.patchValue(v, { emitEvent: false });
    }
  }

  algorithmOptions = [
    FastIcaAlgorithm.PARALLEL,
    FastIcaAlgorithm.DEFLATION
  ];

  functionOptions = [
    FastIcaFunction.LOGCOSH,
    FastIcaFunction.CUBE,
    FastIcaFunction.EXP
  ];

  constructor(private fb: FormBuilder) {

    super();

    this.form = this.fb.group({
      visualization: [],
      graph: [],
      database: [],
      entity: [],
      table: [],
      markerFilter: [],
      markerSelect: [],
      sampleFilter: [],
      sampleSelect: [],
      patientFilter: [],
      patientSelect: [],
      dataOption: [],

      pcx: [],
      pcy: [],
      pcz: [],
      n_components: [],
      dimension: [],
      algorithm: [],
      fun: [],
      whiten: [],
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
