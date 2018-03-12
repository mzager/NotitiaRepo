import { AbstractScatterForm } from './../../visualization/visualization.abstract.scatter.form';
import { DataDecorator } from './../../../model/data-map.model';
import { DataService } from 'app/service/data.service';
import { DendogramConfigModel } from './../../visualization/dendogram/dendogram.model';
import { SurvivalConfigModel } from './../../visualization/survival/survival.model';
import { ModalService } from './../../../service/modal-service';
import { QuadradicDiscriminantAnalysisConfigModel } from './../../visualization/quadradicdiscriminantanalysis/quadradicdiscriminantanalysis.model';
import { LinearDiscriminantAnalysisConfigModel } from 'app/component/visualization/lineardiscriminantanalysis/lineardiscriminantanalysis.model';
import { MiniBatchDictionaryLearningConfigModel } from './../../visualization/minibatchdictionarylearning/minibatchdictionarylearning.model';
import { MiniBatchSparsePcaConfigModel } from './../../visualization/minibatchsparsepca/minibatchsparsepca.model';
import { PathwaysConfigModel } from 'app/component/visualization/pathways/pathways.model';
import { HicConfigModel } from './../../visualization/hic/hic.model';
import { ParallelCoordsConfigModel } from './../../visualization/parallelcoords/parallelcoords.model';
import { BoxWhiskersConfigModel } from './../../visualization/boxwhiskers/boxwhiskers.model';
import { GenomeConfigModel } from './../../visualization/genome/genome.model';
import { LinkedGeneConfigModel } from './../../visualization/linkedgenes/linkedgenes.model';
import { PlsAction } from './../../../action/compute.action';
import { DataTable } from './../../../model/data-field.model';
import { PcaSparseConfigModel } from './../../visualization/pcasparse/pcasparse.model';
import { PcaKernalConfigModel } from './../../visualization/pcakernal/pcakernal.model';
import { PcaIncrementalConfigModel } from './../../visualization/pcaincremental/pcaincremental.model';
import { SpectralEmbeddingConfigModel } from './../../visualization/spectralembedding/spectralembedding.model';
import { LocalLinearEmbeddingConfigModel } from './../../visualization/locallinearembedding/locallinearembedding.model';
import { IsoMapConfigModel } from './../../visualization/isomap/isomap.model';
import { TruncatedSvdConfigModel } from './../../visualization/truncatedsvd/truncatedsvd.model';
import { DictionaryLearningConfigModel } from './../../visualization/dictionarylearning/dictionarylearning.model';
import { FastIcaConfigModel } from './../../visualization/fastica/fastica.model';
import { NmfConfigModel } from './../../visualization/nmf/nmf.model';
import { LdaConfigModel } from './../../visualization/lda/lda.model';
import { FaConfigModel } from './../../visualization/fa/fa.model';
import { MdsConfigModel } from './../../visualization/mds/mds.model';
import { DeConfigModel } from './../../visualization/de/de.model';
import { DaConfigModel } from './../../visualization/da/da.model';
import { SomConfigModel } from './../../visualization/som/som.model';
import { HeatmapConfigModel } from './../../visualization/heatmap/heatmap.model';
import { TsneConfigModel } from './../../visualization/tsne/tsne.model';
import { PlsConfigModel } from './../../visualization/pls/pls.model';
import { PcaConfigModel } from './../../visualization/pca/pca.model';
import { ChromosomeConfigModel } from './../../visualization/chromosome/chromosome.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { EntityTypeEnum, DataTypeEnum } from './../../../model/enum.model';
import { DataField, DataFieldFactory } from 'app/model/data-field.model';
import {
  Component, Input, Output, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy,
  EventEmitter, AfterViewInit, OnInit, ViewChild, ElementRef
} from '@angular/core';
import { VisualizationEnum, GraphEnum, DirtyEnum, CollectionTypeEnum } from 'app/model/enum.model';
import { Legend } from 'app/model/legend.model';
import { TimelinesConfigModel } from 'app/component/visualization/timelines/timelines.model';
import { GraphData } from 'app/model/graph-data.model';
import { Subscription } from 'rxjs/Subscription';
declare var $: any;

@Component({
  selector: 'app-workspace-decorator-panel',
  templateUrl: './decorator-panel.component.html',
  styleUrls: ['./decorator-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DecoratorPanelComponent implements AfterViewInit, OnDestroy {
  colorOptions: Array<DataField>;
  shapeOptions: Array<DataField>;
  sizeOptions: Array<DataField>;
  ngOnDestroy(): void {
    throw new Error("Method not implemented.");
  }
  ngAfterViewInit(): void {
    throw new Error("Method not implemented.");
  }

  public static GENE_SIGNATURE = 'Gene Signature';
  public static CLUSTERING_ALGORITHM = 'Clustering Algorithm';
  @Input() set fields(fields: Array<DataField>) {
    if (fields.length === 0) { return; }
    const defaultDataField: DataField = DataFieldFactory.getUndefined();

    // Gene Signature Color
    const signatureField = DataFieldFactory.getUndefined();
    signatureField.ctype = CollectionTypeEnum.UNDEFINED;
    signatureField.type = DataTypeEnum.FUNCTION;
    signatureField.label = DecoratorPanelComponent.GENE_SIGNATURE;

    // Clustering Algorithm Color
    const clusterField = DataFieldFactory.getUndefined();
    clusterField.ctype = CollectionTypeEnum.UNDEFINED;
    clusterField.type = DataTypeEnum.FUNCTION;
    clusterField.label = DecoratorPanelComponent.CLUSTERING_ALGORITHM;

    const colorOptions = DataFieldFactory.getColorFields(fields);
    colorOptions.push(...[signatureField, clusterField]);

    this.colorOptions = colorOptions;
    this.shapeOptions = DataFieldFactory.getShapeFields(fields);
    this.sizeOptions = DataFieldFactory.getSizeFields(fields);
}
//   if (form.get('pointColor').dirty) {
//     const pointColor = form.getRawValue().pointColor.label;
//     if (pointColor === AbstractScatterForm.CLUSTERING_ALGORITHM) {
//         this.selectClusteringAlgorithm.emit(data);
//         return;
//     }
//     if (pointColor === AbstractScatterForm.GENE_SIGNATURE) {
//         this.selectGeneSignature.emit(data);
//         return;
//     }
//     dirty |= DirtyEnum.COLOR; }
// if (form.get('pointShape').dirty) { dirty |= DirtyEnum.SHAPE; }
// if (form.get('pointSize').dirty) { dirty |= DirtyEnum.SIZE; }
}
