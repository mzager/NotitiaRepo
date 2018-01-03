import { PathwaysGraph } from './../../visualization/pathways/pathways.graph';
import { GraphConfig } from 'app/model/graph-config.model';
import { TimelinesGraph } from './../../visualization/timelines/timelines.graph';
import { HicGraph } from './../../visualization/hic/hic.graph';
import { BoxWhisterksGraph } from './../../visualization/boxwhiskers/boxwhiskers.graph';
import { ParallelCoordsGraph } from './../../visualization/parallelcoords/parallelcoords.graph';
import { GenomeGraph } from './../../visualization/genome/genome.graph';
import * as TWEEN from 'tween.js';
import { LinkedGeneGraph } from './../../visualization/linkedgenes/linkedgenes.graph';
import { ChartFactory } from './chart.factory';
import { element } from 'protractor';
import { EdgeConfigModel } from './../../visualization/edges/edges.model';
import { PcaIncrementalGraph } from './../../visualization/pcaincremental/pcaincremental.graph';
import { PcaSparseGraph } from './../../visualization/pcasparse/pcasparse.graph';
import { PcaKernalGraph } from './../../visualization/pcakernal/pcakernal.graph';
import { SpectralEmbeddingGraph } from './../../visualization/spectralembedding/spectralembedding.graph';
import { IsoMapGraph } from './../../visualization/isomap/isomap.graph';
import { IsoMapFormComponent } from './../../visualization/isomap/isomap.form.component';
import { LocalLinearEmbeddingGraph } from './../../visualization/locallinearembedding/locallinearembedding.graph';
import { NmfGraph } from './../../visualization/nmf/nmf.graph';
import { LdaGraph } from './../../visualization/lda/lda.graph';
import { DictionaryLearningGraph } from './../../visualization/dictionarylearning/dictionarylearning.graph';
import { FastIcaGraph } from './../../visualization/fastica/fastica.graph';
import { TruncatedSvdGraph } from './../../visualization/truncatedsvd/truncatedsvd.graph';
import { FaGraph } from './../../visualization/fa/fa.graph';
import { MdsGraph } from './../../visualization/mds/mds.graph';
import { SomGraph } from './../../visualization/som/som.graph';
import { HeatmapGraph } from './../../visualization/heatmap/heatmap.graph';
import { EdgesGraph } from './../../visualization/edges/edges.graph';
import { PlsGraph } from './../../visualization/pls/pls.graph';
import { TsneGraph } from './../../visualization/tsne/tsne.graph';
import { WorkspaceConfigModel } from './../../../model/workspace.model';
import { EntityTypeEnum, WorkspaceLayoutEnum } from './../../../model/enum.model';
import { ChartObjectInterface } from './../../../model/chart.object.interface';
import { ChartEvents, ChartEvent } from './chart.events';
import { VisualizationView } from './../../../model/chart-view.model';
import { Observable } from 'rxjs/Observable';
import { Injectable, EventEmitter } from '@angular/core';
import { FontFactory } from './../../../service/font.factory';
import { ChartControls } from './chart.controls';
import * as THREE from 'three';
import TransformControls from 'three-transformcontrols';
import { ChromosomeGraph } from './../../visualization/chromosome/chromosome.graph';
import { GraphPanelEnum, ToolEnum, GraphEnum, VisualizationEnum, DimensionEnum, VisibilityEnum } from 'app/model/enum.model';
import { GraphTool } from 'app/model/graph-tool.model';
import { PcaGraph } from './../../visualization/pca/pca.graph';
import { Subscription } from 'rxjs/Subscription';
import { OrbitControls } from 'three-orbitcontrols-ts';
import WebGLRenderer = THREE.WebGLRenderer;
import CanvasRenderer = THREE.CanvasRenderer;
import Scene = THREE.Scene;

export class ChartScene {

    public static instance: ChartScene;

    public onConfigEmit: EventEmitter<{type: GraphConfig}> =
        new EventEmitter<{type: GraphConfig}>();
    public onSelect: EventEmitter<{type: EntityTypeEnum, ids: Array<string>}> =
        new EventEmitter<{type: EntityTypeEnum, ids: Array<string>}>();
    private workspace: WorkspaceConfigModel;
    private container: HTMLElement;
    private labelsA: HTMLElement;
    private labelsB: HTMLElement;
    private events: ChartEvents;
    public renderer: WebGLRenderer;
    private views: Array<VisualizationView>;
    private edges: EdgesGraph;
    private composer: THREE.EffectComposer;
    private centerLine: THREE.Line;
    public set workspaceConfig(value: WorkspaceConfigModel) {
        if ( !value.hasOwnProperty('layout')  ) { return; }
        this.workspace = value;
        this.onResize();
        this.render();
    }
    render = () => {

        this.renderer.clear();
        let view;

        // Graph A
        view = this.views[0];
        this.renderer.setViewport( view.viewport.x, view.viewport.y, view.viewport.width, view.viewport.height );
        this.renderer.render( view.scene, view.camera );

        // Graph B
        view = this.views[1];

        this.renderer.setViewport( view.viewport.x, view.viewport.y, view.viewport.width, view.viewport.height );
        this.renderer.render( view.scene, view.camera );

        // Graph Edges
        view = this.views[2];
        if (view.chart !== null) {
            view.chart.preRender(this.views, this.workspace.layout, this.renderer);
        }

        // Center Line
        try {
            view.scene.remove(this.centerLine);
        } catch (e) {}

        try {
            if (this.workspace.layout !== WorkspaceLayoutEnum.SINGLE) {
                this.centerLine = (this.workspace.layout === WorkspaceLayoutEnum.HORIZONTAL) ?
                    ChartFactory.lineAllocate(0x039BE5, new THREE.Vector2(0, -1000), new THREE.Vector2(0, 1000) ) :
                    ChartFactory.lineAllocate(0x039BE5, new THREE.Vector2(-1000, 0), new THREE.Vector2(1000, 0) );
                view.scene.add(this.centerLine);
                this.renderer.setViewport( view.viewport.x, view.viewport.y, view.viewport.width, view.viewport.height );
                this.renderer.render( view.scene, view.camera );
            }
        } catch (e) {
            console.log('resolve init');
        }
    }
    config = (e: {type: GraphConfig }) => {
        this.onConfigEmit.next(e);
    }
    select = (e: {type: EntityTypeEnum, ids: Array<string>}) => {
        this.onSelect.next(e);
    }

    private onResize() {
        const dimension: ClientRect = this.container.getBoundingClientRect();
        this.renderer.setSize(dimension.width, dimension.height);
        this.views.forEach( (view, i) => {

            // This is the edges
            if (i === 2) {
                view.viewport.x = 0;
                view.viewport.y = 0;
                view.viewport.width = dimension.width;
                view.viewport.height = dimension.height;
                return;
            } else {
                switch (this.workspace.layout) {
                    case WorkspaceLayoutEnum.SINGLE:
                        if (i === 0) {
                            view.viewport.x = 0;
                            view.viewport.y = 0;
                            view.viewport.width = dimension.width;
                            view.viewport.height = dimension.height;
                        } else {
                            view.viewport.x = 0;
                            view.viewport.y = 0;
                            view.viewport.width = 0;
                            view.viewport.height = 0;
                        }
                        break;
                    case WorkspaceLayoutEnum.HORIZONTAL:
                        view.viewport.x = (i === 0) ? 0 : Math.floor(dimension.width * .5);
                        view.viewport.y = 0;
                        view.viewport.width = Math.floor(dimension.width * .5);
                        view.viewport.height = dimension.height;
                        break;
                    case WorkspaceLayoutEnum.VERTICAL:
                        view.viewport.x = 0;
                        view.viewport.y = (i === 0) ? 0 : Math.floor(dimension.height * .5);
                        view.viewport.width = dimension.width;
                        view.viewport.height = Math.floor(dimension.height * .5);
                        break;
                    case WorkspaceLayoutEnum.OVERLAY:
                        view.viewport.x = (i === 0) ? 0 : 10;
                        view.viewport.y = 0;
                        view.viewport.width = dimension.width;
                        view.viewport.height = dimension.height;
                        break;
                }
            }
            const camera = view.camera as THREE.PerspectiveCamera;
            camera.aspect = view.viewport.width / view.viewport.height;
            camera.updateProjectionMatrix();
        });
        if (this.workspace.layout === WorkspaceLayoutEnum.OVERLAY) {
            this.views[0].camera = this.views[1].camera;
        }
        this.render();
    }

    public init(container: HTMLElement, labelsA: HTMLElement, labelsB: HTMLElement) {
        window.addEventListener('resize', this.onResize.bind(this));

        const dimension: ClientRect = container.getBoundingClientRect();
        this.container = container;
        this.labelsA = labelsA;
        this.labelsB = labelsB;
        this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, preserveDrawingBuffer: true});
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setClearColor(0xffffff, 1);
        this.renderer.autoClear = false;

        this.container.appendChild(this.renderer.domElement);

        this.views = [{
            viewport: {x: 0, y: 0, width: Math.floor(dimension.width * .5), height: dimension.height},
            config: { visualization: VisualizationEnum.NONE },
            chart: null,
            camera: new THREE.PerspectiveCamera(20, 1, 1, 30000)  as THREE.Camera,
            scene: new THREE.Scene(),
            controls: null
        }, {
            viewport: {x: Math.floor(dimension.width * .5), y: 0, width: Math.floor(dimension.width * .5), height: dimension.height},
            config: { visualization: VisualizationEnum.NONE },
            chart: null,
            camera: new THREE.PerspectiveCamera(20, 1, 1, 30000)  as THREE.Camera,
            scene: new THREE.Scene(),
            controls: null
        }, {
            viewport: {x: 0, y: 0, width: dimension.width, height: dimension.height},
            config: { visualization: VisualizationEnum.NONE },
            chart: null,
            camera: null, // new THREE.OrthographicCamera(-300, 300, 300, -300) as THREE.Camera,
            scene: new THREE.Scene(),
            controls: null
        }
    ].map<any>( (view, i) => {

            // Edge View Settings
            if (view.camera === null) {

                const aspect = view.viewport.width / view.viewport.height;
                const left = (-aspect * view.viewport.height) / 2;
                const right = Math.abs(left);
                const bottom = -view.viewport.height / 2;
                const top = Math.abs(bottom);

                view.camera = new THREE.OrthographicCamera(left, right, top, bottom) as THREE.Camera;
                view.camera.position.fromArray([0, 0, 1000]);
                view.camera.lookAt(new THREE.Vector3(0, 0, 0));
                view.scene.add( view.camera );
                view.scene.add(new THREE.AmbientLight(0xaaaaaa, .3));
                return view;
            }

            // View
            view.camera.position.fromArray([0, 0, 1000]);
            view.camera.lookAt(new THREE.Vector3(0, 0, 0));
            view.scene.add( view.camera );

            // Controls
            view.controls = new OrbitControls(view.camera, this.renderer.domElement);
            view.controls.enabled = false;
            view.controls.addEventListener( 'change', this.render );

            // Lighting
            view.scene.add(new THREE.AmbientLight(0xaaaaaa, .3));
            let dirLight = new THREE.DirectionalLight(0xffffff, .5);
            dirLight.position.set(10, 0, 20);
            view.scene.add(dirLight);
            dirLight = new THREE.DirectionalLight(0xffffff, .5);
            dirLight.position.set(-10, 0, -20);
            view.scene.add(dirLight);
            view.scene.add( new THREE.HemisphereLight( 0xFFFFFF, 0xFFFFFF, .4 ) );
            return view;
        });

        this.events = new ChartEvents(this.container);
        this.events.chartFocus.subscribe( this.onChartFocus.bind(this) );
        this.setSize();

        this.render();
    }

    private setSize() {
        // const dimensions = this.container.getBoundingClientRect();
        // this.renderer.setSize(dimensions.width, dimensions.height);
        // this.views.forEach((view, i) => {
        //     if (i === 2) {
        //         return;
        //     }
        //     view.viewport.width = Math.floor(dimensions.width / 2);
        //     view.viewport.height = Math.floor(dimensions.height);
        //     view.viewport.y = 0;
        //     view.viewport.x = Math.ceil( view.viewport.width * i);

        //     const camera = view.camera as THREE.PerspectiveCamera;
        //     camera.aspect = view.viewport.width / view.viewport.height;
        //     camera.updateProjectionMatrix();
        // });
    }

    private onChartFocus(e: ChartEvent) {
        if (this.views[1].chart !== null && this.views[0].chart !== null) {
            this.views[0].chart.enable( e.chart === GraphEnum.GRAPH_A );
            this.views[1].chart.enable( e.chart === GraphEnum.GRAPH_B );
            window['scene'] = this.views[1].scene;
        }
    }

    public update(graph: GraphEnum, config: GraphConfig, data: any) {
        const ecm: EdgeConfigModel = config as EdgeConfigModel;

        const view = ( graph === GraphEnum.GRAPH_A ) ? this.views[0] :
                     ( graph === GraphEnum.GRAPH_B ) ? this.views[1] :
                     this.views[2];

        // If None
        if (config.visualization === VisualizationEnum.NONE) {
            if (view.chart !== null) { 
                view.chart.onRequestRender.unsubscribe();
                view.chart.onConfigEmit.unsubscribe();
                view.chart.destroy(); }
            view.chart = null;
            view.config = config;
            this.onResize(); // Calls render once complete
            return;
        }

        // Edges
        if (view.config.entity !== config.entity) {
            if (this.views[2].chart != null) {
                (this.views[2].chart as EdgesGraph).updateEdges = true;
            }
        }

        if (view.config.visualization !== config.visualization) {
            view.config.visualization = config.visualization;
            if (view.chart !== null) { view.chart.destroy(); }
            view.chart = this.getChartObject(config.visualization).create(
                (config.graph === GraphEnum.GRAPH_A) ? this.labelsA : this.labelsB, this.events, view);
            view.chart.onRequestRender.subscribe(this.render);
            view.chart.onConfigEmit.subscribe(this.config);
        }

        view.chart.update(config, data);
        this.render();
    }

    private getChartObject(visualization: VisualizationEnum): ChartObjectInterface {
        switch (visualization) {
            case VisualizationEnum.TIMELINES: return new TimelinesGraph();
            case VisualizationEnum.HEATMAP: return new HeatmapGraph();
            case VisualizationEnum.PATHWAYS: return new PathwaysGraph();
            case VisualizationEnum.EDGES: return new EdgesGraph();
            case VisualizationEnum.PCA: return new PcaGraph();
            case VisualizationEnum.CHROMOSOME: return new ChromosomeGraph();
            case VisualizationEnum.GENOME: return new GenomeGraph();
            case VisualizationEnum.TSNE: return new TsneGraph();
            case VisualizationEnum.PLS: return new PlsGraph();
            case VisualizationEnum.MDS: return new MdsGraph();
            case VisualizationEnum.FA: return new FaGraph();
            case VisualizationEnum.LINKED_GENE: return new LinkedGeneGraph();
            case VisualizationEnum.HIC: return new HicGraph();
            case VisualizationEnum.PARALLEL_COORDS: return new ParallelCoordsGraph();
            case VisualizationEnum.BOX_WHISKERS: return new BoxWhisterksGraph();
            // case VisualizationEnum.KMEANS: return new KmeansGraph();
            // case VisualizationEnum.KMEDIAN: return new KmedianGraph();
            // case VisualizationEnum.KMEDOIDS: return new KmedoidsGraph();
            case VisualizationEnum.SOM: return new SomGraph();
            case VisualizationEnum.TRUNCATED_SVD: return new TruncatedSvdGraph();
            case VisualizationEnum.FAST_ICA: return new FastIcaGraph();
            case VisualizationEnum.DICTIONARY_LEARNING: return new DictionaryLearningGraph();
            case VisualizationEnum.LDA: return new LdaGraph();
            case VisualizationEnum.NMF: return new NmfGraph();
            case VisualizationEnum.LOCALLY_LINEAR_EMBEDDING: return new LocalLinearEmbeddingGraph();
            case VisualizationEnum.ISOMAP: return new IsoMapGraph();
            case VisualizationEnum.SPECTRAL_EMBEDDING: return new SpectralEmbeddingGraph();
            case VisualizationEnum.KERNAL_PCA: return new PcaKernalGraph();
            case VisualizationEnum.SPARSE_PCA: return new PcaSparseGraph();
            case VisualizationEnum.INCREMENTAL_PCA: return new PcaIncrementalGraph;

        }
    }

    animate = (time) => {
        requestAnimationFrame(this.animate);
        TWEEN.update(time);
    }

    constructor() {
        ChartScene.instance = this;
        requestAnimationFrame(this.animate);
     }
}

