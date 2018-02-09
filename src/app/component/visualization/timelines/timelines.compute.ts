import { ChartUtil } from 'app/component/workspace/chart/chart.utils';
import { interpolateSpectral } from 'd3-scale-chromatic';
import { EntityTypeEnum } from './../../../model/enum.model';
import { Legend } from './../../../model/legend.model';
import { DirtyEnum, Colors } from 'app/model/enum.model';
import { TimelinesConfigModel } from './timelines.model';
import { DedicatedWorkerGlobalScope } from './../../../../compute';
import * as _ from 'lodash';
import { color } from 'd3';
import { scaleLinear, scaleLog, InterpolatorFactory, scaleSequential, scaleQuantize, scaleQuantile } from 'd3-scale';

export const timelinesCompute = (config: TimelinesConfigModel, worker: DedicatedWorkerGlobalScope): void => {

    const colors = [
        
        [0x90caf9, 0x0d47a1, 0x64b5f6], // Start Stop Restart
        
        [0xff5722, 0xffc107, 0xcddc39, 0x4caf50],
        [0xa5d6a7, 0xb39ddb, 0x311b92, 0x1b5e20], // Death Stuff
        [0x795548, 0xff9800, 0xffeb3b, 0x8bc34a,
            0x009688, 0x03a9f4, 0x3f51b5, 0x9c27b0,
            0xf44336, 0x607d8b, 0x673ab7, 0xe91e63]
            // [0xbbdefb, 0x64b5f6, 0x2196f3, 0x1976d2],
        //[0xb71c1c, 0x880e4f, 0x4a148c, 0x311b92],
        // [0xd32f2f, 0x7b1fa2, 0x283593, 0x0277bd],
        
        // [0xd1c4e9, 0x9575cd, 0x673ab7, // Purple
        //     0xc8e6c9, 0x81c784, 0x4caf50, // Green
        //     0xf8bbd0, 0xf06292, 0xe91e63, // Pink;
        //     0xffe0b2, 0xffb74d, 0xff9800] // Orange;

        // 0x004d40, 0x1b5e20, 0xf57f17, 0xe65100, 0xbf360c, 0x3e2723],
        
    ];


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
                        .reduce((p, c) => { 
                            if (p.hasOwnProperty(c.p)) {
                                if (p[c.p] > c.start) { p[c.p] = c.start; }
                            } else {
                                p[c.p] = c.start; 
                            }
                            return p; }, {});
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
                result = result.filter(v => events.indexOf(v.subtype) !== -1);

                // Determine Min + Max "Dates"
                const minMax = result.reduce((p, c) => {
                    p.min = Math.min(p.min, c.start);
                    p.max = Math.max(p.max, c.end);
                    return p;
                }, { min: Infinity, max: -Infinity });

             
                const colorMap = config.bars.map( (v, i) =>
                    v.events.reduce((p, c, j) => {
                        p[c] = colors[i][j];
                        return p; }, {})
                ).reduce( (p, c) => Object.assign(p, c), {});

                // Bar Map
                // const barMap = config.bars.reduce((p, c, i) => {
                //     if (c.events !== null) { c.events.forEach(v => p[v] = i); }
                //     return p;
                // }, {});

                // Associate Bar + Color To Event
                result = result.map(v => {
                    return Object.assign(v, { 'color': colorMap[v.subtype]});//, 'bar': barMap[v.subtype] });
                });

                // Build Legend
                let legends = config.bars.map( v => {
                    const rv = new Legend();
                    rv.name = 'ROW // ' + v.label.toUpperCase();
                    rv.type = 'COLOR';
                    rv.display = 'DISCRETE';
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

                const colorToHex = function(color): number {
                    if (color.substr(0, 1) === '#') {
                        return color;
                    }
                    const digits = /(.*?)rgb\((\d+), (\d+), (\d+)\)/.exec(color);
                    const red = parseInt(digits[2], 10);
                    const green = parseInt(digits[3], 10);
                    const blue = parseInt(digits[4], 10);
                    const rgb = blue | (green << 8) | (red << 16);
                    return rgb;
                };

                // Get Heatmap Stuff
                if (config.attrs !== undefined) {

                    const pas = worker.util.getPatientAttributeSummary(config.patientFilter, config.attrs, config.database);
                    pas.then(attrs => {

                        legends = legends.concat(attrs.attrs.map(attr => {
                            if (attr.hasOwnProperty('min')) {
                                const scale = scaleSequential<number>(interpolateSpectral).domain([attr.min, attr.max]);
                                const legend: Legend = new Legend();
                                legend.name = 'HEATMAP // ' + attr.prop.replace(/_/gi, ' ');
                                legend.type = 'COLOR';
                                legend.display = 'CONTINUOUS';
                                legend.labels = [attr.min, attr.max].map(val => Math.round(val).toString());
                                legend.values = [0xFF0000, 0xFF0000];
                                attr.values = attr.values.map(v => ({label: v, color: colorToHex(scale(v))}));
                                return legend;
                            } else {
                                const cm = attr.set.reduce( (p, c, i) => {
                                    p[c] = worker.util.colors[i];
                                    return p;
                                }, {});
                                const legend: Legend = new Legend();
                                legend.name = 'HEATMAP // ' + attr.prop.replace(/_/gi, ' ').toUpperCase();;
                                legend.type = 'COLOR';
                                legend.display = 'DISCRETE';
                                legend.labels = Object.keys(cm);
                                legend.values = Object.keys(cm).map( key => cm[key] );
                                attr.values = attr.values.map(v => ({label: v, color: cm[v]}));
                                return legend;
                            }
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
