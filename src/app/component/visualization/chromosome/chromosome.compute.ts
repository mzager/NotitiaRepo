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


    worker.util.processShapeColorSizeIntersect(config, worker);

    if (config.dirtyFlag & DirtyEnum.LAYOUT) {

        worker.util.getChromosomeInfo(config.chromosome).then(result => {
            const genes = result.map( gene => gene.gene );
            config.markerFilter = genes;
            console.log('This is an odd place to updating the marker filter, this needs to be moved to the form');
            const geneCount = result.length;
            const geneSize = 1;
            const vizCircumference = (geneCount * geneSize);
            const vizRadius = vizCircumference / (Math.PI * 2);
            const vizSlice = 2 * Math.PI / vizCircumference;
            const processedGenes = result.map( (v, i) => {
                const angle = i * vizSlice;
                const r = Math.random() * 10;
                return Object.assign(v, {
                    sPos: { x: vizRadius * Math.cos(angle), y: vizRadius * Math.sin(angle) },
                    ePos: { x: (vizRadius + r) * Math.cos(angle), y: (vizRadius + r) * Math.sin(angle) }
                });
            });


            worker.util.getGeneLinkInfoByGenes( genes ).then( links => {
                const genemap = result.reduce( (p, c) => { p[c.gene] = c; return p; }, {});

                const processedLinks = links
                    .filter( v =>
                        ( genemap.hasOwnProperty(v.source) && genemap.hasOwnProperty(v.target) ) )
                    .map( v => {
                        return Object.assign(v, {sPos: genemap[v.source].sPos, tPos: genemap[v.target].sPos });
                    });

                worker.postMessage({
                    config: config,
                    data: {
                        genes: processedGenes,
                        links: processedLinks,
                        legendItems: [],
                        patientIds: [],
                        sampleIds: [],
                        markerIds: genes
                    }
                });

                worker.postMessage('TERMINATE');
            });
        });
    }
};
