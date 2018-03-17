import { DataField } from './../../../model/data-field.model';
import { Legend } from 'app/model/legend.model';
import { ColorEnum, DirtyEnum } from 'app/model/enum.model';
import { ChromosomeConfigModel } from './chromosome.model';
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

export const chromosomeCompute = (config: ChromosomeConfigModel, worker: DedicatedWorkerGlobalScope): void => {

    const sendResult = (result, chromo, chords) => {
        worker.postMessage({
            config: config,
            data: {
                result: {
                    genes: result,
                    chromosome: chromo,
                    chords: chords
                },
                genes: [],
                links: [],
                legendItems: [],
                patientIds: [],
                sampleIds: [],
                markerIds: []
            }
        });
        worker.postMessage('TERMINATE');
    };

    worker.util.processShapeColorSizeIntersect(config, worker);

    if (config.dirtyFlag & DirtyEnum.LAYOUT) {

        worker.util.getChromosomeInfo(config.chromosome, []).then(result => {

            // const mf = new Set(config.markerFilter);
            const chromo = ct.find(v => v.chr === config.chromosome);
            if (config.geneOption.key !== 'all') {
                const gType = config.geneOption.key;
                result = result.filter(v => v.type === gType);
            }

            const genes = result.map(v => v.gene);

            if (config.chordOption.key === 'none') {
                sendResult(result, chromo, null);
            } else {
                worker.util.getGeneLinkInfoByGenes(config.markerFilter).then(chords => {
                    chords.map(chord => ({ source: chord.source, target: chord.target, tension: chord.tension }));
                    sendResult(result, chromo, chords);
                });
            }
            // Promise.all([
            //     // worker.util.getMolecularGeneValues(genes, {tbl: 'gistic'}),
            //     // worker.util.getMolecularGeneValues(genes, {tbl: 'mut'}),
            //     worker.util.getMolecularGeneValues(genes, {tbl: 'rna'})

            // ]).then(v => {
        });
    }
};
