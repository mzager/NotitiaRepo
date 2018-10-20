import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AbstractScatterForm } from '../visualization.abstract.scatter.form';
import { NuSVRConfigModel, NuSVRKernal  } from './nusvr.model';

@Component({
  selector: 'app-nusvr-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './nusvr.form.component.html'
})
export class NuSVRFormComponent extends AbstractScatterForm {

  NuSVCKernalOptions = [
    NuSVRKernal.RBF,
    NuSVRKernal.LINER,
    NuSVRKernal.POLY,
    NuSVRKernal.SIGMOID,
    NuSVRKernal.CALLABLE,
    NuSVRKernal.PRECOMPUTED
  ];


  @Input() set config(v: NuSVRConfigModel) {
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
      nu: [], // optional
      c: [],
      kernal: [],
      degree: [],
      // gamma = // optional
      coef0: [],
      shrinking: [],
      tol: [],
      // cache_size : float, // optional
      verbose: [],
      max_iter: [],
    });

    this.registerFormChange();
  }
}
