import run from "aocrunner";

type Coord = [number, number];

function parseInput(rawInput: string) {
  return rawInput.split("\n").map((line) => line.trim().split(""));
}

function part1(rawInput: string) {
  const input = parseInput(rawInput);
  let start: Coord = [0, 0];
  let end: Coord = [0, 0];
  const heightMap = input.map((row, y) =>
    row.map((char, x) => {
      switch (char) {
        case "S":
          start = [y, x];
          return 0;
        case "E":
          end = [y, x];
          return 25;
        default:
          return char.charCodeAt(0) - 97;
      }
    }),
  );

  const xMin = 0;
  const xMax = heightMap[0].length - 1;
  const yMin = 0;
  const yMax = heightMap.length - 1;

  function isValid([y, x]: Coord) {
    return y >= yMin && y <= yMax && x >= xMin && x <= xMax;
  }

  function isMovable([y, x]: Coord, elevation: number) {
    const height = heightMap[y][x];
    return height <= elevation + 1;
  }

  function recurse(coords: Coord, steps: number) {
    const coordString = JSON.stringify(coords);
    const oldSteps = visited.get(coordString);
    if (oldSteps && oldSteps <= steps) {
      return;
    }
    visited.set(coordString, steps);

    const [y, x] = coords;
    const elevation = heightMap[y][x];
    const surrounds = getSurrounds(coords);
    surrounds
      .filter(isValid)
      .filter((coord) => isMovable(coord, elevation))
      .map((coord) => recurse(coord, steps + 1));
  }

  const visited = new Map<string, number>();
  recurse(start, 0);

  return visited.get(JSON.stringify(end));
}

function getSurrounds(coords: Coord): Coord[] {
  const [y, x] = coords;
  return [
    [y - 1, x],
    [y + 1, x],
    [y, x - 1],
    [y, x + 1],
  ];
}

function part2(rawInput: string) {
  const input = parseInput(rawInput);

  return;
}

run({
  part1: {
    tests: [
      {
        input: `Sabqponm
        abcryxxl
        accszExk
        acctuvwj
        abdefghi`,
        expected: 31,
      },
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
