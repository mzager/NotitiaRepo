import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AbstractScatterForm } from '../visualization.abstract.scatter.form';
import { LinearSVCConfigModel, LinearSVCLoss, LinearSVCPenalty, LinearSVCMultiClass, LinearSVCRandomState } from './linearsvc.model';

@Component({
  selector: 'app-linearsvc-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './linearsvc.form.component.html'
})
export class LinearSVCFormComponent extends AbstractScatterForm {

  LinearSVCLossOptions = [
    LinearSVCLoss.SQUARED_HINGE,
    LinearSVCLoss.HINGE
  ];

  LinearSVCPenaltyOptions = [
    LinearSVCPenalty.l1,
    LinearSVCPenalty.l2,
  ];

  LinearSVCMultiClassOptions = [
    LinearSVCMultiClass.OVR,
    LinearSVCMultiClass.CRAMMER_SINGER
  ];

  LinearSVCRandomStateOptions = [
    LinearSVCRandomState.NONE,
    LinearSVCRandomState.INSTANCE,
  ];

  @Input() set config(v: LinearSVCConfigModel) {
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
      copy: [],
      scale: []
    });

    this.registerFormChange();
  }
}
