import { DataService } from './../../../service/data.service';
import { GraphEnum, WorkspaceLayoutEnum, SpriteMaterialEnum } from 'app/model/enum.model';
import { EventEmitter } from '@angular/core';
import { DataDecorator } from './../../../model/data-map.model';
import { EntityTypeEnum } from './../../../model/enum.model';
import { ChartFactory, DataDecoatorRenderer } from './../../workspace/chart/chart.factory';
import { GraphConfig } from 'app/model/graph-config.model';
import { ChartObjectInterface } from './../../../model/chart.object.interface';
import { VisualizationView } from './../../../model/chart-view.model';
import { ChartEvent, ChartEvents } from './../../workspace/chart/chart.events';
import { AbstractVisualization } from './../visualization.abstract.component';
import * as THREE from 'three';
import { ChromosomeDataModel, ChromosomeConfigModel } from './chromosome.model';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { arc } from 'd3-shape';
import * as complex from 'three-simplicial-complex';
import { Geometry } from 'three';

/*
 const biotypeCat = {
              'Protein Coding': ['protein_coding', 'polymorphic_pseudogene', 'IG_V_gene', 'TR_V_gene', 'TR_C_gene', 'TR_J_gene',
                'TR_D_gene', 'IG_C_gene', 'IG_D_gene', 'IG_J_gene'],
              'Pseudogene': ['IG_V_pseudogene', 'transcribed_unprocessed_pseudogene', 'processed_pseudogene',
                'unprocessed_pseudogene', 'transcribed_processed_pseudogene', 'unitary_pseudogene', 'IG_pseudogene',
                'IG_C_pseudogene', 'IG_J_pseudogene', 'TR_J_pseudogene', 'TR_V_pseudogene', 'transcribed_unitary_pseudogene'],
              'Long Noncoding': ['antisense', 'sense_intronic', 'lincRNA', 'sense_overlapping', 'processed_transcript',
                '3prime_overlapping_ncRNA', 'non_coding'],
              'Short Noncoding': ['rRna', 'misc_RNA', 'pseudogene', 'snoRNA', 'scRNA', 'miRNA', 'snRNA', 'sRNA', 'ribozyme',
                'scaRNA', 'vaultRNA'],
              'Other': ['TEC', 'bidirectional_promoter_lncRNA', 'macro_lncRNA']
            };

            const biotypeMap = Object.keys(biotypeCat).reduce((p, c) => {
              p = Object.assign(p, biotypeCat[c].reduce((p2, c2) => {
                p2[c2.toLowerCase()] = c;
                return p2;
              }, {}));
              return p;
            }, {});

            const bioTypes: Array<string> = Array.from(results.reduce((p, c) => {
              p.add(c.type.toLowerCase());
              return p;
            }, new Set()));

            const scale = (decorator.type === DataDecoratorTypeEnum.SHAPE) ?
              ChartFactory.getScaleShapeOrdinal(Object.keys(biotypeCat)) :
              ChartFactory.getScaleColorOrdinal(Object.keys(biotypeCat));
              */
// import { ArcCurve, RingBufferGeometry, RingGeometry } from 'three';
export class ChromosomeGraph extends AbstractVisualization {

    public geneTypeSprites: Array<THREE.Sprite> = [];

    public set data(data: ChromosomeDataModel) { this._data = data; }
    public get data(): ChromosomeDataModel { return this._data as ChromosomeDataModel; }
    public set config(config: ChromosomeConfigModel) { this._config = config; }
    public get config(): ChromosomeConfigModel { return this._config as ChromosomeConfigModel; }





    public renderer: DataDecoatorRenderer = (group: THREE.Group, mesh: THREE.Sprite, decorators: Array<DataDecorator>,
        i: number, count: number): void => {

        // if (i === 1) {
        //     const arcShape = new THREE.Shape();
        //     arcShape.absarc(0.0, 0.0, 10.0, 10.0, 20.0, true);
        //     const geometry = new THREE.ShapeBufferGeometry(arcShape);
        //     const m = new THREE.Mesh(geometry, ChartFactory.getColorPhong(0x0000FF));
        //     group.add(m);
        // }


        // arcShape.absarc(0, 0, 30, group.userData)
        // arcShape.moveTo(50, 10);
        // arcShape.absarc(10, 10, 40, 0, Math.PI * 2, false);


        // const circumference = 2 * Math.PI * (count * 0.5);



        // const slice = new THREE.Shape();
        // slice =
        //     count * 0.5;

        // debugger;

        // mesh.position.setX(-2);
        // const lineMat = new THREE.LineBasicMaterial({ color: 0x0000FF });

        // const lineGeom = new THREE.Geometry();

        // lineGeom.vertices.push(
        //     new THREE.Vector3(500, 0, 0),
        //     new THREE.Vector3(0, 0, 0)
        // );
        // const line = new THREE.Line(lineGeom, lineMat);
        // group.add(line);

        // mesh.position.setX(-2);
        const lineMat = new THREE.LineBasicMaterial({ color: mesh.material.color.getHex() });
        const lineGeom = new THREE.Geometry();
        // const pos = new THREE.Vector3(-group.position.x, -group.position.y, group.position.z);
        lineGeom.vertices.push(
            group.position,
            new THREE.Vector3(0, 0, 0)
        );
        const line = new THREE.Line(lineGeom, lineMat);
        group.add(line);
    }


    // Create - Initialize Mesh Arrays
    create(labels: HTMLElement, events: ChartEvents, view: VisualizationView): ChartObjectInterface {
        super.create(labels, events, view);
        this.meshes = [];
        return this;
    }

    destroy() {
        super.destroy();
        this.removeObjects();
    }

    updateDecorator(config: GraphConfig, decorators: DataDecorator[]) {
        super.updateDecorator(config, decorators);
        ChartFactory.decorateDataGroups(this.meshes, this.decorators, this.renderer);
    }

    updateData(config: GraphConfig, data: any) {
        super.updateData(config, data);
        this.removeObjects();
        this.addObjects(this.config.entity);
    }

    enable(truthy: boolean) {
        super.enable(truthy);
        this.view.controls.enableRotate = true;
    }


    addObjects(type: EntityTypeEnum): void {
        if (this.config.layoutOption === 'Line') {
            this.addObjectsLinear(type);
        } else {
            this.addObjectsCircular(type);
        }
        ChartFactory.decorateDataGroups(this.meshes, this.decorators);
    }
    addObjectsLinear(type: EntityTypeEnum): void {
        const propertyId = (this.config.entity === EntityTypeEnum.GENE) ? 'mid' : 'sid';
        const objectIds = this.data[propertyId];
    }

    addObjectsCircular(type: EntityTypeEnum): void {

        let scale = scaleLinear();
        scale.range([0, 365]);
        let geneData, tele, centro, telem;
        const mf = new Set(this.config.markerFilter);
        // if (this.config.spacingOption === 'Linear') {
        scale = scaleLinear();
        scale.domain([0, this.data.genes.length]);
        scale.range([0, 365]);
        geneData = this.data.genes.sort((a, b) => (b.tss - a.tss)).map((v, i) => {
            const angle = scale(i) * Math.PI / 180;
            return Object.assign(v, {
                inSet: mf.has(v.gene),
                sPos: { x: Math.cos(angle), y: Math.sin(angle), a: angle },
                ePos: { x: Math.cos(angle), y: Math.sin(angle), a: angle }
            });
        });
        tele = geneData.findIndex(v => v.arm === 'P');
        centro = { x: Math.cos(0), y: Math.sin(0) };
        telem = { x: Math.cos(scale(tele)), y: Math.sin(scale(tele)) };

        const l = geneData.length * 0.5;
        geneData.forEach((gene, i) => {
            const group = ChartFactory.createDataGroup(
                gene.gene, EntityTypeEnum.GENE, new THREE.Vector3(gene.sPos.x * l, gene.sPos.y * l, 0));
            group.userData.pos = gene.sPos;
            this.view.scene.add(group);
            this.meshes.push(group);
        });

        const colorScale = ChartFactory.getScaleColorOrdinal(Object.keys(DataService.biotypeCat));
        const shapeScale = ChartFactory.getScaleShapeOrdinal(Object.keys(DataService.biotypeCat));

        geneData.forEach((gene, i) => {
            const materialSprite = ChartFactory.getSpriteMaterial(shapeScale(type), colorScale(gene.type));
            const mesh: THREE.Sprite = new THREE.Sprite(materialSprite);
            mesh.position.set(gene.sPos.x * (l + 5), gene.sPos.y * (l + 5), 0);
            this.geneTypeSprites.push(mesh);
            this.view.scene.add(mesh);
        });
        this.view.camera.position.setZ(l * 6);
        ChartFactory.decorateDataGroups(this.meshes, this.decorators, this.renderer);
    }


    removeObjects(): void {
        this.view.scene.remove(...this.meshes);
        this.view.scene.remove(...this.geneTypeSprites);
        this.meshes.length = 0;
        this.geneTypeSprites.length = 0;
    }

    onMouseDown(e: ChartEvent): void { }
    onMouseUp(e: ChartEvent): void { }
    onMouseMove(e: ChartEvent): void { }
}
