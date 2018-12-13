import { DedicatedWorkerGlobalScope } from 'app/service/dedicated-worker-global-scope';
import { scaleLinear } from 'd3-scale';
import * as _ from 'lodash';
import { SpriteMaterialEnum, EntityTypeEnum } from './../../../model/enum.model';
import { Legend } from './../../../model/legend.model';
import { GenomeConfigModel } from './genome.model';

export const genomeCompute = (config: GenomeConfigModel, worker: DedicatedWorkerGlobalScope): void => {
  // Promise.all([
  //   worker.util.getMatrix(
  //     [],
  //     config.sampleFilter,
  //     config.table.map,
  //     config.database,
  //     config.table.tbl,
  //     EntityTypeEnum.GENE
  //   ),
  //   worker.util.fetchUri('https://oncoscape.v3.sttrcancer.org/data/genomes/grch37.json.gz')
  // ]).then(results => {
  //   const chromosomeNames = Object.keys(results[1].stats.chromosomes);
  //   const minMax = chromosomeNames.reduce(
  //     (p, c) => {
  //       p.min = Math.min(results[1].stats.chromosomes[c].min, p.min);
  //       p.max = Math.max(results[1].stats.chromosomes[c].max, p.max);
  //       return p;
  //     },
  //     { min: Infinity, max: -Infinity }
  //   );

  //   // Gene Scale (Y)
  //   const scaleGene = scaleLinear();
  //   scaleGene.domain([0, 248956422]);
  //   scaleGene.range([0, 2000]);

  //   // Chromosome Scale (X)
  //   const scaleChromosome = scaleLinear();
  //   scaleChromosome.domain([0, chromosomeNames.length]);
  //   scaleChromosome.range([0, 300]);

  //   // Gene Position Map
  //   const genePositionMap = results[1].data.reduce((p, c) => {
  //     p[c[1].toUpperCase()] = c;
  //     return p;
  //   }, {});
  //   const geneLookup = results[0].markers.map(v => genePositionMap[v]);
  //   const geneValues = geneLookup
  //     .map((gene, i) => {
  //       if (gene === undefined) {
  //         return null;
  //       }
  //       const sum = results[0].data.reduce((p, c) => {
  //         p += c[i];
  //         return p;
  //       }, 0);
  //       gene.push(sum);
  //       return gene;
  //     })
  //     .filter(v => v);
  //   const geneCount = geneValues.length;
  //   geneValues.forEach(v => {
  //     v[3] = scaleGene(v[3]);
  //     v[4] = scaleGene(v[4]);
  //     v[7] /= geneCount;
  //   });

  //   // const genePositionDict = results[1].data.reduce((p, c) => {
  //   //   p[c[1]] = c;
  //   //   return p;
  //   // }, {});

  //   debugger;

  const bandColors = {
    gneg: 0xec407a,
    gpos25: 0xab47bc,
    gpos50: 0x7e57c2,
    gpos75: 0x5c6bc0,
    gpos100: 0x42a5f5,
    acen: 0x29b6f6,
    gvar: 0x26c6da,
    stalk: 0x26a69a
  };

  const ct38 = [
    { chr: '1', P: 0, C: 123400000, Q: 248956422 },
    { chr: '2', P: 0, C: 93900000, Q: 242193529 },
    { chr: '3', P: 0, C: 90900000, Q: 198295559 },
    { chr: '4', P: 0, C: 50000000, Q: 190214555 },
    { chr: '5', P: 0, C: 48800000, Q: 181538259 },
    { chr: '6', P: 0, C: 59800000, Q: 170805979 },
    { chr: '7', P: 0, C: 60100000, Q: 159345973 },
    { chr: '8', P: 0, C: 45200000, Q: 145138636 },
    { chr: '9', P: 0, C: 43000000, Q: 138394717 },
    { chr: '10', P: 0, C: 39800000, Q: 133797422 },
    { chr: '11', P: 0, C: 53400000, Q: 135086622 },
    { chr: '12', P: 0, C: 35500000, Q: 133275309 },
    { chr: '13', P: 0, C: 17700000, Q: 114364328 },
    { chr: '14', P: 0, C: 17200000, Q: 107043718 },
    { chr: '15', P: 0, C: 19000000, Q: 101991189 },
    { chr: '16', P: 0, C: 36800000, Q: 90338345 },
    { chr: '17', P: 0, C: 25100000, Q: 83257441 },
    { chr: '18', P: 0, C: 18500000, Q: 80373285 },
    { chr: '19', P: 0, C: 26200000, Q: 58617616 },
    { chr: '20', P: 0, C: 28100000, Q: 64444167 },
    { chr: '21', P: 0, C: 12000000, Q: 46709983 },
    { chr: '22', P: 0, C: 15000000, Q: 50818468 },
    { chr: 'X', P: 0, C: 61000000, Q: 156040895 },
    { chr: 'Y', P: 0, C: 10400000, Q: 57227415 }
  ];

  const ct19 = [
    { chr: '1', P: 0, C: 125000000, Q: 249250621 },
    { chr: '2', P: 0, C: 93300000, Q: 243199373 },
    { chr: '3', P: 0, C: 91000000, Q: 198022430 },
    { chr: '4', P: 0, C: 50400000, Q: 191154276 },
    { chr: '5', P: 0, C: 48400000, Q: 180915260 },
    { chr: '6', P: 0, C: 61000000, Q: 171115067 },
    { chr: '7', P: 0, C: 59900000, Q: 159138663 },
    { chr: '8', P: 0, C: 45600000, Q: 146364022 },
    { chr: '9', P: 0, C: 49000000, Q: 141213431 },
    { chr: '10', P: 0, C: 40200000, Q: 135534747 },
    { chr: '11', P: 0, C: 53700000, Q: 135006516 },
    { chr: '12', P: 0, C: 35800000, Q: 133851895 },
    { chr: '13', P: 0, C: 17900000, Q: 115169878 },
    { chr: '14', P: 0, C: 17600000, Q: 107349540 },
    { chr: '15', P: 0, C: 19000000, Q: 102531392 },
    { chr: '16', P: 0, C: 36600000, Q: 90354753 },
    { chr: '17', P: 0, C: 24000000, Q: 81195210 },
    { chr: '18', P: 0, C: 17200000, Q: 78077248 },
    { chr: '19', P: 0, C: 26500000, Q: 59128983 },
    { chr: '20', P: 0, C: 27500000, Q: 63025520 },
    { chr: '21', P: 0, C: 13200000, Q: 48129895 },
    { chr: '22', P: 0, C: 14700000, Q: 51304566 },
    { chr: 'X', P: 0, C: 60600000, Q: 155270560 },
    { chr: 'Y', P: 0, C: 12500000, Q: 59373566 }
  ];

  // Gene Scale (Y)
  const scaleGene = scaleLinear();
  scaleGene.domain([0, 248956422]);
  scaleGene.range([0, 300]);

  // Chromosome Scale (X)
  const scaleChromosome = scaleLinear();
  scaleChromosome.domain([0, 24]);
  scaleChromosome.range([0, 300]);

  worker.util.getGenomePositions(config.alignment).then(result => {
    result[0] = result[0]
      .filter(v => v[0] !== '')
      .map(v => {
        return {
          arm: v[3].substr(0, 1).toUpperCase(),
          chr: v[0],
          s: v[1],
          e: v[2],
          tag: v[4],
          subband: v[3].substring(1)
        };
      });

    const genes = _.groupBy(
      result[1]
        .filter(v => config.markerFilter.indexOf(v[0]) !== -1)
        .map(v => ({
          gene: v[0],
          chr: v[1],
          tss: scaleGene(v[3]),
          s: scaleGene(v[4]),
          e: scaleGene(v[5]),
          strand: v[6],
          type: v[7],
          color: 0x039be5,
          arm: v[2].substr(0, 1).toUpperCase(),
          band: v[2].substring(1)
        })),
      'chr'
    );

    const chromoObj = _.groupBy(result[0], 'chr');
    const bands = Object.keys(chromoObj)
      .map(v => chromoObj[v])
      .map(v => v.sort((a, b) => a.s - b.s))
      .map(v =>
        v.map((w, i) => {
          w.z = w.e;
          w.c = bandColors[w.tag];
          w.s = scaleGene(w.s);
          w.e = scaleGene(w.e);
          w.l = w.e - w.s;
          return w;
        })
      );
    const ct = ct19;

    const d = {
      legends: [Legend.create('Data Points', ['Genes'], [SpriteMaterialEnum.CIRCLE], 'SHAPE', 'DISCRETE')],
      genes: genes,
      bands: bands,
      tads: [],
      chromo: ct.map(v => {
        v.C = scaleGene(v.C);
        v.Q = scaleGene(v.Q);
        return v;
      })
    };
    if (config.showTads) {
      worker.util.getTads().then(tads => {
        tads.forEach(tad => {
          tad.s = scaleGene(tad.s);
          tad.e = scaleGene(tad.e);
        });
        d.tads = tads;
        worker.postMessage({
          config: config,
          data: d
        });
        worker.postMessage('TERMINATE');
      });
    } else {
      worker.postMessage({
        config: config,
        data: d
      });
      worker.postMessage('TERMINATE');
    }
  });
};
