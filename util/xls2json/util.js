const fs = require('fs');

const mutationType = {
    'MISSENSE' : 1 << 0,
    'MISSENSE_MUTATION' : 1 << 0,
    'SILENT' : 1 << 1,
    'FRAME_SHIFT_DEL' : 1 << 2,
    'SPLICE_SITE' : 1 << 3,
    'NONSENSE_MUTATION' : 1 << 4,
    'FRAME_SHIFT_INS' : 1 << 5,
    'RNA' : 1 << 6,
    'IN_FRAME_DEL' : 1 << 7,
    'IN_FRAME_INS' : 1 << 8,
    'NONSTOP_MUTATION' : 1 << 9,
    'TRANSLATION_START_SITE' : 1 << 10,
    'DE_NOVO_START_OUTOFFRAME' : 1 << 11,
    'DE_NOVO_START_INFRAME' : 1 << 12,
    'INTRON' : 1 << 13,
    '3\'UTR' : 1 << 14,
    'IGR' : 1 << 15,
    '5\'UTR' : 1 << 16,
    'TARGETED_REGION' : 1 << 17,
    'READ-THROUGH' : 1 << 18,
    '5\'FLANK' : 1 << 19,
    '3\'FLANK' : 1 << 20,
    'SPLICE_SITE_SNP' : 1 << 21,
    'SPLICE_SITE_DEL' : 1 << 22,
    'SPLICE_SITE_INS' : 1 << 23,
    'INDEL' : 1 << 24,
    'R' : 1 << 25
};
exports.loadCsv = (file) => { 
    let data = fs.readFileSync( process.cwd()+'/data/'+file, 'UTF-8').split('\n').map(v => v.split('","'));
    data.forEach(v => { 
        v[0] = v[0].substring(1);
        v[v.length-1] =  v[v.length-1].substr(0,-1);
    });
    return data;
}

exports.extractColumnValues = (data, columnIndex, formatter) => { 
    return Array.from(new Set(data.map(v => formatter(v[columnIndex])))).filter(v => v !== '').filter(v => v !== null);
}
exports.formatHgnc = (value) => { 
    return value.toUpperCase().trim();
};

exports.formatKey = (value) => {
    if (value === undefined || value === null || value === '') { return null; }
    else {
        return value.trim().toLowerCase().replace(/\s/gi,'_');
    } 
}

exports.formatFloat = (value) => { 
    if (value === undefined || value === null || value === '') { return null; }
    const rv = parseFloat(value);
    return (isNaN(rv)) ? null : rv;
}

exports.formatMut = (value) => { 
    if (value === undefined || value === null || value === '') { return null; }
    value = value.toUpperCase().trim().replace(/\s/gi,'_')
    if (!mutationType.hasOwnProperty(value)) { return null; }
    return mutationType[value];
}

exports.shiftColumns = (value) => { 
    const rv = value.shift().map(v => exports.formatColumn(v)).filter(v => v !== '');
    return rv;
}
/**
 * Input: Columns, Array of column names
 * Output: Object Where Column Name = Index
 */
exports.extractColumnIndexes = (columns, value) =>  {
    const rv = value.reduce( (p, c) => { 
        p[c] = columns.indexOf(c);
        if (p[c] === -1) { throw Error('Unknown Column: ' + c); }
        return p;
    }, {});
    return rv;

}
exports.formatColumn = (value) => { 
    const rv = value.toUpperCase().trim().replace(/\s/gi,'_').replace(/\W/g, '');
    return rv;
}

exports.formatAttr = (value) => { 
    const rv = value.toUpperCase().trim().replace(/\s/gi,'_')
    return rv;
}

/*
formatHgnc = (value) => { 
    return value.toUpperCase().trim();
}
formatMutation = (value) => {
    return mutationType[value];
}
formatAttribute = (value) => { 
    if (value === undefined) { return ''; }
    return value.toUpperCase().trim().replace(/\s/gi,'_');
}
formatId = (value) => {
    if (value === undefined || value === null || value === '') {return null; }
    else {
        return value.trim().toLowerCase().replace(/\s/gi,'_');
    } 
}
formatValue = (value) => { 
    return value.trim().toUpperCase();
}


*/