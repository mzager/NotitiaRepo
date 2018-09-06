import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { AbstractScatterForm } from './../visualization.abstract.scatter.form';
import { UmapMetric, UmapConfigModel } from './umap.model';

@Component({
  selector: 'app-umap-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'umap.form.component.html'
})
// if svd_solver = arpack then tol
export class UmapFormComponent extends AbstractScatterForm {
  UmapMetricOptions = [
    UmapMetric.EUCLIDEAN,
    UmapMetric.MANHATTAN,
    UmapMetric.CHEBYSHEV,
    UmapMetric.MINKOWSKI,
    UmapMetric.CANBERRA,
    UmapMetric.BRAYCURTIS,
    UmapMetric.MAHALANOBIS,
    UmapMetric.WMINKOWSKI,
    UmapMetric.SEUCLIDEAN,
    UmapMetric.COSINE,
    UmapMetric.CORRELATION,
    UmapMetric.HAVERSINE,
    UmapMetric.HAMMING,
    UmapMetric.JACCARD,
    UmapMetric.DICE,
    UmapMetric.RUSSELRAO,
    UmapMetric.KULSINSKI,
    UmapMetric.ROGERSTANIMOTO,
    UmapMetric.SOKALMICHENER,
    UmapMetric.SOKALSNEATH,
    UmapMetric.YULE
  ];

  @Input()
  set config(v: UmapConfigModel) {
    if (v === null) {
      return;
    }
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

      n_neighbors: [],
      min_dist: [],
      metric: [],
      learning_rate: [],
      n_components: [],
      spread: [],
      set_op_mix_ratio: [],
      local_connectivity: [],
      repulsion_strength: [],
      negative_sample_rate: [],
      transform_queue_size: [],
      angular_rp_forest: [],
      target_n_neighbors: [],
      target_weight: []
    });

    this.registerFormChange();
  }
}
