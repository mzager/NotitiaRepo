
import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AbstractScatterForm } from './../visualization.abstract.scatter.form';
import { FaConfigModel, FaSvdMethod } from './fa.model';

@Component({
  selector: 'app-fa-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './fa.form.component.html'
})
export class FaFormComponent extends AbstractScatterForm {

  @Input() set config(v: FaConfigModel) {
    if (v === null) { return; }
    if (this.form.value.visualization === null) {
      this.form.patchValue(v, { emitEvent: false });
    }
  }

  FaSvdMethodOptions = [
    FaSvdMethod.RANDOMIZED,
    FaSvdMethod.LAPACK
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

      n_components: [],
      dimension: [],
      tol: [],
      svd_method: []
    });

    this.registerFormChange();
  }
}
