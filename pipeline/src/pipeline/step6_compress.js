"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IO_1 = require("./IO");
var fs = require('fs');
var zlib = require('zlib');
var WriteZips = /** @class */ (function () {
    function WriteZips() {
    }
    WriteZips.All = function () {
        // return new Promise((resolve, reject) => {
        var files = IO_1.IO.ReadJson('./src/output/', 'manifest.json')
            .files.map(function (v) { return v.file; })
            .concat(['manifest.json', 'log.json']);
        return Promise.all(files.map(function (file) {
            return new Promise(function (resolve, reject) {
                var gzip = zlib.createGzip({ level: 9 });
                var rstream = fs.createReadStream('./src/output/' + file);
                var wstream = fs.createWriteStream('./src/output/' + file + '.gz');
                rstream // reads from myfile.txt
                    .pipe(gzip) // compresses
                    .pipe(wstream) // writes to myfile.txt.gz
                    .on('finish', function () {
                    // finished
                    console.log('done compressing');
                    resolve();
                });
            });
        }));
    };
    return WriteZips;
}());
exports.WriteZips = WriteZips;
//# sourceMappingURL=step6_compress.js.map