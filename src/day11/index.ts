import run from "aocrunner";

type Monkey = {
  id: number;
  items: number[];
  operation: (old: number) => number;
  test: number;
  ifTrue: number;
  ifFalse: number;
  inspected: number;
};

function parseInput(rawInput: string) {
  return rawInput
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .split("\n\n")
    .map((segment) =>
      segment.split("\n").reduce((monkey, line, index) => {
        switch (index) {
          case 0:
            monkey["id"] = Number(line.match(/\d+/g)![0]);
            break;
          case 1:
            monkey["items"] = line.match(/\d+/g)!.map(Number);
            break;
          case 2:
            monkey["operation"] = (old) => {
              const op = line.match(/\*|\+/g)![0];
              const thing = line.match(/\d+/g)
                ? Number(line.match(/\d+/g)![0])
                : old;

              return op === "+" ? old + thing : old * thing;
            };
            break;
          case 3:
            monkey["test"] = Number(line.match(/\d+/g)![0]);
            break;
          case 4:
            monkey["ifTrue"] = Number(line.match(/\d+/g)![0]);
            break;
          case 5:
            monkey["ifFalse"] = Number(line.match(/\d+/g)![0]);
            break;
          default:
            throw new Error("Too far");
        }
        monkey["inspected"] = 0;
        return monkey;
      }, {} as Monkey),
    );
}

function part1(rawInput: string) {
  const monkeys = parseInput(rawInput);

  for (let round = 0; round < 20; round++) {
    monkeys.forEach((monkey) => {
      while (monkey.items.length) {
        monkey.inspected++;
        let inspect = monkey.items.shift()!;
        inspect = monkey.operation(inspect);
        inspect = Math.floor(inspect / 3);
        const nextMonkey =
          inspect % monkey.test === 0 ? monkey.ifTrue : monkey.ifFalse;
        monkeys[nextMonkey].items.push(inspect);
      }
    });
  }

  const inspectedCounts = monkeys.map((monkey) => monkey.inspected);
  inspectedCounts.sort((a, b) => b - a);

  return inspectedCounts[0] * inspectedCounts[1];
}

function part2(rawInput: string) {
  const monkeys = parseInput(rawInput);

  const monkeyModulo = monkeys
    .map((monkey) => monkey.test)
    .reduce((acc, curr) => acc * curr);

  for (let round = 0; round < 10000; round++) {
    monkeys.forEach((monkey) => {
      while (monkey.items.length) {
        monkey.inspected++;
        let inspect = monkey.items.shift()!;
        inspect = monkey.operation(inspect);
        inspect = inspect % monkeyModulo;
        const nextMonkey =
          inspect % monkey.test === 0 ? monkey.ifTrue : monkey.ifFalse;
        monkeys[nextMonkey].items.push(inspect);
      }
    });
  }

  const inspectedCounts = monkeys.map((monkey) => monkey.inspected);
  inspectedCounts.sort((a, b) => b - a);

  return inspectedCounts[0] * inspectedCounts[1];
}

run({
  part1: {
    tests: [
      {
        input: `Monkey 0:
        Starting items: 79, 98
        Operation: new = old * 19
        Test: divisible by 23
          If true: throw to monkey 2
          If false: throw to monkey 3
      
      Monkey 1:
        Starting items: 54, 65, 75, 74
        Operation: new = old + 6
        Test: divisible by 19
          If true: throw to monkey 2
          If false: throw to monkey 0
      
      Monkey 2:
        Starting items: 79, 60, 97
        Operation: new = old * old
        Test: divisible by 13
          If true: throw to monkey 1
          If false: throw to monkey 3
      
      Monkey 3:
        Starting items: 74
        Operation: new = old + 3
        Test: divisible by 17
          If true: throw to monkey 0
          If false: throw to monkey 1`,
        expected: 10605,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `Monkey 0:
        Starting items: 79, 98
        Operation: new = old * 19
        Test: divisible by 23
          If true: throw to monkey 2
          If false: throw to monkey 3
      
      Monkey 1:
        Starting items: 54, 65, 75, 74
        Operation: new = old + 6
        Test: divisible by 19
          If true: throw to monkey 2
          If false: throw to monkey 0
      
      Monkey 2:
        Starting items: 79, 60, 97
        Operation: new = old * old
        Test: divisible by 13
          If true: throw to monkey 1
          If false: throw to monkey 3
      
      Monkey 3:
        Starting items: 74
        Operation: new = old + 3
        Test: divisible by 17
          If true: throw to monkey 0
          If false: throw to monkey 1`,
        expected: 2713310158,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});
