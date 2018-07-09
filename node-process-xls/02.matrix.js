// Libs
const util = require('./util');
const fs = require('fs');

// Globals
const manifest = [];

// Loop Through Matrix Files
fs.readdirSync(process.cwd() + '/data')
  .map(v => v.toLowerCase())
  .filter(v => v.indexOf('matrix') === 0)
  .forEach(file => {
    let data = util.loadCsv(file);

    // Extract FileType From Cell 0:0 - ADD CHECK HERE THAT IT IS VALID
    const fileType = data[0][0];

    const output = {
      ids: null,
      genes: null,
      values: null
    };

    // Format Ids
    output.ids = data.shift().map(v => util.formatKey(v));
    output.ids.shift(); // Remove 0:0 Cell
    output.ids = output.ids.filter(v => v !== null && v !== '');

    // Format Genes
    output.genes = data.map(v => util.formatHgnc(v.shift()));
    output.genes = output.genes.filter(v => v !== null && v !== '');

    // Convert Values To Numbers (could be better, save index of id and gene and do all lookups using that...)
    output.values = data
      .map(row => row.map(cell => util.formatFloat(cell)).filter(v => v !== null))
      .filter(v => v.length);

    // Serialize To Json + Save
    const fileName = file.replace('.csv', '.json');
    manifest.push({
      name: fileName.replace(/-/gi, ' ').replace('.json', ''),
      file: fileName,
      dataType: fileType
    });
    fs.writeFileSync(process.cwd() + '/output/' + fileName, JSON.stringify(output), {
      encoding: 'UTF-8'
    });
  });

fs.writeFileSync(process.cwd() + '/output/manifest-matrix.json', JSON.stringify(manifest), {
  encoding: 'UTF-8'
});
