import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AbstractScatterForm } from './../visualization.abstract.scatter.form';
import { PcaSparseConfigModel, PcaSparseSkMethod } from './pcasparse.model';

@Component({
  selector: 'app-pcasparse-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './pcasparse.form.component.html'
})
export class PcaSparseFormComponent extends AbstractScatterForm {

  @Input() set config(v: PcaSparseConfigModel) {
    if (v === null) { return; }
    if (this.form.value.visualization === null) {
      this.form.patchValue(v, { emitEvent: false });
    }
  }

  PcaSparseSkMethodOptions = [
    PcaSparseSkMethod.CD,
    PcaSparseSkMethod.LARS];


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
      sk_method: [],
      dimension: [],
      alpha: [],
      ridge_alpha: [],
      max_iter: [],
      tol: [],
      method: []
    });

    this.registerFormChange();
  }
}
