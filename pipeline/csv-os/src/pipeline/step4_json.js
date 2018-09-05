"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var InterfacesAndEnums_1 = require("./InterfacesAndEnums");
var IO_1 = require("./IO");
var fs_1 = __importDefault(require("fs"));
var WriteJson = /** @class */ (function () {
    function WriteJson() {
    }
    WriteJson.Run = function () {
        var _this = this;
        // Write All Json Files, Then Create Manifest
        return Promise.all([
            this.writePatientJson('patient.json'),
            this.writeSampleJson('sample.json'),
            this.writePatientSampleJson('psmap.json'),
            this.writeMatriciesJson(),
            this.writeMutationJson(),
            this.writeEventsJson()
        ]).then(function () {
            _this.writeManifestJson();
        });
    };
    WriteJson.writeManifestJson = function () {
        return new Promise(function (resolve, reject) {
            console.log('manifest.json');
            var manifest = {};
            manifest.patient = IO_1.IO.ReadJson('./src/output/', 'patient.json').fields;
            manifest.sample = IO_1.IO.ReadJson('./src/output/', 'sample.json').fields;
            var dir = fs_1.default.readdirSync('./src/output');
            manifest.version = '3.1';
            manifest.schema = {
                dataset: 'name',
                patientSampleMap: 's, p',
                patientMeta: 'key',
                sampleMeta: 'key',
                patient: 'p,' +
                    Object.keys(manifest.patient)
                        .map(function (v) { return v.replace(/ /gi, '_'); })
                        .join(','),
                sample: 's,' +
                    Object.keys(manifest.sample)
                        .map(function (v) { return v.replace(/ /gi, '_'); })
                        .join(',')
            };
            manifest.files = [
                {
                    name: 'patient',
                    dataType: 'patient',
                    file: 'patient.json'
                },
                {
                    name: 'sample',
                    dataType: 'sample',
                    file: 'sample.json'
                },
                {
                    name: 'psmap',
                    dataType: 'psmap',
                    file: 'psmap.json'
                }
            ];
            if (dir.indexOf('events.json')) {
                manifest.events = IO_1.IO.ReadJson('./src/output/', 'events.json').map;
                manifest.schema.events = '++, p';
                manifest.files.push({
                    name: 'events',
                    dataType: 'events',
                    file: 'events.json'
                });
            }
            if (dir.indexOf('mut.json')) {
                manifest.events = IO_1.IO.ReadJson('./src/output/', 'events.json').map;
                manifest.schema.mut = '++, m, p, t';
                manifest.files.push({
                    name: 'mutations',
                    dataType: 'mut',
                    file: 'mut.json'
                });
            }
            dir
                .filter(function (v) { return v.indexOf('matrix') === 0; })
                .filter(function (v) { return v.indexOf('data.json') !== -1; })
                .forEach(function (file) {
                var fname = file.replace('.data.json', '').replace('matrix-', '');
                manifest.schema[fname] = 'm';
                manifest.schema[fname + 'Map'] = 's';
                manifest.files.push({
                    name: fname,
                    dataType: 'matrix',
                    file: file
                });
            });
            var str = JSON.stringify(manifest);
            IO_1.IO.WriteString('manifest.json', str).then(function () {
                console.log('manifest.json');
                resolve();
            });
        });
    };
    WriteJson.writeMutationJson = function () {
        return new Promise(function (resolve, reject) {
            var files = fs_1.default
                .readdirSync('./src/output')
                .filter(function (v) { return v.indexOf('mutation') === 0; })
                .filter(function (v) { return v.indexOf('data.raw.json') !== -1; });
            files.forEach(function (v) {
                var data = IO_1.IO.ReadJson('./src/output/', v).filter(function (v) { return v.error.length === 0; });
                // gene-id-mut
                var agg = data.filter(function (v) { return v.error.length === 0; }).map(function (v) { return ({
                    hgnc: v.data.symbol,
                    sid: v.data['sample id'],
                    type: v.data.variant
                }); });
                var genes = Array.from(new Set(agg.map(function (v) { return v.hgnc; })));
                var sids = Array.from(new Set(agg.map(function (v) { return v.sid; })));
                var muts = Array.from(new Set(agg.map(function (v) { return v.type; }))).reduce(function (p, c, i) {
                    p[c] = 1 * Math.pow(2, i);
                    return p;
                }, {});
                var values = agg.reduce(function (p, c) {
                    // dont map this pass
                    var gid = genes.indexOf(c.hgnc);
                    var sid = sids.indexOf(c.sid);
                    if (!p.hasOwnProperty(gid)) {
                        p[gid] = {};
                    }
                    if (!p[gid].hasOwnProperty(sid)) {
                        p[gid][sid] = 0;
                    }
                    p[gid][sid] |= muts[c.type];
                    return p;
                }, {});
                var strGenes = '["' + genes.join('","') + '"]';
                var strSids = '["' + sids.join('","') + '"]';
                var strMuts = JSON.stringify(muts);
                var strValues = '["' +
                    Object.keys(values).reduce(function (p, gid) {
                        p += Object.keys(values[gid]).reduce(function (ip, sid) {
                            ip += gid + '-' + sid + '-' + values[gid][sid] + '","';
                            return ip;
                        }, '');
                        return p;
                    }, '') +
                    '"]';
                var vals = JSON.parse(strValues).filter(function (v) { return v.length !== 3; });
                var rv = {
                    genes: JSON.parse(strGenes),
                    ids: JSON.parse(strSids),
                    muts: JSON.parse(strMuts),
                    values: vals
                };
                var str = JSON.stringify(rv);
                IO_1.IO.WriteString('mut.json', str).then(function () {
                    console.log('mut.json');
                    resolve();
                });
            });
        });
    };
    WriteJson.writeEventsJson = function () {
        return new Promise(function (resolve, reject) {
            var files = fs_1.default
                .readdirSync('./src/output')
                .filter(function (v) { return v.indexOf('event-') === 0; })
                .filter(function (v) { return v.indexOf('data.raw.json') !== -1; });
            // for (var )
            // IO.ReadJson(fs)
            var eventMap = {};
            var eventIndex = new Array();
            var allEvents = new Array();
            Promise.all(files.map(function (file) {
                return new Promise(function (resolve, reject) {
                    var events = IO_1.IO.ReadJson('./src/output/', file).filter(function (v) { return v.error.length === 0; });
                    var eventType = file.split('.')[0].split('-');
                    // This event has no subcategory
                    if (eventType.length === 2) {
                        eventMap[eventType[1]] = 'Event';
                        eventIndex.push(eventType[1]);
                        // This event has a subcategory
                    }
                    else if (eventType.length === 3) {
                        eventMap[eventType[2]] = eventType[1];
                        eventIndex.push(eventType[2]);
                    }
                    var currentEventIndex = eventIndex.length - 1;
                    allEvents.push.apply(allEvents, events.map(function (event) {
                        var data = Object.keys(event.data)
                            .filter(function (key) {
                            return (key !== 'patient id' && key !== 'start' && key !== 'end');
                        })
                            .reduce(function (p, c) {
                            if (event.data[c].toString().trim() !== '') {
                                p[c] = event.data[c];
                            }
                            return p;
                        }, {});
                        return [
                            event.data['patient id'],
                            currentEventIndex,
                            parseFloat(event.data.start),
                            parseFloat(event.data.end),
                            data
                        ];
                    }));
                    resolve();
                });
            })).then(function () {
                var str = JSON.stringify({
                    map: eventMap,
                    data: allEvents
                });
                IO_1.IO.WriteString('events.json', str).then(function () {
                    console.log('events.json');
                    resolve();
                });
            });
        });
    };
    WriteJson.writeMatriciesJson = function () {
        return new Promise(function (resolve, reject) {
            var files = fs_1.default
                .readdirSync('./src/output')
                .filter(function (v) { return v.indexOf('matrix-') === 0; })
                .filter(function (v) { return v.indexOf('raw.json') !== -1; });
            var samples = IO_1.IO.ReadJson('./src/output/', 'sample.data.id.json');
            Promise.all(files.map(function (v) {
                return new Promise(function (resolve, reject) {
                    // IO.ReadLargeJson('./src/output/', v).then(data => {
                    //   debugger;
                    // });
                    var matrix = IO_1.IO.ReadJson('./src/output/', v).filter(function (v) { return v.error.length === 0; });
                    var dataGenes = matrix.reduce(function (p, c) {
                        var datum = c.data;
                        p.genes.push(datum.symbol);
                        p.data.push(samples.map(function (sample) { return parseFloat(datum[sample]); }));
                        return p;
                    }, { data: [], genes: [] });
                    IO_1.IO.WriteString(v.replace('data.raw.json', 'data.json'), JSON.stringify({
                        ids: samples,
                        genes: dataGenes.genes,
                        data: dataGenes.data
                    })).then(function () {
                        console.log(v.replace('data.raw.json', 'data.json'));
                        resolve();
                    });
                });
            })).then(function () {
                resolve();
            });
        });
    };
    WriteJson.writeSampleJson = function (uri) {
        return new Promise(function (resolve, reject) {
            var meta = IO_1.IO.ReadJson('./src/output/', 'sample.meta.log.json');
            var fields = meta
                .filter(function (v) { return v.error.length === 0; })
                .reduce(function (p, c) {
                if (c.data.type === InterfacesAndEnums_1.eDataType.Number) {
                    var numericValues = c.data.values
                        .map(function (v) { return parseFloat(v); })
                        .filter(function (v) { return !isNaN(v); });
                    var max = Math.max.apply(null, numericValues);
                    var min = Math.min.apply(null, numericValues);
                    p[c.data.label.trim().toLowerCase()] = { min: min, max: max };
                }
                else if (c.data.type === InterfacesAndEnums_1.eDataType.String) {
                    var stringValues = c.data.values.map(function (v) {
                        return v
                            .toString()
                            .trim()
                            .toLowerCase();
                    });
                    p[c.data.label.trim().toLowerCase()] = stringValues;
                }
                return p;
            }, {});
            var data = IO_1.IO.ReadJson('./src/output/', 'sample.data.raw.json');
            var ids = data.map(function (v) { return v.data['sample id'].toLowerCase().trim(); });
            var fieldNames = meta
                .filter(function (v) { return v.error.length === 0; })
                .map(function (v) { return v.data.name.trim().toLowerCase(); });
            var fieldLabels = meta
                .filter(function (v) { return v.error.length === 0; })
                .map(function (v) { return v.data.label; });
            var values = data.map(function (datum) {
                return fieldNames.map(function (fieldName, i) {
                    var lbl = fieldLabels[i];
                    var value = datum.data[fieldName.trim().toLowerCase()];
                    var f = fields[lbl.trim().toLowerCase()];
                    return f.hasOwnProperty('min') ? parseFloat(value) : f.indexOf(value);
                });
            });
            var output = {
                ids: ids,
                fields: fields,
                values: values
            };
            IO_1.IO.WriteString('sample.json', JSON.stringify(output)).then(function () {
                resolve();
            });
        });
    };
    WriteJson.writePatientJson = function (uri) {
        return new Promise(function (resolve, reject) {
            var meta = IO_1.IO.ReadJson('./src/output/', 'patient.meta.log.json');
            var fields = meta
                .filter(function (v) { return v.error.length === 0; })
                .reduce(function (p, c) {
                if (c.data.type === InterfacesAndEnums_1.eDataType.Number) {
                    var numericValues = c.data.values
                        .map(function (v) { return parseFloat(v); })
                        .filter(function (v) { return !isNaN(v); });
                    var max = Math.max.apply(null, numericValues);
                    var min = Math.min.apply(null, numericValues);
                    p[c.data.label.trim().toLowerCase()] = { min: min, max: max };
                }
                else if (c.data.type === InterfacesAndEnums_1.eDataType.String) {
                    var stringValues = c.data.values.map(function (v) {
                        return v
                            .toString()
                            .trim()
                            .toLowerCase();
                    });
                    p[c.data.label.trim().toLowerCase()] = stringValues;
                }
                return p;
            }, {});
            var data = IO_1.IO.ReadJson('./src/output/', 'patient.data.raw.json');
            var ids = data.map(function (v) { return v.data['patient id'].toLowerCase().trim(); });
            var fieldNames = meta
                .filter(function (v) { return v.error.length === 0; })
                .map(function (v) { return v.data.name.trim().toLowerCase(); });
            var fieldLabels = meta
                .filter(function (v) { return v.error.length === 0; })
                .map(function (v) { return v.data.label; });
            var values = data.map(function (datum) {
                return fieldNames.map(function (fieldName, i) {
                    var lbl = fieldLabels[i];
                    var value = datum.data[fieldName.trim().toLowerCase()];
                    var f = fields[lbl.trim().toLowerCase()];
                    return f.hasOwnProperty('min') ? parseFloat(value) : f.indexOf(value);
                });
            });
            var output = {
                ids: ids,
                fields: fields,
                values: values
            };
            IO_1.IO.WriteString('patient.json', JSON.stringify(output)).then(function () {
                console.log('patient.json');
                resolve();
            });
        });
    };
    WriteJson.writePatientSampleJson = function (uri) {
        return new Promise(function (resolve, reject) {
            var data = IO_1.IO.ReadJson('./src/output/', 'sample.data.raw.json');
            var psMap = data
                .filter(function (v) { return v.error.length === 0; })
                .reduce(function (p, c) {
                var pid = c.data['patient id'].trim().toLowerCase();
                var sid = c.data['sample id'].trim().toLowerCase();
                if (!p.hasOwnProperty(pid)) {
                    p[pid] = [];
                }
                p[pid].push(sid);
                return p;
            }, {});
            IO_1.IO.WriteString('psmap.json', JSON.stringify(psMap)).then(function () {
                console.log('psmap.json');
                resolve();
            });
        });
    };
    return WriteJson;
}());
exports.WriteJson = WriteJson;
//# sourceMappingURL=step4_json.js.map