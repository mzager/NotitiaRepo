import { FontService } from './../../../service/font.service';
import { DataDecorator } from './../../../model/data-map.model';
import { GraphConfig } from 'app/model/graph-config.model';
import * as TWEEN from 'tween.js';
import { ChartFactory } from './chart.factory';
import { EdgeConfigModel } from './../../visualization/edges/edges.model';
import { WorkspaceConfigModel } from './../../../model/workspace.model';
import { EntityTypeEnum, WorkspaceLayoutEnum } from './../../../model/enum.model';
import { ChartObjectInterface } from './../../../model/chart.object.interface';
import { ChartEvents, ChartEvent } from './chart.events';
import { VisualizationView } from './../../../model/chart-view.model';
import { Observable } from 'rxjs/Observable';
import { Injectable, EventEmitter } from '@angular/core';
import { ChartControls } from './chart.controls';
import TransformControls from 'three-transformcontrols';
import { GraphPanelEnum, ToolEnum, GraphEnum, VisualizationEnum, DimensionEnum, VisibilityEnum } from 'app/model/enum.model';
import { GraphTool } from 'app/model/graph-tool.model';
import { Subscription } from 'rxjs/Subscription';
import { OrbitControls } from 'three-orbitcontrols-ts';
import {
    WebGLRenderer, PerspectiveCamera, HemisphereLight, Vector3, Line,
    AmbientLight, OrthographicCamera, Camera, Scene, Vector2
} from 'three';
// import { EffectComposer, GlitchPass, RenderPass } from 'postprocessing';
import { EffectComposer, RenderPass } from 'postprocessing';

@Injectable()
export class ChartScene {

    public static instance: ChartScene;

    // Events
    public onConfigEmit: EventEmitter<{ type: GraphConfig }> =
        new EventEmitter<{ type: GraphConfig }>();
    public onSelect: EventEmitter<{ type: EntityTypeEnum, ids: Array<string> }> =
        new EventEmitter<{ type: EntityTypeEnum, ids: Array<string> }>();

    // Instances
    public labelsA: HTMLElement;
    public labelsB: HTMLElement;
    public labelsE: HTMLElement;
    private container: HTMLElement;
    private events: ChartEvents;
    public renderer: WebGLRenderer;
    private views: Array<VisualizationView>;
    // private edges: EdgesGraph;
    private centerLine: Line;

    private workspace: WorkspaceConfigModel;
    public set workspaceConfig(value: WorkspaceConfigModel) {
        if (!value.hasOwnProperty('layout')) { return; }
        this.workspace = value;
        this.events.workspaceConfig = value;
        this.onResize();
        this.render();
    }
    config = (e: { type: GraphConfig }) => {
        this.onConfigEmit.next(e);
    }
    select = (e: { type: EntityTypeEnum, ids: Array<string> }) => {
        this.onSelect.next(e);
    }


    public init(container: HTMLElement, labelsA: HTMLElement, labelsB: HTMLElement, labelsE: HTMLElement) {

        this.labelsA = labelsA;
        this.labelsB = labelsB;
        this.labelsE = labelsE;
        window.addEventListener('resize', this.onResize.bind(this));

        const dimension: ClientRect = container.getBoundingClientRect();
        this.container = container;
        this.renderer = new WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true });
        // this.renderer.setSize(dimension.width, dimension.height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        // this.renderer.setPixelRatio(1);
        this.renderer.setClearColor(0xffffff, 1);
        this.renderer.autoClear = false;
        this.renderer.localClippingEnabled = true;
        this.container.appendChild(this.renderer.domElement);

        this.views = [{
            viewport: { x: 0, y: 0, width: Math.floor(dimension.width * .5), height: dimension.height },
            config: { visualization: VisualizationEnum.NONE },
            chart: null,
            camera: new PerspectiveCamera(22, 1, 1, 30000) as Camera,
            scene: new Scene(),
            renderer: this.renderer,
            controls: null
        }, {
            viewport: { x: Math.floor(dimension.width * .5), y: 0, width: Math.floor(dimension.width * .5), height: dimension.height },
            config: { visualization: VisualizationEnum.NONE },
            chart: null,
            camera: new PerspectiveCamera(22, 1, 1, 30000) as Camera,
            scene: new Scene(),
            renderer: this.renderer,
            controls: null
        }, {
            viewport: { x: 0, y: 0, width: dimension.width, height: dimension.height },
            config: { visualization: VisualizationEnum.NONE },
            chart: null,
            camera: null, // new OrthographicCamera(-300, 300, 300, -300) as Camera,
            scene: new Scene(),
            renderer: this.renderer,
            controls: null
        }
        ].map<any>((view, i) => {

            // Edge View Settings
            if (view.camera === null) {

                const aspect = view.viewport.width / view.viewport.height;
                const left = (-aspect * view.viewport.height) / 2;
                const right = Math.abs(left);
                const bottom = -view.viewport.height / 2;
                const top = Math.abs(bottom);

                view.camera = new OrthographicCamera(left, right, top, bottom) as Camera;
                view.camera.position.fromArray([0, 0, 1000]);
                view.camera.lookAt(new Vector3(0, 0, 0));
                view.scene.add(view.camera);
                view.scene.add(new AmbientLight(0xaaaaaa, .3));
                return view;
            } else {
                const camera = view.camera as PerspectiveCamera;
                camera.aspect = view.viewport.width / view.viewport.height;
                camera.updateProjectionMatrix();
            }

            // View
            view.camera.position.fromArray([0, 0, 1000]);
            view.camera.lookAt(new Vector3(0, 0, 0));
            view.scene.add(view.camera);

            // Controls
            view.controls = new OrbitControls(view.camera, this.renderer.domElement);
            view.controls.enabled = false;
            view.controls.addEventListener('change', this.render);

            // Lighting
            view.scene.add(new HemisphereLight(0x999999, 0xFFFFFF, 1));

            return view;
        });

        this.events = new ChartEvents(this.container);
        this.events.chartFocus.subscribe(this.onChartFocus.bind(this));

        this.render();
    }

    render = () => {
        let view;
        this.renderer.clear();

        this.views.forEach(v => {
            this.renderer.setViewport(v.viewport.x, v.viewport.y, v.viewport.width, v.viewport.height);
            this.renderer.render(v.scene, v.camera);
        });

        view = this.views[2];
        if (view.chart !== null) {
            view.chart.preRender(this.views, this.workspace.layout, this.renderer);
        }

        // Center Line
        try {
            view.scene.remove(this.centerLine);
        } catch (e) { }

        try {
            if (this.workspace.layout !== WorkspaceLayoutEnum.SINGLE) {
                this.centerLine = (this.workspace.layout === WorkspaceLayoutEnum.HORIZONTAL) ?
                    ChartFactory.lineAllocate(0x039BE5, new Vector2(0, -1000), new Vector2(0, 1000)) :
                    ChartFactory.lineAllocate(0x039BE5, new Vector2(-1000, 0), new Vector2(1000, 0));
                view.scene.add(this.centerLine);
                this.renderer.setViewport(view.viewport.x, view.viewport.y, view.viewport.width, view.viewport.height);
                this.renderer.render(view.scene, view.camera);
            }
        } catch (e) {
            console.log('resolve init');
        }
    }

    private onResize() {
        const dimension: ClientRect = this.container.getBoundingClientRect();
        this.renderer.setSize(dimension.width, dimension.height);
        this.views.forEach((view, i) => {

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
            const camera = view.camera as PerspectiveCamera;
            camera.aspect = view.viewport.width / view.viewport.height;
            camera.updateProjectionMatrix();
        });
        if (this.workspace.layout === WorkspaceLayoutEnum.OVERLAY) {
            this.views[0].camera = this.views[1].camera;
        }
        this.render();
    }


    private onChartFocus(e: ChartEvent) {
        if (this.views[1].chart !== null && this.views[0].chart !== null) {
            this.views[0].chart.enable(e.chart === GraphEnum.GRAPH_A);
            this.views[1].chart.enable(e.chart === GraphEnum.GRAPH_B);
        }
    }

    public updateDecorators(graph: GraphEnum, config: GraphConfig, decorators: Array<DataDecorator>): void {
        const view = (graph === GraphEnum.GRAPH_A) ? this.views[0] :
            (graph === GraphEnum.GRAPH_B) ? this.views[1] :
                this.views[2];
        if (view.chart !== null) {
            view.chart.updateDecorator(config, decorators);
            this.render();
        }
    }

    public updateData(graph: GraphEnum, config: GraphConfig, data: any, chartObjectInterface: ChartObjectInterface): void {
        let view: VisualizationView;
        switch (graph) {
            case GraphEnum.EDGES:
                //     view = this.views[2];
                //     //     //     if (view.config.visualization !== config.visualization) {
                //     //     //         if (view.chart !== null) { view.chart.destroy(); }
                //     //     //         view.chart = this.getChartObject(config.visualization)
                //     //     //             .create(this.labelsE, this.events, view);
                //     //     //         view.chart.onRequestRender.subscribe(this.render);
                //     //     //         view.chart.onConfigEmit.subscribe(this.config);
                //     //     //         (view.chart as EdgesGraph).updateEdges = true;
                //     //     //     }
                return;
            case GraphEnum.GRAPH_A:
            case GraphEnum.GRAPH_B:
                view = (graph === GraphEnum.GRAPH_A) ? this.views[0] : this.views[1];
                if (view.config.visualization !== config.visualization) {
                    const entityChanged = (view.config.entity === config.entity);
                    view.config.visualization = config.visualization;
                    let decorators = [];
                    if (view.chart !== null) {
                        decorators = view.chart.decorators;
                        view.chart.onRequestRender.unsubscribe();
                        view.chart.onConfigEmit.unsubscribe();
                        view.chart.destroy();
                        view.controls.minDistance = 0;
                        view.controls.maxDistance = Infinity;
                        // const camera = view.camera as PerspectiveCamera;
                        // camera.fov = 90;
                        // camera.position.set(0, 0, 1000);
                        // camera.lookAt(new Vector3(0, 0, 0));
                        // camera.aspect = view.viewport.width / view.viewport.height;
                        // camera.updateProjectionMatrix();

                    }
                    view.chart = chartObjectInterface.create(
                        (config.graph === GraphEnum.GRAPH_A) ? this.labelsA : this.labelsB,
                        this.events, view);
                    if (!entityChanged) {
                        view.chart.decorators = decorators;
                    } else { view.chart.decorators = []; }
                    view.chart.onRequestRender.subscribe(this.render);
                    view.chart.onConfigEmit.subscribe(this.config);
                    view.controls.enableRotate = false;
                    view.controls.reset();
                    view.chart.enable(true);
                    try {
                        ((graph === GraphEnum.GRAPH_A) ? this.views[1] : this.views[0]).chart.enable(false);
                    } catch (e) { }

                    if (this.workspace.layout === WorkspaceLayoutEnum.SINGLE) {
                        try {
                            this.views[0].chart.enable(true);
                        } catch (e) { }
                        try {
                            this.views[1].chart.enable(false);
                        } catch (e) { }

                    }
                }
                break;
        }
        view.chart.updateData(config, data);
        this.render();
    }



    // animate = (time) => {
    //     requestAnimationFrame(this.animate);
    //     TWEEN.update(time);
    // }

    constructor(private fontService: FontService) {
        ChartScene.instance = this;
        // requestAnimationFrame(this.animate);
    }
}

