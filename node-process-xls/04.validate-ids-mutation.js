const api = require('./api.js');
const files = api.io.readDir('output').filter(v => v.indexOf('mutation') === 0);
const sampleIdsSampleTab = new Set(api.io.readJson('output', '_sample-ids.json'));

// Loop Through Matrix Files
files.forEach(file => {
  const tab = file.substr(0, file.length - 4);
  const mutationData = api.io.readCsv('output', file);
  const cols = mutationData.shift().map(v => v.toLowerCase().trim());
  const sampleIndex = cols.indexOf('sample id');

  // Verify Column Sample Id Exists
  if (sampleIndex === -1) {
    api.log.error('Required Column Missing: Sample Id', tab);
    api.term();
  }

  // Verify Sample Ids Map To Sample Tab
  const sampleIds = mutationData.map(v => v[sampleIndex].toLowerCase().trim());
  const difference = api.sets.getDifference(sampleIdsSampleTab, new Set(sampleIds));
  if (difference.onlyInA.size) {
    api.log.warn('Missing Sample Id(s): ' + Array.from(difference.onlyInA).join(', '), tab);
  }
  if (difference.onlyInB.size) {
    api.log.error('Unknown Sample Id(s): ' + Array.from(difference.onlyInB).join(', '), tab);
  }
});
