import { IO } from './IO';
import { resolve } from 'url';
var fs = require('fs');

var zlib = require('zlib');
export class WriteZips {
  public static All(): Promise<any> {
    // return new Promise((resolve, reject) => {
    const files = IO.ReadJson('./src/output/', 'manifest.json')
      .files.map((v: any) => v.file)
      .concat(['manifest.json', 'log.json']);
    return Promise.all(
      files.map((file: string) => {
        return new Promise((resolve, reject) => {
          var gzip = zlib.createGzip({ level: 9 });
          var rstream = fs.createReadStream('./src/output/' + file);
          var wstream = fs.createWriteStream('./src/output/' + file + '.gz');
          rstream // reads from myfile.txt
            .pipe(gzip) // compresses
            .pipe(wstream) // writes to myfile.txt.gz
            .on('finish', function() {
              // finished
              console.log('done compressing');
              resolve();
            });
        });
      })
    );
  }
}
