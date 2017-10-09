import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Rx';
import { NcbiService } from './ncbi.service';
import { DatabaseService } from './database.service';
import { DataService } from './data.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import { Colors } from './../model/enum.model';
import { DataCollection } from './../model/data-collection.model';
import { DataField } from './../model/data-field.model';
import { DataTypeEnum } from 'app/model/enum.model';
import { HttpClient } from './http.client';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

// type AOA = Array<Array<any>>;

// function s2ab(s: string): ArrayBuffer {
//     const buf = new ArrayBuffer(s.length);
//     const view = new Uint8Array(buf);
//     for (let i = 0; i !== s.length; ++i) {
//         view[i] = s.charCodeAt(i) & 0xFF;
//     };
//     return buf;
// }

@Injectable()
export class WorkbookService {


    constructor() { }

    // onload = (data: any) => {
    //     /* read workbook */

    //     const bstr = data.target.result;
    //     const wb = XLSX.read(bstr, { type: 'binary' });

    //     // /* grab first sheet */
    //     // const wsname = wb.SheetNames[0];
    //     // const ws = wb.Sheets[wsname];

    //     // /* save data to scope */
    //     // const p1 = (<AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 })));
    //     this.parsed.next();
    // }

    parseWorkbook(dataTransfer: any): Observable<any> {
        return Observable.fromPromise(
            new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = function (e: any) {
                    const bstr = e.target.result;
                    const workbook = XLSX.read(bstr, { type: 'binary' });
                    const molecularData = workbook.SheetNames
                        .map(v => v.toUpperCase()).filter(v => v.indexOf('MOLECULAR') === 0).map(v => {
                            const rv = {
                                name: v.replace('MOLECULAR-', '').toUpperCase(),
                                data: XLSX.utils.sheet_to_json(workbook.Sheets[v]),
                                samples: [],
                                markers: []
                            };
                            // const fileGenes = rv.data.map(datum => datum['HUGO'].toUpperCase().replace(/[^A-Z0-9]/g, ''))
                            // const hugoGenes = new Set(geneMap.map(gene => gene.hugo.toUpperCase()));

                            // // Array.from is workaround for typescript 'bug'
                            // const missingGenes = [...fileGenes].filter(x => !hugoGenes.has(x));

                            // const missingGeneMap = missingGenes.map(gene => {
                            //     const altName = geneMap.find(map => {
                            //         const hasAlias = map.symbols
                            //             .map(symbol => symbol.toUpperCase())
                            //             .find(symbol => (symbol === gene));
                            //         return (hasAlias !== undefined);
                            //     });
                            //     return { gene: gene, altName: altName };
                            // });

                            // const lost = missingGeneMap.filter(gene => gene.altName === undefined).map(gene => gene.gene);
                            // const found = missingGeneMap.filter(gene => gene.altName !== undefined).map(gene => {
                            //     gene.altName = gene.altName.hugo; return gene;
                            // });
                        try {
                            rv.samples = Object.keys(rv.data[0]).filter(keys => keys !== 'HUGO');
                            rv.markers = rv.data.map(marker => marker['HUGO']);
                            rv.data = rv.samples.map(keys => {
                                return rv.data.map(x => {
                                    const n = Number(x[keys]);
                                    return (isNaN(n) ? 1 : n);
                                });
                            });
                        }catch ( e ) {}
                            // Transpose
                            rv.data = _.zip.apply(_, rv.data);
                            return rv;
                        });

                    const toBool = (v) => {
                        v = v.toLowerCase().trim();
                        return (v === 'true' || v === 'yes' || v === 1);
                    };

                    const toDate = (v) => {
                        return moment(v, 'MM/DD/YYYY').unix();
                    };

                    const toFloat = (v) => {
                        return parseFloat(v);
                    };

                    const patientSampleMap = workbook.SheetNames
                        .map(v => v.toUpperCase()).filter(v => v.indexOf('PATIENT-SAMPLE') === 0).map(v => {
                            const data = XLSX.utils.sheet_to_json(workbook.Sheets[v]);
                            const rv = {
                                name: v,
                                samples: {},
                                patients: {}
                            };
                            rv.samples = data.reduce((p, c) => {
                                p[c['SampleID']] = data.filter(s => {
                                    return s['SampleID'] === c['SampleID'];
                                })[0]['PatientID']; return p;
                            }, {});
                            rv.patients = data.reduce((p, c) => {
                                p[c['PatientID']] = data.filter(s => {
                                    return s['PatientID'] === c['PatientID'];
                                }).map(s => s['SampleID']); return p;
                            }, {});
                            return rv;
                        })[0];

                    const patient = workbook.SheetNames
                        .map(v => v.toUpperCase()).filter(v => v.indexOf('PATIENT-DATA') === 0).map(v => {
                            let data = XLSX.utils.sheet_to_json(workbook.Sheets[v]);
                            // Parse Object Properties To Type + Key
                            const fields = Object.keys(data[0])
                                .map(field => field.split('-'))
                                .filter(field => field.length > 1)
                                .map(field => {
                                    const rv = { type: field.slice(-1)[0].toUpperCase(), key: field.join('-'), label: '', data: null };
                                    field.splice(-1);
                                    rv.label = field.join(' ');
                                    return rv;
                                });

                            fields.forEach(field => {
                                switch (field.type) {
                                    case DataTypeEnum.STRING:
                                        field.data = { values: _.uniqBy(data, field.key).map(datum => datum[field.key]) };
                                        break;
                                    case DataTypeEnum.NUMBER:
                                        data = data.map(datum => { datum[field.key] = toFloat(datum[field.key]); return datum; });
                                        field.data = {
                                            min: _.minBy(data, field.key)[field.key],
                                            max: _.maxBy(data, field.key)[field.key]
                                        };
                                        break;
                                    // case DataTypeEnum.DATE:
                                    //     data.map(datum => { datum[field.key] = toDate(v[field.key]); return v; });
                                    //     field.data = {
                                    //         min: _.minBy(data, field.key)[field.key],
                                    //         max: _.maxBy(data, field.key)[field.key]
                                    //     };
                                    //     break;
                                }
                            });
                            return {
                                data: data,
                                fields: fields
                            };
                        })[0];


                    const patientEvents = workbook.SheetNames
                        .map(v => v.toUpperCase()).filter(v => v.indexOf('PATIENT-EVENT') === 0).map(v => {
                            const data = XLSX.utils.sheet_to_json(workbook.Sheets[v]);
                            const rv = data.reduce((p, c) => {
                                if (!p.hasOwnProperty(c['PatientID'])) { p[c['PatientID']] = []; }
                                p[c['PatientID']].push({
                                    'start': toDate(c['StartDate']),
                                    'end': toDate(c['EndDate']),
                                    'string': Object.keys(c).filter(key => { return key.toLowerCase().indexOf('-string') > 0; })
                                        .map(key => { return { key: key.toLowerCase().replace('-string', ''), value: c[key].toLowerCase() }; }),
                                    'date': Object.keys(c).filter(key => { return key.toLowerCase().indexOf('date') > 0; })
                                        .map(key => { return { key: key.toLowerCase().replace('-date', ''), value: toDate(c[key]) }; }),
                                    'number': Object.keys(c).filter(key => { return key.toLowerCase().indexOf('-number') > 0; })
                                        .map(key => { return { key: key.toLowerCase().replace('-number', ''), value: Number(c[key]) }; }),
                                    'boolean': Object.keys(c).filter(key => { return key.toLowerCase().indexOf('-boolean') > 0; })
                                        .map(key => { return { key: key.toLowerCase().replace('-boolean', ''), value: toBool(c[key]) }; }),
                                });
                                return p;
                            }, {});
                            return { key: v.replace('PATIENT-EVENT-', ''), data: rv };
                        });

                    const patientEventsValues = patientEvents.map(event => {
                        const sValuesGroup = _.groupBy([].concat.apply([], [].concat.apply([],
                            _.values(event.data)).map(v => v.string)), v => v['key']);
                        const sKeys = _.keys(sValuesGroup);
                        const sValues = _.values(sValuesGroup).map(v0 => _.uniqBy(v0, x => x['value']))
                            .map(v1 => v1.map(v2 => v2['value']));
                        const oValues = _.zipObject(sKeys, sValues);
                        return oValues;
                    });

                    const patientEventsTypes = patientEvents.map(v => v.key);
                    const patientEventsData = patientEvents.map(v => v.data);

                    const result = {
                        patientSampleMap: patientSampleMap,
                        molecularData: molecularData,
                        patientData: patient.data,
                        patientDataFields: patient.fields,
                        patientEventsValues: patientEventsValues,
                        patientEventsTypes: patientEventsTypes,
                        patientEventsData: patientEventsData
                    };
                    resolve(result);
                };
                reader.readAsBinaryString(dataTransfer.files[0]);
            })
        );

    }
}

