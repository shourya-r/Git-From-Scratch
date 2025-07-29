const path = require("path");
const fs = require("fs");
const zlib = require("zlib");

class CatFileCommand {
  constructor(flag, commitSHA) {
    this.flag = flag;
    this.commitSHA = commitSHA;
  }
  execute() {
    // navigate to .git/objects/commitSHA[0:2]
    // read the file commitSHA[2:]
    // decompress the file
    // print the output
    const flag = this.flag;
    const commitSHA = this.commitSHA;
    switch (flag) {
      case "-p":
        {
          const folder = commitSHA.slice(0, 2);
          const file = commitSHA.slice(2);

          const completePath = path.join(
            process.cwd(),
            ".git",
            "objects",
            folder,
            file
          );

          if (!fs.existsSync(completePath)) {
            // Git exits with a non-zero status code and prints to stderr
            console.error(`fatal: Not a valid object name ${commitSHA}`);
            process.exit(1); // Exit to match git's behavior
          }

          const fileContent = fs.readFileSync(completePath);

          const decompressedContent = zlib.inflateSync(fileContent);
          // The content is in the format "blob <size>\0<actual_content>"
          // We need to find the null byte to separate the header from the content
          const nullByteIndex = decompressedContent.indexOf(0);
          // Everything after the null byte is the content we want to print
          const content = decompressedContent.subarray(nullByteIndex + 1);
          // Write content to stdout, but without a trailing newline, just like `git cat-file -p`
          process.stdout.write(content);
        }
        break;
    }
  }
}

module.exports = CatFileCommand;
