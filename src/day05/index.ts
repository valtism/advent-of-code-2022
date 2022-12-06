import run from "aocrunner";

function parseInput(rawInput: string) {
  const [state, moves] = rawInput.split("\n\n");
  const st2 = state.split("\n").slice(0, -1);

  let st3: string[][] = [];
  for (const line of st2) {
    let pos = 1;
    for (let i = 1; i < line.length; i += 4) {
      const char = line[i];
      const empty = char === " ";
      if (!empty) {
        if (!st3[pos]) {
          st3[pos] = [];
        }
        st3[pos].unshift(char);
      }
      pos++;
    }
  }

  const moves2 = moves.split("\n").map((line) => {
    const match = line.split(" ");
    return [match[1], match[3], match[5]].map(Number);
  });

  return [st3, moves2] as const;
}

function part1(rawInput: string) {
  const [state, moves] = parseInput(rawInput);

  moves.forEach((move) => {
    const [num, from, to] = move;
    const temp: string[] = [];
    for (let i = 0; i < num; i++) {
      const char = state[from].pop();
      if (char) {
        temp.push(char);
      }
    }
    temp.forEach((char) => state[to].push(char));
  });

  return getTopCrates(state);
}

function part2(rawInput: string) {
  const [state, moves] = parseInput(rawInput);

  moves.forEach((move) => {
    const [num, from, to] = move;
    const crane = state[from].splice(-num);
    state[to] = state[to].concat(crane);
  });

  return getTopCrates(state);
}

function getTopCrates(state: string[][]) {
  let names: string = "";
  for (let i = 1; i < state.length; i++) {
    names = names.concat(state[i].at(-1)!);
  }
  return names;
}

run({
  part1: {
    tests: [
      {
        input: `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`,
        expected: "CMZ",
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`,
        expected: "MCD",
      },
    ],
    solution: part2,
  },
  trimTestInputs: false,
  onlyTests: false,
});
