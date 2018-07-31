const api = require('./api.js');
const files = api.io.readDir('output').filter(v => v.indexOf('mutation') === 0);
const mutations = new Set(api.io.readJson('ref', 'mutations.json'));

// Loop Through  Files
files.forEach(file => {
  const tab = file.substr(0, file.length - 4);
  const mutationData = api.io.readCsv('output', file);
  const cols = mutationData.shift().map(v => v.toLowerCase().trim());
  const typeIndex = cols.indexOf('type');

  // Verify Column Type Exists
  if (typeIndex === -1) {
    api.log.error('Required Column Missing: Type', tab);
    api.term();
  }

  // Verify Type Map To Type Reference File
  const types = mutationData.map(v => v[typeIndex].toLowerCase().trim());
  const unknown = api.sets.getMinus(new Set(types), mutations);
  if (unknown.size) {
    api.log.warn('Unknown Mutation Type(s): ' + Array.from(unknown).join(', '), tab);
  }
});
