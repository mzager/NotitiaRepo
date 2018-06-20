import { DedicatedWorkerGlobalScope } from 'app/service/dedicated-worker-global-scope';
import { scaleSequential } from 'd3-scale';
import { interpolateSpectral } from 'd3-scale-chromatic';
import * as _ from 'lodash';
import { Legend } from './../../../model/legend.model';
import { TimelinesConfigModel } from './timelines.model';

export const timelinesCompute = (config: TimelinesConfigModel, worker: DedicatedWorkerGlobalScope): void => {

    const colorToHex = function (col): number {
        if (col.substr(0, 1) === '#') {
            return col;
        }
        const digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(col);
        const red = parseInt(digits[2], 10);
        const green = parseInt(digits[3], 10);
        const blue = parseInt(digits[4], 10);
        const rgb = blue | (green << 8) | (red << 16);
        return rgb;
    };

    const colors = [
        [   // Blues
            0x1A237E,
            0x27358B,
            0x344899,
            0x415AA7,
            0x4E6DB4,
            0x5B7FC2,
            0x6892D0,
            0x75A4DD,
            0x82B7EB,
            0x90CAF9
        ],  // Start Stop Restart
        [   // Greens
            0x1B5E20,
            0x2B6B2A,
            0x3B7835,
            0x4C8540,
            0x5C924B,
            0x6CA055,
            0x7DAD60,
            0x8DBA6B,
            0x9DC776
        ],
        [   // Oranges
            0xE65100,
            0xE85D00,
            0xEB6901,
            0xEE7602,
            0xF18203,
            0xF38F03,
            0xF69B04,
            0xF9A805,
            0xFCB406,
            0xFFC107,
        ],  // Death Stuff
        [
            0xB71C1C,
            0xB7242F,
            0xB72C42,
            0xB83555,
            0xB83D68,
            0xB8467B,
            0xB94E8E,
            0xB957A1,
            0xB95FB4,
            0xBA68C8
        ]
    ];

    const getPatientInfo = function (db: string, tbl: string): Promise<any> {
        return worker.util.getPatients([], db, tbl);
    };

    // if (config.dirtyFlag & DirtyEnum.OPTIONS) {
    //     worker.postMessage({
    //         config: config,
    //         data: {}
    //     });
    // }

    // if (config.dirtyFlag & DirtyEnum.LAYOUT) {
    Promise.all([
        worker.util.getEvents(config.database, config.patientFilter),
        worker.util.getPatients([], config.database, 'patient')
    ]).then(result => {

        let eventData = result[0];
        const patientData = result[1];

        // Align
        if (config.align !== 'None') {
            const align = eventData.filter(v => v.subtype === config.align)
                .reduce((p, c) => {
                    if (p.hasOwnProperty(c.p)) {
                        if (p[c.p] > c.start) { p[c.p] = c.start; }
                    } else {
                        p[c.p] = c.start;
                    }
                    return p;
                }, {});
            eventData = eventData.filter(v => align.hasOwnProperty(v.p));
            eventData.forEach(v => {
                v.start -= align[v.p];
                v.end -= align[v.p];
            });
        }

        // Filter Events
        const events = Array.from(config.bars
            .reduce((p, c) => { if (c.events !== null) { c.events.forEach(v => p.add(v.toString())); } return p; }, new Set()))
            .map(v => v.toString());
        eventData = eventData.filter(v => events.indexOf(v.subtype) !== -1);


        const cols = worker.util.interpolateColors('rgb(94, 79, 162)', 'rgb(247, 148, 89)', config.bars.length, true);

        debugger;
        const colorMap = config.bars.map((v, i) =>
            v.events.reduce((p, c, j) => {
                p[c] = colors[i][j];
                return p;
            }, {})
        ).reduce((p, c) => Object.assign(p, c), {});

        // Associate Bar + Color To Event
        eventData = eventData.map(v => {
            return Object.assign(v, { 'color': colorMap[v.subtype] });
        });

        // Build Legend
        let legends = config.bars.filter(v => v.style !== 'None').map(v => {
            const rv = new Legend();
            rv.name = 'ROW // ' + v.label.toUpperCase();
            rv.type = 'COLOR';
            rv.display = 'DISCRETE';
            rv.labels = v.events;
            rv.values = rv.labels.map(w => colorMap[w]);
            return rv;
        });

        // Group And Execute Sort
        let patients: any;
        patients = _.groupBy(eventData, 'p');
        if (config.group.label !== 'None') {
            patientData.forEach(patient => {
                if (patients.hasOwnProperty(patient.p)) {
                    patients[patient.p]['group'] = patient[config.group.label];
                }
            });
        }
        if (config.sort.label !== 'None') {
            if (config.sort['type'] === 'patient') {
                patientData.forEach(patient => {
                    if (patients.hasOwnProperty(patient.p)) {
                        patients[patient.p].sort = patient[config.sort['key']];
                    }
                });
            } else {
                Object.keys(patients).forEach(pid => {
                    const patient = patients[pid];
                    const eref = patient.find(v => v.subtype === config.sort.label);
                    if (eref !== undefined) {
                        patient.sort = eref.start;
                    }
                });
            }
        }

        patients = Object.keys(patients).map(key => ({
            sort: patients[key].hasOwnProperty('sort') ? patients[key].sort : null,
            group: patients[key].hasOwnProperty('group') ? patients[key]['group'] : null,
            events: patients[key]
        }));
        if (config.sort.label !== 'None') {
            // patients = patients.filter(p => p.sort !== null);
            patients = patients.sort((a, b) => b.sort - a.sort);
        }
        if (config.group.label !== 'None') {
            // patients = patients.filter(p => p.group !== null);
            patients = _.groupBy(patients, 'group');
            patients = Object.keys(patients).reduce((p, c) => p.concat(patients[c]), []);
        }
        patients = patients.map(patient => patient.events);

        // Determine Min + Max "Dates"
        const minMax = eventData.reduce((p, c) => {
            p.min = Math.min(p.min, c.start);
            p.max = Math.max(p.max, c.end);
            return p;
        }, { min: Infinity, max: -Infinity });

        // Get Heatmap Stuff
        if (config.attrs !== undefined) {

            const pas = worker.util.getPatientAttributeSummary(config.patientFilter, config.attrs, config.database);
            pas.then(attrs => {

                legends = legends.concat(attrs.attrs.map(attr => {
                    if (attr.hasOwnProperty('min')) {
                        const scale = scaleSequential<string>(interpolateSpectral).domain([attr.min, attr.max]);
                        const legend: Legend = new Legend();
                        legend.name = 'HEATMAP // ' + attr.prop.replace(/_/gi, ' ');
                        legend.type = 'COLOR';
                        legend.display = 'CONTINUOUS';
                        legend.labels = [attr.min, attr.max].map(val => Math.round(val).toString());
                        legend.values = [0xFF0000, 0xFF0000];
                        attr.values = attr.values.map(v => ({ label: v, color: colorToHex(scale(v)) }));
                        return legend;
                    } else {
                        const cm = attr.set.reduce((p, c, i) => {
                            p[c] = worker.util.colors[i];
                            return p;
                        }, {});
                        const legend: Legend = new Legend();
                        legend.name = 'HEATMAP // ' + attr.prop.replace(/_/gi, ' ').toUpperCase();
                        legend.type = 'COLOR';
                        legend.display = 'DISCRETE';
                        legend.labels = Object.keys(cm);
                        legend.values = Object.keys(cm).map(key => cm[key]);
                        attr.values = attr.values.map(v => ({ label: v, color: cm[v] }));
                        return legend;
                    }
                }));
                worker.postMessage({
                    config: config,
                    data: {
                        legends: legends,
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
                    legends: legends,
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
    // }
};
