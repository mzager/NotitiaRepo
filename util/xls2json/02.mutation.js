// Libs
const util = require('./util');
const fs = require('fs');

// Load Data
let data = util.loadCsv('Mutation.csv');

// Extract Lookups
const cols = util.shiftColumns(data);
const indexes = util.extractColumnIndexes(cols, ['SAMPLE_ID', 'HGNC_ID', 'TYPE']);
const sids =  util.extractColumnValues(data, indexes.SAMPLE_ID, util.formatKey);
const genes = util.extractColumnValues(data, indexes.HGNC_ID, util.formatHgnc);

// Loop Through Data
let values = data.reduce( (p, c) => {

    // Skip If Unknown Mutation Type
    const mut = util.formatMut(c[indexes.TYPE]);
    if (mut === null) { return p; }

    // Combine SampleID + GeneId To Create Key
    const key = sids.indexOf(  util.formatKey(c[indexes.SAMPLE_ID])) + '-' + genes.indexOf( util.formatHgnc(c[indexes.HGNC_ID]));
    
    // If Key Exists Bitwise Add Else Set Default
    if (p.hasOwnProperty(key)){
        p[key] |= mut
    } else {
        p[key] = mut
    }
    return p;
}, {});

// Value = geneid + sampleid + bitmask
values = Object.keys(values).map(v => v + '-' + values[v])

// Output Object
const output = { 
    ids: sids,
    genes: genes,
    values: values
}

fs.writeFileSync(process.cwd()+'/output/mutation.json', JSON.stringify(output), {'encoding':'UTF-8'});