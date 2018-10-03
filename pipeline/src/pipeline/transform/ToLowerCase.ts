import { Transform } from "stream";

export class TransformToLowerCase extends Transform {
  constructor() {
    super({ objectMode: true });
  }

  _transform(data: any, encoding: any, done: any) {
    // const trim = /((")[ ]+)|([ ]+("))/g;
    this.push(
      data
        .toString()
        // .replace(trim, '')
        .toLowerCase()
    );
    done();
  }
}
