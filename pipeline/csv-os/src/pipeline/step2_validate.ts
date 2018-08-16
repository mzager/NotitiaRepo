import { IO } from './IO';
import { eDataType, eAction, eElement, eConstraint, iTest } from './InterfacesAndEnums';

export class Validate {
  public static Run(): Promise<any> {
    return new Promise((resolve, reject) => {
      const genes = IO.ReadGenes();
      const mutations = IO.ReadMutations();
      this.processPatient('./src/output/patient.csv').then((patientIds: Array<string>) => {
        this.processSample('./src/output/sample.csv', patientIds).then((sampleIds: Array<string>) => {
          IO.ReadEventFiles('./src/output').then(files => {
            console.log('events');
            Promise.all(
              files.map(file => {
                return this.Event('./src/output/', file, patientIds, sampleIds);
              })
            ).then(v => {
              console.log('muts');
              IO.ReadMutationFiles('./src/output').then(files => {
                Promise.all(
                  files.map(file => {
                    return this.Mutation('./src/output/', file, sampleIds, genes, mutations);
                  })
                ).then(v => {
                  console.log('mtx');
                  IO.ReadMatrixFiles('./src/output').then(files => {
                    Promise.all(
                      files.map(file => {
                        return this.Matrix('./src/output/', file, sampleIds, genes);
                      })
                    ).then(v => {
                      resolve();
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  }
  private static ExtractPropertyValues(inputStream: Highland.Stream<iTest>, prop: string): Promise<Array<string>> {
    return new Promise((resolve, reject) => {
      prop = prop.toLowerCase().trim();
      inputStream
        .filter(v => v.error.length === 0)
        .reduce(new Array<string>(), (p, c) => {
          p.push(c.data[prop]);
          return p;
        })
        .toArray(v => {
          resolve(v[0]);
        });
    });
  }
  public static Mutation(path: string, file: string, sampleIds: Array<string>, genes: Array<string>, mutations: Array<string>): Promise<any> {
    return new Promise((resolve, reject) => {
      // Base Files Name
      const baseFileName = file.replace('.csv', '');
      // Load & Preform Inital Tests
      const results = IO.loadCsv(path + file)
        .map<iTest>(Test.requireProperties(['sample id', 'hgnc', 'variant']))
        .map<iTest>(Test.propertyValuesInSet('sample id', sampleIds))
        .map<iTest>(Test.propertyValuesInSet('type', mutations))
        .map<iTest>(Test.resolveGenes());

      // Write Initial Data
      IO.WriteLog(baseFileName + '.data.log.json', results.observe());
      IO.WriteMutation(baseFileName + '.data.raw.json', results.observe());
      console.log(baseFileName + '.data.log.json');
      console.log(baseFileName + '.data.raw.json');

      // Load Meta Data
      IO.loadMetadata(results, ['sample id', 'hgnc', 'variant']).then(metadata => {
        const results = metadata
          .map<iTest>(Test.metaFieldsWithOneValue())
          .map<iTest>(Test.metaFieldLabels())
          .map<iTest>(Test.metaDataType());

        // Write Meta Data
        console.log(baseFileName + '.meta.log.json');
        console.log(baseFileName + '.meta.raw.json');
        Promise.all([IO.WriteLog(baseFileName + '.meta.log.json', results.observe()), IO.WriteJson(baseFileName + '.meta.raw.json', results)]).then(() => resolve());
      });
    });
  }
  public static Event(path: string, file: string, patientIds: Array<string>, sampleIds: Array<string>): Promise<any> {
    return new Promise((resolve, reject) => {
      // Base Files Name
      const baseFileName = file.replace('.csv', '');
      // Load & Preform Inital Tests
      const results = IO.loadCsv(path + file)
        .map<iTest>(Test.requireProperties(['patient id', 'start', 'end']))
        .map<iTest>(Test.propertyValuesInSet('patient id', patientIds));

      // Write Initial Data
      IO.WriteLog(baseFileName + '.data.log.json', results.observe());
      IO.WriteEvent(baseFileName + '.data.raw.json', results.observe());
      console.log(baseFileName + '.data.log.json');
      console.log(baseFileName + '.data.raw.json');

      // Load Meta Data
      IO.loadMetadata(results, ['patient id', 'start', 'end']).then(metadata => {
        const results = metadata
          .map<iTest>(Test.metaFieldsWithOneValue())
          .map<iTest>(Test.metaFieldLabels())
          .map<iTest>(Test.metaDataType());

        // Write Meta Data
        console.log(baseFileName + '.meta.log.json');
        console.log(baseFileName + '.meta.raw.json');
        Promise.all([IO.WriteLog(baseFileName + '.meta.log.json', results.observe()), IO.WriteJson(baseFileName + '.meta.raw.json', results)]).then(() => resolve());
      });
    });
  }
  public static Matrix(path: string, file: string, sampleIds: Array<string>, genes: Array<string>): Promise<any> {
    return new Promise((resolve, reject) => {
      // Base Files Name
      const baseFileName = file.replace('.csv', '');
      // Load & Preform Initial Tests
      const results = IO.loadCsv(path + file)
        .map<iTest>(Test.requireProperties(['hgnc']))
        .map<iTest>(Test.uniqueProperties(['hgnc']))
        .map<iTest>(Test.resolveGenes());
      // Write Data
      Promise.all([
        IO.WriteLog(
          baseFileName + '.data.log.json',
          results.observe().map(v => {
            v.data = { hgnc: v.data.hgnc, symbol: v.data.symbol };
            return v;
          })
        ),
        IO.WriteMatrix(baseFileName + '.data.raw.json', results)
      ]).then(() => resolve()); // Write Molecular Data
    });
  }
  public static processSample(uri: string, patientIds: Array<string>): Promise<Array<string>> {
    return new Promise((resolve, reject) => {
      // Test Inital Data
      const results = IO.loadCsv(uri)
        .map<iTest>(Test.requireProperties(['patient id', 'sample id']))
        .map<iTest>(Test.uniqueProperties(['sample id']))
        .map<iTest>(Test.propertyValuesInSet('patient id', patientIds));
      // Write Inital Data
      IO.WriteLog('sample.data.log.json', results.fork());
      IO.WriteJson('sample.data.raw.json', results.fork());
      IO.WriteProperty('sample.data.id.json', results.fork(), 'sample id');
      console.log('sample.data.log.json');
      console.log('sample.data.raw.json');
      console.log('sample.data.id.json');

      // Load Meta Data
      IO.loadMetadata(results.fork(), ['patient id', 'sample id']).then(metadata => {
        const results = metadata
          .map<iTest>(Test.metaFieldsWithOneValue())
          .map<iTest>(Test.metaFieldLabels())
          .map<iTest>(Test.metaDataType());

        // Write Meta Data
        IO.WriteLog('sample.meta.log.json', results.observe());
        IO.WriteJson('sample.meta.raw.json', results);
        console.log('sample.meta.log.json');
        console.log('sample.meta.raw.json');
      });

      // Extract Ids + Resolve Promise
      this.ExtractPropertyValues(results.fork(), 'sample id').then(results => {
        resolve(results);
      });
    });
  }
  public static processPatient(uri: string): Promise<Array<string>> {
    return new Promise((resolve, reject) => {
      // Load Data + Preform Tests
      const results = IO.loadCsv(uri)
        .map<iTest>(Test.requireProperties(['patient id']))
        .map<iTest>(Test.uniqueProperties(['patient id']));

      // Write Data
      IO.WriteLog('patient.data.log.json', results.fork());
      IO.WriteJson('patient.data.raw.json', results.fork());
      IO.WriteProperty('patient.id.json', results.fork(), 'patient id');
      console.log('patient.data.log.json');
      console.log('patient.data.raw.json');
      console.log('patient.data.id.json');

      // Load Meta Data
      IO.loadMetadata(results.fork(), ['patient id']).then(metadata => {
        const results = metadata
          .map<iTest>(Test.metaFieldsWithOneValue())
          .map<iTest>(Test.metaFieldLabels())
          .map<iTest>(Test.metaDataType());

        // Write Meta Data
        IO.WriteLog('patient.meta.log.json', results.observe());
        IO.WriteJson('patient.meta.raw.json', results);
        console.log('patient.meta.log.json');
        console.log('patient.meta.raw.json');
      });

      // Extract Ids + Resolve Promise
      this.ExtractPropertyValues(results.fork(), 'patient id').then(results => {
        resolve(results);
      });
    });
  }
}

export class Test {
  /**
   * Map Function For Highland Stream
   * @param props Array of Required Object Property Names
   */
  public static requireProperties(props: Array<string>): (x: iTest) => iTest {
    props = props.map(v => v.trim().toLowerCase());
    return (obj: iTest) => {
      props.forEach(prop => {
        if (!obj.data.hasOwnProperty(prop)) {
          obj.error.push({
            action: eAction.REM,
            element: eElement.SHEET,
            constraint: eConstraint.REQUIRED,
            prop: prop,
            value: prop
          });
        }
      });
      return obj as iTest;
    };
  }

  /**
   * Map Function For Highland Stream
   * @param props names of column headers
   */
  public static uniqueProperties(props: Array<string>): (x: iTest) => iTest {
    props = props.map(v => v.trim().toLowerCase());
    const sets = props.reduce((p: any, c: string) => {
      p[c] = new Set<string>();
      return p;
    }, {});
    return (obj: iTest) => {
      props.forEach(prop => {
        const value = obj.data[prop];
        if (sets[prop].has(value)) {
          obj.error.push({
            action: eAction.REM,
            element: eElement.ROW,
            constraint: eConstraint.UNIQUE,
            prop: prop,
            value: value
          });
        } else {
          sets[prop].add(value);
        }
      });
      return obj as iTest;
    };
  }

  /**
   * Map Function For Highland Stream
   * @param props name of column header
   * @param values valid values for the column
   */
  public static propertyValuesInSet(prop: string, values: Array<string>): (x: iTest) => iTest {
    prop = prop.trim().toLowerCase();
    const vals = new Set(values.map(v => v.trim().toLowerCase()));
    return (obj: iTest) => {
      const value = obj.data[prop];
      if (!vals.has(value)) {
        obj.error.push({
          action: eAction.REM,
          element: eElement.ROW,
          constraint: eConstraint.INVALID_VALUE,
          prop: prop,
          value: value
        });
      }
      return obj as iTest;
    };
  }

  public static metaFieldLabels(): (x: iTest) => iTest {
    return (obj: iTest) => {
      obj.data.label = obj.data.name.replace(/[\W_]+/g, ' ');
      if (obj.data.label !== obj.data.name) {
        obj.info.push({
          action: eAction.MOD,
          element: eElement.COLUMN,
          constraint: eConstraint.INVALID_VALUE,
          prop: obj.data.name,
          value: obj.data.label
        });
      }
      return obj;
    };
  }

  public static propertyValues(inputStream: Highland.Stream<iTest>, prop: string): Promise<Array<string>> {
    return new Promise((resolve, reject) => {
      prop = prop.toLowerCase().trim();
      inputStream
        .filter(v => v.error.length === 0)
        .reduce(new Array<string>(), (p, c) => {
          p.push(c.data[prop]);
          return p;
        })
        .toArray(v => {
          resolve(v[0]);
        });
    });
  }

  public static metaFieldsWithOneValue(): (x: iTest) => iTest {
    return (obj: iTest) => {
      if (obj.data.values.length === 1) {
        obj.error.push({
          action: eAction.REM,
          element: eElement.COLUMN,
          constraint: eConstraint.SINGLE_VALUE,
          prop: obj.data.name,
          value: obj.data.values[0]
        });
      }
      return obj;
    };
  }

  public static metaDataType(): (x: iTest) => iTest {
    return (obj: iTest) => {
      // Aggregate Numeric and String Values in Each Property
      const distribution = obj.data.values.reduce(
        (p: { numbers: Array<number>; strings: Array<string> }, c: any) => {
          const sValue = c.trim().toLowerCase();
          if (!isNaN(parseFloat(sValue)) && isFinite(parseFloat(sValue))) {
            p.numbers.push(parseFloat(sValue));
          } else {
            p.strings.push(sValue);
          }
          return p;
        },
        { numbers: new Array<number>(), strings: new Array<string>() }
      );

      const numberValues = distribution.numbers.length;
      const stringValues = distribution.strings.length;
      const totalValues = numberValues + stringValues;
      if (stringValues > 0 && numberValues > 0) {
        // Few Values That will likely work well as descrete strings
        if (totalValues < 12) {
          // Only treat as numbers if there are no strings
          obj.data.type = stringValues === 0 ? eDataType.Number : eDataType.String;
        } else {
          // Here we have to start guessing... Lots of values
          const percentNumeric = numberValues / totalValues;
          const percentStric = stringValues / totalValues;
          if (stringValues <= 3) {
            obj.info.push({
              action: eAction.MOD,
              element: eElement.COLUMN,
              constraint: eConstraint.NON_NUMERIC,
              prop: obj.data.name,
              value: distribution.strings.join(',')
            });
            obj.data.type = eDataType.Number;
          } else if (percentNumeric >= 0.9) {
            obj.info.push({
              action: eAction.MOD,
              element: eElement.COLUMN,
              constraint: eConstraint.NON_NUMERIC,
              prop: obj.data.name,
              value: distribution.strings.join(',')
            });
            obj.data.type = eDataType.Number;
          } else {
            obj.error.push({
              action: eAction.REM,
              element: eElement.COLUMN,
              constraint: eConstraint.UNKNOWN_TYPE,
              prop: obj.data.name,
              value: totalValues.toString() + 'values, of which ' + Math.round(100 * percentNumeric).toString() + '% are numeric'
            });
            obj.data.type = eDataType.NA;
          }
        }
      } else if (stringValues === 0) {
        obj.data.type = eDataType.Number;
      } else {
        if (totalValues > 12) {
          obj.error.push({
            action: eAction.REM,
            element: eElement.COLUMN,
            constraint: eConstraint.UNINFORMATIVE,
            prop: obj.data.name,
            value: totalValues + ' string values'
          });

          obj.data.type = eDataType.NA;
        } else {
          obj.data.type = eDataType.String;
        }
      }
      return obj;
    };
  }

  // Resolve Gene Names
  public static geneMap: any = IO.ReadGenes();
  public static resolveGenes(): (x: iTest) => iTest {
    return (obj: iTest) => {
      const gene = obj.data.hgnc.toLowerCase().trim();
      if (this.geneMap[gene]) {
        const geneInfo = this.geneMap[gene];
        const symbol = geneInfo[0];
        const lookup = geneInfo[1];
        obj.data.symbol = geneInfo[0];
        if (lookup !== 'symbol') {
          obj.info.push({
            action: eAction.MOD,
            element: eElement.GENE,
            constraint: eConstraint.INVALID_VALUE,
            prop: gene,
            value: symbol + ' using ' + lookup
          });
        }
      } else {
        obj.error.push({
          action: eAction.REM,
          element: eElement.GENE,
          constraint: eConstraint.INVALID_VALUE,
          prop: gene,
          value: ''
        });
      }

      return obj as iTest;
    };
  }
}
