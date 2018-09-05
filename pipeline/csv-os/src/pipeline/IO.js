"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var ToLowerCase_1 = require("./transform/ToLowerCase");
var InterfacesAndEnums_1 = require("./InterfacesAndEnums");
var hl = __importStar(require("highland"));
var fs = __importStar(require("fs"));
var csv = __importStar(require("fast-csv"));
var json = require('big-json');
var IO = /** @class */ (function () {
    function IO() {
    }
    IO.ReadEventFiles = function (path) {
        return new Promise(function (resolve, reject) {
            fs.readdir(path, function (err, files) {
                resolve(files.filter(function (v) { return v.indexOf('event') === 0; }));
            });
        });
    };
    IO.ReadMutationFiles = function (path) {
        return new Promise(function (resolve, reject) {
            fs.readdir(path, function (err, files) {
                resolve(files.filter(function (v) { return v.indexOf('mutation') === 0; }));
            });
        });
    };
    IO.ReadMatrixFiles = function (path) {
        return new Promise(function (resolve, reject) {
            fs.readdir(path, function (err, files) {
                resolve(files.filter(function (v) { return v.indexOf('matrix') === 0; }));
            });
        });
    };
    IO.ReadLargeJson = function (path, file) {
        return new Promise(function (resolve, reject) {
            var readStream = fs.createReadStream(path + file);
            var parseStream = json.createParseStream();
            debugger;
            parseStream.on('data', function (pojo) {
                // => receive reconstructed POJO
                debugger;
            });
            readStream.pipe(parseStream);
        });
    };
    IO.ReadJson = function (path, file) {
        return JSON.parse(fs.readFileSync(path + file, 'UTF8'));
    };
    IO.ReadZips = function () {
        return fs.readdirSync('./src/output/').filter(function (v) { return v.endsWith('.gz'); });
    };
    IO.ReadMutations = function () {
        var file = fs.readFileSync('./src/ref/mutations.json', 'UTF8');
        var json = JSON.parse(file);
        return json;
    };
    IO.ReadMutationIdMap = function () {
        var file = fs.readFileSync('./src/ref/mutations.json', 'UTF8');
        var json = JSON.parse(file);
        var x = 1;
        return json.reduce(function (p, c) {
            x += x;
            p[c] = x;
            return p;
        }, {});
    };
    IO.DeleteArtifacts = function () {
        return new Promise(function (resolve, reject) {
            fs.readdir('./src/output/', function (err, files) {
                var filesToDelete = files.filter(function (v) { return !v.endsWith('.gz') && !v.endsWith('.md'); });
                filesToDelete.forEach(function (v) {
                    fs.unlinkSync('./src/output/' + v);
                });
                resolve();
            });
        });
    };
    IO.ReadGenes = function () {
        var file = fs.readFileSync('./src/ref/hgnc.json', 'UTF8');
        var json = JSON.parse(file);
        return json;
    };
    /**
     * Takes the result of a stream of value objects, transposes the object and properties and wraps in a TestVO
     * @param inputStream
     * @param omitFields Fields not to include in the transpose
     */
    IO.loadMetadata = function (inputStream, omitFields) {
        var omit = new Set(omitFields.map(function (v) { return v.trim().toLowerCase(); }));
        return new Promise(function (resolve, reject) {
            inputStream
                .filter(function (v) {
                // Remove Items With Errors
                return v.error.length === 0;
            })
                .reduce({}, function (meta, obj) {
                Object.keys(obj.data)
                    .filter(function (prop) { return !omit.has(prop); })
                    .forEach(function (prop) {
                    var value = obj.data[prop];
                    if (!meta.hasOwnProperty(prop)) {
                        meta[prop] = new Set();
                    }
                    meta[prop].add(value.trim().toLowerCase());
                });
                return meta;
            })
                .toArray(function (result) {
                var testVos = Object.keys(result[0])
                    .filter(function (v) { return !omit.has(v); })
                    .map(function (v) { return ({
                    data: {
                        name: v,
                        label: v,
                        values: Array.from(result[0][v]),
                        distribution: null,
                        type: InterfacesAndEnums_1.eDataType.NA
                    },
                    error: [],
                    info: []
                }); });
                resolve(hl.default(testVos));
            });
        });
    };
    /**
     * Loads A CSV File Into a Highland Stream, Converts Content To LowerCase,
     * Transforms Each Row Into A Object Wrapped In TestVo
     *
     * @param uri Location Of File
     * @api public
     */
    IO.loadCsv = function (uri) {
        return hl
            .default(fs
            .createReadStream(uri)
            .pipe(new ToLowerCase_1.TransformToLowerCase())
            .pipe(csv.default({
            headers: true,
            ignoreEmpty: true,
            discardUnmappedColumns: true,
            strictColumnHandling: false,
            trim: true,
            objectMode: true
        })))
            .map(function (obj) {
            return { data: obj, info: [], error: [] };
        });
    };
    /**
     *
     * @param uri File Name For Output
     * @param inputStream Stream to extract the
     */
    IO.WriteLog = function (uri, inputStream) {
        return new Promise(function (resolve, reject) {
            var outputStream = fs.createWriteStream('./src/output/' + uri);
            outputStream.write('[');
            outputStream.on('finish', function () { return resolve(); });
            inputStream
                .filter(function (v) { return v.error.length !== 0 || v.info.length !== 0; })
                .map(function (v) { return JSON.stringify(v); })
                .intersperse(',')
                .append(']')
                .pipe(outputStream);
        });
    };
    IO.WriteProperty = function (uri, inputStream, prop) {
        return new Promise(function (resolve, reject) {
            prop = prop.toLowerCase().trim();
            var outputStream = fs.createWriteStream('./src/output/' + uri);
            outputStream.on('finish', function () { return resolve(); });
            outputStream.write('[');
            inputStream
                .filter(function (v) { return v.error.length === 0; })
                .map(function (v) { return JSON.stringify(v.data[prop]); })
                .intersperse(',')
                .append(']')
                .pipe(outputStream);
        });
    };
    IO.WriteMeta = function (uri, inputStream) {
        return new Promise(function (resolve, reject) {
            var outputStream = fs.createWriteStream('./src/output/' + uri);
            outputStream.on('finish', function () { return resolve(); });
            outputStream.write('[');
            inputStream
                .filter(function (v) { return v.error.length === 0; })
                .filter(function (v) { return v.data.type !== InterfacesAndEnums_1.eDataType.ID; })
                .map(function (v) {
                var obj = {};
                obj[v.data.name] =
                    v.data.type === InterfacesAndEnums_1.eDataType.Number
                        ? v.data.values
                        : v.data.values.string;
                return JSON.stringify(obj);
            })
                .intersperse(',')
                .append(']')
                .pipe(outputStream);
        });
    };
    IO.WriteEvent = function (uri, inputStream) {
        return new Promise(function (resolve, reject) {
            var outputStream = fs.createWriteStream('./src/output/' + uri);
            outputStream.on('finish', function () { return resolve(); });
            outputStream.write('[');
            inputStream
                .filter(function (v) { return v.error.length === 0; })
                .map(function (v) {
                return JSON.stringify(v);
            })
                .intersperse(',')
                .append(']')
                .pipe(outputStream);
        });
    };
    IO.WriteMutation = function (uri, inputStream) {
        return new Promise(function (resolve, reject) {
            var outputStream = fs.createWriteStream('./src/output/' + uri);
            outputStream.on('finish', function () { return resolve(); });
            outputStream.write('[');
            inputStream
                .filter(function (v) { return v.error.length === 0; })
                .map(function (v) {
                return JSON.stringify(v);
            })
                .intersperse(',')
                .append(']')
                .pipe(outputStream);
        });
    };
    IO.WriteMatrix = function (uri, inputStream) {
        return new Promise(function (resolve, reject) {
            var outputStream = fs.createWriteStream('./src/output/' + uri);
            outputStream.on('finish', function () { return resolve(); });
            outputStream.write('[');
            inputStream
                .filter(function (v) { return v.error.length === 0; })
                .map(function (v) { return JSON.stringify(v); })
                .intersperse(',')
                .append(']')
                .pipe(outputStream);
        });
    };
    IO.WriteString = function (uri, content) {
        return new Promise(function (resolve, reject) {
            fs.writeFileSync('./src/output/' + uri, content);
            resolve();
        });
    };
    IO.WriteJson = function (uri, inputStream) {
        return new Promise(function (resolve, reject) {
            var outputStream = fs.createWriteStream('./src/output/' + uri);
            outputStream.on('finish', function () { return resolve(); });
            outputStream.write('[');
            inputStream
                .filter(function (v) { return v.error.length === 0; })
                .map(function (v) { return JSON.stringify(v); })
                .intersperse(',')
                .append(']')
                .pipe(outputStream);
        });
    };
    return IO;
}());
exports.IO = IO;
//# sourceMappingURL=IO.js.map