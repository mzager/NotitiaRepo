import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AbstractScatterForm } from './../visualization.abstract.scatter.form';
import { TruncatedSvdAlgorithm, TruncatedSvdConfigModel } from './truncatedsvd.model';

@Component({
  selector: 'app-truncatedsvd-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './truncatedsvd.form.component.html',
  encapsulation: ViewEncapsulation.None
})
export class TruncatedSvdFormComponent extends AbstractScatterForm {


  @Input() set config(v: TruncatedSvdConfigModel) {
    if (v === null) { return; }
    if (this.form.value.visualization === null) {
      this.form.patchValue(v, { emitEvent: false });
    }
  }

  TruncatedSvdAlgorithmOptions = [
    TruncatedSvdAlgorithm.RANDOMIZED,
    // TruncatedSvdAlgorithm.ARPACK
  ];

  constructor(private fb: FormBuilder) {

    super();

    this.form = this.fb.group({
      dirtyFlag: [0],
      visualization: [],
      graph: [],
      database: [],
      entity: [],
      table: [],

      pcx: [],
      pcy: [],
      pcz: [],
      n_components: [],
      dimension: [],
      algorithm: [],
      tol: [],
      n_iter: []
    });

    this.registerFormChange();
  }
}
