"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var xlsx = __importStar(require("xlsx"));
var fs_1 = __importDefault(require("fs"));
var Xls2Csv = /** @class */ (function () {
    function Xls2Csv() {
    }
    Xls2Csv.Run = function () {
        return new Promise(function (resolve, reject) {
            var workbook = xlsx.readFile('./src/input/ASCp_Oncoscape_06292018.xlsx');
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