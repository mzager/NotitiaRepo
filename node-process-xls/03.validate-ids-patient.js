const api = require('./api.js');
const patientIds = api.io.readCsv('output', 'patient.csv');
const columns = patientIds.shift().map(v => v.toLowerCase().trim());
const idIndex = columns.indexOf('patient id');

// Verify That Column Patient Id Exists
if (idIndex === -1) {
  api.log.error('Required Column Missing: Patient Id From WorkSheet Patient');
  api.term();
}

// Verify That All Ids Are Unique
const ids = patientIds.map(v => v[idIndex].toLowerCase().trim());
const dups = api.sets.getDuplicates(ids);
if (dups.length > 0) {
  api.log.error('Duplicate Patient Id(s) Error: ' + dups.join(', '));
}

// Write Ids To Temp File
api.io.writeJson('output', '_patient-ids.json', Array.from(new Set(ids)));
