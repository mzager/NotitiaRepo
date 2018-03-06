import { ModalService } from './../../../service/modal-service';
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
import { EntityTypeEnum } from './../../../model/enum.model';
import { DataField } from 'app/model/data-field.model';
import {
  Component, Input, Output, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy,
  EventEmitter, AfterViewInit, OnInit, ViewChild, ElementRef
} from '@angular/core';
import { VisualizationEnum, GraphEnum, DirtyEnum } from 'app/model/enum.model';
import { Legend } from 'app/model/legend.model';
import { TimelinesConfigModel } from 'app/component/visualization/timelines/timelines.model';
import { GraphData } from 'app/model/graph-data.model';
import { DataService } from 'app/service/data.service';
import { Subscription } from 'rxjs/Subscription';
declare var $: any;

@Component({
  selector: 'app-workspace-help-panel',
  templateUrl: './help-panel.component.html',
  styleUrls: ['./help-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HelpPanelComponent implements AfterViewInit, OnDestroy {

  // Mini Batch Dictionary Learning
  // Mini Batch Sparse PCA
  // Sparse Coder
  // Dict Learning Online
  // Sparse Encode
  method = '';
  desc = '';
  url = '';
  urlparagraph = '';
  attrs: Array < { name: string, type: string, desc: string } > = [];
  params: Array < { name: string, type: string, desc: string } > = [];
  citations: Array < { name: string, desc: string, url: string } > = [];
  tutorial: Array < { desc: string, url: string} > = [];


  @Input() set config(config: GraphConfig) {

    this.dataService.getHelpInfo(config).then(result => {
      this.method = result.method;
      this.desc = result.desc;
      this.url = result.url;
      this.urlparagraph = result.urlparagraph;
      this.attrs = result.attrs;
      this.params = result.params;
      this.citations = result.citations;
      this.tutorial = result.tutorial;
      this.cd.markForCheck();
    });
  }


  @Output() hide: EventEmitter<any> = new EventEmitter();

  ngAfterViewInit(): void { }
  ngOnDestroy(): void { }

  closeClick() {
    this.hide.emit();
  }
  constructor(private dataService: DataService, public ms: ModalService, private cd: ChangeDetectorRef) {

  }

}
