import run from "aocrunner";

function parseInput(rawInput: string) {
  return rawInput.split("\n\n").map((set) => set.split("\n").map(Number));
}

function part1(rawInput: string) {
  const input = parseInput(rawInput);
  const totals = input.map((set) => set.reduce((acc, curr) => acc + curr));

  return totals.reduce((acc, curr) => (acc > curr ? acc : curr), 0);
}

function part2(rawInput: string) {
  const input = parseInput(rawInput);
  const totals = input.map((set) => set.reduce((acc, curr) => acc + curr));
  totals.sort((a, b) => b - a);

  return totals[0] + totals[1] + totals[2];
}

run({
  part1: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
