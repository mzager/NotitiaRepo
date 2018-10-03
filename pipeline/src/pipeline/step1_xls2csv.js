"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var xlsx = __importStar(require("xlsx"));
var fs_1 = __importStar(require("fs"));
var path_1 = require("path");
var copydir = require('copy-dir');
var ParseTree = /** @class */ (function () {
    function ParseTree() {
    }
    ParseTree.Run = function () {
        return new Promise(function (resolve, reject) {
            var src = './src/cbio/';
            var dsFolders = fs_1.default
                .readdirSync(src)
                .map(function (name) { return path_1.join(src, name); })
                .filter(function (v) { return fs_1.lstatSync(v).isDirectory(); })
                .filter(function (folder) {
                var dsFiles = fs_1.default
                    .readdirSync('./' + folder)
                    .filter(function (v) { return v !== '.DS_Store'; });
                if (!dsFiles.indexOf('patient.csv'))
                    return false;
                if (!dsFiles.indexOf('sample.csv'))
                    return false;
                if (!dsFiles.reduce(function (p, c) {
                    if (c.indexOf('matrix') === 0 && c.indexOf('-rppa') === -1) {
                        p = true;
                    }
                    return p;
                }, false)) {
                    return false;
                }
                return true;
            });
            resolve(dsFolders.map(function (v) { return './' + v + '/'; }));
        });
    };
    return ParseTree;
}());
exports.ParseTree = ParseTree;
var Xls2Csv = /** @class */ (function () {
    function Xls2Csv() {
    }
    Xls2Csv.Run = function (file) {
        return new Promise(function (resolve, reject) {
            var workbook = xlsx.readFile(file);
            Promise.all(workbook.SheetNames.map(function (sheetName) {
                return new Promise(function (resolve, reject) {
                    var data = xlsx.utils.sheet_to_csv(workbook.Sheets[sheetName], {
                        FS: ',',
                        RS: '\n',
                        strip: true,
                        blankrows: false,
                        skipHidden: true
                    });
                    fs_1.default.writeFileSync('./src/output/' + sheetName.toLowerCase() + '.csv', data);
                    console.log('Exported CSV : ' + sheetName.toLowerCase());
                    resolve();
                });
            })).then(function () {
                resolve();
            });
        });
    };
    return Xls2Csv;
}());
exports.Xls2Csv = Xls2Csv;
//# sourceMappingURL=step1_xls2csv.js.map