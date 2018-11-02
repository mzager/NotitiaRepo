import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AbstractScatterForm } from '../visualization.abstract.scatter.form';
import { PlsRegressionConfigModel } from './plsregression.model';

@Component({
  selector: 'app-plsregression-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './plsregression.form.component.html',
  encapsulation: ViewEncapsulation.None
})
export class PlsRegressionFormComponent extends AbstractScatterForm {
  @Input()
  set config(v: PlsRegressionConfigModel) {
    if (v === null) {
      return;
    }
    if (this.form.value.visualization === null) {
      this.form.patchValue(v, { emitEvent: false });
    }
  }

  constructor(private fb: FormBuilder) {
    super();

    this.form = this.fb.group({
      dirtyFlag: [0],
      visualization: [],
      graph: [],
      database: [],
      entity: [],
      table: [],

      max_iter: [],
      tol: [],
      pcx: [],
      pcy: [],
      pcz: [],
      n_components: [],
      dimension: [],
      copy: [],
      scale: []
    });

    this.registerFormChange();
  }
}
