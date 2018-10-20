import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AbstractScatterForm } from '../visualization.abstract.scatter.form';
import { SVRConfigModel, SVRKernal  } from './svr.model';

@Component({
  selector: 'app-svr-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './svr.form.component.html'
})
export class SVRFormComponent extends AbstractScatterForm {

  SVRKernalOptions = [
    SVRKernal.RBF,
    SVRKernal.LINER,
    SVRKernal.POLY,
    SVRKernal.SIGMOID,
    SVRKernal.CALLABLE,
    SVRKernal.PRECOMPUTED
  ];


  @Input() set config(v: SVRConfigModel) {
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

      kernal: [], // optional
      degree: [], // optional
      // gamma = // optional
      coef0: [], // optional
      tol: [], // optional
      c: [], // optional
      epsilon: [], // opitional
      shrinking: [], // optional
      // cache_size : float, // optional
      verbose: [],
      max_iter: [] // optional
    });

    this.registerFormChange();
  }
}
