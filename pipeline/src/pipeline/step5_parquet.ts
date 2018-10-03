import { IO } from './IO';
import { ParquetSchema, ParquetWriter } from 'parquets';
import { iTest } from './InterfacesAndEnums';
import fs from 'fs';
export class WriteParquet {
  public static All(): Promise<any> {
    return Promise.all([this.writeMatriciesParquet(), this.writeMutationsParquet()]);
  }

  public static writeMutationsParquet(): Promise<any> {
    const writeFile = async function(filename: string, matrix: Array<iTest>) {
      var schema = new ParquetSchema({ sample: { type: 'UTF8' }, hgnc: { type: 'UTF8' }, value: { type: 'DOUBLE' } });
      const data = matrix.reduce((p, gene) => {
        const hgnc = gene.data.symbol;
        Object.keys(gene.data)
          .filter(v => v !== 'hgnc' && v !== 'symbol')
          .forEach(sample => {
            const value = gene.data[sample];
            p.push({ sample: sample, hgnc: hgnc, value: value });
          });
        return p;
      }, new Array<{ sample: string; hgnc: string; value: number }>());
      let file = await ParquetWriter.openFile(schema, './src/output/' + filename.replace('data.raw.json', 'data.parquet'));
      for (var i = 0; i < data.length; i++) {
        await file.appendRow(data[i]);
      }
      await file.close();
    };
    return new Promise((resolve, reject) => {
      resolve();
    });
  }

  public static writeMatriciesParquet(): Promise<any> {
    const writeFile = async function(filename: string, matrix: Array<iTest>) {
      var schema = new ParquetSchema({ sample: { type: 'UTF8' }, hgnc: { type: 'UTF8' }, value: { type: 'DOUBLE' } });
      const data = matrix.reduce((p, gene) => {
        const hgnc = gene.data.symbol;
        Object.keys(gene.data)
          .filter(v => v !== 'hgnc' && v !== 'symbol')
          .forEach(sample => {
            const value = gene.data[sample];
            p.push({ sample: sample, hgnc: hgnc, value: value });
          });
        return p;
      }, new Array<{ sample: string; hgnc: string; value: number }>());
      let file = await ParquetWriter.openFile(schema, './src/output/' + filename.replace('data.raw.json', 'data.parquet'));
      for (var i = 0; i < data.length; i++) {
        await file.appendRow(data[i]);
      }
      await file.close();
    };
    return new Promise((resolve, reject) => {
      const files = fs
        .readdirSync('./src/output')
        .filter(v => v.indexOf('matrix-') === 0)
        .filter(v => v.indexOf('raw.json') !== -1);
      const samples = IO.ReadJson('./src/output/', 'sample.data.id.json');
      Promise.all(
        files.map<Promise<any>>(v => {
          const matrix = IO.ReadJson('./src/output/', v).filter((v: iTest) => v.error.length === 0) as Array<iTest>;
          return writeFile(v, matrix);
        })
      ).then(() => {
        console.log('Write Parquet Matrix Files');
        resolve();
      });
      resolve(); // Jenny this needs to be fixed.  I put this in as a hack
    });
  }
}
