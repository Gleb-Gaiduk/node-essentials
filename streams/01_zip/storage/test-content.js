

rganization of this Document#
This document is divided into two primary sections with a third section for additional notes. The first section explains the elements of the stream API that are required to use streams within an application. The second section explains the elements of the API that are required to implement new types of streams.

Types of Streams#
There are four fundamental stream types within Node.js:

Writable - streams to which data can be written (for example, fs.createWriteStream()).
Readable - streams from which data can be read (for example, fs.createReadStream()).
Duplex - streams that are both Readable and Writable (for example, net.Socket).
Transform - Duplex streams that can modify or transform the data as it is written and read (for example, zlib.createDeflate()).
Additionally, this module includes the utility functions pipeline and finished.

Object Mode#
All streams created by Node.js APIs operate exclusively on strings and Buffer (or Uint8Array) objects. It is possible, however, for stream implementations to work with other types of JavaScript values (with the exception of null, which serves a special purpose within streams). Such streams are considered to operate in "object mode".

Stream instances are switched into object mode using the objectMode option when the stream is created. Attempting to switch an existing stream into object mode is not safe.

Buffering#
Both Writable and Readable streams will store data in an internal buffer that can be retrieved using writable.writableBuffer or readable.readableBuffer, respectively.

The amount of data potentially buffered depends on the highWaterMark option passed into the stream's constructor. For normal streams, the highWaterMark option specifies a total number of bytes. For streams operating in object mode, the highWaterMark specifies a total number of objects.

Data is buffered in Readable streams when the implementation calls stream.push(chunk). If the consumer of the Stream does not call stream.read(), the data will sit in the internal queue until it is consumed.

Once the total size of the internal read buffer reaches the threshold specified by highWaterMark, the stream will temporarily stop reading data from the underlying resource until the data currently buffered can be consumed (that is, the stream will stop calling the internal readable._read() method that is used to fill the read buffer).

Data is buffered in Writable streams when the writable.write(chunk) method is called repeatedly. While the total size of the internal write buffer is below the threshold set by highWaterMark, calls to writable.write() will return true. Once the size of the internal buffer reaches or exceeds the highWaterMark, false will be returned.

A key goal of the stream API, particularly the stream.pipe() method, is to limit the buffering of data to acceptable levels such that sources and destinations of differing speeds will not overwhelm the available memory.

Because Duplex and Transform streams are both Readable and Writable, each maintains two separate internal buffers used for reading and writing, allowing each side to operate independently of the other while maintaining an appropriate and efficient flow of data. For example, net.Socket instances are Duplex streams whose Readable side allows consumption of data received from the socket and whose Writable side allows writing data to the socket. Because data may be written to the socket at a faster or slower rate than data is received, it is important for each side to operate (and buffer) independently of the other.

API for Stream Consumers#
Almost all Node.js applications, no matter how simple, use streams in some manner. The following is an example of using streams in a Node.js application that implements an HTTP server:

const http = require('http');

const server = http.createServer((req, res) => {
  // `req` is an http.IncomingMessage, which is a Readable Stream
  // `res` is an http.ServerResponse, which is a Writable Stream

  let body = '';
  // Get the data as utf8 strings.
  // If an encoding is not set, Buffer objects will be received.
  req.setEncoding('utf8');

  // Readable streams emit 'data' events once a listener is added
  req.on('data', (chunk) => {
    body += chunk;
  });

  // The 'end' event indicates that the entire body has been received
  req.on('end', () => {
    try {
      const data = JSON.parse(body);
      // Write back something interesting to the user:
      res.write(typeof data);
      res.end();
    } catch (er) {
      // uh oh! bad json!
      res.statusCode = 400;
      return res.end(`error: ${er.message}`);
    }
  });
});

server.listen(1337);

// $ curl localhost:1337 -d "{}"
// object
// $ curl localhost:1337 -d "\"foo\""
// string
// $ curl localhost:1337 -d "not json"
// error: Unexpected token o in JSON at position 1
Writable streams (such as res in the example) expose methods such as write() and end() that are used to write data onto the stream.

Readable streams use the EventEmitter API for notifying application code when data is available to be read off the stream. That available data can be read from the stream in multiple ways.

Both Writable and Readable streams use the EventEmitter API in various ways to communicate the current state of the stream.

Duplex and Transform streams are both Writable and Readable.

Applications that are either writing data to or consuming data from a stream are not required to implement the stream interfaces directly and will generally have no reason to call require('stream').

Developers wishing to implement new types of streams should refer to the section API for Stream Implementers.

Writable Streams#
Writable streams are an abstraction for a destination to which data is written.

Examples of Writable streams include:

HTTP requests, on the client
HTTP responses, on the server
fs write streams
zlib streams
crypto streams
TCP sockets
child process stdin
process.stdout, process.stderr
Some of these examples are actually Duplex streams that implement the Writable interface.

All Writable streams implement the interface defined by the stream.Writable class.

While specific instances of Writable streams may differ in various ways, all Writable streams follow the same fundamental usage pattern as illustrated in the example below:

const myStream = getWritableStreamSomehow();
myStream.write('some data');
myStream.write('some more data');
myStream.end('done writing data');
Class: stream.Writable#
Added in: v0.9.4
Event: 'close'#
History
The 'close' event is emitted when the stream and any of its underlying resources (a file descriptor, for example) have been closed. The event indicates that no more events will be emitted, and no further computation will occur.

A Writable stream will always emit the 'close' event if it is created with the emitClose option.

Event: 'drain'#
Added in: v0.9.4
If a call to stream.write(chunk) returns false, the 'drain' event will be emitted when it is appropriate to resume writing data to the stream.

// Write the data to the supplied writable stream one million times.
// Be attentive to back-pressure.
function writeOneMillionTimes(writer, data, encoding, callback) {
  let i = 1000000;
  write();
  function write() {
    let ok = true;
    do {
      i--;
      if (i === 0) {
        // last time!
        writer.write(data, encoding, callback);
      } else {
        // See if we should continue, or wait.
        // Don't pass the callback, because we're not done yet.
        ok = writer.write(data, encoding);
      }
    } while (i > 0 && ok);
    if (i > 0) {
      // had to stop early!
      // write some more once it drains
      writer.once('drain', write);
    }
  }
}
Event: 'error'#
Added in: v0.9.4
<Error>
The 'error' event is emitted if an error occurred while writing or piping data. The listener callback is passed a single Error argument when called.

The stream is not closed when the 'error' event is emitted.

Event: 'finish'#
Added in: v0.9.4