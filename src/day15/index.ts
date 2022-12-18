import run from "aocrunner";

function parseInput(rawInput: string) {
  return rawInput.split("\n");
}

/**  
               1    1    2    2
     0    5    0    5    0    5
-2 ..........#.................
-1 .........###................
 0 ....S...#####...............
 1 .......#######........S.....
 2 ......#########S............
 3 .....###########SB..........
 4 ....#############...........
 5 ...###############..........
 6 ..#################.........
 7 .#########S##|||||S#........
 8 ..############|||||.........
 9 ...############|||-.........
10 ....B###########|--.........
11 ..S..###########.--.........
12 ......#########...-.........
13 .......#######..............
14 ........#####.S.......S.....
15 B........###................
16 ..........#SB...............
17 ................S..........B
18 ....S.......-...............
19 .........s##-...............
20 .........##-=S......S........
21 .........#..................
22 .......................B....

8,7 (9) | 16,7 (5) => 14,10
0,0 (3) | 3,0 (1) => 2,1
0,0 (3) | 3,0 (2) => 1,2
0,0 (3) | 2,1 (1) => 1,2

 */

const TARGET = 10;

function part1(rawInput: string) {
  const input = parseInput(rawInput);
  const sensors = input.map((line) => {
    const [x, y, beaconX, beaconY] = line.match(/-?\d+/g)!.map(Number);
    const distance = Math.abs(x - beaconX) + Math.abs(y - beaconY);
    return { x, y, beaconX, beaconY, distance };
  });
  const xPositions = new Set<number>();

  for (const sensor of sensors) {
    const targetDiff = sensor.distance - Math.abs(sensor.y - TARGET);
    if (targetDiff < 0) {
      continue;
    }
    const xPoses = range(sensor.x - targetDiff, sensor.x + targetDiff);
    xPoses.forEach((pos) => xPositions.add(pos));
  }

  for (const { x, y, beaconX, beaconY } of sensors) {
    if (y === TARGET) {
      xPositions.delete(x);
    }
    if (beaconY === TARGET) {
      xPositions.delete(beaconX);
    }
  }

  return xPositions.size;
}

function range(from: number, to: number) {
  const numbers: number[] = [];
  for (let i = from; i <= to; i++) {
    numbers.push(i);
  }
  return numbers;
}

type Coord = { x: number; y: number };
type Edge = { slope: number; yIntercept: number };

const BOUNDS = { min: 0, max: 20 };
function part2(rawInput: string) {
  const input = parseInput(rawInput);
  const sensors = input.map((line) => {
    const [x, y, beaconX, beaconY] = line.match(/-?\d+/g)!.map(Number);
    const distance = Math.abs(x - beaconX) + Math.abs(y - beaconY);
    const corners = {
      left: { x: x - distance, y },
      right: { x: x + distance, y },
      top: { x: x, y: y - distance },
      bottom: { x: x, y: y + distance },
    };
    return { x, y, beaconX, beaconY, distance, corners };
  });

  const edges: Edge[] = [];
  sensors.forEach(({ corners }) => {
    edges.push(getLine(corners.top, corners.right));
    edges.push(getLine(corners.right, corners.bottom));
    edges.push(getLine(corners.bottom, corners.left));
    edges.push(getLine(corners.left, corners.top));
  });

  const posEdges = edges.filter((edge) => edge.slope === 1);
  const negEdges = edges.filter((edge) => edge.slope === -1);

  const intersections = new Set<string>();
  posEdges.forEach((posEdge) => {
    negEdges.forEach((negEdge) => {
      const x = (posEdge.yIntercept - negEdge.yIntercept) / 2;
      const y = (posEdge.yIntercept + negEdge.yIntercept) / 2;
      // if ()
      if (x < BOUNDS.min || x > BOUNDS.max || !Number.isInteger(x)) return;
      if (y < BOUNDS.min || y > BOUNDS.max || !Number.isInteger(y)) return;
      intersections.add(JSON.stringify({ x, y }));
    });
  });

  const candidates: Coord[] = [];
  for (const intersection of intersections) {
    const coord: Coord = JSON.parse(intersection);
    const surrounds = getSurrounds(coord);
    surrounds.forEach((surround) => {
      if (surround.x === 14 && surround.y === 11) {
        console.log("here");
        
      }
      const surroundSurrounds = getSurrounds(surround);
      if (
        surroundSurrounds.every((surroundSurround) =>
          intersections.has(JSON.stringify(surroundSurround)),
        )
      ) {
        candidates.push(surround);
      }
    });
  }
  console.log("a", intersections.size);

  console.log("b", candidates.length);

  const result = candidates.filter((candidate) => {
    return sensors.every((sensor) => {
      const actualDistance = manhattanDistance(candidate, {
        x: sensor.x,
        y: sensor.y,
      });
      return sensor.distance < actualDistance;
    });
  });

  console.log(result);

  // const edges = new Set<string>();

  // sensors.forEach(({ x, y, distance }) => {
  //   console.log("sensor", x, y);

  //   for (let i = 0; i <= distance; i++) {
  //     const j = distance - i;
  //     const coords = [
  //       {
  //         x: x - i,
  //         y: y + j,
  //       },
  //       {
  //         x: x - i,
  //         y: y - j,
  //       },
  //       {
  //         x: x + i,
  //         y: y + j,
  //       },
  //       {
  //         x: x + i,
  //         y: y - j,
  //       },
  //     ];
  //     const jsons = coords.map((coord) => JSON.stringify(coord));
  //     jsons.forEach((json) => {
  //       edges.add(json);
  //     });
  //   }
  // });

  // console.log("edges", edges.size);

  // const candidates = new Set<string>();

  // for (const edge of edges) {
  //   const coord = JSON.parse(edge);
  //   const surrounds = getSurrounds(coord);
  //   surrounds.forEach((surround) => {
  //     const surroundSurrounds = getSurrounds(surround);
  //     if (surroundSurrounds.every((ss) => edges.has(JSON.stringify(ss)))) {
  //       candidates.add(JSON.stringify(surround));
  //     }
  //   });
  // }

  // console.log("candidates", candidates.size);

  // const results: string[] = [];
  // candidates.forEach((candidate) => {
  //   const candidateCoord: Coord = JSON.parse(candidate);
  //   const inRange = sensors.some((sensor) => {
  //     const sensorCoord = {
  //       x: sensor.x,
  //       y: sensor.y,
  //     };
  //     const distance = manhattanDistance(candidateCoord, sensorCoord);
  //     return sensor.distance >= distance;
  //   });
  //   if (!inRange) {
  //     results.push(candidate);
  //   }
  // });

  // console.log("results", results.length);

  // if (results.length > 1) {
  //   throw new Error("Too many");
  // }
  // const res: Coord = JSON.parse(results[0]);

  // return res.x * 4000000 + res.y;
}

function getLine(coord1: Coord, coord2: Coord) {
  const slope = (coord1.y - coord2.y) / (coord1.x - coord2.x);
  const yIntercept = -coord1.x * slope + coord1.y;
  return { slope, yIntercept };
}

function manhattanDistance(coord1: Coord, coord2: Coord) {
  return Math.abs(coord1.x - coord2.x) + Math.abs(coord1.y - coord2.y);
}

function getSurrounds({ x, y }: Coord) {
  return [
    { x: x + 1, y },
    { x: x - 1, y },
    { x, y: y + 1 },
    { x, y: y - 1 },
  ];
}

function permutate<T>(array: T[], callback: (first: T, second: T) => void) {
  for (let i = 0; i < array.length; i++) {
    const first = array[i];
    for (let j = i + 1; j < array.length; j++) {
      const second = array[j];
      callback(first, second);
    }
  }
}

run({
  part1: {
    tests: [
      {
        input: `Sensor at x=2, y=18: closest beacon is at x=-2, y=15
        Sensor at x=9, y=16: closest beacon is at x=10, y=16
        Sensor at x=13, y=2: closest beacon is at x=15, y=3
        Sensor at x=12, y=14: closest beacon is at x=10, y=16
        Sensor at x=10, y=20: closest beacon is at x=10, y=16
        Sensor at x=14, y=17: closest beacon is at x=10, y=16
        Sensor at x=8, y=7: closest beacon is at x=2, y=10
        Sensor at x=2, y=0: closest beacon is at x=2, y=10
        Sensor at x=0, y=11: closest beacon is at x=2, y=10
        Sensor at x=20, y=14: closest beacon is at x=25, y=17
        Sensor at x=17, y=20: closest beacon is at x=21, y=22
        Sensor at x=16, y=7: closest beacon is at x=15, y=3
        Sensor at x=14, y=3: closest beacon is at x=15, y=3
        Sensor at x=20, y=1: closest beacon is at x=15, y=3`,
        expected: 26,
      },
      // {
      //   input: `Sensor at x=2332081, y=2640840: closest beacon is at x=2094728, y=2887414
      //   Sensor at x=3048293, y=3598671: closest beacon is at x=3872908, y=3598272
      //   Sensor at x=2574256, y=3973583: closest beacon is at x=2520711, y=4005929
      //   Sensor at x=3011471, y=2514567: closest beacon is at x=2999559, y=2558817
      //   Sensor at x=3718881, y=2593817: closest beacon is at x=2999559, y=2558817
      //   Sensor at x=2388052, y=2201955: closest beacon is at x=2163809, y=1961540
      //   Sensor at x=3783125, y=3897169: closest beacon is at x=3872908, y=3598272
      //   Sensor at x=1864613, y=3918152: closest beacon is at x=2520711, y=4005929
      //   Sensor at x=2850099, y=689863: closest beacon is at x=3231146, y=2000000
      //   Sensor at x=3431652, y=2328669: closest beacon is at x=3231146, y=2000000
      //   Sensor at x=3480248, y=3999492: closest beacon is at x=3872908, y=3598272
      //   Sensor at x=455409, y=3347614: closest beacon is at x=-399822, y=4026621
      //   Sensor at x=2451938, y=2950107: closest beacon is at x=2094728, y=2887414
      //   Sensor at x=1917790, y=3194437: closest beacon is at x=2094728, y=2887414
      //   Sensor at x=3947393, y=3625984: closest beacon is at x=3872908, y=3598272
      //   Sensor at x=1615064, y=2655330: closest beacon is at x=2094728, y=2887414
      //   Sensor at x=3630338, y=1977851: closest beacon is at x=3231146, y=2000000
      //   Sensor at x=3878266, y=3019867: closest beacon is at x=3872908, y=3598272
      //   Sensor at x=2837803, y=2395749: closest beacon is at x=2999559, y=2558817
      //   Sensor at x=3979396, y=3697962: closest beacon is at x=3872908, y=3598272
      //   Sensor at x=109399, y=250528: closest beacon is at x=929496, y=-688981
      //   Sensor at x=2401381, y=3518884: closest beacon is at x=2520711, y=4005929
      //   Sensor at x=3962391, y=71053: closest beacon is at x=5368730, y=-488735
      //   Sensor at x=1751119, y=97658: closest beacon is at x=929496, y=-688981
      //   Sensor at x=2932155, y=2967347: closest beacon is at x=2999559, y=2558817
      //   Sensor at x=3326630, y=2845463: closest beacon is at x=2999559, y=2558817
      //   Sensor at x=3959042, y=1734156: closest beacon is at x=3231146, y=2000000
      //   Sensor at x=675279, y=1463916: closest beacon is at x=2163809, y=1961540
      //   Sensor at x=3989603, y=3500749: closest beacon is at x=3872908, y=3598272
      //   Sensor at x=1963470, y=2288355: closest beacon is at x=2163809, y=1961540`,
      //   expected: 5461729,
      // },
      // {
      //   input: `Sensor at x=2557568, y=3759110: closest beacon is at x=2594124, y=3746832
      //   Sensor at x=2684200, y=1861612: closest beacon is at x=2816974, y=2000000
      //   Sensor at x=1003362, y=1946094: closest beacon is at x=1972523, y=2563441
      //   Sensor at x=2142655, y=1481541: closest beacon is at x=1932524, y=967542
      //   Sensor at x=2796219, y=1955744: closest beacon is at x=2816974, y=2000000
      //   Sensor at x=3890832, y=1818644: closest beacon is at x=3454717, y=2547103
      //   Sensor at x=2828842, y=1921726: closest beacon is at x=2816974, y=2000000
      //   Sensor at x=2065227, y=583957: closest beacon is at x=1932524, y=967542
      //   Sensor at x=2725784, y=2088998: closest beacon is at x=2816974, y=2000000
      //   Sensor at x=3574347, y=927734: closest beacon is at x=1932524, y=967542
      //   Sensor at x=2939312, y=2652370: closest beacon is at x=3454717, y=2547103
      //   Sensor at x=2495187, y=3681541: closest beacon is at x=2431306, y=3703654
      //   Sensor at x=2878002, y=2054681: closest beacon is at x=2816974, y=2000000
      //   Sensor at x=1539310, y=3235516: closest beacon is at x=1972523, y=2563441
      //   Sensor at x=545413, y=533006: closest beacon is at x=-538654, y=69689
      //   Sensor at x=1828899, y=3980292: closest beacon is at x=2431306, y=3703654
      //   Sensor at x=3275729, y=2937931: closest beacon is at x=3454717, y=2547103
      //   Sensor at x=600131, y=3861189: closest beacon is at x=2431306, y=3703654
      //   Sensor at x=2089895, y=28975: closest beacon is at x=1932524, y=967542
      //   Sensor at x=2960402, y=3942666: closest beacon is at x=2594124, y=3746832
      //   Sensor at x=3785083, y=3905392: closest beacon is at x=2594124, y=3746832
      //   Sensor at x=1721938, y=1077173: closest beacon is at x=1932524, y=967542
      //   Sensor at x=2515156, y=3751221: closest beacon is at x=2594124, y=3746832
      //   Sensor at x=2469423, y=2109095: closest beacon is at x=2816974, y=2000000
      //   Sensor at x=1776986, y=904092: closest beacon is at x=1932524, y=967542
      //   Sensor at x=2789294, y=3316115: closest beacon is at x=2594124, y=3746832
      //   Sensor at x=3538757, y=2695066: closest beacon is at x=3454717, y=2547103
      //   Sensor at x=2299738, y=2708004: closest beacon is at x=1972523, y=2563441
      //   Sensor at x=2388366, y=3234346: closest beacon is at x=2431306, y=3703654`,
      //   expected: 5403290,
      // },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: `Sensor at x=8, y=7: closest beacon is at x=2, y=10
      //   Sensor at x=16, y=7: closest beacon is at x=15, y=3`,
      //   expected: 26,
      // },
      {
        input: `Sensor at x=2, y=18: closest beacon is at x=-2, y=15
        Sensor at x=9, y=16: closest beacon is at x=10, y=16
        Sensor at x=13, y=2: closest beacon is at x=15, y=3
        Sensor at x=12, y=14: closest beacon is at x=10, y=16
        Sensor at x=10, y=20: closest beacon is at x=10, y=16
        Sensor at x=14, y=17: closest beacon is at x=10, y=16
        Sensor at x=8, y=7: closest beacon is at x=2, y=10
        Sensor at x=2, y=0: closest beacon is at x=2, y=10
        Sensor at x=0, y=11: closest beacon is at x=2, y=10
        Sensor at x=20, y=14: closest beacon is at x=25, y=17
        Sensor at x=17, y=20: closest beacon is at x=21, y=22
        Sensor at x=16, y=7: closest beacon is at x=15, y=3
        Sensor at x=14, y=3: closest beacon is at x=15, y=3
        Sensor at x=20, y=1: closest beacon is at x=15, y=3`,
        expected: 56000011,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});
