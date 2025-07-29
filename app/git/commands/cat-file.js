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
            throw new Error(`Object ${commitSHA} not found`);
          }

          const fileContent = fs.readFileSync(completePath);

          const outputBuffer = zlib.inflateSync(fileContent);
          const output = outputBuffer.toString();

          process.stdout.write(output);
        }
        break;
    }
  }
}

module.exports = CatFileCommand;
