import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AbstractScatterForm } from '../visualization.abstract.scatter.form';
import { OneClassSVMConfigModel, OneClassSVMKernal } from './oneclasssvm.model';

@Component({
  selector: 'app-oneclasssvm-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './oneclasssvm.form.component.html'
})
export class OneClassSVMFormComponent extends AbstractScatterForm {

  OneClassSVMKernalOptions = [
    OneClassSVMKernal.RBF,
    OneClassSVMKernal.LINER,
    OneClassSVMKernal.POLY,
    OneClassSVMKernal.SIGMOID,
    OneClassSVMKernal.CALLABLE,
    OneClassSVMKernal.PRECOMPUTED,
  ];


  @Input() set config(v: OneClassSVMConfigModel) {
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
      kernal: [],
      degree: [],
      // gamma = // optional
      coef0: [],
      tol: [],
      c: [],
      epsilon: [], // optional
      shrinking: [],
      // cache_size : float, // optional
      verbose: [],
      max_iter: []
    });

    this.registerFormChange();
  }
}
