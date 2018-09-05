import { TransformToLowerCase } from './transform/ToLowerCase';
import { iTest, eDataType } from './InterfacesAndEnums';
import * as hl from 'highland';
import * as fs from 'fs';
import * as csv from 'fast-csv';
const json = require('big-json');

export class IO {
  public static ReadEventFiles(path: string): Promise<Array<string>> {
    return new Promise<Array<string>>((resolve, reject) => {
      fs.readdir(path, (err: any, files: string[]) => {
        resolve(files.filter(v => v.indexOf('event') === 0));
      });
    });
  }

  public static ReadMutationFiles(path: string): Promise<Array<string>> {
    return new Promise<Array<string>>((resolve, reject) => {
      fs.readdir(path, (err: any, files: string[]) => {
        resolve(files.filter(v => v.indexOf('mutation') === 0));
      });
    });
  }

  public static ReadMatrixFiles(path: string): Promise<Array<string>> {
    return new Promise<Array<string>>((resolve, reject) => {
      fs.readdir(path, (err: any, files: string[]) => {
        resolve(files.filter(v => v.indexOf('matrix') === 0));
      });
    });
  }

  public static ReadLargeJson(path: string, file: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const readStream = fs.createReadStream(path + file);
      const parseStream = json.createParseStream();
      debugger;
      parseStream.on('data', function(pojo: any) {
        // => receive reconstructed POJO
        debugger;
      });

      readStream.pipe(parseStream);
    });
  }
  public static ReadJson(path: string, file: string): any {
    return JSON.parse(fs.readFileSync(path + file, 'UTF8'));
  }
  public static ReadZips(): any {
    return fs.readdirSync('./src/output/').filter(v => v.endsWith('.gz'));
  }

  public static ReadMutations(): any {
    const file = fs.readFileSync('./src/ref/mutations.json', 'UTF8');
    const json = JSON.parse(file);
    return json;
  }

  public static ReadMutationIdMap(): any {
    const file = fs.readFileSync('./src/ref/mutations.json', 'UTF8');
    const json = JSON.parse(file) as Array<string>;
    var x = 1;
    return json.reduce((p: any, c) => {
      x += x;
      p[c] = x;
      return p;
    }, {});
  }
  public static DeleteArtifacts(): Promise<any> {
    return new Promise((resolve, reject) => {
      fs.readdir('./src/output/', (err: any, files: string[]) => {
        const filesToDelete = files.filter(
          v => !v.endsWith('.gz') && !v.endsWith('.md')
        );
        filesToDelete.forEach(v => {
          fs.unlinkSync('./src/output/' + v);
        });
        resolve();
      });
    });
  }

  public static ReadGenes(): any {
    const file = fs.readFileSync('./src/ref/hgnc.json', 'UTF8');
    const json = JSON.parse(file);
    return json;
  }
  /**
   * Takes the result of a stream of value objects, transposes the object and properties and wraps in a TestVO
   * @param inputStream
   * @param omitFields Fields not to include in the transpose
   */
  public static loadMetadata(
    inputStream: Highland.Stream<iTest>,
    omitFields: Array<string>
  ): Promise<Highland.Stream<iTest>> {
    const omit = new Set(omitFields.map(v => v.trim().toLowerCase()));
    return new Promise<Highland.Stream<iTest>>((resolve, reject) => {
      inputStream
        .filter(v => {
          // Remove Items With Errors
          return v.error.length === 0;
        })
        .reduce<any>({}, (meta: any, obj: iTest) => {
          Object.keys(obj.data)
            .filter(prop => !omit.has(prop))
            .forEach(prop => {
              const value = obj.data[prop];
              if (!meta.hasOwnProperty(prop)) {
                meta[prop] = new Set<any>();
              }
              meta[prop].add(value.trim().toLowerCase());
            });
          return meta;
        })
        .toArray(result => {
          const testVos: Array<iTest> = Object.keys(result[0])
            .filter(v => !omit.has(v))
            .map(v => ({
              data: {
                name: v,
                label: v,
                values: Array.from(result[0][v]),
                distribution: null,
                type: eDataType.NA
              },
              error: [],
              info: []
            }));
          resolve(hl.default(testVos));
        });
    });
  }
  /**
   * Loads A CSV File Into a Highland Stream, Converts Content To LowerCase,
   * Transforms Each Row Into A Object Wrapped In TestVo
   *
   * @param uri Location Of File
   * @api public
   */
  public static loadCsv(uri: string): Highland.Stream<iTest> {
    return hl
      .default(
        fs
          .createReadStream(uri)
          .pipe(new TransformToLowerCase())
          .pipe(
            csv.default({
              headers: true,
              ignoreEmpty: true,
              discardUnmappedColumns: true,
              strictColumnHandling: false,
              trim: true,
              objectMode: true
            })
          )
      )
      .map((obj: any) => {
        return { data: obj, info: [], error: [] } as iTest;
      });
  }

  /**
   *
   * @param uri File Name For Output
   * @param inputStream Stream to extract the
   */
  public static WriteLog(
    uri: string,
    inputStream: Highland.Stream<iTest>
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const outputStream = fs.createWriteStream('./src/output/' + uri);
      outputStream.write('[');
      outputStream.on('finish', () => resolve());
      inputStream
        .filter(v => v.error.length !== 0 || v.info.length !== 0)
        .map(v => JSON.stringify(v))
        .intersperse(',')
        .append(']')
        .pipe(outputStream);
    });
  }

  public static WriteProperty(
    uri: string,
    inputStream: Highland.Stream<iTest>,
    prop: string
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      prop = prop.toLowerCase().trim();
      const outputStream = fs.createWriteStream('./src/output/' + uri);
      outputStream.on('finish', () => resolve());
      outputStream.write('[');
      inputStream
        .filter(v => v.error.length === 0)
        .map(v => JSON.stringify(v.data[prop]))
        .intersperse(',')
        .append(']')
        .pipe(outputStream);
    });
  }

  public static WriteMeta(
    uri: string,
    inputStream: Highland.Stream<iTest>
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const outputStream = fs.createWriteStream('./src/output/' + uri);
      outputStream.on('finish', () => resolve());
      outputStream.write('[');
      inputStream
        .filter(v => v.error.length === 0)
        .filter(v => v.data.type !== eDataType.ID)
        .map(v => {
          const obj: any = {};
          obj[v.data.name] =
            v.data.type === eDataType.Number
              ? v.data.values
              : v.data.values.string;
          return JSON.stringify(obj);
        })
        .intersperse(',')
        .append(']')
        .pipe(outputStream);
    });
  }
  public static WriteEvent(
    uri: string,
    inputStream: Highland.Stream<iTest>
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const outputStream = fs.createWriteStream('./src/output/' + uri);
      outputStream.on('finish', () => resolve());
      outputStream.write('[');
      inputStream
        .filter(v => v.error.length === 0)
        .map(v => {
          return JSON.stringify(v);
        })
        .intersperse(',')
        .append(']')
        .pipe(outputStream);
    });
  }
  public static WriteMutation(
    uri: string,
    inputStream: Highland.Stream<iTest>
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const outputStream = fs.createWriteStream('./src/output/' + uri);
      outputStream.on('finish', () => resolve());
      outputStream.write('[');
      inputStream
        .filter(v => v.error.length === 0)
        .map(v => {
          return JSON.stringify(v);
        })
        .intersperse(',')
        .append(']')
        .pipe(outputStream);
    });
  }

  public static WriteMatrix(
    uri: string,
    inputStream: Highland.Stream<iTest>
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const outputStream = fs.createWriteStream('./src/output/' + uri);
      outputStream.on('finish', () => resolve());
      outputStream.write('[');
      inputStream
        .filter(v => v.error.length === 0)
        .map(v => JSON.stringify(v))
        .intersperse(',')
        .append(']')
        .pipe(outputStream);
    });
  }

  public static WriteString(uri: string, content: string): Promise<any> {
    return new Promise((resolve, reject) => {
      fs.writeFileSync('./src/output/' + uri, content);
      resolve();
    });
  }
  public static WriteJson(
    uri: string,
    inputStream: Highland.Stream<iTest>
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      const outputStream = fs.createWriteStream('./src/output/' + uri);
      outputStream.on('finish', () => resolve());
      outputStream.write('[');
      inputStream
        .filter(v => v.error.length === 0)
        .map(v => JSON.stringify(v))
        .intersperse(',')
        .append(']')
        .pipe(outputStream);
    });
  }
}
