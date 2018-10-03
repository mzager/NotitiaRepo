"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var IO_1 = require("./IO");
var parquets_1 = require("parquets");
var fs_1 = __importDefault(require("fs"));
var WriteParquet = /** @class */ (function () {
    function WriteParquet() {
    }
    WriteParquet.All = function () {
        return Promise.all([this.writeMatriciesParquet(), this.writeMutationsParquet()]);
    };
    WriteParquet.writeMutationsParquet = function () {
        var writeFile = function (filename, matrix) {
            return __awaiter(this, void 0, void 0, function () {
                var schema, data, file, i;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            schema = new parquets_1.ParquetSchema({ sample: { type: 'UTF8' }, hgnc: { type: 'UTF8' }, value: { type: 'DOUBLE' } });
                            data = matrix.reduce(function (p, gene) {
                                var hgnc = gene.data.symbol;
                                Object.keys(gene.data)
                                    .filter(function (v) { return v !== 'hgnc' && v !== 'symbol'; })
                                    .forEach(function (sample) {
                                    var value = gene.data[sample];
                                    p.push({ sample: sample, hgnc: hgnc, value: value });
                                });
                                return p;
                            }, new Array());
                            return [4 /*yield*/, parquets_1.ParquetWriter.openFile(schema, './src/output/' + filename.replace('data.raw.json', 'data.parquet'))];
                        case 1:
                            file = _a.sent();
                            i = 0;
                            _a.label = 2;
                        case 2:
                            if (!(i < data.length)) return [3 /*break*/, 5];
                            return [4 /*yield*/, file.appendRow(data[i])];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            i++;
                            return [3 /*break*/, 2];
                        case 5: return [4 /*yield*/, file.close()];
                        case 6:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return new Promise(function (resolve, reject) {
            resolve();
        });
    };
    WriteParquet.writeMatriciesParquet = function () {
        var writeFile = function (filename, matrix) {
            return __awaiter(this, void 0, void 0, function () {
                var schema, data, file, i;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            schema = new parquets_1.ParquetSchema({ sample: { type: 'UTF8' }, hgnc: { type: 'UTF8' }, value: { type: 'DOUBLE' } });
                            data = matrix.reduce(function (p, gene) {
                                var hgnc = gene.data.symbol;
                                Object.keys(gene.data)
                                    .filter(function (v) { return v !== 'hgnc' && v !== 'symbol'; })
                                    .forEach(function (sample) {
                                    var value = gene.data[sample];
                                    p.push({ sample: sample, hgnc: hgnc, value: value });
                                });
                                return p;
                            }, new Array());
                            return [4 /*yield*/, parquets_1.ParquetWriter.openFile(schema, './src/output/' + filename.replace('data.raw.json', 'data.parquet'))];
                        case 1:
                            file = _a.sent();
                            i = 0;
                            _a.label = 2;
                        case 2:
                            if (!(i < data.length)) return [3 /*break*/, 5];
                            return [4 /*yield*/, file.appendRow(data[i])];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            i++;
                            return [3 /*break*/, 2];
                        case 5: return [4 /*yield*/, file.close()];
                        case 6:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return new Promise(function (resolve, reject) {
            var files = fs_1.default
                .readdirSync('./src/output')
                .filter(function (v) { return v.indexOf('matrix-') === 0; })
                .filter(function (v) { return v.indexOf('raw.json') !== -1; });
            var samples = IO_1.IO.ReadJson('./src/output/', 'sample.data.id.json');
            Promise.all(files.map(function (v) {
                var matrix = IO_1.IO.ReadJson('./src/output/', v).filter(function (v) { return v.error.length === 0; });
                return writeFile(v, matrix);
            })).then(function () {
                console.log('Write Parquet Matrix Files');
                resolve();
            });
            resolve(); // Jenny this needs to be fixed.  I put this in as a hack
        });
    };
    return WriteParquet;
}());
exports.WriteParquet = WriteParquet;
//# sourceMappingURL=step5_parquet.js.map