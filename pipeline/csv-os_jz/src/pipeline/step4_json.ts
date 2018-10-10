import { iTest, eDataType } from './InterfacesAndEnums';
import { IO } from './IO';
import fs from 'fs';

export class WriteJson {
  public static Run(): Promise<any> {
    // Write All Json Files, Then Create Manifest
    console.log('HI');
    return Promise.all([
      this.writePatientJson('patient.json'),
      this.writeSampleJson('sample.json'),
      this.writePatientSampleJson('psmap.json'),
      this.writeMatriciesJson(),
      this.writeMutationJson(),
      this.writeEventsJson()
    ]).then(() => {
      console.log('DOWN WITH');
      this.writeManifestJson();
    });
  }

  public static writeManifestJson(): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log('manifest.json');
      const manifest: any = {};
      manifest.patient = IO.ReadJson('./src/output/', 'patient.json').fields;
      manifest.sample = IO.ReadJson('./src/output/', 'sample.json').fields;
      const dir = fs.readdirSync('./src/output');
      manifest.version = '3.1';
      manifest.schema = {
        dataset: 'name',
        patientSampleMap: 's, p',
        patientMeta: 'key',
        sampleMeta: 'key',
        patient:
          'p,' +
          Object.keys(manifest.patient)
            .map(v => v.replace(/ /gi, '_'))
            .join(','),
        sample:
          's,' +
          Object.keys(manifest.sample)
            .map(v => v.replace(/ /gi, '_'))
            .join(',')
      };
      if (manifest.schema.patient.length === 2) {
        manifest.schema.patient = 'p';
      }
      if (manifest.schema.sample.length === 2) {
        manifest.schema.sample = 's';
      }
      manifest.files = [
        {
          name: 'patient',
          dataType: 'patient',
          file: 'patient.json'
        },
        {
          name: 'sample',
          dataType: 'sample',
          file: 'sample.json'
        },
        {
          name: 'psmap',
          dataType: 'psmap',
          file: 'psmap.json'
        }
      ];

      if (dir.indexOf('events.json') !== -1) {
        manifest.events = IO.ReadJson('./src/output/', 'events.json').map;
        manifest.schema.events = '++, p';
        manifest.files.push({
          name: 'events',
          dataType: 'events',
          file: 'events.json'
        });
      } else {
        console.log('There is no events.json');
      }

      if (dir.indexOf('mut.json') !== -1) {
        manifest.events = IO.ReadJson('./src/output/', 'events.json').map;
        manifest.schema.mut = '++, m, p, t';
        manifest.files.push({
          name: 'mutations',
          dataType: 'mut',
          file: 'mut.json'
        });
      } else {
        console.log('there is not mut.json');
      }

      dir
        .filter(v => v.indexOf('matrix') === 0)
        .filter(v => v.indexOf('data.json') !== -1)
        .forEach(file => {
          const fname = file.replace('.data.json', '').replace('matrix-', '');
          manifest.schema[fname] = 'm';
          manifest.schema[fname + 'Map'] = 's';
          manifest.files.push({
            name: fname,
            dataType: 'matrix',
            file: file
          });
        });
      const str = JSON.stringify(manifest);
      IO.WriteString('manifest.json', str).then(() => {
        console.log('manifest.json');
        resolve();
      });
    });
  }

  public static writeMutationJson(): Promise<any> {
    return new Promise((resolve, reject) => {
      const files = fs
        .readdirSync('./src/output')
        .filter(v => v.indexOf('mutation') === 0)
        .filter(v => v.indexOf('data.raw.json') !== -1);

      if (files.length === 0) {
        return resolve();
      }

      files.forEach(v => {
        const data = IO.ReadJson('./src/output/', v).filter(
          (v: iTest) => v.error.length === 0
        ) as Array<iTest>;
        // gene-id-mut
        let agg = data.filter(v => v.error.length === 0).map(v => ({
          hgnc: v.data.symbol,
          sid: v.data['sample id'],
          type: v.data.variant
        }));
        const genes = Array.from(new Set(agg.map(v => v.hgnc)));
        const sids = Array.from(new Set(agg.map(v => v.sid)));
        const muts = Array.from(new Set(agg.map(v => v.type))).reduce(
          (p: any, c, i) => {
            p[c] = 1 * Math.pow(2, i);
            return p;
          },
          {}
        );
        const values = agg.reduce((p: any, c) => {
          // dont map this pass
          const gid = genes.indexOf(c.hgnc);
          const sid = sids.indexOf(c.sid);
          if (!p.hasOwnProperty(gid)) {
            p[gid] = {};
          }
          if (!p[gid].hasOwnProperty(sid)) {
            p[gid][sid] = 0;
          }
          p[gid][sid] |= muts[c.type];
          return p;
        }, {});
        const strGenes = '["' + genes.join('","') + '"]';
        const strSids = '["' + sids.join('","') + '"]';
        const strMuts = JSON.stringify(muts);
        const strValues =
          '["' +
          Object.keys(values).reduce((p: any, gid) => {
            p += Object.keys(values[gid]).reduce((ip: any, sid) => {
              ip += gid + '-' + sid + '-' + values[gid][sid] + '","';
              return ip;
            }, '');
            return p;
          }, '') +
          '"]';
        const vals = JSON.parse(strValues).filter((v: any) => v.length !== 3);
        const rv = {
          genes: JSON.parse(strGenes),
          ids: JSON.parse(strSids),
          muts: JSON.parse(strMuts),
          values: vals
        };
        const str = JSON.stringify(rv);
        IO.WriteString('mut.json', str).then(() => {
          console.log('mut.json');
          resolve();
        });
      });
    });
  }
  public static writeEventsJson(): Promise<any> {
    return new Promise((resolve, reject) => {
      const files = fs
        .readdirSync('./src/output')
        .filter(v => v.indexOf('event-') === 0)
        .filter(v => v.indexOf('data.raw.json') !== -1);

      if (files.length === 0) {
        return resolve();
      }
      // for (var )
      // IO.ReadJson(fs)
      // if (files.length === 0) {
      //   resolve();
      //   return;
      // }
      const eventMap: any = {};
      const eventIndex = new Array<string>();
      const allEvents = new Array<any>();
      Promise.all(
        files.map<Promise<any>>(file => {
          return new Promise((resolve, reject) => {
            const events = IO.ReadJson('./src/output/', file).filter(
              (v: iTest) => v.error.length === 0
            ) as Array<iTest>;
            const eventType = file.split('.')[0].split('-');
            // This event has no subcategory
            if (eventType.length === 2) {
              eventMap[eventType[1]] = 'Event';
              eventIndex.push(eventType[1]);
              // This event has a subcategory
            } else if (eventType.length === 3) {
              eventMap[eventType[2]] = eventType[1];
              eventIndex.push(eventType[2]);
            }
            const currentEventIndex = eventIndex.length - 1;
            allEvents.push(
              ...events.map(event => {
                const data = Object.keys(event.data)
                  .filter(key => {
                    return (
                      key !== 'patient id' && key !== 'start' && key !== 'end'
                    );
                  })
                  .reduce((p: any, c: any) => {
                    if (event.data[c].toString().trim() !== '') {
                      p[c] = event.data[c];
                    }
                    return p;
                  }, {});
                return [
                  event.data['patient id'],
                  currentEventIndex,
                  parseFloat(event.data.start),
                  parseFloat(event.data.end),
                  data
                ];
              })
            );
            resolve();
          });
        })
      ).then(() => {
        const str = JSON.stringify({
          map: eventMap,
          data: allEvents
        });
        IO.WriteString('events.json', str).then(() => {
          console.log('events.json');
          resolve();
        });
      });
    });
  }
  public static writeMatriciesJson(): Promise<any> {
    return new Promise((resolve, reject) => {
      const files = fs
        .readdirSync('./src/output')
        .filter(v => v.indexOf('matrix-') === 0)
        .filter(v => v.indexOf('raw.json') !== -1);
      const samples = IO.ReadJson('./src/output/', 'sample.data.id.json');
      Promise.all(
        files.map<Promise<any>>(v => {
          return new Promise<any>((resolve, reject) => {
            // IO.ReadLargeJson('./src/output/', v).then(data => {
            //   debugger;
            // });
            const matrix = IO.ReadJson('./src/output/', v).filter(
              (v: iTest) => v.error.length === 0
            ) as Array<iTest>;
            const samplesInMatrix = samples.filter((v: any) =>
              matrix[0].data.hasOwnProperty(v)
            );
            const dataGenes = matrix.reduce(
              (
                p: { data: Array<Array<number>>; genes: Array<string> },
                c: iTest
              ) => {
                const datum = c.data;
                p.genes.push(datum.symbol);

                p.data.push(
                  samplesInMatrix.map((sample: string) =>
                    parseFloat(datum[sample])
                  )
                );
                return p;
              },
              { data: [], genes: [] }
            );
            IO.WriteString(
              v.replace('data.raw.json', 'data.json'),
              JSON.stringify({
                ids: samplesInMatrix,
                genes: dataGenes.genes,
                data: dataGenes.data
              })
            ).then(() => {
              console.log(v.replace('data.raw.json', 'data.json'));
              resolve();
            });
          });
        })
      ).then(() => {
        resolve();
      });
    });
  }
  public static writeSampleJson(uri: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const meta = IO.ReadJson(
        './src/output/',
        'sample.meta.raw.json'
      ) as Array<iTest>;
      const fields = meta
        .filter(v => v.error.length === 0)
        .reduce((p: any, c: iTest) => {
          if (c.data.type === eDataType.Number) {
            const numericValues = c.data.values
              .map((v: any) => parseFloat(v))
              .filter((v: any) => !isNaN(v));
            const max = Math.max.apply(null, numericValues);
            const min = Math.min.apply(null, numericValues);
            p[c.data.label.trim().toLowerCase()] = { min: min, max: max };
          } else if (c.data.type === eDataType.String) {
            const stringValues = c.data.values.map((v: any) =>
              v
                .toString()
                .trim()
                .toLowerCase()
            );
            p[c.data.label.trim().toLowerCase()] = stringValues;
          }
          return p;
        }, {});
      const data = IO.ReadJson(
        './src/output/',
        'sample.data.raw.json'
      ) as Array<iTest>;
      const ids = data.map(v => v.data['sample id'].toLowerCase().trim());
      const fieldNames = meta
        .filter(v => v.error.length === 0)
        .map(v => v.data.name.trim().toLowerCase());
      const fieldLabels = meta
        .filter(v => v.error.length === 0)
        .map(v => v.data.label);
      const values = data.map(datum => {
        return fieldNames.map((fieldName, i) => {
          const lbl = fieldLabels[i];
          const value = datum.data[fieldName.trim().toLowerCase()];
          const f = fields[lbl.trim().toLowerCase()];
          return f.hasOwnProperty('min') ? parseFloat(value) : f.indexOf(value);
        });
      });
      const output = {
        ids: ids,
        fields: fields,
        values: values
      };
      IO.WriteString('sample.json', JSON.stringify(output)).then(() => {
        resolve();
      });
    });
  }
  public static writePatientJson(uri: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const meta = IO.ReadJson(
        './src/output/',
        'patient.meta.raw.json'
      ) as Array<iTest>;
      const fields = meta
        .filter(v => v.error.length === 0)
        .reduce((p: any, c: iTest) => {
          if (c.data.type === eDataType.Number) {
            const numericValues = c.data.values
              .map((v: any) => parseFloat(v))
              .filter((v: any) => !isNaN(v));
            const max = Math.max.apply(null, numericValues);
            const min = Math.min.apply(null, numericValues);
            p[c.data.label.trim().toLowerCase()] = { min: min, max: max };
          } else if (c.data.type === eDataType.String) {
            const stringValues = c.data.values.map((v: any) =>
              v
                .toString()
                .trim()
                .toLowerCase()
            );
            p[c.data.label.trim().toLowerCase()] = stringValues;
          }
          return p;
        }, {});
      const data = IO.ReadJson(
        './src/output/',
        'patient.data.raw.json'
      ) as Array<iTest>;
      const ids = data.map(v => v.data['patient id'].toLowerCase().trim());
      const fieldNames = meta
        .filter(v => v.error.length === 0)
        .map(v => v.data.name.trim().toLowerCase());
      const fieldLabels = meta
        .filter(v => v.error.length === 0)
        .map(v => v.data.label);
      const values = data.map(datum => {
        return fieldNames.map((fieldName, i) => {
          const lbl = fieldLabels[i];
          const value = datum.data[fieldName.trim().toLowerCase()];
          const f = fields[lbl.trim().toLowerCase()];
          return f.hasOwnProperty('min') ? parseFloat(value) : f.indexOf(value);
        });
      });
      const output = {
        ids: ids,
        fields: fields,
        values: values
      };
      IO.WriteString('patient.json', JSON.stringify(output)).then(() => {
        console.log('patient.json');
        resolve();
      });
    });
  }
  public static writePatientSampleJson(uri: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const data = IO.ReadJson(
        './src/output/',
        'sample.data.raw.json'
      ) as Array<iTest>;
      const psMap = data
        .filter(v => v.error.length === 0)
        .reduce((p: any, c: iTest) => {
          const pid = c.data['patient id'].trim().toLowerCase();
          const sid = c.data['sample id'].trim().toLowerCase();
          if (!p.hasOwnProperty(pid)) {
            p[pid] = [];
          }
          p[pid].push(sid);
          return p;
        }, {});

      IO.WriteString('psmap.json', JSON.stringify(psMap)).then(() => {
        console.log('psmap.json');
        resolve();
      });
    });
  }
}
