import run from "aocrunner";

function parseInput(rawInput: string) {
  return rawInput
    .split("\n")
    .map((line) => line.split(" ") as ["A" | "B" | "C", "X" | "Y" | "Z"]);
}

const scores = {
  A: {
    X: 4,
    Y: 8,
    Z: 3,
  },
  B: {
    X: 1,
    Y: 5,
    Z: 9,
  },
  C: {
    X: 7,
    Y: 2,
    Z: 6,
  },
};

function part1(rawInput: string) {
  const input = parseInput(rawInput);
  return input.reduce((acc, [first, second]) => acc + scores[first][second], 0);
}

const scores2 = {
  A: {
    X: 3,
    Y: 4,
    Z: 8,
  },
  B: {
    X: 1,
    Y: 5,
    Z: 9,
  },
  C: {
    X: 2,
    Y: 6,
    Z: 7,
  },
};

function part2(rawInput: string) {
  const input = parseInput(rawInput);
  return input.reduce(
    (acc, [first, second]) => acc + scores2[first][second],
    0,
  );
}

run({
  part1: {
    tests: [
      {
        input: `A Y
B X
C Z`,
        expected: 15,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `A Y
B X
C Z`,
        expected: 12,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
