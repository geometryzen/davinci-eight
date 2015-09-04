import expectArg = require('../checks/expectArg');
import isDefined = require('../checks/isDefined');

class Matrix2 {
  public elements: Float32Array;
  /**
   * Constructs the Matrix4 by wrapping a Float32Array.
   * @constructor
   */
  constructor(elements: Float32Array) {
    expectArg('elements', elements).toSatisfy(elements.length === 4, 'elements must have length 4');
    this.elements = elements;
  }
}

export = Matrix2;
