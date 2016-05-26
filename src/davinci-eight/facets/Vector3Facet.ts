import {Facet} from '../core/Facet';
import {FacetVisitor} from '../core/FacetVisitor';
import mustBeObject from '../checks/mustBeObject';
import mustBeString from '../checks/mustBeString';
import Vector3 from '../math/Vector3';

/**
 * @module EIGHT
 * @submodule facets
 */

var LOGGING_NAME = 'Vector3Facet'

function contextBuilder() {
  return LOGGING_NAME
}

/**
 * Updates a <code>uniform vec3</code> shader parameter from a <code>Vector3</code>.
 *
 * @class Vector3Facet
 */
export default class Vector3Facet implements Facet {

  /**
   * @property _name
   * @type string
   * @private
   */
  private _name: string;

  /**
   * @property _vector
   * @type Vector3
   * @private
   */
  private _vector: Vector3;

  /**
   * @class Vector3Facet
   * @constructor
   * @param name {string}
   * @param vector {Vector3}
   */
  constructor(name: string, vector: Vector3) {
    this._name = mustBeString('name', name, contextBuilder)
    this._vector = mustBeObject('vector', vector, contextBuilder)
  }

  /**
   * @method getProperty
   * @param name {string}
   * @return {number[]}
   */
  getProperty(name: string): number[] {
    return void 0
  }

  /**
   * @method setProperty
   * @param name {string}
   * @param value {number[]}
   * @return {Vector3Facet}
   * @chainable
   */
  setProperty(name: string, value: number[]): Vector3Facet {
    return this
  }

  /**
   * @method setUniforms
   * @param visitor {FacetVisitor}
   * @return {void}
   */
  setUniforms(visitor: FacetVisitor): void {
    const v = this._vector
    visitor.uniform3f(this._name, v.x, v.y, v.z)
  }
}
