const api = require('./api.js');

// Convert All Files To Lower Case
api.io.filesToLowerCase('output');

// Get List Of Files
const files = api.io.readDir('output');

// Check Required Files
if (!files.indexOf('patient.csv')) {
  api.log.error('Required Worksheet Missing: Patient');
}
if (!files.indexOf('sample.csv')) {
  api.log.error('Required Worksheet Missing: Sample');
}

// Check For Unknown File Types
const knownPrefixes = ['sample.', 'patient.', 'event-', 'matrix-', 'mutation.'];
files.forEach(file => {
  if (
    !knownPrefixes.reduce((found, prefix) => {
      if (file.indexOf(prefix) === 0) {
        found = true;
      }
      return found;
    }, false)
  ) {
    api.log.warn('Ignoring Unknown Worksheet: ' + file.replace('.csv', ''));
  }
});
