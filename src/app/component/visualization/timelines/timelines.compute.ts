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
        [0x90caf9, 0x0d47a1, 0x64b5f6], // Start Stop Restart
        [0xff5722, 0xffc107, 0xcddc39, 0x4caf50],
        [0xa5d6a7, 0xb39ddb, 0x311b92, 0x1b5e20], // Death Stuff
        [0x795548, 0xff9800, 0xffeb3b, 0x8bc34a,
            0x009688, 0x03a9f4, 0x3f51b5, 0x9c27b0,
            0xf44336, 0x607d8b, 0x673ab7, 0xe91e63]
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
            patients = patients.filter(p => p.sort !== null);
            patients = patients.sort((a, b) => b.sort - a.sort);
        }
        if (config.group.label !== 'None') {
            patients = patients.filter(p => p.group !== null);
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
