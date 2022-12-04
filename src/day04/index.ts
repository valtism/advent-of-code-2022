import run from "aocrunner";

function parseInput(rawInput: string) {
  return rawInput
    .split("\n")
    .map((line) => line.split(",").map((elf) => elf.split("-").map(Number)));
}

function part1(rawInput: string) {
  const input = parseInput(rawInput);
  return input.reduce((overlaps, section) => {
    const firstOverlaps =
      section[0][0] <= section[1][0] && section[0][1] >= section[1][1];
    const secondOverlaps =
      section[1][0] <= section[0][0] && section[1][1] >= section[0][1];
    if (firstOverlaps || secondOverlaps) {
      overlaps++;
    }
    return overlaps;
  }, 0);
}

function part2(rawInput: string) {
  const input = parseInput(rawInput);

  return input.reduce((overlaps, section) => {
    const noOverlap =
      section[0][1] < section[1][0] || section[0][0] > section[1][1];

    if (!noOverlap) {
      overlaps++;
    }
    return overlaps;
  }, 0);
}

run({
  part1: {
    tests: [
      {
        input: `2-4,6-8
        2-3,4-5
        5-7,7-9
        2-8,3-7
        6-6,4-6
        2-6,4-8`,
        expected: 2,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `2-4,6-8
        2-3,4-5
        5-7,7-9
        2-8,3-7
        6-6,4-6
        2-6,4-8`,
        expected: 4,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
