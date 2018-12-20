import { MeshLine, MeshLineMaterial } from 'three.meshline';
import { ProteinResidue, ProteinStructure, ProteinAtom } from './protein.graph';
import { Subscription } from 'rxjs';
import { ProteinDataModel } from 'app/component/visualization/protein/protein.model';
import { Legend } from './../../../model/legend.model';
import { LegendPanelComponent } from './../../workspace/legend-panel/legend-panel.component';
import { EventEmitter } from '@angular/core';
import * as TWEEN from '@tweenjs/tween.js';
import { ChartScene } from 'app/component/workspace/chart/chart.scene';
import { ChartEvents, ChartEvent } from 'app/component/workspace/chart/chart.events';
import { AbstractVisualization } from './../visualization.abstract.component';
import { ChartFactory } from 'app/component/workspace/chart/chart.factory';
import { GraphData } from 'app/model/graph-data.model';
import * as THREE from 'three';
import { Vector3, Raycaster, Object3D, TrianglesDrawModes, Geometry, TriangleStripDrawMode, Line } from 'three';
import { LabelController, LabelOptions } from 'app/controller/label/label.controller';
import { ChartObjectInterface } from 'app/model/chart.object.interface';
import { DataDecorator } from 'app/model/data-map.model';
import { EntityTypeEnum, GraphEnum } from 'app/model/enum.model';

import { SelectionController } from 'app/controller/selection/selection.controller';
import { VisualizationView } from 'app/model/chart-view.model';
import { GraphConfig } from 'app/model/graph-config.model';
import kmeans from 'ml-kmeans';
import { DataService } from 'app/service/data.service';
import { ProteinConfigModel } from './protein.model';
import { connect } from 'net';
import * as chroma from 'chroma-js';
import * as binarysearch from 'binarysearch';

export interface ProteinData {
  atoms: Array<ProteinAtom>;
  seqRes: Array<ProteinSequence>;
  residues: Array<ProteinResidue>;
  chains: any;
}
export interface ProteinChain {
  id: number;
  chainID: string;
  residues: Array<ProteinResidue>;
}
export interface ProteinAtom {
  serial: number;
  name: string;
  altLoc: string;
  resName: string;
  chainID: string;
  resSeq: number;
  iCode: string;
  x: number;
  y: number;
  z: number;
  occupancy: number;
  tempFactor: number;
  element: string;
  charge: string;
  color: number;
  hetflag: boolean;
  bonds: Array<any>;
  bondOrder: Array<number>;
  structure: ProteinStructure;
}
export interface ProteinStructure {
  type: string;
  startChain: string;
  startResi: number;
  endChain: string;
  endResi: number;
}
export interface ProteinConect {
  from: number;
  to: Array<number>;
}
export interface ProteinResidue {
  atoms: Array<ProteinAtom>;
  chainID: string;
  id: number;
  resName: string;
  serNum: number;
}
export interface ProteinSequence {
  chainID: string;
  numRes: number;
  resNames: Array<string>;
  serNum: number;
}

export class ProteinGraph extends AbstractVisualization {
  // Reference: A. Bondi, J. Phys. Chem., 1964, 68, 441.
  public static vdwRadii = {
    H: 1.2,
    LI: 1.82,
    NA: 2.27,
    K: 2.75,
    C: 1.7,
    N: 1.55,
    O: 1.52,
    F: 1.47,
    P: 1.8,
    S: 1.8,
    CL: 1.75,
    BR: 1.85,
    SE: 1.9,
    ZN: 1.39,
    CU: 1.4,
    NI: 1.63
  };
  public static elementColors = {
    H: 0xcccccc,
    C: 0xfce4ec,
    O: 0xe91e63,
    N: 0x0000cc,
    S: 0xcccc00,
    P: 0x6622cc,
    F: 0x00cc00,
    CL: 0x00cc00,
    BR: 0x882200,
    I: 0x6600aa,
    FE: 0xcc6600,
    CA: 0x8888aa
  };

  container = new THREE.Group();
  chains: Array<THREE.Group> = [];
  model: ProteinData;

  parsePdb(pdb): ProteinData {
    const ATOM_NAME = 'ATOM  ';
    const HETATM_NAME = 'HETATM';
    const RESIDUE_NAME = 'SEQRES';
    const HELIX = 'HELIX ';
    const SHEET = 'SHEET ';
    const CONECT = 'CONECT';
    const CRYST1 = 'CRYST1';
    const REMARK = 'REMARK';
    const HEADER = 'HEADER';
    const TITLE = 'TITLE';
    const pdbLines = pdb.split('\n');
    const atoms: Array<ProteinAtom> = [];
    const structures: Array<ProteinStructure> = [];
    const conect: Array<ProteinConect> = [];
    const seqRes: Array<ProteinSequence> = []; // raw SEQRES entry data
    let residues: Array<ProteinResidue> = []; // individual residue data parsed from SEQRES

    const chains = new Map(); // individual rchaindata parsed from SEQRES

    // Iterate each line looking for atoms
    pdbLines.forEach(pdbLine => {
      const el = pdbLine.substr(0, 6);
      if (el === ATOM_NAME || el === HETATM_NAME) {
        // http://www.wwpdb.org/documentation/file-format-content/format33/sect9.html#ATOM
        const item = {
          serial: parseInt(pdbLine.substring(6, 11), 10),
          name: pdbLine
            .substring(12, 16)
            .trim()
            .toUpperCase(),
          altLoc: pdbLine
            .substring(16, 17)
            .trim()
            .toUpperCase(),
          resName: pdbLine
            .substring(17, 20)
            .trim()
            .toUpperCase(),
          chainID: pdbLine
            .substring(21, 22)
            .trim()
            .toUpperCase(),
          resSeq: parseInt(pdbLine.substring(22, 26), 10),
          iCode: pdbLine
            .substring(26, 27)
            .trim()
            .toUpperCase(),
          color: 0xff0000,
          x: parseFloat(pdbLine.substring(30, 38)),
          y: parseFloat(pdbLine.substring(38, 46)),
          z: parseFloat(pdbLine.substring(46, 54)),
          occupancy: parseFloat(pdbLine.substring(54, 60)),
          tempFactor: parseFloat(pdbLine.substring(60, 68)),
          hetflag: false,
          bonds: [],
          bondOrder: [],
          element: pdbLine
            .substring(76, 78)
            .trim()
            .toUpperCase(),
          charge: pdbLine
            .substring(78, 80)
            .trim()
            .toUpperCase(),
          structure: null
        };
        item.color = ProteinGraph.elementColors[item.element];
        item.hetflag = el === HETATM_NAME;
        atoms.push(item);
      } else if (el === RESIDUE_NAME) {
        // http://www.wwpdb.org/documentation/file-format-content/format33/sect3.html#SEQRES
        const seqResEntry = {
          serNum: parseInt(pdbLine.substring(7, 10), 10),
          chainID: pdbLine
            .substring(11, 12)
            .trim()
            .toUpperCase(),
          numRes: parseInt(pdbLine.substring(13, 17), 10),
          resNames: pdbLine
            .substring(19, 70)
            .trim()
            .split(' ')
        };
        seqRes.push(seqResEntry);

        residues = residues.concat(
          seqResEntry.resNames.map(resName => ({
            id: residues.length,
            serNum: seqResEntry.serNum,
            chainID: seqResEntry.chainID,
            resName
          }))
        );

        if (!chains.get(seqResEntry.chainID)) {
          chains.set(seqResEntry.chainID, { id: chains.size, chainID: seqResEntry.chainID });
          // No need to save numRes, can just do chain.residues.length
        }
      } else if (el === SHEET || el === HELIX) {
        const item = {
          type: el,
          startChain: pdbLine
            .substr(21, 1)
            .trim()
            .toUpperCase(),
          startResi: parseInt(pdbLine.substr(22, 4), 10),
          endChain: pdbLine
            .substr(32, 1)
            .trim()
            .toUpperCase(),
          endResi: parseInt(pdbLine.substr(33, 4), 10)
        };
        structures.push(item);
      } else if (el === CONECT) {
        const from = parseInt(pdbLine.substr(6, 5), 10);
        const to = [11, 16, 21, 26, 31, 36, 41].map(v => parseInt(pdbLine.substr(v, 5), 10)).filter(v => !isNaN(v));
        const fromIndex = binarysearch.first(atoms, from, (atom, index) => {
          return atom.serial > index ? 1 : atom.serial < index ? -1 : 0;
        });
        atoms[fromIndex].bonds.push(
          ...to.map(v => {
            return atoms[
              binarysearch.first(atoms, v, (atom, index) => {
                return atom.serial > index ? 1 : atom.serial < index ? -1 : 0;
              })
            ];
          }, this)
        );
        conect.push({ from: from, to: to });
      } else {
        console.log(el);
      }
    });

    atoms.forEach(atom => {
      structures.forEach(structure => {
        if (
          atom.chainID === structure.startChain &&
          atom.resSeq > structure.startResi &&
          atom.resSeq < structure.endResi
        ) {
          atom.structure = structure;
        }
      }, this);
    }, this);

    // Add residues to chains
    chains.forEach(chain => {
      chain.residues = residues.filter(residue => residue.chainID === chain.chainID);
    });

    // Add atoms to residues
    residues.forEach(residue => {
      residue.atoms = atoms.filter(atom => atom.chainID === residue.chainID && atom.resSeq === residue.serNum);
    });

    // conect.forEach(con => {
    //   debugger;
    //   atoms[con.from - 1].bonds.push(...con.to.map(v => atoms[v - 1], this));
    // }, this);

    return {
      atoms: atoms,
      seqRes: seqRes,
      residues: residues,
      chains: chains
    };
  }

  private addAtom(atom: ProteinAtom): void {
    const sphereGeometry = new THREE.SphereGeometry(0.5);
    const sphereMaterial = new THREE.MeshPhongMaterial({
      color: ProteinGraph.elementColors[atom.element],
      shininess: 100
    });
    const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphereMesh.position.set(atom.x, atom.y, atom.z);
    this.container.add(sphereMesh);
  }

  private addResidue(residual: ProteinResidue): void {
    residual.atoms.forEach(this.addAtom.bind(this));
  }

  private addChain(chain: ProteinChain): void {
    chain.residues.forEach(this.addResidue.bind(this));
  }

  private drawSideChains(chain: THREE.Group, atoms: Array<ProteinAtom>): void {
    // const atomsWithBonds = atoms.filter(atom => atom.bonds.length);
    // const numBonds = atomsWithBonds.reduce((p, c) => (p += c.bonds.length), 0);
    // const numIndicies = numBonds * 2 - 1;
    // const bondArr = new Float32Array(numBonds * 6);
    // const indexArr = new Uint16Array(numIndicies);
    // let z = 0;
    // const _mat = new THREE.LineBasicMaterial({
    //   color: 0x000000
    // });
    // for (let i = 0, iLen = atomsWithBonds.length; i < iLen; i++) {
    //   const atom = atomsWithBonds[i];
    //   for (let j = 0, jLen = atom.bonds.length; j < jLen; j++) {
    //     indexArr[z * 2] = z;
    //     if (z * 2 + 1 < numIndicies) {
    //       indexArr[z * 2 + 1] = z + 1;
    //     }
    //     const bond = atom.bonds[j];
    //     bondArr[z + 0] = atom.x;
    //     bondArr[z + 1] = atom.y;
    //     bondArr[z + 2] = atom.z;
    //     bondArr[z + 3] = bond.x;
    //     bondArr[z + 4] = bond.y;
    //     bondArr[z + 5] = bond.z;
    //     z += 1;
    //     const direction = new THREE.Vector3().subVectors(
    //       new Vector3(atom.x, atom.y, atom.z),
    //       new Vector3(bond.x, bond.y, bond.z)
    //     );
    //     const edgeGeometry = new THREE.CylinderGeometry(2, 2, direction.length(), 6, 4);
    //     const mesh = new THREE.Mesh(edgeGeometry, new THREE.MeshBasicMaterial({ color: 0x0000ff }));
    //     const arrow = new THREE.ArrowHelper(direction, new Vector3(atom.x, atom.y, atom.z));
    //     mesh.rotation.set(arrow.rotation.x, arrow.rotation.y, arrow.rotation.z);
    //     const v = new THREE.Vector3().addVectors(new Vector3(atom.x, atom.y, atom.z), direction.multiplyScalar(0.5));
    //     mesh.position.set(v.x, v.y, v.z);
    //     this.view.scene.add(mesh);
    // const cyl = new THREE.CylinderGeometry(3, 3, )
    // }
  }

  // const geometry = new THREE.BufferGeometry();
  // geometry.addAttribute('position', new THREE.BufferAttribute(bondArr, 3));
  // // geometry.setIndex(new THREE.BufferAttribute(indexArr, 1));

  // const line = new THREE.LineSegments(
  //   geometry,
  //   new THREE.LineBasicMaterial({
  //     color: 0x000000
  //   })
  // );f
  // this.view.scene.add(line);
  // }

  private drawSmallMolicules(chain: THREE.Group, atoms: Array<ProteinAtom>, size: number): void {
    atoms.forEach(v => {
      const sphereGeometry = new THREE.SphereGeometry(size, 10, 10);
      const sphereMaterial = new THREE.MeshPhongMaterial({
        color: ProteinGraph.elementColors[v.element]
      });
      const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphereMesh.position.set(v.x, v.y, v.z);
      chain.add(sphereMesh);
    });
  }

  private drawSmoothCurve(chain: THREE.Group, atoms: Array<ProteinAtom>, width: 5): void {
    const a = atoms.filter(v => v.name === 'A' || v.name === 'O');
    const geoBuf = new THREE.BufferGeometry();
    const ptsVec = a.map(atom => {
      if (atom.structure !== null) {
        return new Vector3(atom.x, atom.y, atom.z);
      }
      return new Vector3(atom.x, atom.y, atom.z);
    });
    const ptsArr = new Float32Array(ptsVec.length * 3);
    ptsVec.forEach((v, i) => {
      ptsArr[i * 3 + 0] = v.x;
      ptsArr[i * 3 + 1] = v.y;
      ptsArr[i * 3 + 2] = v.z;
    }, this);
    const ptsBuf = new THREE.BufferAttribute(ptsArr, 3);
    geoBuf.addAttribute('position', ptsBuf);
    const colVec = chroma
      .scale(['#03a9f4', '#9c27b0'])
      .mode('lch')
      .colors(a.length)
      .map(
        v =>
          new THREE.Vector3(
            ...chroma(v)
              .rgb()
              .map(w => w / 255)
          )
      );

    const colArr = new Float32Array(ptsVec.length * 3);
    colVec.forEach((v, i) => {
      colArr[i * 3 + 0] = v.x;
      colArr[i * 3 + 1] = v.y;
      colArr[i * 3 + 2] = v.z;
    }, this);
    const colBuf = new THREE.BufferAttribute(colArr, 3);
    geoBuf.addAttribute('color', colBuf);

    const mesh = new THREE.Mesh(
      geoBuf,
      new THREE.MeshLambertMaterial({
        side: THREE.DoubleSide,
        vertexColors: THREE.VertexColors
      })
    );

    mesh.setDrawMode(THREE.TriangleStripDrawMode);

    chain.add(mesh);
  }

  private drawCartoon(chain: THREE.Group, atoms: Array<ProteinAtom>): void {
    this.drawSmoothCurve(chain, atoms, 5);
  }

  private addObjects(config: ProteinConfigModel, data: ProteinDataModel) {
    this.model = this.parsePdb(data.result.raw);

    this.chains.push(new THREE.Group());
    const chain = this.chains[this.chains.length - 1];

    //  Bonded
    this.drawSmallMolicules(chain, this.model.atoms.filter(v => v.hetflag).filter(v => v.resName !== 'HOH'), 1.4);

    // // Non Bonded
    this.drawSmallMolicules(chain, this.model.atoms.filter(v => v.hetflag).filter(v => v.resName === 'HOH'), 0.2);

    // Ribbon
    this.drawCartoon(chain, this.model.atoms.filter(v => !v.hetflag));

    // // Side Chains
    // this.drawSideChains(
    //   chain,
    //   this.model.atoms
    //     .filter(atom => atom.hetflag)
    //     .filter(atom => atom.name === 'C' || atom.name === 'O' || (atom.name === 'N' && atom.resName !== 'PRO'))
    // );

    // Center
    new THREE.Box3()
      .setFromObject(chain)
      .getCenter(chain.position)
      .multiplyScalar(-1);
    this.view.scene.add(chain);
    this.view.scene.add(this.container);
  }

  private getColoredBufferLine(steps: number, phase: number, geo: THREE.Geometry): THREE.Mesh {
    const mesh = new THREE.Mesh();
    const vertices = geo.vertices;
    const segments = geo.vertices.length;
    const geometry = new THREE.Geometry();
    return mesh;
  }

  updateData(config: GraphConfig, data: any): void {
    super.updateData(config, data);
    this.addObjects(config, data);
  }

  // Private Subscriptions
  create(labels: HTMLElement, events: ChartEvents, view: VisualizationView): ChartObjectInterface {
    super.create(labels, events, view);
    // const dLight = new THREE.DirectionalLight(0xffffff);
    // dLight.position.set(0, 0, 1);
    // dLight.shadow.camera.near = 1;
    // dLight.shadow.camera.far = 160;
    // dLight.shadow.camera.castShadow = true;
    // this.view.scene.parent.add(dLight);
    // const directionalLight = new THREE.DirectionalLight(0xffff00);
    // const dlp = new THREE.Vector3(0.2, 0.2, -1).normalize();
    // const dlp = new THREE.Vector3(0.2, 0.2, -1).normalize();
    // directionalLight.position.set(dlp.x, dlp.y, dlp.z);
    // directionalLight.intensity = 1.2;
    // this.view.scene.add(directionalLight);
    // const ambientLight = new THREE.AmbientLight(0x202020);
    // this.view.scene.add(ambientLight);
    return this;
  }

  destroy() {
    super.destroy();
    this.chains.map(v => this.view.scene.remove);
    this.view.scene.remove(this.container);
  }

  enable(truthy: boolean) {
    super.enable(truthy);
    this.view.renderer.domElement.style.setProperty('cursor', 'default');
    this.view.controls.enableRotate = true;
  }

  constructor() {
    super();
  }
}
