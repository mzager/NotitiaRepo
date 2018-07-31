// Converts Download From HGNC (genes.txt) Into Lookup (HGNC.json)

const csvParse = require('csv-parse/lib/sync');

const file = '/Users/michaelz/Documents/Projects/no/NotitiaRepo/node-process-xls/ref/genes.txt';

const data = csvParse(fs.readFileSync(file, 'UTF8'), {
  delimiter: '\t',
  cast: false,
  cast_date: false,
  skip_empty_lines: true,
  columns: true
});

const shortName = {
  'Previous Symbols': 'prev',
  Synonyms: 'syn',
  'HGNC ID': 'hgnc',
  'Approved Symbol': 'symbol',
  'Approved Name': 'name',
  'Entrez Gene ID': 'entrez',
  'Ensembl Gene ID': 'ensembl',
  'RefSeq IDs': 'refseq',
  'Vega ID': 'vega'
};
const multiples = ['Previous Symbols', 'Synonyms'];

const singles = [
  'HGNC ID',
  'Approved Symbol',
  'Approved Name',
  'Entrez Gene ID',
  'Ensembl Gene ID',
  'RefSeq IDs',
  'Vega ID'
];

const lookup = data.reduce((p, c) => {
  singles.forEach(prop => {
    if (c[prop] !== undefined) {
      if (c[prop] !== '') {
        p[c[prop].toLowerCase().trim()] = [
          c['Approved Symbol'].trim().toLowerCase(),
          shortName[prop]
        ];
      }
    }
  });
  multiples.forEach(prop => {
    if (c[prop] !== undefined) {
      if (c[prop] !== '') {
        c[prop].split(',').forEach(sym => {
          p[sym.trim().toLowerCase()] = [
            c['Approved Symbol'].trim().toLowerCase(),
            shortName[prop]
          ];
        });
      }
    }
  });
  return p;
}, {});

fs.writeFileSync('hgnc.json', JSON.stringify(lookup), 'UTF-8');
