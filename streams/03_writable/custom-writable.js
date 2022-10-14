const { Writable } = require('stream');
const path = require('node:path');
const { mkdir, writeFile } = require('node:fs/promises');

class ToFileStream extends Writable {
  constructor(options) {
    super({ ...options, objectMode: true });
  }

  async _write(chunk, encoding, cb) {
    try {
      await mkdir(path.dirname(chunk.path));
      await writeFile(chunk.path, chunk.content);
      cb(null);
    } catch (err) {
      cb(err);
    }
  }
}

const tfs = new ToFileStream();
tfs.write({
  path: path.join('files', 'file1.txt'),
  content: 'Hello World!'
});
tfs.end(() => console.log('All files created'));
