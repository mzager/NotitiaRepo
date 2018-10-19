import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AbstractScatterForm } from '../visualization.abstract.scatter.form';
import { LinearSVRConfigModel, LinearSVRRandomState, LinearSVRLoss } from './linearsvr.model';

@Component({
  selector: 'app-linearsvr-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './linearsvr.form.component.html'
})
export class LinearSVRFormComponent extends AbstractScatterForm {

  LinearSVRRandomStateOptions = [
    LinearSVRRandomState.NONE,
    LinearSVRRandomState.INSTANCE,
  ];
  LinearSVRLossOptions = [
    LinearSVRLoss.EPSILON_INSENSITIVE,
    LinearSVRLoss.SQUARED_EPSILON_INSENITIVE,
  ];

  @Input() set config(v: LinearSVRConfigModel) {
    if (v === null) { return; }
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

      pcx: [],
      pcy: [],
      pcz: [],
      n_components: [],
      dimension: [],
      coef: [],
      intercept: [],
    });

    this.registerFormChange();
  }
}
