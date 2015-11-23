import IFacet = require('../core/IFacet')
import IFacetVisitor = require('../core/IFacetVisitor')
import mustBeObject = require('../checks/mustBeObject')
import mustBeString = require('../checks/mustBeString')
import Shareable = require('../utils/Shareable')
import R3 = require('../math/R3')

var LOGGING_NAME = 'Vector3Facet'

function contextBuilder() {
  return LOGGING_NAME
}

/**
 * @class Vector3Facet
 */
class Vector3Facet extends Shareable implements IFacet {
  private _name: string;
  private _vector: R3;
  /**
   * @class Vector3Facet
   * @constructor
   * @param name {string}
   * @param vector {R3}
   */
  constructor(name: string, vector: R3) {
    super('Vector3Facet')
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
  setUniforms(visitor: IFacetVisitor, canvasId?: number): void {
    visitor.vec3(this._name, this._vector, canvasId)
  }
}

export = Vector3Facet