const fs = require("fs");
const path = require("path");

const GitClient = require("./git/client");

// Commands
const { CatFileCommand } = require("./git/commands");

const gitClient = new GitClient();

const command = process.argv[2];

switch (command) {
  case "init":
    createGitDirectory();
    break;
  case "cat-file":
    handleCatFileCommand();
    break;
  default:
    throw new Error(`Unknown command ${command}`);
}

function createGitDirectory() {
  const gitPath = path.join(process.cwd(), ".git");
  fs.mkdirSync(path.join(gitPath, "objects"), {
    recursive: true,
  });
  fs.mkdirSync(path.join(gitPath, "refs"), { recursive: true });

  fs.writeFileSync(path.join(gitPath, "HEAD"), "ref: refs/heads/main\n");
  console.log(`Initialized empty Git repository in ${gitPath}/`);
}

function handleCatFileCommand() {
  const flag = process.argv[3];
  const commitSHA = process.argv[4];

  const command = new CatFileCommand(flag, commitSHA);
  gitClient.run(command);
}
