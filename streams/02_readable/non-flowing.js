process.stdin
  .on('readable', () => {
    let chunk;

    while ((chunk = process.stdin.read()) !== null) {
      console.log(chunk.toString());
    }
  })
  .on('error', (err) => console.log(err))
  .on('end', () => console.log('end of stream'));
