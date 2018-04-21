import { HazardFormComponent } from './component/visualization/hazard/hazard.form.component';
import { PathwayPanelComponent } from './component/workspace/pathway-panel/pathway-panel.component';
import { QueryBuilderComponent } from './component/workspace/query-panel/query-builder/query-builder.component';
import { QueryPanelComponent } from './component/workspace/query-panel/query-panel.component';
import { DashboardPanelComponent } from './component/workspace/dashboard-panel/dashboard-panel.component';
import { DecoratorPanelComponent } from './component/workspace/decorator-panel/decorator-panel.component';
import { CitationsPanelComponent } from './component/workspace/citations-panel/citations-panel.component';
import { AboutPanelComponent } from './component/workspace/about-panel/about-panel.component';
import { FeedbackPanelComponent } from './component/workspace/feedback-panel/feedback-panel.component';
import { AnalysisPanelComponent } from './component/workspace/analysis-panel/analysis-panel.component';
import { LandingPanelComponent } from './component/workspace/landing-panel/landing-panel.component';
import { AngularDraggableModule } from 'angular2-draggable';
import { MiniBatchSparsePcaFormComponent } from './component/visualization/minibatchsparsepca/minibatchsparsepca.form.component';
import { HelpPanelComponent } from './component/workspace/help-panel/help-panel.component';
import { HicFormComponent } from './component/visualization/hic/hic.form.component';
import { ParallelCoordsFormComponent } from './component/visualization/parallelcoords/parallelcoords.form.component';
import { BoxWhiskersFormComponent } from './component/visualization/boxwhiskers/boxwhiskers.form.component';
import { AppComponent } from './app.component';
import { ApplicationBarComponent } from 'app/component/application-bar/application-bar.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule, Title } from '@angular/platform-browser';
import { ChartComponent } from 'app/component/workspace/chart/chart.component';
import { ChartFactory } from './component/workspace/chart/chart.factory';
import { ChromosomeFormComponent } from 'app/component/visualization/chromosome/chromosome.form.component';
import { ClusteringAlgorithmPanelComponent } from './component/workspace/clustering-algorithm-panel/clustering-algorithm-panel.component';
import { CohortPanelComponent } from './component/workspace/cohort-panel/cohort-panel.component';
import { ColorPanelComponent } from './component/workspace/color-panel/color-panel.component';
import { ComputeEffect } from './effect/compute.effect';
import { ComputeService } from './service/compute.service';
import { DaFormComponent } from './component/visualization/da/da.form.component';
import { DataEffect } from './effect/data.effect';
import { DataPanelComponent } from 'app/component/workspace/data-panel/data-panel.component';
import { DataService } from 'app/service/data.service';
import { DatasetService } from './service/dataset.service';
import { DeFormComponent } from './component/visualization/de/de.form.component';
import { DictionaryLearningFormComponent } from './component/visualization/dictionarylearning/dictionarylearning.form.component';
import { EdgePanelComponent } from './component/workspace/edge-panel/edge-panel.component';
import { EdgesFormComponent } from './component/visualization/edges/edges.form.component';
import { EffectsModule } from '@ngrx/effects';
import { FaFormComponent } from './component/visualization/fa/fa.form.component';
import { FastIcaFormComponent } from './component/visualization/fastica/fastica.form.component';
import { FilePanelComponent } from './component/workspace/file-panel/file-panel.component';
import { FileUploadModule } from 'ng2-file-upload';
import { FormsModule } from '@angular/forms';
import { GenesetPanelComponent } from './component/workspace/geneset-panel/geneset-panel.component';
import { GeneSignaturePanelComponent } from './component/workspace/gene-signature-panel/gene-signature-panel.component';
import { GenomeFormComponent } from './component/visualization/genome/genome.form.component';
import { GraphPanelComponent } from 'app/component/workspace/graph-panel/graph-panel.component';
import { HeatmapFormComponent } from './component/visualization/heatmap/heatmap.form.component';
import { HistogramFormComponent } from './component/visualization/histogram/histogram.form.component';
import { HttpClient } from './service/http.client';
import { HttpModule } from '@angular/http';
import { IsoMapFormComponent } from './component/visualization/isomap/isomap.form.component';
import { KmeansConfigModel } from './component/visualization/kmeans/kmeans.model';
import { KMeansFormComponent } from './component/visualization/kmeans/kmeans.form.component';
import { KmedianConfigModel } from './component/visualization/kmedians/kmedians.model';
import { KmedianFormComponent } from './component/visualization/kmedians/kmedians.form.component';
import { KmedoidConfigModel } from './component/visualization/kmedoids/kmedoids.model';
import { KmedoidFormComponent } from './component/visualization/kmedoids/kmedoids.form.component';
import { LdaFormComponent } from './component/visualization/lda/lda.form.component';
import { LegendPanelComponent } from 'app/component/workspace/legend-panel/legend-panel.component';
import { LinkedGeneFormComponent } from './component/visualization/linkedgenes/linkedgenes.form.component';
import { LocalLinearEmbeddingFormComponent } from './component/visualization/locallinearembedding/locallinearembedding.form.component';
import { MaterializeModule } from 'angular2-materialize';
import { MdsFormComponent } from './component/visualization/mds/mds.form.component';
import { NcbiService } from './service/ncbi.service';
import { NgModule, NgZone } from '@angular/core';
import { NmfFormComponent } from './component/visualization/nmf/nmf.form.component';
import { OAuthService } from 'angular2-oauth2/oauth-service';
import { PathwaysFormComponent } from './component/visualization/pathways/pathways.form.component';
import { PcaFormComponent } from 'app/component/visualization/pca/pca.form.component';
import { PcaIncrementalFormComponent } from './component/visualization/pcaincremental/pcaincremental.form.component';
import { PcaKernalFormComponent } from './component/visualization/pcakernal/pcakernal.form.component';
import { PcaSparseFormComponent } from './component/visualization/pcasparse/pcasparse.form.component';
import { PlsFormComponent } from 'app/component/visualization/pls/pls.form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { reducers } from 'app/reducer/index.reducer';
import { SelectEffect } from './effect/select.effect';
import { SomFormComponent } from './component/visualization/som/som.form.component';
import { SpectralEmbeddingFormComponent } from './component/visualization/spectralembedding/spectralembedding.form.component';
import { StatPanelComponent } from 'app/component/workspace/stat-panel/stat-panel.component';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { SurvivalFormComponent } from './component/visualization/survival/survival.form.component';
import { SvdFormComponent } from './component/visualization/svd/svd.form.component';
import { TimelinesFormComponent } from './component/visualization/timelines/timelines.form.component';
import { ToastModule } from 'ng2-toastr/ng2-toastr';
import { ToolBarComponent } from 'app/component/workspace/tool-bar/tool-bar.component';
import { TruncatedSvdFormComponent } from './component/visualization/truncatedsvd/truncatedsvd.form.component';
import { TsneFormComponent } from './component/visualization/tsne/tsne.form.component';
import { WorkbookService } from './service/workbook.service';
import { WorkspaceComponent } from 'app/component/workspace/workspace.component';
// tslint:disable-next-line:max-line-length
import { QuadradicDiscriminantAnalysisFormComponent } from 'app/component/visualization/quadradicdiscriminantanalysis/quadradicdiscriminantanalysis.form.component';
// tslint:disable-next-line:max-line-length
import { LinearDiscriminantAnalysisFormComponent } from 'app/component/visualization/lineardiscriminantanalysis/lineardiscriminantanalysis.form.component';
// tslint:disable-next-line:max-line-length
import { MiniBatchDictionaryLearningFormComponent } from 'app/component/visualization/minibatchdictionarylearning/minibatchdictionarylearning.form.component';
import { ModalService } from 'app/service/modal-service';
import { FontService } from 'app/service/font.service';
import { HotTableModule } from 'angular-handsontable';
import { NouisliderModule } from 'ng2-nouislider';
import { SummaryComponent } from './component/workspace/data-panel/summary/summary.component';
import { DendogramFormComponent } from './component/visualization/dendogram/dendogram.form.component';
import { SettingsPanelComponent } from './component/workspace/settings-panel/settings-panel.component';
import { LoaderComponent } from './component/workspace/loader/loader.component';
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
    EdgesFormComponent,
    PcaFormComponent,
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
    DecoratorPanelComponent,
    PathwayPanelComponent,
    DashboardPanelComponent,
    FeedbackPanelComponent,

    ToolBarComponent,
    ColorPanelComponent,
    QueryPanelComponent,
    QueryBuilderComponent
  ],
  entryComponents: [
  ],
  imports: [
    NouisliderModule,
    ToastModule.forRoot(),
    MaterializeModule,
    FileUploadModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AngularDraggableModule,
    EffectsModule.forRoot([DataEffect, ComputeEffect, SelectEffect]),
    StoreModule.forRoot(reducers),
    StoreDevtoolsModule.instrument({
      maxAge: 25 //  Retains last 25 states
    }),
    HotTableModule
  ],
  providers: [
    Title,
    DataService,
    DatasetService,
    FontService,
    ComputeService,
    WorkbookService,
    ChartFactory,
    HttpClient,
    // NcbiService,
    ModalService,
    OAuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
