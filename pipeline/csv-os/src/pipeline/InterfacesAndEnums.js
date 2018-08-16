"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var eDataType;
(function (eDataType) {
    eDataType[eDataType["Number"] = 1] = "Number";
    eDataType[eDataType["String"] = 2] = "String";
    eDataType[eDataType["ID"] = 4] = "ID";
    eDataType[eDataType["NA"] = 8] = "NA";
})(eDataType = exports.eDataType || (exports.eDataType = {}));
var eSheet;
(function (eSheet) {
    eSheet[eSheet["PATIENT"] = 1] = "PATIENT";
    eSheet[eSheet["SAMPLE"] = 2] = "SAMPLE";
    eSheet[eSheet["MATRIX"] = 4] = "MATRIX";
    eSheet[eSheet["EVENT"] = 8] = "EVENT";
    eSheet[eSheet["MUTATION"] = 16] = "MUTATION";
})(eSheet = exports.eSheet || (exports.eSheet = {}));
var eConstraint;
(function (eConstraint) {
    eConstraint[eConstraint["UNIQUE"] = 1] = "UNIQUE";
    eConstraint[eConstraint["REQUIRED"] = 2] = "REQUIRED";
    eConstraint[eConstraint["INVALID_VALUE"] = 4] = "INVALID_VALUE";
    eConstraint[eConstraint["SINGLE_VALUE"] = 8] = "SINGLE_VALUE";
    eConstraint[eConstraint["NON_NUMERIC"] = 16] = "NON_NUMERIC";
    eConstraint[eConstraint["UNKNOWN_TYPE"] = 32] = "UNKNOWN_TYPE";
    eConstraint[eConstraint["UNINFORMATIVE"] = 64] = "UNINFORMATIVE";
})(eConstraint = exports.eConstraint || (exports.eConstraint = {}));
var eAction;
(function (eAction) {
    eAction[eAction["REM"] = 1] = "REM";
    eAction[eAction["MOD"] = 2] = "MOD";
})(eAction = exports.eAction || (exports.eAction = {}));
var eElement;
(function (eElement) {
    eElement[eElement["SHEET"] = 1] = "SHEET";
    eElement[eElement["COLUMN"] = 2] = "COLUMN";
    eElement[eElement["ROW"] = 4] = "ROW";
    eElement[eElement["GENE"] = 16] = "GENE";
})(eElement = exports.eElement || (exports.eElement = {}));
//# sourceMappingURL=InterfacesAndEnums.js.map