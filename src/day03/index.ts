import run from "aocrunner";

function parseInput(rawInput: string) {
  return rawInput.split("\n").map((line) => line.trim());
}

function part1(rawInput: string) {
  const input = parseInput(rawInput);
  const rucksacks = input.map((line) => [
    line.slice(0, line.length / 2).split(""),
    line.slice(line.length / 2).split(""),
  ]);
  const duplicates = rucksacks.map((rucksack) => {
    for (const item of rucksack[0]) {
      if (rucksack[1].includes(item)) {
        return item;
      }
    }
    throw new Error("No duplicate found");
  });
  const priorities = duplicates.map(getPriority);
  return priorities.reduce((a, b) => a + b);
}

function part2(rawInput: string) {
  const input = parseInput(rawInput);
  const rucksacks = input.map((line) => line.split(""));
  const badges: string[] = [];
  for (let i = 0; i < rucksacks.length; i += 3) {
    for (const item of rucksacks[i]) {
      if (rucksacks[i + 1].includes(item) && rucksacks[i + 2].includes(item)) {
        badges.push(item);
        break;
      }
    }
  }
  const priorities = badges.map(getPriority);
  return priorities.reduce((a, b) => a + b);
}

function getPriority(char: string) {
  const charCode = char.charCodeAt(0);
  return charCode > 90 ? charCode - 96 : charCode - 38;
}

run({
  part1: {
    tests: [
      {
        input: `vJrwpWtwJgWrhcsFMMfFFhFp
        jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
        PmmdzqPrVvPwwTWBwg
        wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
        ttgJtRGJQctTZtZT
        CrZsJsPPZsGzwwsLwLmpwMDw`,
        expected: 157,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `vJrwpWtwJgWrhcsFMMfFFhFp
        jqHRNqRjqzjGDLGLrsFMfFZSrLrFZsSL
        PmmdzqPrVvPwwTWBwg
        wMqvLMZHhHMvwLHjbvcjnnSBnvTQFn
        ttgJtRGJQctTZtZT
        CrZsJsPPZsGzwwsLwLmpwMDw`,
        expected: 70,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
