import VectorN = require('../math/VectorN');

class ElementsAttribute {
  public vector: VectorN<number>;
  public size: number;
  constructor(vector: VectorN<number>, size: number) {
    this.vector = vector;
    this.size = size;
  }
}
export = ElementsAttribute;