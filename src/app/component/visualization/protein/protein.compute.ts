import { SpriteMaterialEnum } from './../../../model/enum.model';
import { ProteinConfigModel } from './protein.model';
import { Legend } from './../../../model/legend.model';
import { DedicatedWorkerGlobalScope } from 'app/service/dedicated-worker-global-scope';

export const ProteinCompute = (config: ProteinConfigModel, worker: DedicatedWorkerGlobalScope): void => {
  const headers = {
    // Accept: 'application/json',
    // 'Content-Type': 'application/json',
    // 'Accept-Encoding': 'gzip',
    // 'Access-Control-Allow-Origin': '*'
  };
  fetch('http://files.rcsb.org/view/2POR.pdb', { headers: headers, method: 'GET' })
    .then(result => result.text())
    .then(result => {
      const defineCell = (p: any) => {
        if (p.a === undefined) {
          return;
        }
        p.ax = p.a;
        p.ay = 0;
        p.az = 0;
        p.bx = p.b * Math.cos((Math.PI / 180.0) * p.gamma);
        p.by = p.b * Math.sin((Math.PI / 180.0) * p.gamma);
        p.bz = 0;
        p.cx = p.c * Math.cos((Math.PI / 180.0) * p.beta);
        p.cy =
          (p.c *
            (Math.cos((Math.PI / 180.0) * p.alpha) -
              Math.cos((Math.PI / 180.0) * p.gamma) * Math.cos((Math.PI / 180.0) * p.beta))) /
          Math.sin((Math.PI / 180.0) * p.gamma);
        p.cz = Math.sqrt(
          p.c * p.c * Math.sin((Math.PI / 180.0) * p.beta) * Math.sin((Math.PI / 180.0) * p.beta) - p.cy * p.cy
        );
      };
      const protein = {
        sheet: [],
        helix: [],
        biomtChains: '',
        biomtMatrices: [],
        symMat: [],
        pdbID: '',
        title: '',
        a: 0.0,
        b: 0.0,
        c: 0.0,
        alpha: 0.0,
        beta: 0.0,
        gamma: 0.0,
        spacegroup: '',
        smallMolecule: true
      };
      const atoms = [];

      // const molID;

      // let atoms_cnt = 0;
      let m = 0;
      let n = 0;
      const lines = result.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].replace(/^\s*/, ''); // remove indent
        const recordName = line.substr(0, 6);
        if (recordName === 'ATOM  ' || recordName === 'HETATM') {
          let atom, resn, chain, resi, x, y, z, hetflag, elem, serial, altLoc, b;
          altLoc = line.substr(16, 1);
          if (altLoc !== ' ' && altLoc !== 'A') {
            continue;
          } // FIXME: ad hoc
          serial = parseInt(line.substr(6, 5), 10);
          atom = line.substr(12, 4).replace(/ /g, '');
          resn = line.substr(17, 3);
          chain = line.substr(21, 1);
          resi = parseInt(line.substr(22, 5), 10);
          x = parseFloat(line.substr(30, 8));
          y = parseFloat(line.substr(38, 8));
          z = parseFloat(line.substr(46, 8));
          b = parseFloat(line.substr(60, 8));
          elem = line.substr(76, 2).replace(/ /g, '');
          if (elem === '') {
            // for some incorrect PDB files
            elem = line.substr(12, 4).replace(/ /g, '');
          }
          hetflag = line[0] === 'H';
          atoms[serial] = {
            resn: resn,
            x: x,
            y: y,
            z: z,
            elem: elem.toUpperCase(),
            hetflag: hetflag,
            chain: chain,
            resi: resi,
            serial: serial,
            atom: atom,
            bonds: [],
            ss: 'c',
            color: 0xffffff,
            bondOrder: [],
            b: b /*', altLoc': altLoc*/
          };
        } else if (recordName === 'SHEET ') {
          const startChain = line.substr(21, 1);
          const startResi = parseInt(line.substr(22, 4), 10);
          const endChain = line.substr(32, 1);
          const endResi = parseInt(line.substr(33, 4), 10);
          protein.sheet.push([startChain, startResi, endChain, endResi]);
        } else if (recordName === 'CONECT') {
          // MEMO: We don't have to parse SSBOND, LINK because both are also
          // described in CONECT. But what about 2JYT???
          const from = parseInt(line.substr(6, 5), 10);
          for (let j = 0; j < 4; j++) {
            const to = parseInt(line.substr([11, 16, 21, 26][j], 5), 10);
            if (isNaN(to)) {
              continue;
            }
            if (atoms[from] !== undefined) {
              atoms[from].bonds.push(to);
              atoms[from].bondOrder.push(1);
            }
          }
        } else if (recordName === 'HELIX ') {
          const startChain = line.substr(19, 1);
          const startResi = parseInt(line.substr(21, 4), 10);
          const endChain = line.substr(31, 1);
          const endResi = parseInt(line.substr(33, 4), 10);
          protein.helix.push([startChain, startResi, endChain, endResi]);
        } else if (recordName === 'CRYST1') {
          protein.a = parseFloat(line.substr(6, 9));
          protein.b = parseFloat(line.substr(15, 9));
          protein.c = parseFloat(line.substr(24, 9));
          protein.alpha = parseFloat(line.substr(33, 7));
          protein.beta = parseFloat(line.substr(40, 7));
          protein.gamma = parseFloat(line.substr(47, 7));
          protein.spacegroup = line.substr(55, 11);
          defineCell(protein);
        } else if (recordName === 'REMARK') {
          const type = parseInt(line.substr(7, 3), 10);
          if (type === 290 && line.substr(13, 5) === 'SMTRY') {
            n = parseInt(line[18], 10) - 1;
            m = parseInt(line.substr(21, 2), 10);
            if (protein.symMat[m] === undefined) {
              // protein.symMat[m] = new THREE.Matrix4().identity();
              protein.symMat[m] = { elements: [] };
            }
            protein.symMat[m].elements[n] = parseFloat(line.substr(24, 9));
            protein.symMat[m].elements[n + 4] = parseFloat(line.substr(34, 9));
            protein.symMat[m].elements[n + 8] = parseFloat(line.substr(44, 9));
            protein.symMat[m].elements[n + 12] = parseFloat(line.substr(54, 10));
          } else if (type === 350 && line.substr(13, 5) === 'BIOMT') {
            n = parseInt(line[18], 10) - 1;
            m = parseInt(line.substr(21, 2), 10);
            if (protein.biomtMatrices[m] === undefined) {
              // protein.biomtMatrices[m] = new THREE.Matrix4().identity();
              protein.biomtMatrices[m] = { elements: [] };
            }

            protein.biomtMatrices[m].elements[n] = parseFloat(line.substr(24, 9));
            protein.biomtMatrices[m].elements[n + 4] = parseFloat(line.substr(34, 9));
            protein.biomtMatrices[m].elements[n + 8] = parseFloat(line.substr(44, 9));
            protein.biomtMatrices[m].elements[n + 12] = parseFloat(line.substr(54, 10));
          } else if (type === 350 && line.substr(11, 11) === 'BIOMOLECULE') {
            protein.biomtMatrices = [];
            protein.biomtChains = '';
          } else if (type === 350 && line.substr(34, 6) === 'CHAINS') {
            protein.biomtChains += line.substr(41, 40);
          }
        } else if (recordName === 'HEADER') {
          protein.pdbID = line.substr(62, 4);
        } else if (recordName === 'TITLE ') {
          if (protein.title === undefined) {
            protein.title = '';
          }
          protein.title += line.substr(10, 70) + '\n'; // CHECK: why 60 is not enough???
        } else if (recordName === 'COMPND') {
          // TODO: Implement me!
        }
      }

      // Assign secondary structures
      for (let i = 0; i < atoms.length; i++) {
        const atom = atoms[i];
        if (atom === undefined) {
          continue;
        }

        // let found = false;
        // MEMO: Can start chain and end chain differ?
        for (let j = 0; j < protein.sheet.length; j++) {
          if (atom.chain !== protein.sheet[j][0]) {
            continue;
          }
          if (atom.resi < protein.sheet[j][1]) {
            continue;
          }
          if (atom.resi > protein.sheet[j][3]) {
            continue;
          }
          atom.ss = 's';
          if (atom.resi === protein.sheet[j][1]) {
            atom.ssbegin = true;
          }
          if (atom.resi === protein.sheet[j][3]) {
            atom.ssend = true;
          }
        }
        for (let j = 0; j < protein.helix.length; j++) {
          if (atom.chain !== protein.helix[j][0]) {
            continue;
          }
          if (atom.resi < protein.helix[j][1]) {
            continue;
          }
          if (atom.resi > protein.helix[j][3]) {
            continue;
          }
          atom.ss = 'h';
          if (atom.resi === protein.helix[j][1]) {
            atom.ssbegin = true;
          } else if (atom.resi === protein.helix[j][3]) {
            atom.ssend = true;
          }
        }
      }
      protein.smallMolecule = false;
      const legends = [Legend.create('Data Points', ['Samples'], [SpriteMaterialEnum.CIRCLE], 'SHAPE', 'DISCRETE')];
      worker.postMessage({ config: config, data: { legends: legends, result: protein } });
      worker.postMessage('TERMINATE');
    });
};
