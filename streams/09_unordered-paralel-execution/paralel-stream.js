const { Transform } = require('node:stream');

class ParallelStream extends Transform {
  constructor(transformStream, options) {
    super({ objectMode: true, ...options });
    this._transformStream = transformStream;
    this._operationsCount = 0;
    this._onDoneRef = null;
  }

  _transform(chunk, enc, onDone) {
    this._operationsCount++;
    this._transformStream(
      chunk,
      enc,
      this.push.bind(this),
      this._onOperationComplete.bind(this)
    );
    onDone();
  }

  _flush(onDone) {
    if (this._operationsCount > 0) {
      this._onDoneRef = onDone;
    } else onDone();
  }

  _onOperationComplete(err) {
    this._operationsCount--;
    if (err) this.emit('error', err);
    if (this._operationsCount === 0) {
      this._onDoneRef && this._onDoneRef();
    }
  }
}

module.exports.ParallelStream = ParallelStream;
