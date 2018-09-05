import { Deploy } from './src/pipeline/step7_deploy';
import { Xls2Csv } from './src/pipeline/step1_xls2csv';
import { Validate } from './src/pipeline/step2_validate';
import { WriteLog } from './src/pipeline/step3_log';
import { WriteJson } from './src/pipeline/step4_json';
import { WriteParquet } from './src/pipeline/step5_parquet';
import { WriteZips } from './src/pipeline/step6_compress';

class Startup {
  public static main(): number {
    // Xls2Csv.Run().then(() => {
    Validate.Run().then(() => {
      WriteLog.Run().then(() => {
        WriteJson.Run().then(v => {
          // WriteParquet.All().then(v => {
          WriteZips.All().then(v => {
            Deploy.All().then(v => {
              console.log('done');
              EXIT = true;
            });
          });
          // });
        });
      });
    });
    // });
    return 0;
  }
}

Startup.main();

let EXIT = false;
function wait() {
  if (!EXIT) setTimeout(wait, 1000);
}
wait();
