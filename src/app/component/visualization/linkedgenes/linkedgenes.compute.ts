import { ComputeWorkerUtil } from './../../../service/compute.worker.util';
import { LinkedGeneConfigModel } from './linkedgenes.model';
import { Legend } from 'app/model/legend.model';
import { ColorEnum, DirtyEnum } from 'app/model/enum.model';
import * as util from 'app/service/compute.worker.util';
import { scaleLinear, scaleQuantize, scaleQuantile, scaleOrdinal, scaleThreshold } from 'd3-scale';
import { schemeRdBu, interpolateRdBu } from 'd3-scale-chromatic';
import * as _ from 'lodash';
import * as d3Interpolate from 'd3-interpolate';
import * as d3Scale from 'd3-scale';
import * as d3Color from 'd3-color';
import * as d3Array from 'd3-array';
import * as JStat from 'jstat';
import { DedicatedWorkerGlobalScope } from 'compute';

export const linkedGeneComputeFn = (config: LinkedGeneConfigModel): Promise<any> => {
    return new Promise((resolve, reject) => {
        const util: ComputeWorkerUtil = new ComputeWorkerUtil();
        util.getGeneLinkInfo().then(data => {
            const nodes1 = data[0].map(v => v.source);  // 8869
            const nodes2 = data[0].map(v => v.target);  // 8940
            const setU = new Set(nodes1.concat(nodes2));
            const genes = Array.from(setU);
            const geneMap = data[1].reduce((p, c) => { p[c.gene] = c; return p; }, {});
            const geneData = genes.map(g => geneMap[g.toString()]);
            resolve({
                nodes: genes,
                nodeData: geneData,
                edges: data[0]
            });

        });
    });
};


export const linkedgeneCompute = (config: LinkedGeneConfigModel, worker: DedicatedWorkerGlobalScope): void => {

    const bandColors = {
        'gneg': 0xeceff1,
        'gpos25': 0xcfd8dc,
        'gpos50': 0xb0bec5,
        'gpos75': 0xeceff1,
        'gpos100': 0x78909c,
        'acen': 0x039BE5,
        'gvar': 0x607d8b,
        'stalk': 0x546e7a
    };

    const ct = [
        { 'chr': '1', 'P': 0, 'C': 124300000, 'Q': 247249719 },
        { 'chr': '2', 'P': 0, 'C': 93300000, 'Q': 242951149 },
        { 'chr': '3', 'P': 0, 'C': 91700000, 'Q': 199501827 },
        { 'chr': '4', 'P': 0, 'C': 50700000, 'Q': 191273063 },
        { 'chr': '5', 'P': 0, 'C': 47700000, 'Q': 180857866 },
        { 'chr': '6', 'P': 0, 'C': 60500000, 'Q': 170899992 },
        { 'chr': '7', 'P': 0, 'C': 59100000, 'Q': 158821424 },
        { 'chr': '8', 'P': 0, 'C': 45200000, 'Q': 146274826 },
        { 'chr': '9', 'P': 0, 'C': 51800000, 'Q': 140273252 },
        { 'chr': '10', 'P': 0, 'C': 40300000, 'Q': 135374737 },
        { 'chr': '11', 'P': 0, 'C': 52900000, 'Q': 134452384 },
        { 'chr': '12', 'P': 0, 'C': 35400000, 'Q': 132349534 },
        { 'chr': '13', 'P': 0, 'C': 16000000, 'Q': 114142980 },
        { 'chr': '14', 'P': 0, 'C': 15600000, 'Q': 106368585 },
        { 'chr': '15', 'P': 0, 'C': 17000000, 'Q': 100338915 },
        { 'chr': '16', 'P': 0, 'C': 38200000, 'Q': 88827254 },
        { 'chr': '17', 'P': 0, 'C': 22200000, 'Q': 78774742 },
        { 'chr': '18', 'P': 0, 'C': 16100000, 'Q': 76117153 },
        { 'chr': '19', 'P': 0, 'C': 28500000, 'Q': 63811651 },
        { 'chr': '20', 'P': 0, 'C': 27100000, 'Q': 62435964 },
        { 'chr': '21', 'P': 0, 'C': 12300000, 'Q': 46944323 },
        { 'chr': '22', 'P': 0, 'C': 11800000, 'Q': 49691432 },
        { 'chr': 'X', 'P': 0, 'C': 59500000, 'Q': 154913754 },
        { 'chr': 'Y', 'P': 0, 'C': 11300000, 'Q': 57772954 }];

    // Gene Scale (Y)
    const scaleGene = scaleLinear();
    scaleGene.domain([0, 248956422]);
    scaleGene.range([0, 300]);

    // Chromosome Scale (X)
    const scaleChromosome = scaleLinear();
    scaleChromosome.domain([0, 24]);
    scaleChromosome.range([0, 300]);

    worker.util.processShapeColorSizeIntersect(config, worker);

    if (config.dirtyFlag & DirtyEnum.LAYOUT) {
        worker.util
            .getMatrix(config.markerFilter, config.sampleFilter, config.table.map, config.database, config.table.tbl, config.entity)
            .then(mtx => {
                worker.util.getGenomeInfo(mtx.markers).then(result => {

                    // const genes = _.groupBy(result[1].forEach( gene => {
                    //     gene.tss = scaleGene(gene.tss);
                    // }), 'chr');

                    const genes = _.groupBy(result[1].map(v => {
                        v.color = 0xFF0000;
                        v.tss = scaleGene(v.tss);
                        return v;
                    }), 'chr');

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

                    console.dir(genes);
                    console.dir(bands);
                    const d = {
                        legendItems: [],
                        genes: genes,
                        bands: bands,
                        chromo: ct.map(v => { v.C = scaleGene(v.C); v.Q = scaleGene(v.Q); return v; })
                    };
                    worker.postMessage({
                        config: config,
                        data: d
                    });
                    worker.postMessage('TERMINATE');
                });
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
