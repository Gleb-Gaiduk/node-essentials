const { Transform } = require('stream');

class ReplaceStream extends Transform {
  constructor(searchStr, replaceStr, options) {
    super({ ...options });
    this.searchStr = searchStr;
    this.replaceStr = replaceStr;
    this.tail = '';
  }

  _transform(chunk, encoding, cb) {
    const piecies = (this.tail + chunk).split(this.searchStr);
    const lastPiece = piecies[piecies.length - 1];
    const tailLen = this.searchStr.length - 1;
    this.tail = lastPiece.slice(-tailLen);
    piecies[piecies.length - 1] = lastPiece.slice(0, -tailLen);
    this.push(piecies.join(this.replaceStr));
    cb();
  }

  _flush(cb) {
    this.push(this.tail);
    cb();
  }
}

const replaceStream = new ReplaceStream('World', 'Node.js');
replaceStream.on('data', (chunk) => console.log(chunk.toString()));
replaceStream.write('Hello W');
replaceStream.write('orld!');
replaceStream.end();
