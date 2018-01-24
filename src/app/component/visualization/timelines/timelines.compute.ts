import { EntityTypeEnum } from './../../../model/enum.model';
import { Legend } from './../../../model/legend.model';
import { DirtyEnum } from 'app/model/enum.model';
import { TimelinesConfigModel } from './timelines.model';
import { DedicatedWorkerGlobalScope } from './../../../../compute';
import * as _ from 'lodash';

export const timelinesCompute = (config: TimelinesConfigModel, worker: DedicatedWorkerGlobalScope): void => {

    if (config.dirtyFlag & DirtyEnum.OPTIONS) {
        worker.postMessage({
            config: config,
            data: {}
        });
    }

    if (config.dirtyFlag & DirtyEnum.LAYOUT) {
        worker.util
            .getEventData(config.database, config.patientFilter)
            .then(result => {

                // Align
                if (config.align !== 'None') {
                    const align = result.filter(v => v.subtype === config.align)
                        .reduce((p, c) => { p[c.p] = c.start; return p; }, {});
                    result = result.filter(v => align.hasOwnProperty(v.p));
                    result.forEach(v => {
                        v.start -= align[v.p];
                        v.end -= align[v.p];
                    });
                }

                // Sort Map (sort must occur here, pre-filter)
                let sortMap = null;
                if (config.sort !== 'None') {
                    sortMap = Array.from(new Set(result
                        .filter(v => v.subtype === config.sort)
                        .sort((a, b) => a.start - b.start)
                        .map(v => v.p)));
                }

                // Filter Events
                const events = Array.from(config.bars
                    .reduce((p, c) => { if (c.events !== null) { c.events.forEach(v => p.add(v.toString())); } return p; }, new Set()))
                    .map(v => v.toString());
                result = result.filter(v => events.indexOf(v.subtype) !== -1)

                // Determine Min + Max "Dates"
                const minMax = result.reduce((p, c) => {
                    p.min = Math.min(p.min, c.start);
                    p.max = Math.max(p.max, c.end);
                    return p;
                }, { min: Infinity, max: -Infinity });

                // Color Map
                const colors = worker.util.colors;
                const colorMap = events.reduce((p, c, i) => {
                    p[c] = colors[i];
                    return p;
                }, {});

                // Bar Map
                const barMap = config.bars.reduce((p, c, i) => {
                    if (c.events !== null) { c.events.forEach(v => p[v] = i); }
                    return p;
                }, {});

                // Associate Bar + Color To Event
                result = result.map(v => Object.assign(v, { color: colorMap[v.subtype], bar: barMap[v.subtype] }));

                // Build Legend
                let legends = config.bars.map(v => { 
                    const rv = new Legend();
                    rv.name = v.label;
                    rv.type = "COLOR";
                    rv.display = "DISCRETE";
                    rv.labels = v.events;
                    rv.values = rv.labels.map(v => colorMap[v]);
                    return rv;
                });

                // Group And Execute Sort
                let patients = _.groupBy(result, 'p');

                // Remove From SortMap Patients That Are Not In Result
                if (sortMap !== null) {
                    sortMap = sortMap.filter(v => patients[v]).reduce((p, c, i) => { p[c] = i; return p; }, {});
                    patients = Object.keys(patients)
                        .map(key => patients[key])
                        .sort((a, b) => {
                            a = (sortMap.hasOwnProperty(a[0].p)) ? sortMap[a[0].p] : -1;
                            b = (sortMap.hasOwnProperty(b[0].p)) ? sortMap[b[0].p] : -1;
                            return a - b;
                        });
                }

                // Get Heatmap Stuff
                if (config.attrs !== undefined) {
                    const pas = worker.util.getPatientAttributeSummary(config.patientFilter, config.attrs, config.database);
                    pas.then(attrs => {

                        legends = legends.concat(attrs.attrs.map(attr => { 
                            const legend: Legend = new Legend();
                            legend.name = attr.prop.replace(/_/gi, ' ');
                            legend.type = 'COLOR';
                            legend.display = 'CONTINUOUS';
                            legend.labels = [attr.min, attr.max].map(val => Math.round(val).toString());
                            legend.values = [0xFF0000, 0xFF0000];
                            return legend;
                        }));
                        
                        worker.postMessage({
                            config: config,
                            data: {
                                legendItems: legends,
                                result: {
                                    minMax: minMax,
                                    patients: patients,
                                    attrs: attrs
                                }
                            }
                        });
                        worker.postMessage('TERMINATE');
                    });

                } else {

                    worker.postMessage({
                        config: config,
                        data: {
                            legendItems: legends,
                            result: {
                                minMax: minMax,
                                patients: patients,
                                attrs: null
                            }
                        }
                    });
                    worker.postMessage('TERMINATE');

                }
        });
    }
};
