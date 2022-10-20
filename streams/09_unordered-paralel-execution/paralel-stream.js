const { Transform } = require('node:stream');

class ParallelStream extends Transform {
  constructor(userTransform, options) {
    super({ objectMode: true, ...options });
    this._userTransform = userTransform;
    this._runningTasks = 0;
    this._terminateCb = null;
  }

  _transform(chunk, enc, doneCb) {
    this._runningTasks++;
    this._userTransform(
      chunk,
      enc,
      this.push.bind(this),
      this._onComplete.bind(this)
    );
    doneCb();
  }

  _flush(doneCb) {
    if (this._runningTasks > 0) {
      this._terminateCb = doneCb;
    } else doneCb();
  }

  _onComplete(err) {
    this._runningTasks--;
    if (err) {
      return this.emit('error', err);
    }

    if (this._runningTasks === 0) {
      this._terminateCb && this._terminateCb();
    }
  }
}
