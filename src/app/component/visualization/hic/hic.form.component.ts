import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DimensionEnum, DirtyEnum } from 'app/model/enum.model';
import { DataField } from './../../../model/data-field.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { HicConfigModel } from './hic.model';

@Component({
  selector: 'app-hic-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './hic.form.component.html'
})
export class HicFormComponent {
  @Input()
  set config(v: HicConfigModel) {
    if (v === null) {
      return;
    }
    this.form.patchValue(v, { emitEvent: false });
  }

  @Output() configChange = new EventEmitter<GraphConfig>();

  form: FormGroup;

  dimensionOptions = [DimensionEnum.THREE_D, DimensionEnum.TWO_D, DimensionEnum.ONE_D];

  byKey(p1: DataField, p2: DataField) {
    if (p2 === null) {
      return false;
    }
    return p1.key === p2.key;
  }

  constructor(private fb: FormBuilder) {
    // Init Form
    this.form = this.fb.group({
      dirtyFlag: [0],
      visualization: [],
      graph: [],
      database: [],
      entity: [],
      table: [],

      gene: [],
      dimensions: [],
      allowRotation: [],
      showLabels: [],
      showLinks: [],
      showChromosome: []
    });

    // Update When Form Changes
    this.form.valueChanges
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe(data => {
        const form = this.form;
        form.markAsPristine();
        data.dirtyFlag = DirtyEnum.NO_COMPUTE;
        this.configChange.emit(data);
      });
  }
}
