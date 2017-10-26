import { Legend } from 'app/model/legend.model';
import { ColorEnum, DirtyEnum } from 'app/model/enum.model';
import { ChromosomeConfigModel } from './chromosome.model';
import * as util from 'app/service/compute.worker.util';
import { scaleLinear, scaleQuantize, scaleQuantile, scaleOrdinal, scaleThreshold } from 'd3-scale';
import { scaleSequential, schemeRdBu, interpolateRdBu } from 'd3-scale-chromatic';
import * as _ from 'lodash';
import * as d3Interpolate from 'd3-interpolate';
import * as d3Scale from 'd3-scale';
import * as d3Color from 'd3-color';
import * as d3Array from 'd3-array';
import * as JStat from 'jstat';
import { DedicatedWorkerGlobalScope } from 'compute';

export const chromosomeCompute = (config: ChromosomeConfigModel, worker: DedicatedWorkerGlobalScope): void => {


    //    worker.util.processShapeColorSizeIntersect(config, worker);

    if (config.dirtyFlag & DirtyEnum.LAYOUT) {

        worker.util.getChromosomeInfo(config.chromosome).then(result => {
            const genes = result.map( gene => gene.gene );
            const geneCount = result.length;
            const geneSize = 3;
            const vizCircumference = (geneCount * geneSize) + 20;   // 20 is 5 * 4 = (telomere, centromere);
            const vizRadius = vizCircumference / (Math.PI * 2);
            const vizSlice = 2 * Math.PI / vizCircumference;
            result.forEach( (v, i) => {
                const angle = i * vizSlice;
                v.x = vizRadius * Math.cos(angle);
                v.y = vizRadius * Math.sin(angle);
            });


            worker.util.getGeneLinkInfoByGenes( genes ).then( links => {
                debugger;

                worker.postMessage('TERMINATE');
            });


            // // const genes = _.groupBy(result[1].forEach( gene => {
            // //     gene.tss = scaleGene(gene.tss);
            // // }), 'chr');

            // const genes = _.groupBy(result[1].map(v => {
            //     v.color = 0xFF0000;
            //     v.tss = scaleGene(v.tss);
            //     return v;
            // }), 'chr');

            // const chromoObj = _.groupBy(result[0], 'chr');
            // const bands = Object.keys(chromoObj)
            //     .map(v => chromoObj[v])
            //     .map(v => v.sort((a, b) => a.s - b.s))
            //     .map(v =>
            //         v.map((w, i) => {
            //             w.z = w.e;
            //             w.c = bandColors[w.tag];
            //             w.s = scaleGene(w.s);
            //             w.e = scaleGene(w.e);
            //             w.l = w.e - w.s;
            //             return w;
            //         })
            //     );

            // const d = {
            //     legendItems: [],
            //     genes: genes,
            //     bands: bands,
            //     chromo: ct.map(v => { v.C = scaleGene(v.C); v.Q = scaleGene(v.Q); return v; })
            // };
            // worker.postMessage({
            //     config: config,
            //     data: d
            // });
            
        });
    }



    // const colorMean = (genes: Array<any>, data, matrix): Legend => {
    //     genes = genes.map(v => {
    //         const i = data.markers.indexOf(v.tag);
    //         v.mean = JStat.jStat.mean(matrix[i]);
    //         v.meandev = JStat.jStat.meandev(matrix[i]);
    //         return v;
    //     });

    //     const min = _.minBy(genes, v => v.mean).mean;
    //     const max = _.maxBy(genes, v => v.mean).mean;
    //     const tbl = config.molecularTable.toLowerCase();
    //     // const ird = (tbl === 'left-large' || tbl === 'right-large' || tbl === 'right' || tbl === 'alltumors');
    //     // if (!ird) {
    //     //     const colorScale = scaleLinear().domain([-1, 0, 1]);
    //     //     colorScale.range([0xB21212, 0xFFFFFF, 0x0971B2]);
    //     //     genes.map(v => { v.color = colorScale(v.mean); return v; });
    //     //     return {
    //     //         name: 'Molecular', type: 'COLOR', legendItems: [
    //     //             { name: min, value: 0xB21212, type: 'COLOR' },
    //     //             { name: max, value: 0x0971B2, type: 'COLOR' }
    //     //         ]
    //     //     } as Legend;
    //     // } else {
    //         const s = d3Scale.scaleSequential(interpolateRdBu).domain([max, min]);
    //         // const colorScale = scaleLinear().domain([-1, 1]);
    //         // colorScale.range([0, 1]);

    //         genes.map(v => {
    //             v.color = s(v.mean); return v;
    //         });
    //         return {
    //             name: 'Molecular', type: 'COLOR', legendItems: [
    //                 { name: min, value: 0xFF0000, type: 'COLOR' },
    //                 { name: max, value: 0x1485CC, type: 'COLOR' }
    //             ]
    //         } as Legend;
    // };

    // worker.util.loadData(config.dataKey).then((data) => {

    //     const legendItems: Array<Legend> = [];
    //     let molecularData = data.molecularData.filter(v => v.name === config.molecularTable)[0];
    //     if (molecularData == null) {
    //         config.molecularTable = data.molecularData[0].name;
    //         molecularData = data.molecularData[0];
    //     }
    //     Promise.all([
    //         worker.util.loadData('chr-gene'),
    //         worker.util.loadData('chr-band')
    //     ]).then(result => {
    //         const chrGene = result[0];
    //         const geneData = molecularData.markers
    //             .filter(gene => (gene !== undefined))
    //             .map(gene => gene.replace(/[^A-Z0-9]/g))
    //             .map(gene => (chrGene.hasOwnProperty(gene)) ? chrGene[gene] : null)
    //             .filter(gene => gene !== null)
    // .map(gene => {
    //     gene.side = 0;
    //     gene.tss = scaleGene(gene.tss);
    //     gene.color = 0xFF0000;
    //     gene.size = 1;
    //     return gene;
    // });

    //         let matrix = molecularData.data;
    //         if (config.sampleFilter.length > 0) {
    //             const samplesOfInterest = molecularData.samples
    //                 .map((v, i) => (config.sampleFilter.indexOf(v) >= 0) ? { sample: v, i: i } : -1)
    //                 .filter(v => v !== -1);

    //             matrix = molecularData.data.map(v =>
    //                 samplesOfInterest
    //                     .map(soi => soi.i)
    //                     .map(si => v[si])
    //             );
    //         }

    //         const legendColor = colorMean(geneData, molecularData, matrix);

    //         const genes = _.groupBy(geneData, 'chr');

    //         // Bands
    //         const chrBand = Object.keys(result[1]).map(v => result[1][v]).filter(v => v.e !== undefined);
    //         const bandColors = {
    //             'gneg': 0xeceff1,
    //             'gpos25': 0xcfd8dc,
    //             'gpos50': 0xb0bec5,
    //             'gpos75': 0xeceff1,
    //             'gpos100': 0x78909c,
    //             'acen': 0x039BE5,
    //             'gvar': 0x607d8b,
    //             'stalk': 0x546e7a
    //         };
    // const chromoObj = _.groupBy(result[0], 'chr');
    // //         const chromoObj = _.groupBy(chrBand, 'chr');
    //         const bands = Object.keys(chromoObj)
    //             .map(v => chromoObj[v])
    //             .map(v => v.sort((a, b) => a.s - b.s))
    //             .map(v =>
    //                 v.map((w, i) => {
    //                     w.z = w.e;
    //                     w.c = bandColors[w.tag];
    //                     w.s = scaleGene(w.s);
    //                     w.e = scaleGene(w.e);
    //                     w.l = w.e - w.s;
    //                     return w;
    //                 })
    //             );

    //         legendItems.push(legendColor);
    //         worker.postMessage({
    //             config: config,
    //             data: {
    //                 legendItems: legendItems,
    //                 genes: genes,
    //                 bands: bands,
    //                 chromo: ct.map(v => { v.C = scaleGene(v.C); v.Q = scaleGene(v.Q); return v; })
    //             }
    //         });
    //         worker.postMessage('TERMINATE');

    //     });
    // });
};
