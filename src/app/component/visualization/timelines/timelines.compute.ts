import { EntityTypeEnum } from './../../../model/enum.model';
import { Legend } from './../../../model/legend.model';
import { DirtyEnum } from 'app/model/enum.model';
import { TimelinesConfigModel } from './timelines.model';
import { DedicatedWorkerGlobalScope } from './../../../../compute';
import * as _ from 'lodash';

declare var ML: any;

export const timelinesCompute = (config: TimelinesConfigModel, worker: DedicatedWorkerGlobalScope): void => {
    if (config.dirtyFlag & DirtyEnum.OPTIONS) {
        worker.postMessage({
            config: config,
            data: {}
        });
    }
    if (config.dirtyFlag & DirtyEnum.LAYOUT) {
        worker.util
            .getEventData(config.database)
            .then(events => {

                const colors = worker.util.colors3;
                const legend: Legend = new Legend();
                legend.name = 'Color';
                legend.type = 'COLOR';
                legend.display = 'DISCRETE';

                // Create Map Of Alignments
                if (config.align !== 'None') {
                    const align = events.filter(v => v.subtype === config.align)
                        .reduce((p, c) => { p[c.p] = c.start; return p; }, {});

                    // Remove Rows That Don't Have Alignment Property
                    events = events.filter(v => align.hasOwnProperty(v.p));
                    // Preform Alignment
                    events.forEach(v => {
                        v.start -= align[v.p];
                        v.end -= align[v.p];
                    });
                }

                // Filter Toggles
                const birth = [];
                events = events.filter(v => {
                    if (v.subtype === 'Birth') {
                        birth.push(v);
                        return false;
                    }
                    return true;
                });
                if (config.hasOwnProperty('visibleElements') && config.visibleElements !== null) {
                    const show = config.visibleElements;
                    events = events.filter(v => show[v.subtype]);
                }

                const subtypes = Array.from(events.reduce((p, c) => { p.add(c.subtype); return p; }, new Set()));
                legend.labels = subtypes as Array<string>;
                legend.values = colors.slice(0, legend.labels.length);

                const colorMap = legend.labels.reduce((p, c, i) => {
                    p[c] = legend.values[i].toString(16);
                    while (p[c].length < 6) {
                        p[c] = '0' + p[c];
                    }
                    p[c] = '#' + p[c];
                    return p;
                }, {});
                events.forEach(v => {
                    v.color = colorMap[v.subtype];
                });

                let patientEvents;
                let minMaxDates;

                if (config.entity === EntityTypeEnum.EVENT) {

                    patientEvents = _.groupBy(events, 'subtype');
                    // Process Each Event Subtype
                    minMaxDates = Object.keys(patientEvents).map(subtype => {
                        let subtypeEvents = patientEvents[subtype];
                        subtypeEvents = subtypeEvents.sort((a, b) => a.start - b.start);
                        const first = subtypeEvents[0];
                        const last = subtypeEvents[subtypeEvents.length - 1];
                        return { subtype: subtype, min: first.start, max: last.end };
                    });
                }

                if (config.entity === EntityTypeEnum.PATIENT) {
                    // Should Move This Down
                    minMaxDates = events.reduce((p, c) => {
                        p.min = Math.min(p.min, c.start);
                        p.max = Math.max(p.max, c.start);
                        p.min = Math.min(p.min, c.end);
                        p.max = Math.max(p.max, c.end);
                        return p;
                    }, { min: Infinity, max: -Infinity });

                    patientEvents = _.groupBy(events, 'p');
                    patientEvents = Object.keys(patientEvents).map(v => [v, patientEvents[v].sort((a, b) => a.start - b.start)]);

                    if (config.sort !== 'None') {
                        patientEvents.forEach(v => v.sortField = v[1].find(w => w.subtype === config.sort));
                        patientEvents = patientEvents
                            .filter(v => v.sortField !== undefined)
                            .sort((a, b) => b.sortField.start - a.sortField.start);
                    }

                    patientEvents = patientEvents.map(v => {
                        const evts = _.groupBy(v[1], 'type');
                        if (evts.hasOwnProperty('Status')) {
                            evts.Status = evts.Status.sort((a, b) => a.start - b.start);
                        } else {
                            evts.Status = [];
                        }
                        const death = evts.Status.find(v => v.subtype === 'Death');

                        if (evts.hasOwnProperty('Treatment')) {
                            if (death !== null) evts.Treatment = evts.Treatment.filter(v => (v.start < death.start && v.end < death.start));
                            evts.Treatment = evts.Treatment.sort((a, b) => a.start - b.start);
                        } else {
                            evts.Treatment = [];
                        }

                        evts.id = v[0];
                        return evts;
                    });
                }

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
