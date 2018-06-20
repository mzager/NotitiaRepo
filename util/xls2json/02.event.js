formatAttribute = (value) => { 
    return value.toUpperCase().trim().replace(/\s/gi,'_');
}
const fs = require('fs');
const files = fs.readdirSync(process.cwd()+'/data').map(v => v.toLowerCase()).filter(v => v.indexOf('event') === 0);
const eventMap = files.map(v => {  return v.split('-').filter(w => w !== 'event').map(v => v.replace('.csv','')) }).reduce( (p, c) => { 
        p[c[1]] = c[0]; return p; }, {});
    
let events = [];
files.forEach( (file, fileIndex) => { 
    data = fs.readFileSync( process.cwd()+'/data/'+file, 'UTF-8').split('\n').map(v => v.split('","'));
    data.forEach(v => { 
        v[0] = v[0].substring(1);
        v[v.length-1] =  v[v.length-1].substr(0,-1);
    });
    const cols = data.shift().map(v => formatAttribute(v));
    const pidIndex = cols.indexOf('PATIENT_ID');
    const startIndex = cols.indexOf('START_DATE');
    const stopIndex = cols.indexOf('STOP_DATE');

    if (pidIndex === -1 || startIndex === -1 || stopIndex === -1) {
        { throw new Error('Missing Key Field'); }
    }

    events = events.concat(data.map(v => { 
        const rv = [];
        rv.push(v[pidIndex]);
        rv.push(fileIndex);
        const startDate = parseFloat(v[startIndex]);
        let endDate = parseFloat(v[stopIndex]);
        if (isNaN(endDate)) { endDate = startDate; }
        rv.push(startDate);
        rv.push(endDate);
        rv.push(v.reduce( (p, c, i) => {
            if (i === pidIndex || i === startIndex || i === stopIndex) { return p; }
            const key = cols[i];
            if (key === '') { return p; }
            p[key] = c;
            return p;
        }, {}));
        return rv;
    }));
});

const output = {
    map: eventMap,
    data: events
};

// Serialize To Json + Save
fs.writeFileSync(process.cwd()+'/output/manifest-events.json', JSON.stringify(eventMap), {'encoding':'UTF-8'});
fs.writeFileSync(process.cwd()+'/output/events.json', JSON.stringify(output), {'encoding':'UTF-8'});
