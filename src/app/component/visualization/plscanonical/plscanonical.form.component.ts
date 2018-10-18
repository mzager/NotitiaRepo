import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AbstractScatterForm } from '../visualization.abstract.scatter.form';
import { PlsCanonicalConfigModel } from './plscanonical.model';

@Component({
  selector: 'app-plscanonical-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './plscanonical.form.component.html',
  encapsulation: ViewEncapsulation.None
})
export class PlsCanonicalFormComponent extends AbstractScatterForm {

  @Input() set config(v: PlsCanonicalConfigModel) {
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
