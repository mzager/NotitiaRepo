const api = require('./api.js');
const sampleData = api.io.readCsv('output', 'sample.csv');
const sampleColumns = sampleData.shift().map(v => v.toLowerCase().trim());

const patientIndex = sampleColumns.indexOf('patient id');
const sampleIndex = sampleColumns.indexOf('sample id');

// Verify That Column Patient Id Exists
if (patientIndex === -1) {
  api.log.error('Required Column Missing: Patient Id From WorkSheet Sample', 'sample');
  api.term();
}

// Verify That Column Sample Id Exists
if (sampleIndex === -1) {
  api.log.error('Required Column Missing: Sample Id From WorkSheet Sample', 'sample');
  api.term();
}

// Extract Ids
const sampleIds = sampleData.map(v => v[sampleIndex].toLowerCase().trim());

// Verify There Are No Dulicate Sample Ids
const dups = api.sets.getDuplicates(sampleIds);
if (dups.length) {
  api.log.error('Duplicate Sample Id(s) Error: ' + dups.join(', '), 'sample');
}

// Verify Patient Ids Map To Patient Tab
const patientIdsPatientTab = new Set(api.io.readJson('output', '_patient-ids.json'));
const patientIdsSampleTab = new Set(sampleData.map(v => v[patientIndex].toLowerCase().trim()));
const difference = api.sets.getDifference(patientIdsPatientTab, new Set(patientIdsSampleTab));
if (difference.onlyInA.size) {
  api.log.warn('Missing Patient Id(s): ' + Array.from(difference.onlyInA).join(', '), 'sample');
}
if (difference.onlyInB.size) {
  api.log.error('Unknown Patient Id(s): ' + Array.from(difference.onlyInB).join(', '), 'sample');
}

// Write Ids To Temp File
api.io.writeJson('output', '_sample-ids.json', Array.from(new Set(sampleIds)));
