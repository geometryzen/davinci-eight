import IFacet = require('../core/IFacet')
import IFacetVisitor = require('../core/IFacetVisitor')
import mustBeObject = require('../checks/mustBeObject')
import mustBeString = require('../checks/mustBeString')
import Shareable = require('../utils/Shareable')
import MutableVectorE3 = require('../math/MutableVectorE3')

var LOGGING_NAME = 'Vector3Uniform'

function contextBuilder() {
  return LOGGING_NAME
}

/**
 * @class Vector3Uniform
 */
class Vector3Uniform extends Shareable implements IFacet {
  private _name: string;
  private _vector: MutableVectorE3;
  /**
   * @class Vector3Uniform
   * @constructor
   * @param name {string}
   * @param vector {MutableVectorE3}
   */
  constructor(name: string, vector: MutableVectorE3) {
    super('Vector3Uniform')
    this._name = mustBeString('name', name, contextBuilder)
    this._vector = mustBeObject('vector', vector, contextBuilder)
  }
  protected destructor(): void {
    super.destructor()
  }
  getProperty(name: string): number[] {
    return void 0;
  }
  setProperty(name:string, value: number[]): void {
  }
  setUniforms(visitor: IFacetVisitor, canvasId: number): void {
    visitor.uniformVectorE3(this._name, this._vector, canvasId)
  }
}

export = Vector3Uniform