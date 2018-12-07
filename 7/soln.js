const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.resolve(__dirname, 'in2'), 'utf8');

const parser = () => /Step (.+?) must be finished before step (.+?) can begin./

const run = (lines) => {
  const steps = {};

  for (const line of lines) {
    const [_, stepBefore, stepToRun] = parser().exec(line);
    if (!steps[stepToRun]) steps[stepToRun] = new Set();
    if (!steps[stepBefore]) steps[stepBefore] = new Set();
    steps[stepToRun].add(stepBefore);
  }

  const order = [];

  while (Object.keys(steps).length > 0) {
    const options = Object.keys(steps).filter(key => steps[key].size === 0).sort();
    order.push(...options);
    for (const toUse of options) {
      for (const key in steps) {
        steps[key].delete(toUse);
      }
      delete steps[toUse];
    }
  }

  console.log(order.join(''));
}

run(input.split('\n'));
