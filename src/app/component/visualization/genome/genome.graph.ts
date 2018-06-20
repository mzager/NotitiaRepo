import { SelectionBoxController } from './../../../controller/selection/selection.box.controller';
import { GenomicEnum, ShapeEnum } from 'app/model/enum.model';
import * as THREE from 'three';
import { Vector3 } from 'three';
import { LabelController, LabelOptions } from './../../../controller/label/label.controller';
import { VisualizationView } from './../../../model/chart-view.model';
import { ChartObjectInterface } from './../../../model/chart.object.interface';
import { DataDecorator } from './../../../model/data-map.model';
import { EntityTypeEnum, WorkspaceLayoutEnum } from './../../../model/enum.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { ChartEvents } from './../../workspace/chart/chart.events';
import { ChartFactory, DataDecoatorRenderer } from './../../workspace/chart/chart.factory';
import { AbstractVisualization } from './../visualization.abstract.component';
import { GenomeConfigModel, GenomeDataModel } from './genome.model';

export class GenomeGraph extends AbstractVisualization {

    public set data(data: GenomeDataModel) { this._data = data; }
    public get data(): GenomeDataModel { return this._data as GenomeDataModel; }
    public set config(config: GenomeConfigModel) { this._config = config; }
    public get config(): GenomeConfigModel { return this._config as GenomeConfigModel; }

    public meshes: THREE.Object3D[] = [];
    private points: Array<THREE.Object3D>;
    public tads: Array<THREE.Object3D> = [];
    public chromosomes: Array<THREE.Object3D> = [];
    public meres: Array<THREE.Object3D> = [];
    public bands: Array<THREE.Object3D> = [];
    protected selectionController: SelectionBoxController;

    public renderer: DataDecoatorRenderer = (group: THREE.Group, mesh: THREE.Sprite, decorators: Array<DataDecorator>,
        i: number, count: number): void => {
        mesh.position.setX(-2);
        const lineMat = new THREE.LineBasicMaterial({ color: mesh.material.color.getHex() });
        const lineGeom = new THREE.Geometry();
        lineGeom.vertices.push(
            new THREE.Vector3(-2, 0, 0),
            new THREE.Vector3(0, 0, 0)
        );
        const line = new THREE.Line(lineGeom, lineMat);
        group.add(line);
    }

    chromosomeToNumber(chromosome: string, x: boolean = true): number {
        let rv = parseInt(chromosome, 10);
        if (isNaN(rv)) { rv = (chromosome.toLowerCase() === 'x') ? 23 : 24; }
        return (x) ? rv * 20 : rv;
    }

    updateDecorator(config: GraphConfig, decorators: DataDecorator[]) {
        super.updateDecorator(config, decorators);
        ChartFactory.decorateDataGroups(this.meshes, this.decorators, this.renderer);
        this.selectionController.targets = this.points;
        this.onShowLabels();
    }
    updateData(config: GraphConfig, data: any) {
        super.updateData(config, data);
        this.removeObjects();
        this.addObjects();
    }
    create(labels: HTMLElement, events: ChartEvents, view: VisualizationView): ChartObjectInterface {
        super.create(labels, events, view);
        this.selectionController = new SelectionBoxController(view, events);
        this.tooltipController.targets = this.bands;
        return this;
    }
    destroy() {
        super.destroy();
        this.selectionController.destroy();
        this.removeChromosomes();
        this.removeTads();
        this.removeGenes();
    }
    enable(truthy: boolean) {
        super.enable(truthy);
    }

    preRender(views: VisualizationView[], layout: WorkspaceLayoutEnum, renderer: THREE.Renderer): void {
        super.preRender(views, layout, renderer);
    }
    addObjects() {
        if (this.chromosomes.length === 0) { this.addChromosomes(); }
        if (this.config.showTads) { this.addTads(); }
        this.addGenes();
        ChartFactory.configPerspectiveOrbit(this.view,
            new THREE.Box3(
                new THREE.Vector3(-200, -100, -5),
                new THREE.Vector3(200, 100, 5)));

        requestAnimationFrame(v => {
            this.onShowLabels();
        });
    }
    removeObjects() {
        if (!this.config.showTads) { this.removeTads(); }
        this.removeGenes();
    }
    addChromosomes() {
        const data = this.data;
        data.chromo.forEach(chromosome => {
            const xPos = this.chromosomeToNumber(chromosome.chr);

            // Centromere
            const centro: THREE.Mesh = ChartFactory.meshAllocate(0x0091EA, ShapeEnum.CIRCLE, .5,
                new THREE.Vector3(xPos - 230, 0, 0), {});
            centro.userData.tooltip = chromosome.chr;
            this.meres.push(centro);
            this.view.scene.add(centro);

            // Tele Q
            const teleQ: THREE.Mesh = ChartFactory.meshAllocate(0x0091EA, ShapeEnum.CIRCLE, .5,
                new THREE.Vector3(xPos - 230, chromosome.Q - chromosome.C, 0), {});
            teleQ.userData.chr = chromosome.chr;
            teleQ.userData.type = GenomicEnum.Q_TELOMERE;
            teleQ.userData.tooltip = 'Q' + chromosome.chr; // Telemere
            this.meres.push(teleQ);
            this.view.scene.add(teleQ);

            // Tele P
            const teleP: THREE.Mesh = ChartFactory.meshAllocate(0x0091EA, ShapeEnum.CIRCLE, .5,
                new THREE.Vector3(xPos - 230, chromosome.P - chromosome.C, 0), {});
            teleP.userData.chr = chromosome.chr;
            teleP.userData.type = GenomicEnum.P_TELOMERE;
            teleP.userData.tooltip = 'P' + chromosome.chr; // Telemere
            this.meres.push(teleP);
            this.view.scene.add(teleP);
        });

        data.bands.forEach((band, i) => {
            let yPos = 0;
            const xPos = (i + 1) * 20 - 230;
            band.forEach((cyto) => {
                const centro = data.chromo[i].C;
                const geometry: THREE.PlaneGeometry = new THREE.PlaneGeometry(0.5, cyto.l);
                const material: THREE.Material = ChartFactory.getColorPhong(cyto.c);
                const mesh: THREE.Mesh = new THREE.Mesh(geometry, material);
                mesh.userData.type = GenomicEnum.CYTOBAND;
                mesh.position.set(xPos, (yPos + (cyto.l / 2)) - centro, 0);
                mesh.userData.color = cyto.c;
                mesh.userData.tooltip = cyto.chr + cyto.arm.toLowerCase() +
                    ((cyto.subband) ? '.' + cyto.subband : '') + ' | ' + cyto.tag.replace('neg', '-').replace('pos', '+');
                yPos += cyto.l;
                this.bands.push(mesh);
                this.view.scene.add(mesh);
            });
        });
    }
    addTads() {
        const data = this.data;
        data.tads.forEach(tad => {
            const chr = this.chromosomeToNumber(tad.chr, false);
            const xPos = chr * 20 - 230;
            const centro = data.chromo[chr - 1].C;
            const line = ChartFactory.lineAllocateCurve(
                0x9c27b0,
                new THREE.Vector2(xPos, tad.s - centro),
                new THREE.Vector2(xPos, tad.e - centro),
                new THREE.Vector2(
                    xPos + (20 * 0.2),
                    (Math.abs(tad.e - tad.s) * 0.5) + tad.s - centro
                )
            );
            this.tads.push(line);
            this.view.scene.add(line);
        });
    }
    addGenes() {
        const data = this.data;
        Object.keys(data.genes).forEach(chromosome => {
            const chr = this.chromosomeToNumber(chromosome, false);
            const xPos = chr * 20 - 230;
            const centro = data.chromo[chr - 1].C;
            data.genes[chromosome].forEach(gene => {
                const group = ChartFactory.createDataGroup(gene.gene, EntityTypeEnum.GENE,
                    new Vector3(xPos, gene.tss - centro, 0));
                group.userData.tooltip = gene.gene;
                this.meshes.push(group);
                this.view.scene.add(group);
            });
        });

        ChartFactory.decorateDataGroups(this.meshes, this.decorators, this.renderer);
        // debugger;
        this.points = this.meshes.map(v => {
            v.children[1].userData.tooltip = v.userData.tooltip;
            return v.children[1];
        });
        this.tooltipController.targets = this.bands.concat(this.points);
    }
    removeChromosomes() {
        this.view.scene.remove(... this.chromosomes);
        this.view.scene.remove(... this.meres);
        this.view.scene.remove(... this.bands);
        this.chromosomes.length = 0;
        this.meres.length = 0;
        this.bands.length = 0;
    }
    removeTads() {
        this.view.scene.remove(...this.tads);
        this.tads.length = 0;
    }
    removeGenes() {
        this.view.scene.remove(...this.meshes);
        this.meshes.length = 0;
    }

    onShowLabels(): void {

        const zoom = this.view.camera.position.z;
        let labelOptions;
        if (zoom > 600) {
            labelOptions = new LabelOptions(this.view, 'PIXEL');
            // labelOptions.offsetX3d = -2;
            // labelOptions.align = 'RIGHT';
            this.labels.innerHTML = LabelController.generateHtml(this.meres, labelOptions);
            // debugger;
        } else {
            labelOptions = new LabelOptions(this.view, 'FORCE');
            labelOptions.offsetX3d = -4;
            // labelOptions.offsetY3d = 1;
            labelOptions.align = 'RIGHT';
            labelOptions.maxLabels = 500;
            // labelOptions.offsetX = -30;
            this.labels.innerHTML = LabelController.generateHtml(this.meshes, labelOptions);
        }
    }
    onKeyDown(e: KeyboardEvent): void {
        if (e.key === 'Meta') {
            if (this.isEnabled) {
                this.view.renderer.domElement.style.setProperty('cursor', 'crosshair');
                this.view.controls.enabled = false;
                this.tooltipController.enable = false;
                this.selectionController.setup(this.config, this.onRequestRender, this.onSelect, this.points);
                this.selectionController.enable = true;
            }
        }
    }
    onKeyUp(e: KeyboardEvent): void {
        if (e.key === 'Meta') {
            if (this.isEnabled) {
                this.view.renderer.domElement.style.setProperty('cursor', 'default');
                this.view.controls.enabled = true;
                this.tooltipController.enable = true;
                this.selectionController.enable = false;
                this.selectionController.teardown();
            }
        }
    }
}
