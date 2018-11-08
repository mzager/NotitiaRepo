import { DataService } from 'app/service/data.service';
import { distinctUntilChanged } from 'rxjs/operators';
import { ScatterGraph } from './scatter.graph';
import { DirtyEnum } from 'app/model/enum.model';
import { ScatterConfigModel } from './scatter.model';
import { AbstractScatterForm } from './../visualization.abstract.scatter.form';
import { Component, Input, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
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
    { name: 'none', value: '' },
    { name: 'main_cell_type', value: 'attrs-main_cell_type' },
    { name: 'main_trajectory', value: 'attrs-main_trajectory' },
    { name: 'main_cluster', value: 'attrs-main_cluster' },
    { name: 'embryo_sex', value: 'attrs-embryo_sex' },
    { name: 'development_stage', value: 'attrs-development_stage' },
    { name: 'sample', value: 'attrs-sample' },
    { name: 'embryo_id', value: 'attrs-embryo_id' },
    { name: 'total_mrnas', value: 'attrs-total_mrnas' },
    { name: 'main_cluster_tsne_1', value: 'attrs-main_cluster_tsne_1' },
    { name: 'main_cluster_tsne_2', value: 'attrs-main_cluster_tsne_2' }
  ];
  // { name: 'none', value: 'none' },
  // { name: 'tissue', value: 'tissue' },
  // { name: 'cell', value: 'cell_label' },
  // {
  //   name: 'microwell cell',
  //   value: 'assigned_cell_label_microwell'
  // },
  // { name: 'microwell status', value: 'assigned_cell_label_tm' },
  // { name: 'tm cell', value: 'assigned_cell_label_tm' },
  // { name: 'tm status', value: 'label_status_tm' },
  // { name: 'KMeans 3', value: 'k3' },
  // { name: 'KMeans 5', value: 'k5' },
  // { name: 'KMeans 17', value: 'k17' }

  files = [
    { name: 'Mouse', uri: 'http://localhost:4200/assets/cell-scaled.json' },
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
    fetch('./assets/' + e.value + '.json', {
      method: 'GET',
      headers: DataService.headersJson
    })
      .then(res => res.json())
      .then(v => {
        ScatterGraph.setColorField.emit({ field: e, data: v });
      });
    // ScatterGraph.setColorField.emit({
    //   field: e.value,
    //   graph: this.form.get('graph').value
    // });
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
      .pipe(
        // .debounceTime(200)
        distinctUntilChanged()
      )
      .subscribe(data => {
        this.configChange.emit(data);
      });
  }
}
