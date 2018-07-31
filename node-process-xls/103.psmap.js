// Libs
const util = require('./util');
const fs = require('fs');

// Load Data
let data = util.loadCsv('SAMPLE.csv');

const cols = util.shiftColumns(data);
const indexes = util.extractColumnIndexes(cols, ['PATIENTID','SAMPLEID']);

const output = data.reduce( (p, c) => { 
    const pid = util.formatKey(c[indexes.PATIENTID]);
    const sid = util.formatKey(c[indexes.SAMPLEID]);
    if (pid === null || sid === null) { return p; }
    if (!p.hasOwnProperty(pid)) { p[pid] = []; }
    p[pid].push(sid);
    return p;
}, {});

// Serialize To Json + Save
fs.writeFileSync(process.cwd()+'/output/psmap.json', JSON.stringify(output), {'encoding':'UTF-8'});