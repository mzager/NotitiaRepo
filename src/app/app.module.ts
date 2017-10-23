import { ClusteringAlgorithmPanelComponent } from './component/workspace/clustering-algorithm-panel/clustering-algorithm-panel.component';
import { GeneSignaturePanelComponent } from './component/workspace/gene-signature-panel/gene-signature-panel.component';
import { GenesetPanelComponent } from './component/workspace/geneset-panel/geneset-panel.component';
import { DatasetService } from './service/dataset.service';
import { TcgaPanelComponent } from './component/workspace/tcga-panel/tcga-panel.component';
import { SpectralEmbeddingFormComponent } from './component/visualization/spectralembedding/spectralembedding.form.component';
import { LocalLinearEmbeddingFormComponent } from './component/visualization/locallinearembedding/locallinearembedding.form.component';
import { IsoMapFormComponent } from './component/visualization/isomap/isomap.form.component';
import { PcaSparseFormComponent } from './component/visualization/pcasparse/pcasparse.form.component';
import { PcaKernalFormComponent } from './component/visualization/pcakernal/pcakernal.form.component';
import { PcaIncrementalFormComponent } from './component/visualization/pcaincremental/pcaincremental.form.component';
import { FastIcaFormComponent } from './component/visualization/fastica/fastica.form.component';
import { TruncatedSvdFormComponent } from './component/visualization/truncatedsvd/truncatedsvd.form.component';
import { NmfFormComponent } from './component/visualization/nmf/nmf.form.component';
import { LdaFormComponent } from './component/visualization/lda/lda.form.component';
import { DictionaryLearningFormComponent } from './component/visualization/dictionarylearning/dictionarylearning.form.component';
import { FaFormComponent } from './component/visualization/fa/fa.form.component';
import { MdsFormComponent } from './component/visualization/mds/mds.form.component';

// Effects
import { ComputeEffect } from './effect/compute.effect';
import { DataEffect } from './effect/data.effect';
import { SelectEffect } from './effect/select.effect';

// Services
import { ComputeService } from './service/compute.service';
import { HttpClient } from './service/http.client';
import { DataService } from 'app/service/data.service';
import { WorkbookService } from './service/workbook.service';
import { OAuthService } from 'angular2-oauth2/oauth-service';
import { IlluminaService } from './service/illumina.service';
import { NcbiService } from './service/ncbi.service';

// Modules
import { HotTableModule } from 'ng2-handsontable';
import { NgModule, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterializeModule } from 'angular2-materialize';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FileUploadModule } from 'ng2-file-upload';
import { TreeModule } from 'angular-tree-component';
import { Draggable } from 'ng2draggable/draggable.directive';
import { ToastModule } from 'ng2-toastr/ng2-toastr';

// Components
import { ApplicationBarComponent } from 'app/component/application-bar/application-bar.component';
import { ChartComponent } from 'app/component/workspace/chart/chart.component';
import { ChromosomeFormComponent } from 'app/component/visualization/chromosome/chromosome.form.component';
import { CohortPanelComponent } from './component/workspace/cohort-panel/cohort-panel.component';
import { ColorPanelComponent } from './component/workspace/color-panel/color-panel.component';
import { DaFormComponent } from './component/visualization/da/da.form.component';
import { DataPanelComponent } from 'app/component/workspace/data-panel/data-panel.component';
import { DeFormComponent } from './component/visualization/de/de.form.component';
import { EdgePanelComponent } from './component/workspace/edge-panel/edge-panel.component';
import { EdgesFormComponent } from './component/visualization/edges/edges.form.component';
import { FilePanelComponent } from './component/workspace/file-panel/file-panel.component';
import { GraphPanelComponent } from 'app/component/workspace/graph-panel/graph-panel.component';
import { HeatmapFormComponent } from './component/visualization/heatmap/heatmap.form.component';
import { HistogramFormComponent } from './component/visualization/histogram/histogram.form.component';
import { KmeansConfigModel } from './component/visualization/kmeans/kmeans.model';
import { KMeansFormComponent } from './component/visualization/kmeans/kmeans.form.component';
import { KmedianConfigModel } from './component/visualization/kmedians/kmedians.model';
import { KmedianFormComponent } from './component/visualization/kmedians/kmedians.form.component';
import { KmedoidConfigModel } from './component/visualization/kmedoids/kmedoids.model';
import { KmedoidFormComponent } from './component/visualization/kmedoids/kmedoids.form.component';
import { LegendPanelComponent } from 'app/component/workspace/legend-panel/legend-panel.component';
import { PathwaysFormComponent } from './component/visualization/pathways/pathways.form.component';
import { PcaFormComponent } from 'app/component/visualization/pca/pca.form.component';
import { PlsFormComponent } from 'app/component/visualization/pls/pls.form.component';
import { QueryPanelComponent } from 'app/component/workspace/query-panel/query-panel.component';
import { SomFormComponent } from './component/visualization/som/som.form.component';
import { StatPanelComponent } from 'app/component/workspace/stat-panel/stat-panel.component';
import { SurvivalFormComponent } from './component/visualization/survival/survival.form.component';
import { SvdFormComponent } from './component/visualization/svd/svd.form.component';
import { TimelinesFormComponent } from './component/visualization/timelines/timelines.form.component';
import { ToolBarComponent } from 'app/component/workspace/tool-bar/tool-bar.component';
import { TsneFormComponent } from './component/visualization/tsne/tsne.form.component';
import { WorkspaceComponent } from 'app/component/workspace/workspace.component';
import { WorkspacePanelComponent } from './component/workspace/workspace-panel/workspace-panel.component';

// Factories
import { ChartFactory } from './component/workspace/chart/chart.factory';

// Reducer
import { reducers } from 'app/reducer/index.reducer';

@NgModule({
  declarations: [
    Draggable,
    AppComponent,
    WorkspaceComponent,
    ApplicationBarComponent,
    ToolBarComponent,
    TcgaPanelComponent,
    FilePanelComponent,
    EdgePanelComponent,
    ColorPanelComponent,
    WorkspacePanelComponent,
    LegendPanelComponent,
    GraphPanelComponent,
    GenesetPanelComponent,
    StatPanelComponent,
    DataPanelComponent,
    CohortPanelComponent,
    ChartComponent,
    QueryPanelComponent,
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
    SomFormComponent,
    ChromosomeFormComponent,
    TimelinesFormComponent,
    SurvivalFormComponent,
    HeatmapFormComponent,
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
    ClusteringAlgorithmPanelComponent
  ],
  entryComponents: [
  ],
  imports: [
    ToastModule.forRoot(),
    HotTableModule,
    MaterializeModule,
    TreeModule,
    FileUploadModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    ReactiveFormsModule,
    EffectsModule.forRoot([DataEffect, ComputeEffect, SelectEffect]),
    StoreModule.forRoot( reducers ),
    StoreDevtoolsModule.instrument({
      maxAge: 25 //  Retains last 25 states
    })
  ],
  providers: [
    Title,
    DataService,
    DatasetService,
    ComputeService,
    WorkbookService,
    ChartFactory,
    HttpClient,
    NcbiService,
    OAuthService,
    IlluminaService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
