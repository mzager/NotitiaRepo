import { ScatterFormComponent } from './component/visualization/scatter/scatter.form.component';
import { UmapFormComponent } from './component/visualization/umap/umap.form.component';
import { TipPanelComponent } from './component/workspace/tip-panel/tip-panel.component';
import { SelectionPanelComponent } from './component/workspace/selection-panel/selection-panel.component';
import { NgModule, ErrorHandler } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HotTableModule } from '@handsontable/angular';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { FileUploadModule } from 'ng2-file-upload';
import { AppRoutingModule } from './app-routing.module';
// Components
import { AppComponent } from './app.component';
import { ApplicationBarComponent } from './component/application-bar/application-bar.component';
import { BoxWhiskersFormComponent } from './component/visualization/boxwhiskers/boxwhiskers.form.component';
import { ChromosomeFormComponent } from './component/visualization/chromosome/chromosome.form.component';
import { DaFormComponent } from './component/visualization/da/da.form.component';
import { DeFormComponent } from './component/visualization/de/de.form.component';
import { DendogramFormComponent } from './component/visualization/dendogram/dendogram.form.component';
import { DictionaryLearningFormComponent } from './component/visualization/dictionarylearning/dictionarylearning.form.component';
import { FaFormComponent } from './component/visualization/fa/fa.form.component';
import { FastIcaFormComponent } from './component/visualization/fastica/fastica.form.component';
import { GenomeFormComponent } from './component/visualization/genome/genome.form.component';
import { HazardFormComponent } from './component/visualization/hazard/hazard.form.component';
import { HeatmapFormComponent } from './component/visualization/heatmap/heatmap.form.component';
import { HicFormComponent } from './component/visualization/hic/hic.form.component';
import { HistogramFormComponent } from './component/visualization/histogram/histogram.form.component';
import { IsoMapFormComponent } from './component/visualization/isomap/isomap.form.component';
import { KMeansFormComponent } from './component/visualization/kmeans/kmeans.form.component';
import { KmedianFormComponent } from './component/visualization/kmedians/kmedians.form.component';
import { KmedoidFormComponent } from './component/visualization/kmedoids/kmedoids.form.component';
import { LdaFormComponent } from './component/visualization/lda/lda.form.component';
// tslint:disable-next-line:max-line-length
import { LinearDiscriminantAnalysisFormComponent } from './component/visualization/lineardiscriminantanalysis/lineardiscriminantanalysis.form.component';
import { LinkedGeneFormComponent } from './component/visualization/linkedgenes/linkedgenes.form.component';
import { LocalLinearEmbeddingFormComponent } from './component/visualization/locallinearembedding/locallinearembedding.form.component';
import { MdsFormComponent } from './component/visualization/mds/mds.form.component';
// tslint:disable-next-line:max-line-length
import { MiniBatchDictionaryLearningFormComponent } from './component/visualization/minibatchdictionarylearning/minibatchdictionarylearning.form.component';
import { MiniBatchSparsePcaFormComponent } from './component/visualization/minibatchsparsepca/minibatchsparsepca.form.component';
import { NmfFormComponent } from './component/visualization/nmf/nmf.form.component';
import { ParallelCoordsFormComponent } from './component/visualization/parallelcoords/parallelcoords.form.component';
import { PathwaysFormComponent } from './component/visualization/pathways/pathways.form.component';
import { PcaFormComponent } from './component/visualization/pca/pca.form.component';
import { PcaIncrementalFormComponent } from './component/visualization/pcaincremental/pcaincremental.form.component';
import { PcaKernalFormComponent } from './component/visualization/pcakernal/pcakernal.form.component';
import { PcaSparseFormComponent } from './component/visualization/pcasparse/pcasparse.form.component';
import { PlsFormComponent } from './component/visualization/pls/pls.form.component';
// tslint:disable-next-line:max-line-length
import { QuadradicDiscriminantAnalysisFormComponent } from './component/visualization/quadradicdiscriminantanalysis/quadradicdiscriminantanalysis.form.component';
import { SomFormComponent } from './component/visualization/som/som.form.component';
import { SpectralEmbeddingFormComponent } from './component/visualization/spectralembedding/spectralembedding.form.component';
import { SurvivalFormComponent } from './component/visualization/survival/survival.form.component';
import { SvdFormComponent } from './component/visualization/svd/svd.form.component';
import { TimelinesFormComponent } from './component/visualization/timelines/timelines.form.component';
import { TruncatedSvdFormComponent } from './component/visualization/truncatedsvd/truncatedsvd.form.component';
import { TsneFormComponent } from './component/visualization/tsne/tsne.form.component';
import { AboutPanelComponent } from './component/workspace/about-panel/about-panel.component';
import { AnalysisPanelComponent } from './component/workspace/analysis-panel/analysis-panel.component';
import { ChartComponent } from './component/workspace/chart/chart.component';
import { ChartFactory } from './component/workspace/chart/chart.factory';
import { CitationsPanelComponent } from './component/workspace/citations-panel/citations-panel.component';
import { ClusteringAlgorithmPanelComponent } from './component/workspace/clustering-algorithm-panel/clustering-algorithm-panel.component';
import { CohortPanelComponent } from './component/workspace/cohort-panel/cohort-panel.component';
import { ColorPanelComponent } from './component/workspace/color-panel/color-panel.component';
import { DashboardPanelComponent } from './component/workspace/dashboard-panel/dashboard-panel.component';
import { DataPanelComponent } from './component/workspace/data-panel/data-panel.component';
import { SummaryComponent } from './component/workspace/data-panel/summary/summary.component';
import { EdgePanelComponent } from './component/workspace/edge-panel/edge-panel.component';
import { FeedbackPanelComponent } from './component/workspace/feedback-panel/feedback-panel.component';
import { FilePanelComponent } from './component/workspace/file-panel/file-panel.component';
import { GeneSignaturePanelComponent } from './component/workspace/gene-signature-panel/gene-signature-panel.component';
import { GenesetPanelComponent } from './component/workspace/geneset-panel/geneset-panel.component';
import { GraphPanelAnalysisComponent } from './component/workspace/graph-panel/graph-panel-analysis.component';
import { GraphPanelDataComponent } from './component/workspace/graph-panel/graph-panel-data.component';
import { GraphPanelVisualizationComponent } from './component/workspace/graph-panel/graph-panel-visualization.component';
import { GraphPanelComponent } from './component/workspace/graph-panel/graph-panel.component';
import { HelpPanelComponent } from './component/workspace/help-panel/help-panel.component';
import { LandingPanelComponent } from './component/workspace/landing-panel/landing-panel.component';
import { LegendPanelComponent } from './component/workspace/legend-panel/legend-panel.component';
import { LoaderComponent } from './component/workspace/loader/loader.component';
import { PathwayPanelComponent } from './component/workspace/pathway-panel/pathway-panel.component';
import { QueryBuilderComponent } from './component/workspace/query-panel/query-builder/query-builder.component';
import { QueryPanelComponent } from './component/workspace/query-panel/query-panel.component';
import { SettingsPanelComponent } from './component/workspace/settings-panel/settings-panel.component';
import { StatPanelComponent } from './component/workspace/stat-panel/stat-panel.component';
import { ToolBarComponent } from './component/workspace/tool-bar/tool-bar.component';
import { UploadPanelComponent } from './component/workspace/upload-panel/upload-panel.component';
import { UserPanelComponent } from './component/workspace/user-panel/user-panel.component';
import { WorkspaceComponent } from './component/workspace/workspace.component';
// Effects
import { ComputeEffect } from './effect/compute.effect';
import { DataEffect } from './effect/data.effect';
import { SelectEffect } from './effect/select.effect';
import { MaterialModule } from './material.module';
// Reducers
import { reducers } from './reducer/index.reducer';
// Services
import { ComputeService } from './service/compute.service';
import { DataService } from './service/data.service';
import { DataHubService } from './service/datahub.service';
import { DatasetService } from './service/dataset.service';
import { HttpClient } from './service/http.client';
import { ModalService } from './service/modal-service';
import { ErrorService } from './service/error.service';

@NgModule({
  declarations: [
    AppComponent,
    WorkspaceComponent,
    ApplicationBarComponent,
    FilePanelComponent,
    EdgePanelComponent,
    LegendPanelComponent,
    GraphPanelComponent,
    GenesetPanelComponent,
    StatPanelComponent,
    DataPanelComponent,
    UploadPanelComponent,
    CohortPanelComponent,
    ChartComponent,
    DictionaryLearningFormComponent,
    LdaFormComponent,
    NmfFormComponent,
    TruncatedSvdFormComponent,
    FastIcaFormComponent,
    DaFormComponent,
    DeFormComponent,
    FaFormComponent,
    PcaFormComponent,
    UmapFormComponent,
    ScatterFormComponent,
    PlsFormComponent,
    TsneFormComponent,
    KMeansFormComponent,
    KmedianFormComponent,
    KmedoidFormComponent,
    MdsFormComponent,
    QuadradicDiscriminantAnalysisFormComponent,
    LinearDiscriminantAnalysisFormComponent,
    MiniBatchDictionaryLearningFormComponent,
    MiniBatchSparsePcaFormComponent,
    SomFormComponent,
    ChromosomeFormComponent,
    GenomeFormComponent,
    LinkedGeneFormComponent,
    HicFormComponent,
    TimelinesFormComponent,
    SurvivalFormComponent,
    HazardFormComponent,
    HeatmapFormComponent,
    DendogramFormComponent,
    BoxWhiskersFormComponent,
    ParallelCoordsFormComponent,
    HistogramFormComponent,
    PathwaysFormComponent,
    SvdFormComponent,
    IsoMapFormComponent,
    LocalLinearEmbeddingFormComponent,
    SpectralEmbeddingFormComponent,
    PcaIncrementalFormComponent,
    PcaKernalFormComponent,
    PcaSparseFormComponent,
    GeneSignaturePanelComponent,
    HelpPanelComponent,
    SummaryComponent,
    ClusteringAlgorithmPanelComponent,
    LandingPanelComponent,
    AnalysisPanelComponent,
    SettingsPanelComponent,
    AboutPanelComponent,
    CitationsPanelComponent,
    LoaderComponent,
    PathwayPanelComponent,
    DashboardPanelComponent,
    FeedbackPanelComponent,
    ToolBarComponent,
    ColorPanelComponent,
    QueryPanelComponent,
    QueryBuilderComponent,
    GraphPanelAnalysisComponent,
    GraphPanelVisualizationComponent,
    GraphPanelDataComponent,
    TipPanelComponent,
    UserPanelComponent,
    SelectionPanelComponent
  ],

  imports: [
    HotTableModule.forRoot(),
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MaterialModule,
    FileUploadModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    ReactiveFormsModule,
    EffectsModule.forRoot([DataEffect, ComputeEffect, SelectEffect]),
    StoreModule.forRoot(reducers),
    StoreDevtoolsModule.instrument({
      maxAge: 10 //  Retains last 25 states
    })
  ],
  providers: [
    Title,
    DataService,
    DatasetService,
    ComputeService,
    ChartFactory,
    HttpClient,
    ModalService,
    DataHubService,
    {
      provide: ErrorHandler,
      useClass: ErrorService
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
