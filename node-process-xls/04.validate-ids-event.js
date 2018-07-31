const api = require('./api.js');
const files = api.io.readDir('output').filter(v => v.indexOf('event-') === 0);
const patientIdsPatientTab = new Set(api.io.readJson('output', '_patient-ids.json'));

// Loop Through Matrix Files
files.forEach(file => {
  const tab = file.substr(0, file.length - 4);
  const eventData = api.io.readCsv('output', file);
  const cols = eventData.shift().map(v => v.toLowerCase().trim());
  const patientIndex = cols.indexOf('patient id');

  // Verify Column Patient Id Exists
  if (patientIndex === -1) {
    api.log.error('Required Column Missing: Patient Id', tab);
    api.term();
  }

  // Verify patient Ids Map To Patient Tab
  const patientIds = eventData.map(v => v[patientIndex].toLowerCase().trim());
  const difference = api.sets.getDifference(patientIdsPatientTab, new Set(patientIds));
  if (difference.onlyInA.size) {
    api.log.warn('Missing Patient Id(s): ' + Array.from(difference.onlyInA).join(', '), tab);
  }
  if (difference.onlyInB.size) {
    api.log.error('Unknown Patient Id(s): ' + Array.from(difference.onlyInB).join(', '), tab);
  }
});
