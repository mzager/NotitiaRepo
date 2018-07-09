const exceljs = require('exceljs');
const fs = require('fs');
const sharedStrings = [];
let writeStream;
let readStream = fs.createReadStream('source.xlsx');
let workbook = new exceljs.stream.xlsx.WorkbookReader();
workbook.on('shared-string', sharedString => {
  sharedStrings.push(sharedString.text);
});
workbook.on('entry', function(entry) {
  console.log('entry', entry);
});
workbook.on('worksheet', worksheet => {
  if (writeStream) {
    writeStream.end();
  }
  writeStream = fs.createWriteStream(worksheet.name + '.csv');
  worksheet.on('row', row => {
    const vals = row.values.map(v => {
      if (v.hasOwnProperty('sharedString')) {
        return sharedStrings[v.sharedString];
      }
      return v;
    });
    writeStream.write(vals.toString() + '\n');
  });
});
workbook.on('finished', () => {
  readStream = fs.createReadStream('source.xlsx');
  workbook.read(readStream, { worksheets: 'emit' });
});
workbook.read(readStream, { sharedStrings: 'emit' });
