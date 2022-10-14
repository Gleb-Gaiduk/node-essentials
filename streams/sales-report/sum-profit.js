const { Transform } = require('node:stream');

class SumProfit extends Transform {
  constructor(options = {}) {
    super({ ...options, objectMode: true });
    this.sumProfit = 0;
  }

  _transform(chunk, encoding, cb) {
    this.sumProfit += Number.parseFloat(chunk.profit);
    cb();
  }

  _flush(cb) {
    this.push(this.sumProfit.toString());
    cb();
  }
}

module.exports = SumProfit;
