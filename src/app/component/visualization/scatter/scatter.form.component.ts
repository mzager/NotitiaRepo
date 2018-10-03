import { ScatterGraph } from './scatter.graph';
import { DirtyEnum } from 'app/model/enum.model';
import { ScatterConfigModel } from './scatter.model';
import { AbstractScatterForm } from './../visualization.abstract.scatter.form';
import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ViewEncapsulation
} from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-scatter-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './scatter.form.component.html',
  encapsulation: ViewEncapsulation.None
})
export class ScatterFormComponent extends AbstractScatterForm {
  @Input()
  set config(v: ScatterConfigModel) {
    if (v === null) {
      return;
    }
    this.form.patchValue(v, { emitEvent: false });
  }
  colors = [
    { name: 'none', value: 'none' },
    { name: 'tissue', value: 'tissue' },
    { name: 'cell', value: 'cell_label' },
    {
      name: 'microwell cell',
      value: 'assigned_cell_label_microwell'
    },
    { name: 'microwell status', value: 'assigned_cell_label_tm' },
    { name: 'tm cell', value: 'assigned_cell_label_tm' },
    { name: 'tm status', value: 'label_status_tm' },
    { name: 'KMeans 3', value: 'k3' },
    { name: 'KMeans 5', value: 'k5' },
    { name: 'KMeans 17', value: 'k17' }
  ];

  files = [
    { name: 'TSNE', uri: 'http://localhost:4200/assets/tsne.json' },
    { name: 'PCA', uri: 'http://localhost:4200/assets/pca.json' },
    { name: 'UMAP', uri: 'http://localhost:4200/assets/umap.json' }
  ];
  public onTimeChange(e: any): void {
    ScatterGraph.setTime.emit({
      time: e.value,
      graph: this.form.get('graph').value
    });
  }
  public onColorChange(e: any): void {
    ScatterGraph.setColorField.emit({
      field: e.value,
      graph: this.form.get('graph').value
    });
  }

  constructor(private fb: FormBuilder) {
    super();

    this.form = this.fb.group({
      dirtyFlag: [],
      visualization: [],
      graph: [],
      database: [],
      table: [],
      pointData: [],
      uri: []
    });
    this.registerFormChange();

    // Update When Form Changes
    this.form.valueChanges
      // .debounceTime(200)
      .distinctUntilChanged()
      .subscribe(data => {
        this.configChange.emit(data);
      });
  }
}
