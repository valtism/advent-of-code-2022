import run from "aocrunner";

function parseInput(rawInput: string) {
  return rawInput;
}

function part1(rawInput: string) {
  const input = parseInput(rawInput);

  return findMarker(input, 4);
}

function part2(rawInput: string) {
  const input = parseInput(rawInput);

  return findMarker(input, 14);
}

function findMarker(code: string, n: number) {
  for (let i = 0; i < code.length - n; i++) {
    const section = code.slice(i, i + n);
    if (section.length === new Set(section).size) {
      return i + n;
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
