// Buffers - data structure that allows us to manage raw binary data.
// internally, a buffer is simply an array of bytes.
const bufferFromString = Buffer.from('Hleb Haiduk');
const bufferFromByteArray = Buffer.from([67, 65, 12, 53, 193]);
const bufferFromHex = Buffer.from('4369616f2068756d616e', 'hex');
const bufferFromBase64 = Buffer.from('Q2lhbyBodW1hbg==', 'base64')

// data is stored in binary format
console.log(bufferFromString);
console.log(bufferFromByteArray);
console.log(bufferFromHex);
console.log(bufferFromBase64);

// raw buffer data can be "visualized" as a string, as hex or base64
console.log(bufferFromString.toString('utf-8'));
console.log(bufferFromByteArray.toString('hex'));
console.log(bufferFromByteArray.toString('base64'));

// You can get the size of a buffer (in bytes) by using `length`
console.log(bufferFromString.length);

const b = Buffer.from('48656c6c6f', 'hex');
console.log(b.toJSON()); // { type: 'Buffer', data: [ 72, 101, 108, 108, 111 ] }

// .slice and Buffer.concat and .slice allows you to get an arbitrary sub-section of a buffer:
const buf = Buffer.from('Hleb Haiduk');
console.log(buf.slice(5).toString()); // 'Haiduk'


const firstName = Buffer.from('Hleb ');
const lastName = Buffer.from('Haiduk');
const fullName = Buffer.concat([firstName, lastName]);
console.log(fullName.toString());

// Streams can keep a low memory footprint even with large amounts of data
// Streams allows you to process data as soon as it is available