const { Transform } = require('node:stream');

class LimitedParallelStream extends Transform {
  constructor(transformStream, concurrencyCount, options) {
    super({ objectMode: true, ...options });
    this._transformStream = transformStream;
    this._runningOperationsCount = 0;
    this._concurrencyCount = concurrencyCount;
    this._onContinueCb = null;
    this._onDoneRef = null;
  }

  _transform(chunk, enc, onDone) {
    this._runningOperationsCount++;
    this._transformStream(
      chunk,
      enc,
      this.push.bind(this),
      this._onOperationComplete.bind(this)
    );

    if (this._runningOperationsCount < this._concurrencyCount) {
      onDone();
    } else {
      this._onContinueCb = onDone;
    }
  }

  _flush(onDone) {
    if (this._runningOperationsCount > 0) {
      this._onDoneRef = onDone;
    } else onDone();
  }

  _onOperationComplete(err) {
    this._runningOperationsCount--;
    if (err) this.emit('error', err);

    const prevOnContinueCb = this._onContinueCb;
    this._onContinueCb = null;
    prevOnContinueCb && prevOnContinueCb();

    if (this._runningOperationsCount === 0) {
      this._onDoneRef && this._onDoneRef();
    }
  }
}

module.exports.LimitedParallelStream = LimitedParallelStream;
