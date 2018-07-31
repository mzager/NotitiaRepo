const _ = require('lodash');
const fs = require('fs');
const files = fs.readdirSync(process.cwd()+'/data').map(v => v.toLowerCase());
const util = require('./util.js');
const help = require('./helping.js');
var requirement = require('./DatasetRequirements.json');
var getFileType = (filename) => filename.replace('.csv','').split('-')[0].split('_')[0];

let evaluation = {};
var uniq_file_types = _.uniq(files.map(file => getFileType(file)));
uniq_file_types.forEach(t => {
    var obj = {};
    obj.pass = true;
    obj.warning = false;
    obj.error = [];
    var related_files = files.filter(f => getFileType(f) === t);
    var fileobj = {};
    related_files.forEach(f => {
        fileobj[f] = {};
        fileobj[f]['pass'] = true;
        fileobj[f]['warning'] = false;
    });
    obj['files'] = fileobj;
    evaluation[t] = obj;
});

/*
    generate validation result in json format
    Error will end the validatioan
    Warning will not
*/

/* After spliting the excel file into multiple csv files
    Check the existance of file types
    required: patient, psmap, at least one matrix | mutation
*/

/* 
   check if all the types are validated 
   return the files that do not fit into current data model, or there is typo in the first token
   valid types : ['patient', 'sample', 'event', 'geneset', 'matrix', 'mutation']
*/
var file_types_validation = function(uniq_file_types, requirement, evaluation) {
    valid_types = Object.keys(requirement);
    return uniq_file_types.filter(t => {
        valid_types.indexOf(t) === -1
    }).map(t => {
        evaluation[t]['files'];
    });
};

var file_types_validation_res = file_types_validation(uniq_file_types, requirement, evaluation);
if (file_types_validation_res.length > 0 ){
    evaluation['warning'] = true;
    evaluation['error'] = evaluation['error'].concat({'file_types_valiation':'The following files cannot be incorporated into Oncoscape V3.' + file_types_validation_res});
} else {
    evaluation['comments'] = 'All file types can be accomodated by current Oncoscape V3 data';
}

var file_existant = function(evaluation) {
    if (!'patient' in evaluation && !'sample' in evaluation) {
        evaluation['pass'] = false;
        evaluation['warning'] = false;
        evaluation['error'] = evaluation['error'].concat({'file_existant':'PATIENT or SAMPLE table does not exist.'});
    } else if (!'matrix' in evaluation && !'mutation' in evaluation) {
        evaluation['warning'] = true;
        evaluation['error'] = evaluation['error'].concat({'molecular_data_existant': 'Do not have molecular data to initiate plotting.'});
        evaluation['available_tools'] = ['spreadsheet'];
    }
};



/*
    Sheet level validation
    --- since the serialization doesn't take long, this step of validation can be performed after the serialization ---
    Targets:
    - patient
    - sample
    - events
    - matrix
    - mutation
    - genesets

    Items to check: 
    - required fields
    - column uniqueless
    - matrix.genes uniqueless
    - overlapping: 
        - patient <-> sample
        - patient <-> events
        - sample <-> matrix/mutation
        - gene symbols from [matrix, mutations] <-> HGNC list
        - genesets <-> HGNC list
*/ 
let ids = {};
// TODO: get HGNC list from Michael
ids.hgnc = [];
files.forEach(f => {
        if (getFileType(f) === 'patient') {
            var data = util.loadCsv(f);
            var pid_ind = util.shiftColumns(data).indexOf('PATIENTID');
            ids['pids'] = data.map(d => d[pid_ind]);
        } else if (getFileType(f) === 'sample') {
            var data = util.loadCsv(f);
            var sid_ind = util.shiftColumns(data).indexOf('SAMPLEID');
            ids['sids'] = data.map(d => d[sid_ind]); 
        }
     });



var sheet_checking_fn = {
    PatientId_overlapping : function(data, type, cols, pid_ref, gene_ref, sid_ref) {
        var pid_ind = cols.indexOf('PATIENTID');
        return help.overlapping(data.map(d => d[pid_ind]), pid_ref); 
    },
    Check_Gene_Symbols : function(data, type, cols, pid_ref, gene_ref, sid_ref) {
        switch(type) {
            case 'geneset':
                return data.map(d => {
                    return help.overlapping(d, gene_ref);
                });
                break;
            case 'matrix':
                return help.overlapping(data.map(d => d[0]), gene_ref);
            case 'mutation':
                var g_ind = cols.indexOf('HGNC_ID');
                return help.overlapping(data.map(d => d[g_ind]), gene_ref);
        }
    },
    SampleId_overlapping : function(data, type, cols, pid_ref, gene_ref, sid_ref) {
        switch (type) {
            case 'mutation':
                var sid_ind = cols.indexOf('SAMPLEID');
                return help.overlapping(data.map(d => d[sid_ind]), sid_ref);
                break;
            case 'matrix':
                return help.overlapping(cols, sid_ref);
                break;
        }
    },
    check_row_uniqueness : function(data, type, cols, pid_ref, gene_ref, sid_ref) {
        return help.check_uniqueness(data.map(d => d[0]));
    }
};

files.forEach(f =>{
    console.log(f);
    var data = util.loadCsv(f);
    var cols = util.shiftColumns(data);
    var cols_upper = cols.map(k => k.toUpperCase());
    data = util.removeExtraCols(data, cols.length);
    // data = util.fillBlankNull(data);
    // data = util.removeExtraRows(data, cols.length);
    var rows = util.shiftColumns(data);
    console.log('size of', f, ':', data.length, 'x', data[0].length);

    // Generic column names unique checking:
    if(!help.check_uniqueness(cols)) {
        evaluation[type]['files'][f]['warning'] = true;
        evaluation[type]['files'][f]['error'] = 'There is duplicated columns';
    };

    // Checking aginst Requirement config
    var type = getFileType(f);
    var r = requirement[type];
    if('required_fields' in r) {
        var notExistingCols = r['required_fields'].filter(k => cols_upper.indexOf(k) === -1);
        if(notExistingCols.length > 0) {
            evaluation[type]['files'][f]['warning'] = false;
            evaluation[type]['files'][f]['pass'] = false;
            evaluation[type]['files'][f]['required_fields'] = notExistingCols;
            evaluation[type]['files'][f]['error'] = evaluation[type]['files'][f]['error'] + '|' + f + 'does not container required fields';
        } else {
            evaluation[type]['files'][f]['warning'] = false;
            evaluation[type]['files'][f]['pass'] = true;
            evaluation[type]['files'][f]['required_fields'] = notExistingCols;
        }
    }
    if('unique_fields' in r) {
        var obj = {};
        var notUniq = [];
        r['unique_fields'].forEach(k => {
            var index = cols_upper.indexOf(k);
            var col_values = data.map(d=>d[index]);
            obj[k] = help.check_uniqueness(col_values);
            if(!obj[k]) notUniq = notUniq.concat(k);
        });
        evaluation[type]['files'][f]['unique_fields'] = obj;
        if(notUniq.length > 0) {
            evaluation[type]['files'][f]['warning'] = false;
            evaluation[type]['files'][f]['pass'] = false;
            evaluation[type]['files'][f]['unique_fields'] = notUniq;
            evaluation[type]['files'][f]['error'] = evaluation[type]['files'][f]['error'] + '|' + f + 'field(s) with replicated values';
        } else {
            evaluation[type]['files'][f]['warning'] = false;
            evaluation[type]['files'][f]['pass'] = true;
            evaluation[type]['files'][f]['unique_fields'] = notUniq;
        }
    }
    if('sheet_specific_checking' in r){
        var fun_arr = r['sheet_specific_checking']; 
        var pid_ref = ids.pids;
        var gene_ref = ids.hgnc;
        var sid_ref = ids.sids;
        fun_arr.forEach(fnstring => {
            console.log(fnstring);
            var fn = eval('sheet_checking_fn.' + fnstring);
            fn(data, type, cols, pid_ref, gene_ref, sid_ref);
        })
    }

});

fs.writeFile('evaluation.json', JSON.stringify(evaluation),(err) => console.error(err));