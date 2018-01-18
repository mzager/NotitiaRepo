import { EntityTypeEnum } from './../../../model/enum.model';
import { Legend } from './../../../model/legend.model';
import { DirtyEnum } from 'app/model/enum.model';
import { TimelinesConfigModel } from './timelines.model';
import { DedicatedWorkerGlobalScope } from './../../../../compute';
import * as _ from 'lodash';

declare var ML: any;

export const timelinesCompute = (config: TimelinesConfigModel, worker: DedicatedWorkerGlobalScope): void => {


    worker.util.processShapeColorSizeIntersect(config, worker);

    if (config.dirtyFlag & DirtyEnum.OPTIONS) {
        worker.postMessage({
            config: config,
            data: {}
        });
    }
    if (config.dirtyFlag & DirtyEnum.LAYOUT) {

        // !!! THIS WORKS WELL - KEEP
        // if (config.attributes !== undefined) {
        //     const pas = worker.util.getPatientAttributeSummary(config.patientFilter, config.attributes, config.database);
        //     pas.then(v => {
        //         debugger;
        //         console.dir(v);
        //         const a = 'asf';
        //     });
        // }
        
            

        worker.util
            .getEventData(config.database, config.patientFilter)
            .then(result => {
                // Temp
                if (!config.hasOwnProperty('bars')) {
                    worker.postMessage({
                        config: config,
                        data: {
                            legendItems: [],
                            result: {
                                // minMax: minMaxDates,
                                events: result
                            }
                        }
                    });
                    worker.postMessage('TERMINATE');
                    return;
                }

                // Align
                if (config.align !== 'None') {
                    const align = result.filter(v => v.subtype === config.align)
                        .reduce((p, c) => { p[c.p] = c.start; return p; }, {});

                    // Remove Rows That Don't Have Alignment Property
                    result = result.filter(v => align.hasOwnProperty(v.p));

                    // Preform Alignment
                    result.forEach(v => {
                        v.start -= align[v.p];
                        v.end -= align[v.p];
                    });
                }

                // Filter Events
                const events = Array.from(config.bars
                    .reduce( (p,c) => { if (c.events !== null) { c.events.forEach( v => p.add(v) ); } return p;}, new Set()))
                    .map(v => v.toString());
                result = result.filter(v => events.indexOf(v.subtype) !== -1 )

                // Determine Min + Max "Dates"
                const minMax = result.reduce( (p, c) => { 
                    p.min = Math.min(p.min, c.start);
                    p.max = Math.max(p.max, c.end);
                    }, {min: Infinity, max: -Infinity});

                // Color Map
                const colors = worker.util.colors3;
                const colorMap = events.reduce( (p, c, i) => { 
                    p[c] = colors[i];
                    return p;
                }, {})

                // Build Legend
                
                const legend: Legend = new Legend();
                legend.name = 'Events';
                legend.type = 'COLOR';
                legend.display = 'DISCRETE';
                legend.labels = events;
                legend.values = events.map( v => colorMap[v] );
                debugger;
            

                // const subtypes = Array.from(events.reduce((p, c) => { p.add(c.subtype); return p; }, new Set()));
                // legend.labels = subtypes as Array<string>;
                // legend.values = colors.slice(0, legend.labels.length);

                // const colorMap = legend.labels.reduce((p, c, i) => {
                //     p[c] = legend.values[i].toString(16);
                //     while (p[c].length < 6) {
                //         p[c] = '0' + p[c];
                //     }
                //     p[c] = '#' + p[c];
                //     return p;
                // }, {});
                // events.forEach(v => {
                //     v.color = colorMap[v.subtype];
                // });

                // let patientEvents;
                // let minMaxDates;

                // if (config.entity === EntityTypeEnum.EVENT) {

                //     patientEvents = _.groupBy(events, 'subtype');

                //     // Process Each Event Subtype
                //     minMaxDates = Object.keys(patientEvents).reduce( (p, subtype) => {
                //         let subtypeEvents = patientEvents[subtype];
                //         subtypeEvents = subtypeEvents.sort((a, b) => a.start - b.start);
                //         const first = subtypeEvents[0];
                //         const last = subtypeEvents[subtypeEvents.length - 1];
                //         p[subtype] = { min: first.start, max: last.end };
                //         return p;
                //     }, {});

                // }

                // if (config.entity === EntityTypeEnum.PATIENT) {
                //     // Should Move This Down
                //     minMaxDates = events.reduce((p, c) => {
                //         p.min = Math.min(p.min, c.start);
                //         p.max = Math.max(p.max, c.start);
                //         p.min = Math.min(p.min, c.end);
                //         p.max = Math.max(p.max, c.end);
                //         return p;
                //     }, { min: Infinity, max: -Infinity });

                //     patientEvents = _.groupBy(events, 'p');
                //     patientEvents = Object.keys(patientEvents).map(v => [v, patientEvents[v].sort((a, b) => a.start - b.start)]);

                //     if (config.sort !== 'None') {

                //         patientEvents.forEach(v => v.sortField = v[1].find(w => w.subtype === config.sort));
                //         patientEvents = patientEvents
                //             .filter(v => v.sortField !== undefined)
                //             .sort((a, b) => b.sortField.start - a.sortField.start);
                //     }

                //     patientEvents = patientEvents.map(v => {
                //         const evts = _.groupBy(v[1], 'type');
                //         if (evts.hasOwnProperty('Status')) {
                //             evts.Status = evts.Status.sort((a, b) => a.start - b.start);
                //         } else {
                //             evts.Status = [];
                //         }
                //         evts.id = v[0];
                //         return evts;
                //     });
                // }
                worker.postMessage({
                    config: config,
                    data: {
                        legendItems: [legend],
                        result: {
                            // minMax: minMaxDates,
                            events: result
                        }
                    }
                });

                worker.postMessage('TERMINATE');
            });
    }
};
