import * as xlsx from 'xlsx';
import fs, { lstatSync } from 'fs';

import { join } from 'path';
import { Validate } from './step2_validate';
var copydir = require('copy-dir');

export class ParseTree {
  public static Run(): Promise<any> {
    return new Promise((resolve, reject) => {
      const src = './src/cbio/';
      const dsFolders = fs
        .readdirSync(src)
        .map(name => join(src, name))
        .filter(v => lstatSync(v).isDirectory())
        .filter(folder => {
          const dsFiles = fs
            .readdirSync('./' + folder)
            .filter(v => v !== '.DS_Store');

          if (!dsFiles.indexOf('patient.csv')) return false;
          if (!dsFiles.indexOf('sample.csv')) return false;
          if (
            !dsFiles.reduce((p, c) => {
              if (c.indexOf('matrix') === 0 && c.indexOf('-rppa') === -1) {
                p = true;
              }
              return p;
            }, false)
          ) {
            return false;
          }
          return true;
        });
      resolve(dsFolders.map(v => './' + v + '/'));
    });
  }
}

export class Xls2Csv {
  public static Run(file: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      var workbook = xlsx.readFile(file);
      Promise.all(
        workbook.SheetNames.map(sheetName => {
          return new Promise((resolve, reject) => {
            const data = xlsx.utils.sheet_to_csv(workbook.Sheets[sheetName], {
              FS: ',',
              RS: '\n',
              strip: true,
              blankrows: false,
              skipHidden: true
            });
            fs.writeFileSync(
              './src/output/' + sheetName.toLowerCase() + '.csv',
              data
            );
            console.log('Exported CSV : ' + sheetName.toLowerCase());
            resolve();
          });
        })
      ).then(() => {
        resolve();
      });
    });
  }
}
