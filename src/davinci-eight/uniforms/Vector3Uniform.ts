import IFacet = require('../core/IFacet')
import IFacetVisitor = require('../core/IFacetVisitor')
import mustBeObject = require('../checks/mustBeObject')
import mustBeString = require('../checks/mustBeString')
import Shareable = require('../utils/Shareable')
import Vector3 = require('../math/Vector3')

var LOGGING_NAME = 'Vector3Uniform'

function contextBuilder() {
  return LOGGING_NAME
}

/**
 * @class Vector3Uniform
 */
class Vector3Uniform extends Shareable implements IFacet {
  private _name: string;
  private _vector: Vector3;
  /**
   * @class Vector3Uniform
   * @constructor
   * @param name {string}
   * @param vector {Vector3}
   */
  constructor(name: string, vector: Vector3) {
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
    visitor.uniformCartesian3(this._name, this._vector, canvasId)
  }
}

export = Vector3Uniform