"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var IO_1 = require("./IO");
var fs = require('fs');
var AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' });
var s3 = new AWS.S3({ apiVersion: '2006-03-01' });
var ddb = new AWS.DynamoDB({ apiVersion: '2012-10-08' });
var uuidv1 = require('uuid/v1');
var Deploy = /** @class */ (function () {
    function Deploy() {
    }
    Deploy.All = function (name, site, description) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            IO_1.IO.DeleteArtifacts().then(function () {
                var projectId = site + '-' + uuidv1().replace(/\s/gi, '');
                // const projectId = 'acsp-e484b460-a0bf-11e8-9654-2973b6f27a97';
                _this.CreateDynamoRecord('michael@zager.co', projectId, name, site, description, true, true, false, 'Exempt');
                _this.CreateS3Bucket(projectId).then(resolve);
            });
        });
    };
    Deploy.CreateS3Bucket = function (projectId) {
        return new Promise(function (resolve, reject) {
            s3.listObjectsV2({
                Bucket: 'oncoscape-datasets',
                Delimiter: '/',
                Prefix: 'datasets/',
                EncodingType: 'url'
            }, function (err, data) {
                var folderNames = data.CommonPrefixes.map(function (v) { return v.Prefix.split('/')[1]; });
                if (folderNames.indexOf(projectId)) {
                    console.log('GUID ALREADY EXISTS.. This is pretty much impossible other than during testing');
                }
                var files = IO_1.IO.ReadZips();
                Promise.all(files.map(function (file) {
                    return new Promise(function (resolve, reject) {
                        var rstream = fs.createReadStream('./src/output/' + file);
                        var params = {
                            Bucket: 'oncoscape-datasets',
                            Key: 'datasets/' + projectId + '/' + file,
                            ContentType: 'application/json',
                            ContentEncoding: 'gzip',
                            ACL: 'public-read',
                            Body: rstream
                        }; // Remove ACL For Production
                        var options = { partSize: 10 * 1024 * 1024, queueSize: 5 };
                        s3.upload(params, options, function (err, data) {
                            console.log(data.Location);
                            resolve();
                        });
                    });
                })).then(function () {
                    resolve();
                });
            });
        });
    };
    Deploy.CreateDynamoRecord = function (email, projectId, name, site, description, isPublic, isHuman, isPhi, reviewType, reviewNumber, role) {
        if (reviewNumber === void 0) { reviewNumber = 'NA'; }
        if (role === void 0) { role = 'ADMIN'; }
        return new Promise(function (reject, resolve) {
            var ddbItem = {
                TableName: 'datasets',
                Item: {
                    email: { S: email },
                    project: { S: projectId + '|' + role },
                    status: { S: 'UPLOAD' },
                    content: {
                        M: {
                            site: { S: site },
                            name: { S: name },
                            description: { S: description },
                            isPublic: { BOOL: isPublic },
                            reviewType: { S: reviewType },
                            isHuman: { BOOL: isHuman },
                            isPhi: { BOOL: isPhi },
                            reviewNumber: { S: reviewNumber }
                        }
                    }
                }
            };
            ddb.putItem(ddbItem, function (err, data) {
                var d = data;
                var e = err;
                if (err) {
                    console.log('Error', err);
                }
                else {
                    console.log('Success', data);
                }
            });
        });
    };
    return Deploy;
}());
exports.Deploy = Deploy;
//# sourceMappingURL=step7_deploy.js.map