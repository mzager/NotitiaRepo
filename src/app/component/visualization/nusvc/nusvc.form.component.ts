import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AbstractScatterForm } from '../visualization.abstract.scatter.form';
import { NuSVCConfigModel, NuSVCKernal, NuSVCDecisionFunctionShape, NuSVCRandomState  } from './nusvc.model';

@Component({
  selector: 'app-nusvc-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './nusvc.form.component.html'
})
export class NuSVCFormComponent extends AbstractScatterForm {

  NuSVCKernalOptions = [
    NuSVCKernal.RBF,
    NuSVCKernal.LINER,
    NuSVCKernal.POLY,
    NuSVCKernal.SIGMOID,
    NuSVCKernal.CALLABLE,
    NuSVCKernal.PRECOMPUTED
  ];

  NuSVCDecisionFunctionShapeOptions = [
    NuSVCDecisionFunctionShape.OVR,
    NuSVCDecisionFunctionShape.OVO
  ];

  NuSVCRandomStateOptions = [
    NuSVCRandomState.NONE,
    NuSVCRandomState.INSTANCE,
  ];

  @Input() set config(v: NuSVCConfigModel) {
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
      float: [],
      kernal: [],
      degree: [],
      // gamma = // optional
      coef0: [],
      shrinking: [],
      probability: [],
      tol: [],
      // cache_size : float, // optional
      verbose: [],
      max_iter: [],
      decision_function_shape: []
    });

    this.registerFormChange();
  }
}
