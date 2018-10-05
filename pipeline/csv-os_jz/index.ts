import { resolve } from 'url';
import { Deploy } from './src/pipeline/step7_deploy';
import { Xls2Csv, ParseTree } from './src/pipeline/step1_xls2csv';
import { Validate } from './src/pipeline/step2_validate';
import { WriteLog } from './src/pipeline/step3_log';
import { WriteJson } from './src/pipeline/step4_json';
import { WriteParquet } from './src/pipeline/step5_parquet';
import { WriteZips } from './src/pipeline/step6_compress';

class Startup {

  // process CSV files from ./src/output directory 
  public static main(): number {
    /*  
        - Clear ./src/output/ directory
        - if CSV files, place them into ./src/output and run this.processCSVFromOutputDirectory();
        - if Xlsx file, place it into ./src/intput and pass four parameters into this.processXlsxFromInputDirectory();
    */

    // this.processCSVFromOutputDirectory();
    // this.processXlsxFromInputDirectory('demo', 'demo', 'demo', './src/input/demo.xlsx');
    return 0;
  }

  // Process XLSX from ./src/input directory
  public static processXlsxFromInputDirectory(
    name: string,
    description: string,
    site: string,
    file: string
  ): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      Xls2Csv.Run(file).then(() => {
        Validate.Run().then(() => {
          WriteLog.Run().then(() => {
            console.log('WROTE LOG');
            WriteJson.Run().then(v => {
              console.log('WROTE JSON');
              // WriteParquet.All().then(v => {
              WriteZips.All().then(v => {
                console.log('WROTE ZIPS');
                // Deploy.All(name, site, description).then(v => {
                console.log('END');
                resolve();
                // });
              });
            });
          });
        });
      });
    });
  }

  public static processCSVFromOutputDirectory(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      Validate.Run().then(() => {
        WriteLog.Run().then(() => {
          console.log('WROTE LOG');
          WriteJson.Run().then(v => {
            console.log('WROTE JSON');
            // WriteParquet.All().then(v => {
            WriteZips.All().then(v => {
              console.log('WROTE ZIPS');
              // Deploy.All(name, site, description).then(v => {
              console.log('END');
              resolve();
              // });
            });
          });
        });
      });
    });
  }
}

Startup.main();

let EXIT = false;
function wait() {
  if (!EXIT) setTimeout(wait, 1000);
}
// wait();
