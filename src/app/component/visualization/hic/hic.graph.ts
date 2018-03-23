import { DataDecorator } from './../../../model/data-map.model';
import { hicComputeFn } from './hic.compute';
import { ComputeWorkerUtil } from './../../../service/compute.worker.util';
import { HicConfigModel, HicDataModel } from './hic.model';
import { Colors, EntityTypeEnum, WorkspaceLayoutEnum, DirtyEnum, CollectionTypeEnum } from './../../../model/enum.model';
import { OrbitControls } from 'three-orbitcontrols-ts';
import { ChartUtil } from './../../workspace/chart/chart.utils';
import { Subscription } from 'rxjs/Subscription';
import { ChartObjectInterface } from './../../../model/chart.object.interface';
import { ChartEvent, ChartEvents } from './../../workspace/chart/chart.events';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { VisualizationView } from './../../../model/chart-view.model';
import { FontFactory } from './../../../service/font.factory';
import { Injectable, EventEmitter, Output } from '@angular/core';
import { ShapeEnum, ColorEnum, GraphEnum } from 'app/model/enum.model';
import { ChartFactory } from './../../workspace/chart/chart.factory';
import { GraphConfig } from './../../../model/graph-config.model';
import * as scale from 'd3-scale';
import * as _ from 'lodash';
import * as THREE from 'three';
import graph from 'ngraph.graph';
import forcelayout3d from 'ngraph.forcelayout3d';
import { MeshLine, MeshLineMaterial } from 'three.meshline';
import * as TWEEN from 'tween.js';
import { schemeRdBu, interpolateRdBu, interpolateYlGnBu } from 'd3-scale-chromatic';
import { scaleLinear, scaleOrdinal, scaleSequential } from 'd3-scale';
import { MeshBasicMaterialParameters, SphereGeometry, Mesh } from 'three';

export class HicGraph implements ChartObjectInterface {

    // tslint:disable-next-line:max-line-length
    private genes25red = ['ALDOA', 'CDC16', 'EXOSC2', 'GPS1', 'LAMTOR2', 'MRPL49', 'NOL10', 'POP5', 'PSMG3', 'SART3', 'SRRT', 'U2AF1', 'USP5', 'EIF5', 'ISCU', 'MATR3', 'MRPL33', 'RNASEH2C', 'SACM1L', 'TBCD', 'DTYMK', 'EMC3', 'RRM2', 'SF3B2', 'WASF2'];
    private genes252green = ['BCL6', 'CDC16', 'CFL1', 'CSNK1G2', 'LOC730668', 'MUS81', 'NCOR2', 'ODC1', 'SNORA42', 'ABL1', 'CLEC3B', 'FOSL2', 'FOXL1', 'IER5L', 'LINC00705', 'LOC100506474', 'NEDD4L', 'PHLDA1', 'RALGPS1', 'RIT1', 'RNASEH2C', 'RUNX1', 'SCARNA4', 'SCYL1', 'SECTM1', 'SNORA80B', 'TRDMT1', 'CDK2AP1', 'DST', 'DTYMK', 'EMC3', 'ENO1', 'GAS6', 'IGFBP5', 'ISCU', 'KLF6', 'LOC100506394', 'LOC644961', 'MIR125B1', 'MIR548AR', 'NOL10', 'NTMT1', 'RAB25', 'SART1', 'SART3', 'SF3B2', 'SLC45A1', 'TBCD', 'TMEM222', 'TRMU', 'VIM', 'AGAP1', 'ALDOA', 'ARHGDIA', 'ARHGEF19', 'ASAP1-IT1', 'B4GALNT3', 'BDH1', 'C17orf62', 'C9orf78', 'CEBPB', 'CHAMP1', 'CHD4', 'CIDECP', 'COTL1', 'CRYGS', 'DCXR', 'DPF2', 'FANCD2', 'FAU', 'FNBP1', 'FOXC2', 'FOXK2', 'GAL3ST3', 'GON4L', 'HIP1R', 'HIST1H2AD', 'HIST1H2AE', 'HIST1H2BF', 'HIST1H3D', 'HIST1H4H', 'HIST1H4I', 'HMGB1', 'IGFBP3', 'KAT5', 'KIF1A', 'LAMTOR2', 'LINC00704', 'LOC100506178', 'LRRC43', 'MIR645', 'MIRLET7BHG', 'MRPL49', 'MYL12B', 'NTNG2', 'OR6B2', 'POP5', 'PRIM2', 'PRR5L', 'RAC3', 'RCAN1', 'SET', 'SH2D3C', 'SLC27A4', 'SNX32', 'SORBS3', 'SRRT', 'STK25', 'SYT11', 'TM7SF2', 'TRIB2', 'TSC22D1', 'TTF2', 'U2AF1', 'UBE2V1', 'UBQLN4', 'UFSP1', 'UPF3A', 'USP20', 'VEGFA', 'VGLL4', 'WDR81', 'ZMIZ1', 'ZMIZ1-AS1', 'ZNF217', 'ADM', 'AHDC1', 'ASAP1', 'ATG4B', 'BCL7A', 'BIN3-IT1', 'BTN3A2', 'C17orf89', 'C1orf61', 'C1orf64', 'C1orf86', 'C8orf58', 'C9orf106', 'CAPN1', 'CDCA3', 'CDKN1B', 'CRLF1', 'CXCR7', 'DIABLO', 'DLEU2', 'DNAJB11', 'DNAJC1', 'EFHC1', 'EGR3', 'EIF5', 'ENTHD2', 'EXOSC2', 'FAM129B', 'FAM20C', 'FAM89B', 'FBXO9', 'FGGY', 'FPGS', 'FTSJ2', 'GBA2', 'GNB3', 'GPR157', 'GPS1', 'HDLBP', 'HIST1H2AH', 'HIST1H2AM', 'HIST1H2BH', 'HIST1H2BK', 'HIST1H2BO', 'HIST1H3F', 'HIST1H3J', 'HIST1H4E', 'HIST1H4G', 'HMHA1', 'IRF2BP2', 'JUN', 'KIAA0196', 'KIAA1967', 'KIF26B', 'KLF4', 'LAMP1', 'LARS2-AS1', 'LIMD1-AS1', 'LINC00961', 'LINC00963', 'LOC100131060', 'LOC100505806', 'LOC101593348', 'MAP3K11', 'MARCKS', 'MATR3', 'MIR199B', 'MIR3143', 'MIR3154', 'MLF2', 'MORN1', 'MRPL33', 'MSANTD1', 'MSMP', 'NCS1', 'NDUFA10', 'NRG2', 'NSMCE2', 'NUDT1', 'P4HB', 'PIANP', 'PITX3', 'PLOD3', 'POLA2', 'POLH', 'PRKAR1B', 'PRPF4B', 'PSD3', 'PSMG3', 'PSMG3-AS1', 'PTPN6', 'RASSF1', 'RBPJ', 'RCE1', 'RERE', 'RFNG', 'RGP1', 'RGS12', 'RRM2', 'RUFY4', 'SACM1L', 'SEMA5A', 'SH3BP4', 'SIK1', 'SLC25A25', 'SMAP2', 'SNORA65', 'SNORD123', 'SOX5', 'SPOCD1', 'SSSCA1', 'SSSCA1-AS1', 'SUN1', 'TBCCD1', 'TCF4', 'TGIF1', 'TRIOBP', 'USP48', 'USP5', 'WASF2', 'XPO5', 'YWHAQ', 'ZC3HC1', 'ZFP36L1', 'ZNF750', 'ZNHIT1', 'ZNHIT2'];

    // Emitters
    public onRequestRender: EventEmitter<GraphEnum> = new EventEmitter();
    public onConfigEmit: EventEmitter<{ type: GraphConfig }> = new EventEmitter<{ type: GraphConfig }>();
    public onSelect: EventEmitter<{ type: EntityTypeEnum, ids: Array<string> }> =
        new EventEmitter<{ type: EntityTypeEnum, ids: Array<string> }>();

    private NODE_SIZE = 5;

    // Chart Elements
    private labels: HTMLElement;
    private overlay: HTMLElement;
    private tooltips: HTMLElement;
    private events: ChartEvents;
    private view: VisualizationView;
    private data: HicDataModel;
    private config: HicConfigModel;
    private isEnabled: boolean;
    private selections: Array<Mesh> = [];
    chromosomeLine: MeshLine;
    chromosomeGeometry: THREE.Geometry;
    chromosomeCurve: THREE.CatmullRomCurve3;
    chromosomePath: THREE.CurvePath<THREE.Vector>;
    normal = new THREE.Vector3(0, 0, 0);
    binormals = new THREE.Vector3(0, 0, 0);

    private wireframe_material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true, wireframeLinewidth: 10 });


    // Objects
    public meshes: Array<THREE.Mesh>;
    public decorators: DataDecorator[];
    public lines: Array<THREE.Line>;
    public chromosomeMesh: THREE.Mesh;
    private graphData: any;

    // Private Subscriptions
    private sMouseMove: Subscription;

    // tslint:disable-next-line:max-line-length
    // private g252 = ["BCL6","CDC16","CFL1","CSNK1G2","LOC730668","MUS81","NCOR2","ODC1","SNORA42","ABL1","CLEC3B","FOSL2","FOXL1","IER5L","LINC00705","LOC100506474","NEDD4L","PHLDA1","RALGPS1","RIT1","RNASEH2C","RUNX1","SCARNA4","SCYL1","SECTM1","SNORA80B","TRDMT1","CDK2AP1","DST","DTYMK","EMC3","ENO1","GAS6","IGFBP5","ISCU","KLF6","LOC100506394","LOC644961","MIR125B1","MIR548AR","NOL10","NTMT1","RAB25","SART1","SART3","SF3B2","SLC45A1","TBCD","TMEM222","TRMU","VIM","AGAP1","ALDOA","ARHGDIA","ARHGEF19","ASAP1-IT1","B4GALNT3","BDH1","C17orf62","C9orf78","CEBPB","CHAMP1","CHD4","CIDECP","COTL1","CRYGS","DCXR","DPF2","FANCD2","FAU","FNBP1","FOXC2","FOXK2","GAL3ST3","GON4L","HIP1R","HIST1H2AD","HIST1H2AE","HIST1H2BF","HIST1H3D","HIST1H4H","HIST1H4I","HMGB1","IGFBP3","KAT5","KIF1A","LAMTOR2","LINC00704","LOC100506178","LRRC43","MIR645","MIRLET7BHG","MRPL49","MYL12B","NTNG2","OR6B2","POP5","PRIM2","PRR5L","RAC3","RCAN1","SET","SH2D3C","SLC27A4","SNX32","SORBS3","SRRT","STK25","SYT11","TM7SF2","TRIB2","TSC22D1","TTF2","U2AF1","UBE2V1","UBQLN4","UFSP1","UPF3A","USP20","VEGFA","VGLL4","WDR81","ZMIZ1","ZMIZ1-AS1","ZNF217","ADM","AHDC1","ASAP1","ATG4B","BCL7A","BIN3-IT1","BTN3A2","C17orf89","C1orf61","C1orf64","C1orf86","C8orf58","C9orf106","CAPN1","CDCA3","CDKN1B","CRLF1","CXCR7","DIABLO","DLEU2","DNAJB11","DNAJC1","EFHC1","EGR3","EIF5","ENTHD2","EXOSC2","FAM129B","FAM20C","FAM89B","FBXO9","FGGY","FPGS","FTSJ2","GBA2","GNB3","GPR157","GPS1","HDLBP","HIST1H2AH","HIST1H2AM","HIST1H2BH","HIST1H2BK","HIST1H2BO","HIST1H3F","HIST1H3J","HIST1H4E","HIST1H4G","HMHA1","IRF2BP2","JUN","KIAA0196","KIAA1967","KIF26B","KLF4","LAMP1","LARS2-AS1","LIMD1-AS1","LINC00961","LINC00963","LOC100131060","LOC100505806","LOC101593348","MAP3K11","MARCKS","MATR3","MIR199B","MIR3143","MIR3154","MLF2","MORN1","MRPL33","MSANTD1","MSMP","NCS1","NDUFA10","NRG2","NSMCE2","NUDT1","P4HB","PIANP","PITX3","PLOD3","POLA2","POLH","PRKAR1B","PRPF4B","PSD3","PSMG3","PSMG3-AS1","PTPN6","RASSF1","RBPJ","RCE1","RERE","RFNG","RGP1","RGS12","RRM2","RUFY4","SACM1L","SEMA5A","SH3BP4","SIK1","SLC25A25","SMAP2","SNORA65","SNORD123","SOX5","SPOCD1","SSSCA1","SSSCA1-AS1","SUN1","TBCCD1","TCF4","TGIF1","TRIOBP","USP48","USP5","WASF2","XPO5","YWHAQ","ZC3HC1","ZFP36L1","ZNF750","ZNHIT1","ZNHIT2"];
    // private g5 = ['MRPL49','RNASEH2C','USP5','PSMG3','CDC16','SRRT'];
    create(labels: HTMLElement, events: ChartEvents, view: VisualizationView): ChartObjectInterface {
        this.labels = labels;
        this.labels.innerText = '';

        this.tooltips = <HTMLDivElement>(document.createElement('div'));
        this.tooltips.className = 'graph-tooltip';
        this.labels.appendChild(this.tooltips);

        this.overlay = <HTMLDivElement>(document.createElement('div'));
        this.overlay.className = 'graph-overlay';
        this.labels.appendChild(this.overlay);
        this.events = events;
        this.view = view;
        this.isEnabled = false;
        this.meshes = [];
        this.lines = [];
        this.view.controls.enableRotate = true;
        return this;
    }

    destroy() {
        this.enable(false);
        this.removeObjects();
    }
    updateDecorator(config: GraphConfig, decorators: DataDecorator[]) {
        throw new Error('Method not implemented.');
    }
    updateData(config: GraphConfig, data: any) {
        this.config = config as HicConfigModel;
        this.data = data;
        if (this.config.dirtyFlag & DirtyEnum.LAYOUT) {
            this.removeObjects();
            this.addObjects();
        }
        if (this.config.dirtyFlag & DirtyEnum.COLOR) {
            const idProperty = (config.entity === EntityTypeEnum.GENE) ? 'mid' :
                (this.config.pointColor.ctype & CollectionTypeEnum.MOLECULAR) ? 'sid' : 'pid';
            const objMap = data.pointColor;
            this.meshes.forEach(mesh => {
                const color = objMap[mesh.userData[idProperty]];
                (mesh as THREE.Mesh).material = ChartFactory.getColorPhong(color);

                mesh.userData.color = color;
            });
        }
        if (this.config.dirtyFlag & DirtyEnum.OPTIONS | DirtyEnum.LAYOUT) {

            // Remove Objects
            this.overlay.innerHTML = '';
            if (this.chromosomeMesh !== null) {
                this.view.scene.remove(this.chromosomeMesh);
                this.chromosomeMesh = null;
            }
            for (let i = 0; i < this.lines.length; i++) {
                this.view.scene.remove(this.lines[i]);
            }

            // Add Objects
            if (this.config.showLinks) {
                this.data.edges.forEach(edge => {
                    const linkGeometry = new THREE.Geometry();
                    linkGeometry.vertices.push(new THREE.Vector3(edge.source.x, edge.source.y, edge.source.z));
                    linkGeometry.vertices.push(new THREE.Vector3(edge.target.x, edge.target.y, edge.target.z));
                    const linkMaterial = new THREE.LineBasicMaterial({ color: edge.color });
                    const line = new THREE.Line(linkGeometry, linkMaterial);
                    this.lines.push(line);
                    this.view.scene.add(line);
                });
            }
            if (this.chromosomeMesh !== null) {
                this.view.scene.remove(this.chromosomeMesh);
                this.chromosomeMesh = null;
            }
            if (this.config.showChromosome) {
                const geneLocations = this.data.nodes.filter(v => v.data)    // Filter Out genes That Don't Have Chromosome Info
                    .sort((a, b) => ((a.data.tss <= b.data.tss) ? -1 : 1)) // Sort Genes By Location On Chromosome
                    .map(node => new THREE.Vector3(node.x, node.y, node.z));
                this.chromosomeCurve = new THREE.CatmullRomCurve3(geneLocations);
                this.chromosomeCurve['type'] = 'chordal';
                this.chromosomePath = new THREE.CurvePath();
                this.chromosomePath.add(this.chromosomeCurve);

                this.chromosomeGeometry = this.chromosomePath.createPointsGeometry(1000);
                this.chromosomeLine = new MeshLine();
                this.chromosomeLine.setGeometry(this.chromosomeGeometry);
                const mat = new MeshLineMaterial({
                    color: new THREE.Color(0x90caf9),
                    lineWidth: 2,
                });
                this.chromosomeMesh = new THREE.Mesh(this.chromosomeLine.geometry, mat); // this syntax could definitely be improved!
                this.chromosomeMesh.frustumCulled = false;
                this.view.scene.add(this.chromosomeMesh);
            }
        }
    }

    enable(truthy: boolean) {
        if (this.isEnabled === truthy) { return; }
        this.isEnabled = truthy;
        this.view.controls.enabled = this.isEnabled;
        if (truthy) {
            this.sMouseMove = this.events.chartMouseMove.subscribe(this.onMouseMove.bind(this));
        } else {
            this.sMouseMove.unsubscribe();
        }
    }

    preRender(views: Array<VisualizationView>, layout: WorkspaceLayoutEnum, renderer: THREE.WebGLRenderer) {

    }
    addObjects() {
        const sl = scaleLinear().range([.2, 2]).domain([1, 20]);
        const cs = scaleSequential(interpolateYlGnBu).domain([0, 7]);
        this.data.nodes.forEach(node => {
            const data = { tip: node.gene, type: EntityTypeEnum.GENE, mid: node.gene };
            const edges = this.data.edges;
            const metrics = edges.reduce((p, c) => {
                if (c.source.gene === node.gene || c.target.gene === node.gene) {
                    p.c += 1;
                    p.t += c.tension;
                }
                return p;
            }, { c: 0, t: 0 });
            const scale = 1; // sl(metrics.c);

            const color = 0x039BE5;
            // if (this.g252.indexOf(node.gene)>-1) color = 0x00FF00;
            // if (this.g5.indexOf(node.gene)>-1) color = 0xFF0000;
            // node.color
            const mesh = ChartFactory.meshAllocate(color, ShapeEnum.CIRCLE, scale,
                new THREE.Vector3(node.x, node.y, node.z), data);
            mesh.material = ChartFactory.getColorPhong(color);
            data.tip += ' [' + metrics.c + '.' + Math.round(metrics.t / metrics.c) + ']';

            if (this.genes25red.indexOf(node.gene) > -1) {
                const mat = ChartFactory.getOutlineShader(this.view.camera.position, 0xFF0000);
                const moonGlow = new THREE.Mesh(mesh.geometry.clone(), mat);
                moonGlow.position.copy(mesh.position);
                moonGlow.scale.multiplyScalar(1.4);
                this.view.scene.add(moonGlow);
                this.selections.push(moonGlow);

            } else if (this.genes252green.indexOf(node.gene) > -1) {
                const mat = ChartFactory.getOutlineShader(this.view.camera.position, 0x00FF00);
                const moonGlow = new THREE.Mesh(mesh.geometry.clone(), mat);
                moonGlow.position.copy(mesh.position);
                moonGlow.scale.multiplyScalar(1.4);
                this.view.scene.add(moonGlow);
                this.selections.push(moonGlow);
            }


            this.meshes.push(mesh);
            this.view.scene.add(mesh);
        });

        this.onRequestRender.emit();
        // this.animateCamera();
    }

    animateCamera(): void {
        const animation = {
            step: 0, view: this.view,
            line: this.chromosomeLine,
            path: this.chromosomePath,
            geo: this.chromosomeGeometry,
            chromosomeCurve: this.chromosomeCurve,
            onRequestRender: this.onRequestRender
        };
        const steps = this.chromosomePath.getPoints().length;
        new TWEEN.Tween(animation)
            .to({ step: 1, target: 1.5 }, 90000)
            .delay(500)
            .onUpdate((step) => {

                const cameraPos = this.chromosomeCurve.getPointAt(step);
                const tan = this.chromosomeCurve.getTangentAt(step);
                this.view.camera.position.copy(cameraPos);
                this.view.camera.rotation.setFromVector3(tan);
                (this.view.camera as THREE.PerspectiveCamera).fov = 80;

                this.view.camera.lookAt(this.chromosomeCurve.getPointAt(step + 0.01));
                this.onRequestRender.emit();
            })
            .start();
    }

    removeObjects() {
        this.overlay.innerHTML = '';
        for (let i = 0; i < this.selections.length; i++) {
            this.view.scene.remove(this.selections[i]);
        }
        for (let i = 0; i < this.meshes.length; i++) {
            this.view.scene.remove(this.meshes[i]);
        }
        if (this.chromosomeMesh !== null) {
            this.view.scene.remove(this.chromosomeMesh);
            this.chromosomeMesh = null;
        }
        for (let i = 0; i < this.lines.length; i++) {
            this.view.scene.remove(this.lines[i]);
        }
    }

    private onMouseMove(e: ChartEvent): void {


        const meshes = ChartUtil.getVisibleMeshes(this.view).map<{ label: string, x: number, y: number, z: number }>(mesh => {
            const coord = ChartUtil.projectToScreen(this.config.graph, mesh, this.view.camera,
                this.view.viewport.width, this.view.viewport.height);
            return { label: mesh.userData.tip, x: coord.x + 10, y: coord.y - 5, z: coord.z };
        });
        if (meshes.length < 15) {
            const html = meshes.filter(v => v.label !== undefined).map(data => {
                return '<div class="chart-label" style="background: rgba(255, 255, 255, .5);font-size:8px;left:' +
                    data.x + 'px;top:' + data.y + 'px;position:absolute;">' + data.label + '</div>';
            }).reduce((p, c) => p += c, '');
            this.tooltips.innerHTML = html;
        } else {
            const geneHit = ChartUtil.getIntersects(this.view, e.mouse, this.meshes);
            if (geneHit.length > 0) {
                const xPos = e.mouse.xs + 10;
                const yPos = e.mouse.ys;
                this.tooltips.innerHTML = '<div style="background:rgba(0,0,0,.8);color:#FFF;padding:3px;border-radius:' +
                    '3px;z-index:9999;position:absolute;left:' +
                    xPos + 'px;top:' +
                    yPos + 'px;">' +
                    geneHit[0].object.userData.tip + '</div>';
                return;
            }
            this.tooltips.innerHTML = '';

        }

    }

    constructor() { }

}
