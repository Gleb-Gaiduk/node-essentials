const fs = require('node:fs');
const { parse } = require('csv-parse');
const FilterByCountry = require('./filter-by-country.js');
const SumProfit = require('./sum-profit.js');

const csvParser = parse({ columns: true });

fs.createReadStream('./data.csv', 'utf-8')
  .pipe(csvParser)
  .pipe(new FilterByCountry('China'))
  .pipe(new SumProfit())
  .on('data', (result) => console.log(result));
