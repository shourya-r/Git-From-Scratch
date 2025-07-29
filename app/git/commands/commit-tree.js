const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

class CommitTreeCommand {
  constructor(tree, parent, commitMessage) {
    this.tree = tree;
    this.parentSHA = parent;
    this.commitMessage = commitMessage;
  }

  execute() {
    const commitContentBuffer = Buffer.concat([
      Buffer.from(`tree ${this.tree}\n`),
      Buffer.from(`parent ${this.parentSHA}\n`),
      Buffer.from(
        `author John Doe <johnDoe@gmail.com> ${Math.floor(
          Date.now() / 1000
        )} +0000\n`
      ),
      Buffer.from(
        `committer John Doe <johnDoe@gmail.com> ${Math.floor(
          Date.now() / 1000
        )} +0000\n`
      ),
      Buffer.from(`\n${this.commitMessage}\n`),
    ]);

    const commitHeader = `commit ${commitContentBuffer.length}\0`;
    const commitBuffer = Buffer.concat([
      Buffer.from(commitHeader),
      commitContentBuffer,
    ]);

    const hash = crypto.createHash("sha1").update(commitBuffer).digest("hex");

    const folder = hash.slice(0, 2);
    const file = hash.slice(2);

    const folderPath = path.join(process.cwd(), ".git", "objects", folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const compressedContent = zlib.deflateSync(commitBuffer);
    fs.writeFileSync(path.join(folderPath, file), compressedContent);

    process.stdout.write(`${hash}\n`);
  }
}

module.exports = CommitTreeCommand;
