var AWS = require('aws-sdk');
var fs = require('fs');
var XLSX = require('xlsx');
var zlib = require('zlib');
var s3 = new AWS.S3();
var s3Stream = require('s3-upload-stream')(s3);
var compress = zlib.createGzip({ level: 9 });

var bucket = 'oncoscape-datasets';
var key = 'b13f39d3-b7de-4f02-ac11-48742e832202/source.xlsx';

var file = s3.getObject({ Bucket: bucket, Key: key }).createReadStream();
var buffers = [];
file.on(
  'data',
  (data => {
    buffers.push(data);
  }).bind(this)
);
file.on(
  'error',
  (err => {
    console.log(err);
  }).bind(this)
);
file.on(
  'finish',
  (() => {
    console.log('Read data into buffer');
    var buffer = Buffer.concat(buffers);
    var workbook = XLSX.read(buffer, { type: 'buffer' });
    console.log('Read data into workbook');
    workbook.SheetNames.forEach(sheetName => {
      console.log('Write data to ' + sheetName);
      XLSX.stream
        .to_csv(workbook.Sheets[sheetName])
        .pipe(compress)
        .pipe(fs.createWriteStream('zzz-' + sheetName + '.csv.gz'));
      // .pipe(
      //   s3Stream.upload({
      //     Bucket: bucket,
      //     Key: 'b13f39d3-b7de-4f02-ac11-48742e832202/' + sheetName + '.csv.gz'
      //   })
      // );
    });
    console.log('o');
  }).bind(this)
);
