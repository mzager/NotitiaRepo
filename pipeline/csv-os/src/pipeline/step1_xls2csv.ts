import * as xlsx from 'xlsx';
import fs from 'fs';

export class Xls2Csv {
  public static Run(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      var workbook = xlsx.readFile('./src/input/ASCp_Oncoscape_06292018.xlsx');
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
            fs.writeFileSync('./src/output/' + sheetName.toLowerCase() + '.csv', data);
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
