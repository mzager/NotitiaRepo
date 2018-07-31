const root = '/Users/michaelz/Documents/Projects/no/NotitiaRepo/node-process-xls';
const fs = require('fs');
const csvParse = require('csv-parse/lib/sync');

exports.term = () => {
  process.exit(1);
};

exports.sets = {
  getDuplicates: arr => {
    const set = new Set(arr);
    if (set.size == arr.length) {
      return [];
    } else {
      const dups = [];
      arr.sort().reduce((p, c) => {
        if (p === c) {
          dups.push(c);
        }
        return c;
      }, '');
      return Array.from(new Set(dups));
    }
  },
  getIntersection: (setA, setB) => {
    return new Set([...setA].filter(x => setB.has(x)));
  },
  getUnion: (setA, setB) => {
    return new Set([...setA, ...setB]);
  },
  getMinus: (setA, setB) => {
    return new Set([...setA].filter(x => !setB.has(x)));
  },
  getDifference: (setA, setB) => {
    return {
      onlyInA: new Set([...setA].filter(x => !setB.has(x))),
      onlyInB: new Set([...setB].filter(x => !setA.has(x)))
    };
  }
};

exports.io = {
  readJson: (dir, file) => {
    return JSON.parse(fs.readFileSync(root + '/' + dir + '/' + file, 'UTF8'));
  },
  writeJson: (dir, file, data) => {
    fs.writeFileSync(root + '/' + dir + '/' + file, JSON.stringify(data));
  },
  readDir: dir => {
    return fs.readdirSync(root + '/' + dir);
  },
  readCsv: (dir, file) => {
    return csvParse(fs.readFileSync(root + '/' + dir + '/' + file, 'UTF8'), {
      cast: true,
      cast_date: false,
      skip_empty_lines: true
    });
  },
  filesToLowerCase: dir => {
    fs.readdirSync(root + '/' + dir).forEach(file => {
      fs.renameSync(root + '/' + dir + '/' + file, root + '/' + dir + '/' + file.toLowerCase());
    });
  }
};

exports.log = {
  error: (msg, sheet) => {
    console.log(sheet + ':' + msg);
  },
  warn: (msg, sheet) => {
    console.log(sheet + ':' + msg);
  }
};
