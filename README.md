# Git from Scratch in Node.js

## Project Description

This project is a simplified implementation of the version control system Git, built entirely from scratch using Node.js. Its primary goal is to demystify the inner workings of Git by recreating its fundamental objects (blobs, trees, commits) and core commands from first principles.

It is designed to be run from the command line and provides a backend-only implementation of Git's core features. By building this, we can gain a deeper understanding of how Git tracks files, manages history, and enables powerful workflows like branching and merging.

---

## Features Implemented

This implementation includes the following core Git commands:

- **Low-Level ("Plumbing") Commands:**
  - `init`: Initializes a new `.git` directory.
  - `hash-object`: Creates a blob object from a file.
  - `cat-file`: Inspects the content of a Git object.
  - `write-tree`: Creates a tree object from the current directory.
  - `ls-tree`: Lists the contents of a tree object.
  - `commit-tree`: Creates a commit object from a tree.
- **High-Level ("Porcelain") Commands:**
  - `add`: Stages files for the next commit.
  - `commit`: Creates a new commit with staged changes.
  - `branch`: Manages branches (creation and listing).
  - `checkout`: Switches between branches.
  - `merge`: Merges one branch into another (supports fast-forward and three-way merges).

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.x or later recommended)

### Installation & Setup

1.  **Clone the repository (or download the source):**

    ```bash
    git clone git@github.com:shourya-r/Git-From-Scratch.git
    cd Git-From-Scratch
    ```

2.  **No dependencies are required!** The project uses only the built-in `fs`, `path`, `crypto`, and `zlib` modules from Node.js.

### Running Commands

All commands are run through the `app/main.js` entry point. The general format is:

```bash
node app/main.js <command> [arguments...]
```

To test the commands, it's recommended to create a separate directory:

```bash
mkdir my-repo
cd my-repo
```

And then run all commands from within that directory, referencing the `main.js` file (e.g., `node ../app/main.js init`).

---

## Command Usage Guide

Here is how to use each of the high-level commands to manage a repository.

### 1. `init`

Initializes a new Git repository in the current directory.

```bash
node ../app/main.js init
# Expected Output: Initialized empty Git repository in .../.git/
```

### 2. `add`

Stages a file, preparing it for the next commit.

```bash
# Create a file
echo "Hello, World!" > file1.txt

# Stage the file
node ../app/main.js add file1.txt
```

### 3. `commit`

Records the staged changes into the repository's history.

```bash
node ../app/main.js commit -m "My first commit"
# Expected Output: [main <sha>] My first commit
```

### 4. `branch`

Manages branches.

```bash
# List all branches (current branch is marked with *)
node ../app/main.js branch

# Create a new branch named 'feature'
node ../app/main.js branch feature
```

### 5. `checkout`

Switches the current working branch.

```bash
# Switch to the 'feature' branch
node ../app/main.js checkout feature
# Expected Output: Switched to branch 'feature'
```

### 6. `merge`

Merges the specified branch into the current branch.

**Scenario: Fast-Forward Merge**

```bash
# On branch 'main', create and checkout 'feature'
node ../app/main.js branch feature
node ../app/main.js checkout feature

# Make a commit on 'feature'
echo "new feature" > feature.txt
node ../app/main.js add feature.txt
node ../app/main.js commit -m "Add new feature"

# Switch back to main and merge
node ../app/main.js checkout main
node ../app/main.js merge feature
# Expected Output: Fast-forward
```

**Scenario: Three-Way Merge**

```bash
# After one commit, create a branch
node ../app/main.js branch feature

# Make a commit on main
echo "main change" >> file1.txt
node ../app/main.js add file1.txt
node ../app/main.js commit -m "Commit on main"

# Switch to feature and make a different commit
node ../app/main.js checkout feature
echo "feature change" >> file1.txt
node ../app/main.js add file1.txt
node ../app/main.js commit -m "Commit on feature"

# Switch back to main and merge
node ../app/main.js checkout main
node ../app/main.js merge feature
# Expected Output: Performing a three-way merge...
```

### Inspection Commands

These are useful for debugging and seeing how Git works under the hood.

- **`cat-file -p <sha>`**: Pretty-prints the content of any Git object (commit, tree, or blob).
- **`ls-tree <tree-sha>`**: Lists the contents of a tree object, showing the files and directories it contains.
