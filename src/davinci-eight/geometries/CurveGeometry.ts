import GeometryElements from '../core/GeometryElements'
import CurveGeometryOptions from './CurveGeometryOptions'
import curveVertexArrays from './curveVertexArrays'
import incLevel from '../base/incLevel'

/**
 * @class CurveGeometry
 * @extends GeometryElements
 */
export default class CurveGeometry extends GeometryElements {

  /**
   * @class CurveGeometry
   * @constructor
   * @param [options] {CurveGeometryOptions}
   * @param [level = 0] {number}
   */
  constructor(options: CurveGeometryOptions = {}, level = 0) {
    super('CurveGeometry', curveVertexArrays(options), options.engine, incLevel(level))
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
}
