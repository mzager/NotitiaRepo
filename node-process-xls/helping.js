// Generic Functions
(function( ) {
    var datasetHelper = (function() {
   
        get_headers = (sheet, headerLineNum) => { 
                var loc = Object.keys(sheet).filter(k=>k[1]==headerLineNum && k.length==2 && sheet[k].t !== 'z');
                return loc.map(l=>sheet[l].v);
        }
    
        get_fieldValues = (sheet, headerLineNum, header) => { 
                var loc = Object.keys(sheet).filter(k=>k[1]==headerLineNum && k.length==2 && sheet[k].t !== 'z');
                var headers = loc.map(l=>sheet[l].v.toUpperCase());
                var re = /[A-Z]/gi;
                var header_loc = loc[headers.indexOf(header.toUpperCase())].match(re)[0];
                var found = Object.keys(sheet).filter(k=>k.match(re)[0] === header_loc);
                var value = found.map(l=>sheet[l]).filter(f=>'v' in f).map(f=>f.v);
                value.splice(0, headerLineNum);
                return value;
        }

        get_rowValues = (sheet, rowNumber) => {
            var re = /[0-9]+/gi;
            var loc = Object.keys(sheet).filter(k=>{
                if(k.match(re) !== null && 
                parseInt(k.match(re)[0]) === rowNumber &&
                sheet[k].t !== 'z'){
                    return k;
                }
            });
            return loc.map(l=>sheet[l].v);    
        }

        get_colValues = (sheet, headerLineNum, col ) => {
            var re = /[A-Z]+/gi;
            var index = 0;
            var loc = Object.keys(sheet).filter(k=>{
                if(k.match(re) !== null && 
                k.match(re)[0] === col &&
                sheet[k].t !== 'z'){
                    return k;
                }
            });
            loc.splice(0, headerLineNum);
            return loc.map(l=>sheet[l].v);
        }

        get_geneSetNames = (geneset_sheet) => {
            var re = /[0-9]+/gi;
            var loc = Object.keys(geneset_sheet).filter(k=>k.match(re) !== null && parseInt(k.match(re)[0]) ===1 && geneset_sheet[k].t !=='z');
            return loc.map(l=>geneset_sheet[l].v);
        }

        check_uniqueness = (arr) => {
            return arr.length == new Set(arr).size;
        }

        field_existence = (header, requiredFieldArr ) => {
            var error = {};
            var header2Upper = header.map(h=>h.toUpperCase());
            error['field_existence'] = {
                'missing_fields': requiredFieldArr.filter(fn=>header2Upper.indexOf(fn)==-1)
            };
            return error;
        }

        overlapping = (array1, refArr ) => {
            var a = new Set(array1);
            var b = new Set(refArr);
            var intersection = new Set([...a].filter(x => b.has(x)));
            var difference = new Set([...a].filter(x => !b.has(x)));
            var intersectionPercentage = intersection.size/a.size * 100;
            var differencePercentage = difference.size/a.size * 100;
            return {'overlappedPercentage': intersectionPercentage,
                    'notInRefPercentage': differencePercentage,
                    'notInRef': difference};
        }

        getAllIndexes = (arr, val ) => {
            var indexes = [], i = -1;
            while ((i = arr.indexOf(val, i+1)) != -1){
                indexes.push(i);
            }
            return indexes;
        }

        Type_Category_inclusion = (sheet, _) => {
            var error = {};
            var subCategoryArr = this.get_fieldValues(sheet, 1, 'TYPE');
            var categoryArr = this.get_fieldValues(sheet, 1, 'CATEGORY');
            var err = {};
            _.uniq(subCategoryArr).forEach(sc=>{
                var cat =_.uniq(this.getAllIndexes(subCategoryArr, sc).map(ind=>categoryArr[ind]));
                if( cat.length > 1){
                    err[sc] = cat; 
                }
            });
            error['subCategoryMatchMultipleCategory'] = err;
            return error;
        }

      
      return {
          get_headers: get_headers,
          get_fieldValues: get_fieldValues,
          get_rowValues: get_rowValues,
          get_colValues: get_colValues,
          get_geneSetNames: get_geneSetNames,
          check_uniqueness: check_uniqueness,
          field_existence: field_existence,
          overlapping: overlapping,
          getAllIndexes: getAllIndexes,
          Type_Category_inclusion: Type_Category_inclusion
      };
    })();
  
    if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
      module.exports = datasetHelper;
    else
      window.datasetHelper = datasetHelper;
  
  })();
  