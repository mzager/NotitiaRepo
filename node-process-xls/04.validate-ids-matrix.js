const api = require('./api.js');
const files = api.io.readDir('output').filter(v => v.indexOf('matrix-') === 0);
const sampleIdsSampleTab = new Set(api.io.readJson('output', '_sample-ids.json'));

// Loop Through Matrix Files
files.forEach(file => {
  const tab = file.substr(0, file.length - 4);
  const mtx = api.io.readCsv('output', file);
  const sampleIds = mtx[0].map(v => v.toLowerCase().trim());
  sampleIds.shift();

  // Check For Duplicate Sample Ids
  const dups = api.sets.getDuplicates(sampleIds);
  if (dups.length) {
    api.log.error('Duplicate Sample Id(s) Error: ' + dups.join(', '), tab);
  }

  // Verify Sample Ids Map To Sample Tab
  const difference = api.sets.getDifference(sampleIdsSampleTab, new Set(sampleIds));
  if (difference.onlyInA.size) {
    api.log.warn('Missing Sample Id(s): ' + Array.from(difference.onlyInA).join(', '), tab);
  }
  if (difference.onlyInB.size) {
    api.log.error('Unknown Sample Id(s): ' + Array.from(difference.onlyInB).join(', '), tab);
  }
});
