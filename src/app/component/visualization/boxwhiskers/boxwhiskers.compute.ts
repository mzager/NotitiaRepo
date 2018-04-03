import { BoxWhiskersConfigModel } from './boxwhiskers.model';
import { Legend } from 'app/model/legend.model';
import { ColorEnum, DirtyEnum, CollectionTypeEnum } from 'app/model/enum.model';
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

export const boxwhiskersCompute = (config: BoxWhiskersConfigModel, worker: DedicatedWorkerGlobalScope): void => {


    // worker.util.processShapeColorSizeIntersect(config, worker);

    // if (config.dirtyFlag & DirtyEnum.LAYOUT) {

    if (config.continuousVariable.tbl !== null && config.categoricalVariable1.tbl !== null) {

        // Continuous Molecular
        if (config.continuousVariable.ctype & CollectionTypeEnum.MOLECULAR) {
            worker.util
                .getMatrix(config.markerFilter, config.sampleFilter, config.table.map, config.database, config.table.tbl, config.entity)
                .then(mtx => {
                    worker.postMessage('TERMINATE');
                });
        }
        if (config.continuousVariable.ctype & CollectionTypeEnum.PATIENT) {
            worker.util.getPatients(config.sampleFilter, config.database, config.continuousVariable.tbl)
                .then(data => {
                });
        }
    } else {
        worker.util
            .getMatrix(config.markerFilter, config.sampleFilter, config.table.map, config.database, config.table.tbl, config.entity)
            .then(mtx => {
                worker.util.getSamplePatientMap(config.database).then(result => {


                    // Transpose To Show Patients
                    mtx.data = _.zip.apply(_, mtx.data);

                    const psMap = result.reduce((p, c) => { p[c.s] = c.p; return p; }, {});

                    const data = mtx.data.map(datum => ({
                        median: JStat.median(datum),
                        quartiles: JStat.quartiles(datum),
                        min: JStat.min(datum),
                        max: JStat.max(datum)
                    }));

                    worker.postMessage({
                        config: config,
                        data: {
                            legendItems: [],
                            result: data,
                            min: JStat.min(data.map(v => v.min)),
                            max: JStat.max(data.map(v => v.max)),
                            patientIds: mtx.samples.map(v => psMap[v]),
                            sampleIds: mtx.samples,
                            markerIds: mtx.markers
                        }
                    });

                    worker.postMessage('TERMINATE');

                });
            });
    }
    // }
};
