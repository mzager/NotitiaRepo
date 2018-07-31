const api = require('./api.js');
const files = api.io.readDir('output').filter(v => v.indexOf('mutation') === 0);
const hgnc = api.io.readJson('ref', 'hgnc.json');

files.forEach(file => {
  const tab = file.substr(0, file.length - 4);
  const mutationData = api.io.readCsv('output', file);
  const cols = mutationData.shift().map(v => v.toLowerCase().trim());
  const hgncIndex = cols.indexOf('hgnc');

  // Verify Column Type Exists
  if (hgncIndex === -1) {
    api.log.error('Required Column Missing: HGNC', tab);
    api.term();
  }

  const genes = mutationData.map(v => v[hgncIndex].trim().toLowerCase()).map(gene => ({
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
