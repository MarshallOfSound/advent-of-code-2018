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

  const workers = {};
  const n_workers = 5;

  for (let i = 0; i < n_workers; i++) {
    workers[i] = { on: null, t: 0 };
  }
  
  let m = 0;
  while (Object.keys(steps).length > 0) {
    console.log('Minute:', m);

    for (let w = 0; w < n_workers; w++) {
      if (workers[`${w}`].t !== 0) {
        workers[`${w}`].t -= 1;
      }

      if (workers[`${w}`].t === 0 && workers[`${w}`].on) {
        const toUse = workers[`${w}`].on;
        order.push(toUse);

        for (const key in steps) {
          steps[key].delete(toUse);
        }
        delete steps[toUse];

        workers[`${w}`] = {
          on: null,
          t: 0,
        }
      }
    }

    const freeWorkers = Object.keys(workers).filter(worker => workers[worker].t === 0);
    console.log('Free:', freeWorkers);

    const options = Object.keys(steps).filter(
      key => steps[key].size === 0 && !Object.keys(workers).find(worker => workers[worker].on === key)
    ).sort().slice(0, freeWorkers.length);
    for (const toQueue of options) {
      workers[freeWorkers.pop()] = { on: toQueue, t: toQueue.charCodeAt(0) - 64 + 60 };
    }

    console.log('State:', workers);
    console.log('Order:', order.join(''), '\n\n');

    m += 1;
  }

  // console.log(steps);
  console.log(order.join(''));
  console.log(m - 1);
}

run(input.split('\n'));
