import run from "aocrunner";

function parseInput(rawInput: string) {
  return rawInput.split("\n").map((line) => line.trim().split(""));
}

function part1(rawInput: string) {
  const forest = parseInput(rawInput);
  let visibleCount = 0;
  for (let y = 0; y < forest.length; y++) {
    for (let x = 0; x < forest[y].length; x++) {
      let visible =
        visibleLeft(forest, y, x) ||
        visibleRight(forest, y, x) ||
        visibleTop(forest, y, x) ||
        visibleBottom(forest, y, x);

      if (visible) {
        visibleCount++;
      }
    }
  }

  return visibleCount;
}

function visibleLeft(forest: string[][], y: number, x: number) {
  for (let left = x - 1; left >= 0; left--) {
    if (forest[y][left] >= forest[y][x]) {
      return false;
    }
  }
  return true;
}

function visibleRight(forest: string[][], y: number, x: number) {
  for (let right = x + 1; right < forest[y].length; right++) {
    if (forest[y][right] >= forest[y][x]) {
      return false;
    }
  }
  return true;
}

function visibleTop(forest: string[][], y: number, x: number) {
  for (let top = y - 1; top >= 0; top--) {
    if (forest[top][x] >= forest[y][x]) {
      return false;
    }
  }
  return true;
}

function visibleBottom(forest: string[][], y: number, x: number) {
  for (let bottom = y + 1; bottom < forest.length; bottom++) {
    if (forest[bottom][x] >= forest[y][x]) {
      return false;
    }
  }
  return true;
}

function part2(rawInput: string) {
  const forest = parseInput(rawInput);
  let scores: number[] = [];
  for (let y = 0; y < forest.length; y++) {
    for (let x = 0; x < forest[y].length; x++) {
      let score =
        scenicLeft(forest, y, x) *
        scenicRight(forest, y, x) *
        scenicTop(forest, y, x) *
        scenicBottom(forest, y, x);

      scores.push(score);
    }
  }

  return scores.reduce((a, b) => Math.max(a, b));
}

function scenicLeft(forest: string[][], y: number, x: number) {
  let score = 0;
  for (let left = x - 1; left >= 0; left--) {
    score++;
    if (forest[y][left] >= forest[y][x]) {
      return score;
    }
  }
  return score;
}

function scenicRight(forest: string[][], y: number, x: number) {
  let score = 0;
  for (let right = x + 1; right < forest[y].length; right++) {
    score++;
    if (forest[y][right] >= forest[y][x]) {
      return score;
    }
  }
  return score;
}

function scenicTop(forest: string[][], y: number, x: number) {
  let score = 0;
  for (let top = y - 1; top >= 0; top--) {
    score++;
    if (forest[top][x] >= forest[y][x]) {
      return score;
    }
  }
  return score;
}

function scenicBottom(forest: string[][], y: number, x: number) {
  let score = 0;
  for (let bottom = y + 1; bottom < forest.length; bottom++) {
    score++;
    if (forest[bottom][x] >= forest[y][x]) {
      return score;
    }
  }
  return score;
}

run({
  part1: {
    tests: [
      {
        input: `30373
        25512
        65332
        33549
        35390`,
        expected: 21,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `30373
        25512
        65332
        33549
        35390`,
        expected: 8,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
