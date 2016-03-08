import ArrowBuilder from './ArrowBuilder'
import ArrowGeometryOptions from './ArrowGeometryOptions'
import GeometryContainer from '../core/GeometryContainer'
import GeometryElements from '../core/GeometryElements'
import incLevel from '../base/incLevel'
import isDefined from '../checks/isDefined'
import mustBeObject from '../checks/mustBeObject'
import R3 from '../math/R3'
import Spinor3 from '../math/Spinor3'
import Vector3 from '../math/Vector3'
import vertexArraysFromPrimitive from '../core/vertexArraysFromPrimitive'

/**
 * @module EIGHT
 * @submodule geometries
 */

/**
 * A convenience class for creating an arrow.
 *
 * @class ArrowGeometry
 * @extends Geometry
 * @deprecated Moving towards the GeometryBuilder architecture and ArrowBuilder.
 */
export default class ArrowGeometry extends GeometryContainer {

  /**
   * @class ArrowGeometry
   * @constructor
   * @param [options] {ArrowGeometryOptios} The initial axis of the arrow.
   * @param [level = 0] {number}
   */
  constructor(options: ArrowGeometryOptions = {}, level = 0) {
    super('ArrowGeometry', options.tilt, incLevel(level))
    mustBeObject('options', options)

    const builder = new ArrowBuilder(R3.e2, R3.e3, false)
    builder.stress.copy(isDefined(options.stress) ? options.stress : Vector3.vector(1, 1, 1))
    builder.tilt.copy(isDefined(options.tilt) ? options.tilt : Spinor3.one())
    builder.offset.copy(isDefined(options.offset) ? options.offset : Vector3.zero())
    const ps = builder.toPrimitives()

    const iLen = ps.length
    for (let i = 0; i < iLen; i++) {
      const dataSource = ps[i]
      const geometry = new GeometryElements('ArrowGeometry', vertexArraysFromPrimitive(dataSource), options.engine, 0)
      this.addPart(geometry)
      geometry.release()
    }
  }

  /**
   * @method destructor
   * @param level {number}
   * @return {void}
   * @protected
   */
  protected destructor(level: number): void {
    super.destructor(incLevel(level))
  }

  /**
   * @method getPrincipalScale
   * @param name {string}
   * @return {number}
   */
  getPrincipalScale(name: string): number {
    return this.scaling.getElement(0, 0)
  }

  /**
   * @method setPrincipalScale
   * @param name {string}
   * @param value {number}
   * @return {void}
   */
  setPrincipalScale(name: string, value: number): void {
    this.scaling.setElement(0, 0, value)
    this.scaling.setElement(1, 1, value)
    this.scaling.setElement(2, 2, value)
  }
}
