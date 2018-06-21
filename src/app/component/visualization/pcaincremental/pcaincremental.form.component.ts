import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AbstractScatterForm } from './../visualization.abstract.scatter.form';
import { PcaIncrementalConfigModel } from './pcaincremental.model';

@Component({
  selector: 'app-pcaincremental-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pcaincremental.form.component.html',
  encapsulation: ViewEncapsulation.None
})
export class PcaIncrementalFormComponent extends AbstractScatterForm {

  @Input() set config(v: PcaIncrementalConfigModel) {
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
      whiten: [],
      batch_size: [],
      copy: []
    });

    this.registerFormChange();
  }
}
