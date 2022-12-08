import run from "aocrunner";

function parseInput(rawInput: string) {
  return rawInput.split("\n").map((line) => line.trim());
}

type Node = number | { [key: string]: Node };

function part1(rawInput: string) {
  const input = parseInput(rawInput);
  const tree = buildTree(input);
  const matches: number[] = [];
  depthSearch(tree, (node, nodeSum) => {
    if (nodeSum < 100000 && typeof node === "object") {
      matches.push(nodeSum);
    }
  });

  return matches.reduce((a, b) => a + b);
}

const TOTAL_SIZE = 70000000;
const UPDATE_SIZE = 30000000;

function part2(rawInput: string) {
  const input = parseInput(rawInput);
  const tree = buildTree(input);
  const matches: number[] = [];
  const rootSize = depthSearch(tree, (node, nodeSum) => {
    if (typeof node === "object") {
      matches.push(nodeSum);
    }
  });
  const neededSize = rootSize - (TOTAL_SIZE - UPDATE_SIZE);
  const candidates = matches.filter((size) => size > neededSize);
  return candidates.reduce((a, b) => Math.min(a, b));
}

function buildTree(input: string[]) {
  const tree: Node = {};
  let dir = tree;
  let ptr: string[] = [];
  input.forEach((line) => {
    if (line.startsWith("$ ls")) {
      return;
    } else if (line.startsWith("$ cd ")) {
      const command = line.slice(5);
      switch (command) {
        case "/":
          ptr = [];
          break;
        case "..":
          ptr.pop();
          break;
        default:
          ptr.push(command);
          break;
      }
      dir = tree;
      for (let prop of ptr) {
        const newDir = dir[prop];
        if (typeof newDir === "number") {
          throw new Error("cd into number");
        } else {
          dir = newDir;
        }
      }
      return;
    } else if (line.startsWith("dir")) {
      const directory = line.slice(4);
      dir[directory] = {};
      return;
    } else {
      // File
      const [size, name] = line.split(" ");
      dir[name] = Number(size);
      return;
    }
  });
  return tree;
}

function depthSearch(
  node: Node,
  onNodeSumCalc: (node: Node, nodeSum: number) => void,
) {
  if (typeof node === "number") {
    return node;
  }
  const childrenSum: number = Object.keys(node).reduce((sum, curr) => {
    const childNode = node[curr];
    const nodeSum = depthSearch(childNode, onNodeSumCalc);
    onNodeSumCalc(childNode, nodeSum);
    return sum + nodeSum;
  }, 0);
  return childrenSum;
}

run({
  part1: {
    tests: [
      {
        input: `$ cd /
        $ ls
        dir a
        14848514 b.txt
        8504156 c.dat
        dir d
        $ cd a
        $ ls
        dir e
        29116 f
        2557 g
        62596 h.lst
        $ cd e
        $ ls
        584 i
        $ cd ..
        $ cd ..
        $ cd d
        $ ls
        4060174 j
        8033020 d.log
        5626152 d.ext
        7214296 k`,
        expected: 95437,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `$ cd /
        $ ls
        dir a
        14848514 b.txt
        8504156 c.dat
        dir d
        $ cd a
        $ ls
        dir e
        29116 f
        2557 g
        62596 h.lst
        $ cd e
        $ ls
        584 i
        $ cd ..
        $ cd ..
        $ cd d
        $ ls
        4060174 j
        8033020 d.log
        5626152 d.ext
        7214296 k`,
        expected: 24933642,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
