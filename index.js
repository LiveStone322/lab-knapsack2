"use strict";

const fs = require("fs");
const path = require("path");
const { Heap } = require("heap-js");

class Subset {
  constructor(
    totalWeight,
    totalCost,
    shouldTake,
    height,
    capacity,
    nextItemProfit
  ) {
    this.totalWeight = totalWeight;
    this.totalCost = totalCost;
    this.shouldTake = shouldTake.splice(0);
    this.height = height;
    this.capacity = capacity;
    this.nextItemCost = nextItemProfit;
  }

  calcValue() {
    return this.totalWeight <= this.capacity
      ? this.totalCost + (this.capacity - this.totalWeight) * this.nextItemCost
      : -1;
  }
}

const data = fs
  .readFileSync(path.join(__dirname, "input.txt"))
  .toString()
  .split("\n")
  .map((e) => e.split(" ").map((n) => Number.parseFloat(n)))
  .map((p, idx) => [...p, p[1] / p[0], idx]);

const capacity = data[0][0];
data.shift();

function solve(capacity, n, items) {
  const maxHeap = new Heap((a, b) => b.calcValue() - a.calcValue());
  maxHeap.push(new Subset(0, 0, [], -1, capacity, 0));

  while (true) {
    const curSubset = maxHeap.top(1)[0];
    maxHeap.pop();

    const curHeight = curSubset.height + 1;

    if (curHeight == items.length) {
      return curSubset.shouldTake;
    }
    const curItem = items[curHeight];
    const nextItemProfit =
      curHeight + 1 < items.length ? items[curHeight + 1][2] : 0;
    maxHeap.push(
      new Subset(
        curSubset.totalWeight,
        curSubset.totalCost,
        curSubset.shouldTake,
        curHeight,
        capacity,
        nextItemProfit
      )
    );

    const nextShouldTake = curSubset.shouldTake.splice(0);
    nextShouldTake.push(curItem[3]);

    maxHeap.push(
      new Subset(
        curSubset.totalWeight + curItem[0],
        curSubset.totalCost + curItem[1],
        nextShouldTake,
        curHeight,
        capacity,
        nextItemProfit
      )
    );
  }
}

function print(props) {
  console.log(props);
  // console.log(`Предметы: ${props.items}`);
  // console.log(`Вес: ${props.weight}`);
  // console.log(`Цена: ${props.cost}`);
}

print(solve(capacity, data.length, data));
