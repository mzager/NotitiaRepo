const api = require('./api.js');
const files = api.io.readDir('output').filter(v => v.indexOf('matrix') === 0);
const hgnc = api.io.readJson('ref', 'hgnc.json');

files.forEach(file => {
  const tab = file.substr(0, file.length - 4);

  const matrixData = api.io.readCsv('output', file);
  matrixData.shift(); // Remove Header
  const genes = matrixData.map(v => v[0].trim().toLowerCase()).map(gene => ({
    orig: gene,
    match: hgnc.hasOwnProperty(gene) ? hgnc[gene] : [null, null]
  }));

  const unknown = genes
    .filter(v => !v.match[0])
    .map(v => v.orig)
    .sort();
  if (unknown.length) {
    api.log.warn('Unknown HGNC Symbol(s): ' + unknown.join(', '), tab);
  }

  const mapped = genes
    .filter(v => v.match[0])
    .filter(v => v.orig != v.match[0])
    .map(v => v.orig + '=' + v.match.join('|'));
  if (mapped.length) {
    api.log.warn('Converted HGNC Symbols(s): ' + mapped.join(', '), tab);
  }
});
