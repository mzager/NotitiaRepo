/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var mutationType = {
    1: 'Missense',
    2: 'Silent',
    4: 'Frame_Shift_Del',
    8: 'Splice_Site',
    16: 'Nonsense_Mutation',
    32: 'Frame_Shift_Ins',
    64: 'RNA',
    128: 'In_Frame_Del',
    256: 'In_Frame_Ins',
    512: 'Nonstop_Mutation',
    1024: 'Translation_Start_Site',
    2048: 'De_novo_Start_OutOfFrame',
    4096: 'De_novo_Start_InFrame',
    8192: 'Intron',
    16384: '3\'UTR',
    32768: 'IGR',
    65536: '5\'UTR',
    131072: 'Targeted_Region',
    262144: 'Read-through',
    524288: '5\'Flank',
    1048576: '3\'Flank',
    2097152: 'Splice_Site_SNP',
    4194304: 'Splice_Site_Del',
    8388608: 'Splice_Site_Ins',
    16777216: 'Indel',
    33554432: 'R'
};
var baseUrl = 'https://s3-us-west-2.amazonaws.com/notitia/tcga/';
var headers = new Headers();
headers.append('Content-Type', 'application/json');
headers.append('Accept-Encoding', 'gzip');
var requestInit = {
    method: 'GET',
    headers: headers,
    mode: 'cors',
    cache: 'default'
};
var startTime = new Date().getTime();
var report = function (msg) {
    var date = new Date();
    console.log(msg + ' : ' + date.getMinutes() + ':' + date.getSeconds());
};
var loadManifest = function (manifestUri) {
    fetch(manifestUri, requestInit)
        .then(function (response) { return response.json(); })
        .then(function (response) {
        Promise.all(response.map(processResource));
    });
    return null;
};
var processResource = function (resource) {
    resource.name = resource.name.replace(/ /gi, '').toLowerCase();
    return (resource.dataType === 'clinical') ? loadClinical(resource.name, resource.file) :
        (resource.dataType === 'psmap') ? loadPatientSampleMap(resource.name, resource.file) :
            (resource.dataType === 'gistic_threshold') ? loadGisticThreshold(resource.name, resource.file) :
                (resource.dataType === 'gistic') ? loadGistic(resource.name, resource.file) :
                    (resource.dataType === 'mut') ? loadMutation(resource.name, resource.file) :
                        (resource.dataType === 'rna') ? loadRna(resource.name, resource.file) :
                            (resource.dataType === 'events') ? loadEvents(resource.name, resource.file) :
                                null;
};
// Complete
var loadEvents = function (name, file) {
    return fetch(baseUrl + file + '.gz', requestInit)
        .then(function (response) { report('Events Loaded'); return response.json(); })
        .then(function (response) {
        report('Events Parsed');
        var eventTable = [];
        var mult = 86400000;
        var lookup = Object.keys(response.map).reduce(function (p, c) { p.push({ type: response.map[c], subtype: c }); return p; }, []);
        var data = response.data.map(function (datum) { return Object.assign({
            p: datum[0],
            start: datum[2],
            end: datum[3],
            data: datum[4]
        }, lookup[datum[1]]); });
        report('Events Processed');
        return new Promise(function (resolve, reject) {
            resolve([
                { tbl: name, data: data },
            ]);
        });
    });
};
// Complete
var loadClinical = function (name, file) {
    report('Clinical Requested');
    return fetch(baseUrl + file + '.gz', requestInit)
        .then(function (response) { report('Clinical Loaded'); return response.json(); })
        .then(function (response) {
        report('Clinical Parsed');
        var patientMetaTable = Object.keys(response.fields).map(function (key, index) { return ({
            ctype: 2,
            key: key,
            label: key.replace(/_/gi, ' '),
            tbl: 'patient',
            type: Array.isArray(response.fields[key]) ? 'STRING' : 'NUMBER',
            values: response.fields[key]
        }); });
        var patientTable = response.ids.map(function (id, index) {
            return patientMetaTable.reduce(function (p, v, i) {
                var value = response.values[index][i];
                p[v.key] = (v.type === 'NUMBER') ? value : v.values[value];
                return p;
            }, { p: id });
        });
        report('Clinical Processed');
        return new Promise(function (resolve, reject) {
            resolve([
                // { tbl: 'patientMeta', data: patientMetaTable },
                { tbl: 'patient', data: patientTable }
            ]);
        });
    });
};
// Complete
var loadGisticThreshold = function (name, file) {
    report('Gistic Threshold Requested');
    return fetch(baseUrl + file + '.gz', requestInit)
        .then(function (response) { report('Gistic Threshold Loaded'); return response.json(); })
        .then(function (response) {
        report('Gistic Threshold Parsed');
        var gisticThresholdSampleIds = response.ids.map(function (s, i) { return ({ i: i, s: s }); });
        var gisticThresholdTable = response.values.map(function (v, i) {
            var obj = v.reduce(function (p, c) {
                p.min = Math.min(p.min, c);
                p.max = Math.max(p.max, c);
                p.mean += c;
                return p;
            }, { m: response.genes[i], d: v, min: Infinity, max: -Infinity, mean: 0 });
            obj.mean /= v.length;
            return obj;
        });
        report('Gistic Threshold Processed');
        return new Promise(function (resolve, reject) {
            resolve([
                { tbl: name, data: gisticThresholdTable },
                { tbl: name + 'Map', data: gisticThresholdSampleIds }
            ]);
        });
    });
};
// Complete
var loadGistic = function (name, file) {
    report('Gistic Requested');
    return fetch(baseUrl + file + '.gz', requestInit)
        .then(function (response) { report('Gistic Loaded'); return response.json(); })
        .then(function (response) {
        report('Gistic Parsed');
        var gisticSampleIds = response.ids.map(function (s, i) { return ({ i: i, s: s }); });
        var gisticTable = response.values.map(function (v, i) {
            var obj = v.reduce(function (p, c) {
                p.min = Math.min(p.min, c);
                p.max = Math.max(p.max, c);
                p.mean += c;
                return p;
            }, { m: response.genes[i], d: v, min: Infinity, max: -Infinity, mean: 0 });
            obj.mean /= v.length;
            return obj;
        });
        report('Gistic Processed');
        return new Promise(function (resolve, reject) {
            resolve([
                { tbl: name, data: gisticTable },
                { tbl: name + 'Map', data: gisticSampleIds }
            ]);
        });
    });
};
var loadPatientSampleMap = function (name, file) {
    return fetch(baseUrl + file + '.gz', requestInit)
        .then(function (response) { report('PS Map Loaded'); return response.json(); })
        .then(function (response) {
        report('Patient Sample Map Parsed');
        var data = Object.keys(response).reduce(function (p, c) {
            response[c].forEach(function (v) { p.push({ p: c, s: v }); });
            return p;
        }, []);
        report('Patient Sample Map Processed');
        return new Promise(function (resolve, reject) {
            resolve([
                { tbl: 'patientSampleMap', data: data },
            ]);
        });
    });
};
var loadMutation = function (name, file) {
    report('Mutation Requested');
    return fetch(baseUrl + file + '.gz', requestInit)
        .then(function (response) { report('Mutation Loaded'); return response.json(); })
        .then(function (response) {
        report('Mutation Parsed');
        var ids = response.ids;
        var genes = response.genes;
        var mType = mutationType;
        var lookup = Object.keys(mType);
        var data = response.values.map(function (v) { return v
            .split('-')
            .map(function (v1) { return parseInt(v1, 10); })
            .map(function (v2, i) { return (i === 0) ? genes[v2] : (i === 1) ? ids[v2] : v2; }); }).reduce(function (p, c) {
            p.push.apply(p, lookup
                .filter(function (v) { return (parseInt(v, 10) & c[2]); })
                .map(function (v) { return ({ m: c[0], s: c[1], t: mType[v] }); }));
            return p;
        }, []);
        report('Mutation Processed');
        return new Promise(function (resolve, reject) {
            // TODO: This is a bug.  Need to replace token mut with value from result
            resolve([
                { tbl: 'mut', data: data },
            ]);
        });
    });
};
// Complete
var loadRna = function (name, file) {
    report('RNA Requested');
    return fetch(baseUrl + file + '.gz', requestInit)
        .then(function (response) { report('RNA Loaded'); return response.json(); })
        .then(function (response) {
        report('RNA Parsed');
        var rnaSampleIds = response.ids.map(function (s, i) { return ({ i: i, s: s }); });
        var rnaTable = response.values.map(function (v, i) {
            var obj = v.reduce(function (p, c) {
                p.min = Math.min(p.min, c);
                p.max = Math.max(p.max, c);
                p.mean += c;
                return p;
            }, { m: response.genes[i], d: v, min: Infinity, max: -Infinity, mean: 0 });
            obj.mean /= v.length;
            return obj;
        });
        report('RNA Processed');
        return new Promise(function (resolve, reject) {
            resolve([
                { tbl: name, data: rnaTable },
                { tbl: name + 'Map', data: rnaSampleIds }
            ]);
        });
    });
};
onmessage = function (e) {
    var me = self;
    switch (e.data.cmd) {
        case 'load':
            processResource(e.data.file).then(function (v) {
                me.postMessage(JSON.stringify(v));
            });
            break;
    }
};


/***/ })
/******/ ]);