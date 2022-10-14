const { Transform } = require('node:stream');

class FilterByCountry extends Transform {
  constructor(country, options = {}) {
    super({ ...options, objectMode: true });
    this.country = country;
  }

  _transform(chunk, encoding, cb) {
    if (chunk.country === this.country) this.push(chunk);
    cb();
  }
}

module.exports = FilterByCountry;
