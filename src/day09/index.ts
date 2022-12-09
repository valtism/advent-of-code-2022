import run from "aocrunner";

type Direction = "U" | "R" | "D" | "L";

function parseInput(rawInput: string) {
  return rawInput.split("\n").map((line) => {
    const [dir, steps] = line.trim().split(" ");
    return [dir as Direction, Number(steps)] as const;
  });
}

function part1(rawInput: string) {
  const input = parseInput(rawInput);
  let head = [0, 0];
  let tail = [0, 0];
  const tailVisits = new Set<string>();
  input.forEach(([direction, steps]) => {
    for (let i = 0; i < steps; i++) {
      // [x, y]
      const coordinate = ["L", "R"].includes(direction) ? 0 : 1;
      const increment = ["L", "D"].includes(direction) ? -1 : 1;
      if (head[coordinate] - increment === tail[coordinate]) {
        tail[0] = head[0];
        tail[1] = head[1];
      }
      head[coordinate] += increment;
      tailVisits.add(JSON.stringify(tail));
    }
  });

  return tailVisits.size;
}

function part2(rawInput: string) {
  const input = parseInput(rawInput);
  const knots = new Array(10).fill(null).map((_) => [0, 0]);
  const tailVisits = new Set<string>();
  input.forEach(([direction, steps]) => {
    for (let i = 0; i < steps; i++) {
      let a = 1;
      for (let k = 0; k < knots.length; k++) {
        const knot = knots[k];
        if (k === 0) {
          // Head
          // [x, y]
          const coordinate = ["L", "R"].includes(direction) ? 0 : 1;
          const increment = ["L", "D"].includes(direction) ? -1 : 1;
          knot[coordinate] += increment;
          continue;
        }

        const aheadKnot = knots[k - 1];
        const xDiff = aheadKnot[0] - knot[0];
        const yDiff = aheadKnot[1] - knot[1];
        if (Math.abs(xDiff) > 1 || Math.abs(yDiff) > 1) {
          knot[0] += clamp(xDiff, -1, 1);
          knot[1] += clamp(yDiff, -1, 1);
        }
        if (k === knots.length - 1) {
          // Tail
          tailVisits.add(JSON.stringify(knot));
        }
      }
    }
  });

  return tailVisits.size;
}

function clamp(number: number, min: number, max: number) {
  return Math.max(Math.min(number, max), min);
}

run({
  part1: {
    tests: [
      {
        input: `R 4
        U 4
        L 3
        D 1
        R 4
        D 1
        L 5
        R 2`,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `R 4
        U 4
        L 3
        D 1
        R 4
        D 1
        L 5
        R 2`,
        expected: 1,
      },
      {
        input: `R 5
        U 8
        L 8
        D 3
        R 17
        D 10
        L 25
        U 20`,
        expected: 36,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
