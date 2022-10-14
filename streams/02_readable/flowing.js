process.stdin
  .on('data', (chunk) => {
    console.log(chunk.toString());
  })
  .on('error', (err) => console.log(err))
  .on('end', () => console.log('End of stream'));
