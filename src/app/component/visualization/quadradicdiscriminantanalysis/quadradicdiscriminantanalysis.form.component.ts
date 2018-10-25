import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AbstractScatterForm } from '../visualization.abstract.scatter.form';
import { QuadradicDiscriminantAnalysisConfigModel } from './quadradicdiscriminantanalysis.model';

@Component({
  selector: 'app-quadradicdiscriminantanalysis-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './quadradicdiscriminantanalysis.form.component.html',
  encapsulation: ViewEncapsulation.None
})
export class QuadradicDiscriminantAnalysisFormComponent extends AbstractScatterForm {

  @Input() set config(v: QuadradicDiscriminantAnalysisConfigModel) {
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
