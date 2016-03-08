import GeometryContainer from '../core/GeometryContainer'
import GeometryElements from '../core/GeometryElements'
import incLevel from '../base/incLevel'
import notSupported from '../i18n/notSupported'
import SphereBuilder from './SphereBuilder'
import SphereGeometryOptions from './SphereGeometryOptions'
import vertexArraysFromPrimitive from '../core/vertexArraysFromPrimitive'

/**
 * @module EIGHT
 * @submodule geometries
 */

/**
 * A convenience class for creating a sphere.
 *
 * @class SphereGeometry
 * @extends Geometry
 */
export default class SphereGeometry extends GeometryContainer {

  /**
   * @property _radius
   * @type number
   * @default 1
   * @private
   */
  private _radius = 1

  /**
   * @class SphereGeometry
   * @constructor
   * @param [options] {SphereGeometryOptions}
   * @param [level = 0] {number}
   */
  constructor(options: SphereGeometryOptions = {}, level = 0) {
    super('SphereGeometry', void 0, incLevel(level))
    const builder = new SphereBuilder()
    const ps = builder.toPrimitives()
    const iLen = ps.length
    for (let i = 0; i < iLen; i++) {
      const p = ps[i]
      const geometry = new GeometryElements('SphereGeometry', vertexArraysFromPrimitive(p), options.engine, 0)
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
   * @property radius
   * @type {number}
   */
  get radius(): number {
    return this._radius
  }
  set radius(radius: number) {
    this._radius = radius
    this.setPrincipalScale('radius', radius)
  }

  /**
   * @method getPrincipalScale
   * @param name {string}
   * @return {number}
   */
  getPrincipalScale(name: string): number {
    switch (name) {
      case 'radius': {
        return this._radius
      }
      default: {
        throw new Error(notSupported(`getPrincipalScale('${name}')`).message)
      }
    }
  }

  /**
   * @method setPrincipalScale
   * @param name {string}
   * @param value {number}
   * @return {void}
   */
  setPrincipalScale(name: string, value: number): void {
    switch (name) {
      case 'radius': {
        this._radius = value
      }
        break
      default: {
        throw new Error(notSupported(`setPrincipalScale('${name}')`).message)
      }
    }
    this.setScale(this._radius, this._radius, this._radius)
  }
}
