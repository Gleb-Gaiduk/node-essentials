async function main() {
  for await (const chunk of process.stdin) {
    console.log('New chunk: ', chunk.toString());
  }
}

main();
