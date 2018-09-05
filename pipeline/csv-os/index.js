"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var step7_deploy_1 = require("./src/pipeline/step7_deploy");
var step2_validate_1 = require("./src/pipeline/step2_validate");
var step3_log_1 = require("./src/pipeline/step3_log");
var step4_json_1 = require("./src/pipeline/step4_json");
var step6_compress_1 = require("./src/pipeline/step6_compress");
var Startup = /** @class */ (function () {
    function Startup() {
    }
    Startup.main = function () {
        // Xls2Csv.Run().then(() => {
        step2_validate_1.Validate.Run().then(function () {
            step3_log_1.WriteLog.Run().then(function () {
                step4_json_1.WriteJson.Run().then(function (v) {
                    // WriteParquet.All().then(v => {
                    step6_compress_1.WriteZips.All().then(function (v) {
                        step7_deploy_1.Deploy.All().then(function (v) {
                            console.log('done');
                            EXIT = true;
                        });
                    });
                    // });
                });
            });
        });
        // });
        return 0;
    };
    return Startup;
}());
Startup.main();
var EXIT = false;
function wait() {
    if (!EXIT)
        setTimeout(wait, 1000);
}
wait();
//# sourceMappingURL=index.js.map