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
var baseUrl = 'https://s3-us-west-2.amazonaws.com/notitia/firehose/';
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
    return (resource.dataType === 'clinical') ? loadClinical(resource.name, resource.file) :
        (resource.dataType === 'gistic_threshold') ? loadGisticThreshold(resource.name, resource.file) :
            (resource.dataType === 'gistic') ? loadGistic(resource.name, resource.file) :
                (resource.dataType === 'mutation') ? loadMutation(resource.name, resource.file) :
                    (resource.dataType === 'rna') ? loadRna(resource.name, resource.file) :
                        null;
};
var loadClinical = function (name, file) {
    report('Clinical Requested');
    return fetch(baseUrl + file, requestInit)
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
            resolve({ meta: patientMetaTable, tbl: patientTable });
        });
    });
};
var loadGisticThreshold = function (name, file) {
    report('Gistic Threshold Requested');
    return fetch(baseUrl + file, requestInit)
        .then(function (response) { report('Gistic Threshold Loaded'); return response.json(); })
        .then(function (response) {
        report('Gistic Threshold Parsed');
        var gisticThresholdSampleIds = response.ids;
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
            resolve({ ids: gisticThresholdSampleIds, tbl: gisticThresholdTable });
        });
    });
};
var loadGistic = function (name, file) {
    report('Gistic Requested');
    return fetch(baseUrl + file, requestInit)
        .then(function (response) { report('Gistic Loaded'); return response.json(); })
        .then(function (response) {
        report('Gistic Parsed');
        var gisticSampleIds = response.ids;
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
            resolve({ ids: gisticSampleIds, tbl: gisticTable });
        });
    });
};
var loadMutation = function (name, file) {
    report('Mutation Requested');
    return fetch(baseUrl + file, requestInit)
        .then(function (response) { report('Mutation Loaded'); return response.json(); })
        .then(function (response) {
        report('Mutation Parsed');
        return new Promise(function (resolve, reject) {
            resolve({});
        });
    });
};
var loadRna = function (name, file) {
    report('RNA Requested');
    return fetch(baseUrl + file, requestInit)
        .then(function (response) { report('RNA Loaded'); return response.json(); })
        .then(function (response) {
        report('RNA Parsed');
        var rnaSampleIds = response.ids;
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
            resolve({ ids: rnaSampleIds, tbl: rnaTable });
        });
    });
};
onmessage = function (e) {
    var me = self;
    switch (e.data.cmd) {
        case 'load':
            processResource(e.data.file).then(function (v) {
                me.postMessage({
                    msg: e,
                    result: v
                });
            });
            break;
    }
};


/***/ })
/******/ ]);