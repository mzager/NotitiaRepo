import { Legend } from './../../../model/legend.model';
import { DirtyEnum } from 'app/model/enum.model';
import { TimelinesConfigModel } from './timelines.model';
import { DedicatedWorkerGlobalScope } from './../../../../compute';
import * as _ from 'lodash';

declare var ML: any;


export const timelinesCompute = (config: TimelinesConfigModel, worker: DedicatedWorkerGlobalScope): void => {
    if (config.dirtyFlag & DirtyEnum.LAYOUT) {
        worker.util
            .getEventData()
            .then(events => {

                const colors = worker.util.colors;
                const legend: Legend = new Legend();
                legend.name = 'xxx';
                legend.type = 'COLOR';
                legend.display = 'DISCRETE';
                events = events.filter( p => p.subtype !== 'Birth');

                // Create Map Of Alignments
                if (config.align !== 'None') {
                    const align = events.filter( v => v.subtype === config.align)
                        .reduce( (p, c) => { p[c.p] = c.start; return p; }, {});
                    // Remove Rows That Don't Have Alignment Property
                    events = events.filter( v => align.hasOwnProperty(v.p));
                    // Preform Alignment
                    events.forEach( v => {
                        v.start -= align[v.p];
                        v.end -= align[v.p];
                    });
                }

                const subtypes = Array.from(events.reduce( (p, c) => { p.add(c.subtype); return p; }, new Set()));
                legend.labels = subtypes as Array<string>;
                legend.values = colors.slice(0, legend.labels.length);

                const colorMap = legend.labels.reduce( (p, c, i) => {
                    p[c] = legend.values[i].toString(16);
                    while (p[c].length < 6) {
                        p[c] = '0' + p[c];
                    }
                    p[c] = '#' + p[c];
                    return p;
                }, {});
                events.forEach( v => {
                    v.color = colorMap[v.subtype];
                });

                // Should Move This Down
                const minMaxDates = events.reduce( (p, c) => {
                    p.min = Math.min(p.min, c.start);
                    p.max = Math.max(p.max, c.start);
                    p.min = Math.min(p.min, c.end);
                    p.max = Math.max(p.max, c.end);
                    return p;
                }, {min: Infinity, max: -Infinity});

                let patientEvents = _.groupBy(events, 'p');
                patientEvents = Object.keys(patientEvents).map( v => [v, patientEvents[v].sort( (a, b) => a.start - b.start )] );

                if (config.sort !== 'None') {
                    patientEvents.forEach( v => v.sortField = v[1].find(w => w.subtype === config.sort) );
                    patientEvents = patientEvents
                        .filter(v => v.sortField !== undefined)
                        .sort( (a, b) => a.sortField.start - b.sortField.start );
                }

                patientEvents = patientEvents.map( v => {
                    const evts = _.groupBy(v[1], 'type');
                    evts.Status = evts.Status.sort( (a, b) => a.start - b.start );
                    if (evts.hasOwnProperty('Treatment')) {
                        evts.Treatment = evts.Treatment.sort( (a, b) => a.start - b.start );
                    }
                    evts.id = v[0];
                    return evts;
                });


                worker.postMessage({
                    config: config,
                    data: {
                        legendItems: [legend],
                        result: {
                            minMax: minMaxDates,
                            events: patientEvents

                        }
                    }
                });
                worker.postMessage('TERMINATE');
            });
    }
};
