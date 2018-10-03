"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var stream_1 = require("stream");
var TransformToLowerCase = /** @class */ (function (_super) {
    __extends(TransformToLowerCase, _super);
    function TransformToLowerCase() {
        return _super.call(this, { objectMode: true }) || this;
    }
    TransformToLowerCase.prototype._transform = function (data, encoding, done) {
        // const trim = /((")[ ]+)|([ ]+("))/g;
        this.push(data
            .toString()
            // .replace(trim, '')
            .toLowerCase());
        done();
    };
    return TransformToLowerCase;
}(stream_1.Transform));
exports.TransformToLowerCase = TransformToLowerCase;
//# sourceMappingURL=ToLowerCase.js.map