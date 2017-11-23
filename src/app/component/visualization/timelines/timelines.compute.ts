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

                const subtypes = Array.from(events.reduce( (p, c) => { p.add(c.subtype); return p; }, new Set()));
                legend.labels = subtypes as Array<string>;
                legend.values = colors.slice(0, legend.labels.length);

                const colorMap = legend.labels.reduce( (p, c, i) => {
                    p[c] = legend.values[i];
                    return p;
                }, {});
                events.forEach( v => {
                    v.color = colorMap[v.subtype];
                });

                const minMaxDates = events.reduce( (p, c) => {
                    p.min = Math.min(p.min, c.start.getTime());
                    p.max = Math.max(p.max, c.start.getTime());
                    p.min = Math.min(p.min, c.end.getTime());
                    p.max = Math.max(p.max, c.end.getTime());
                    return p;
                }, {min: Infinity, max: -Infinity});

                let patientEvents = _.groupBy(events, 'p');
                patientEvents = Object.keys(patientEvents).map( v => {
                    const evts = _.groupBy(patientEvents[v], 'type');
                    evts.Status = evts.Status.sort( (a, b) => a - b);
                    if (evts.hasOwnProperty('Treatment')) {
                        evts.Treatment = evts.Treatment.sort( (a, b) => a - b);
                    }
                    evts.id = v;
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
