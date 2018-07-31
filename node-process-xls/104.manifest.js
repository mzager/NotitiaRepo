const fs = require('fs');

let files = JSON.parse(fs.readFileSync(process.cwd()+'/output/manifest-matrix.json','UTF-8'));
const output = {
    fields: JSON.parse(fs.readFileSync(process.cwd()+'/output/manifest-fields.json', 'UTF-8')),
    events: JSON.parse(fs.readFileSync(process.cwd()+'/output/manifest-events.json', 'UTF-8')),
    schema: {
        "dataset": "name",
        "events": "++, p",
        "patientSampleMap": "s, p",
        "patientMeta": "key",
        "patient": "p"
    },
    files: files
}
output.schema.patient += ','+Object.keys(output.fields).toString()
files.forEach(file => { 
    switch (file.dataType.trim().toLowerCase()){
        case 'rna':
            output.schema["rna"] = "m";
            output.schema["rnaMap"] = "s";
            break;
        case 'gistic':
            output.schema["gistic"] = "m";
            output.schema["gisticMap"] = "s";
            break;
        case 'gistic_threshold':
            output.schema["gisticthreshold"] = "m";
            output.schema["gisticthresholdMap"] = "s";
            break;
    }
});

files = fs.readdirSync(process.cwd()+'/output');
if (files.find(v => v === 'events.json')) {
    output.files.push( {
        "name": "events",
        "dataType": "events",
        "file": "events.json"
    });
}
if (files.find(v => v=== 'clinical.json')) {
    output.files.push({
        "name": "clinical",
        "dataType": "clinical",
        "file": "clinical.json"
    });
}
if (files.find(v => v==='psmap.json')) {
    output.files.push({
        "name": "psmap",
        "dataType": "psmap",
        "file": "psmap.json"
    });
}
if (files.find(v => v==='mutation.json')) {
    output.files.push({
        "name": "mut",
        "dataType": "mut",
        "file": "mutation.json"
    });
    output.schema["mut"] = "++, m, p, t"
}


files.filter(v => v.indexOf('manifest') === 0 ) .forEach(file => { 
    fs.unlinkSync(process.cwd()+'/output/'+file);
});
fs.writeFileSync(process.cwd()+'/output/manifest.json', JSON.stringify(output), {'encoding':'UTF-8'});