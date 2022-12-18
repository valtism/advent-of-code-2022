import run from "aocrunner";

type Coord = { x: number; y: number; z: number };
type Bounds = {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
};

function parseInput(rawInput: string) {
  return rawInput.split("\n").map((line) => {
    const [x, y, z] = line.match(/\d+/g)!.map(Number);
    return { x, y, z };
  });
}

function part1(rawInput: string) {
  const coordinates = parseInput(rawInput);

  const cubes = new Set<string>();
  coordinates.forEach((coord) => {
    cubes.add(JSON.stringify(coord));
  });

  let sides = 0;
  coordinates.forEach((coord) => {
    const surrounds = getSurrounds(coord);
    surrounds.forEach((surround) => {
      if (!cubes.has(JSON.stringify(surround))) {
        sides++;
      }
    });
  });

  return sides;
}

function part2(rawInput: string) {
  const input = parseInput(rawInput);

  const blocks = new Set<string>();
  input.forEach((coord) => {
    blocks.add(JSON.stringify(coord));
  });

  const bounds = getBounds(input);

  let count = 0;
  const visited = new Set<string>();
  const startPoint = { x: bounds.minX, y: bounds.minY, z: bounds.minZ };
  const stack: Coord[] = [startPoint];
  while (stack.length) {
    const coord = stack.pop()!;
    const coordString = JSON.stringify(coord);
    if (blocks.has(coordString)) {
      count++;
      continue;
    }
    if (visited.has(coordString)) continue;
    visited.add(coordString);
    if (!isInBounds(coord, bounds)) continue;
    const surrounds = getSurrounds(coord);
    surrounds.forEach((surround) => stack.push(surround));
  }

  return count;
}

function getSurrounds({ x, y, z }: Coord) {
  return [
    { x: x + 1, y: y, z: z },
    { x: x - 1, y: y, z: z },
    { x: x, y: y + 1, z: z },
    { x: x, y: y - 1, z: z },
    { x: x, y: y, z: z + 1 },
    { x: x, y: y, z: z - 1 },
  ];
}

function isInBounds(
  { x, y, z }: Coord,
  { minX, maxX, maxY, maxZ, minY, minZ }: Bounds,
) {
  return (
    x >= minX && x <= maxX && y >= minY && y <= maxY && z >= minZ && z <= maxZ
  );
}

function getBounds(input: Coord[]) {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;

  input.forEach(({ x, y, z }) => {
    if (x < minX) {
      minX = x;
    }
    if (x > maxX) {
      maxX = x;
    }
    if (y < minY) {
      minY = y;
    }
    if (y > maxY) {
      maxY = y;
    }
    if (z < minZ) {
      minZ = z;
    }
    if (z > maxZ) {
      maxZ = z;
    }
  });

  return {
    minX: minX - 1,
    maxX: maxX + 1,
    minY: minY - 1,
    maxY: maxY + 1,
    minZ: minZ - 1,
    maxZ: maxZ + 1,
  };
}

run({
  part1: {
    tests: [
      {
        input: `1,1,1
        2,1,1`,
        expected: 10,
      },
      {
        input: `2,2,2
        1,2,2
        3,2,2
        2,1,2
        2,3,2
        2,2,1
        2,2,3
        2,2,4
        2,2,6
        1,2,5
        3,2,5
        2,1,5
        2,3,5`,
        expected: 64,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `2,2,2
        1,2,2
        3,2,2
        2,1,2
        2,3,2
        2,2,1
        2,2,3
        2,2,4
        2,2,6
        1,2,5
        3,2,5
        2,1,5
        2,3,5`,
        expected: 58,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
