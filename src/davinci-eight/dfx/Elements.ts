import expectArg = require('../checks/expectArg');

class Elements {
  public indices: number[];
  public attributes: {[name:string]:number[]} = {};
  constructor(indices: number[], attributes: { [name: string]: number[] }) {
    expectArg('indices', indices).toBeObject();
    expectArg('attributes', attributes).toBeObject();
    this.indices = indices;
    this.attributes = attributes;
  }
}

export = Elements;