import run from "aocrunner";

function parseInput(rawInput: string) {
  return rawInput;
}

function part1(rawInput: string) {
  const input = parseInput(rawInput);

  for (let i = 4; i < input.length; i++) {
    const last4 = [input[i - 4], input[i - 3], input[i - 2], input[i - 1]];
    if (new Set(last4).size === 4) {
      return i;
    }
  }
}

function part2(rawInput: string) {
  const input = parseInput(rawInput);

  for (let i = 14; i < input.length; i++) {
    const last14 = [
      input[i - 14],
      input[i - 13],
      input[i - 12],
      input[i - 11],
      input[i - 10],
      input[i - 9],
      input[i - 8],
      input[i - 7],
      input[i - 6],
      input[i - 5],
      input[i - 4],
      input[i - 3],
      input[i - 2],
      input[i - 1],
    ];
    if (new Set(last14).size === 14) {
      return i;
    }
  }
}

run({
  part1: {
    tests: [
      {
        input: `mjqjpqmgbljsphdztnvjfqwrcgsmlb`,
        expected: 7,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `mjqjpqmgbljsphdztnvjfqwrcgsmlb`,
        expected: 19,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
