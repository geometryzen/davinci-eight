import GeometryBuffers from '../core/GeometryBuffers'
import CurveGeometryOptions from './CurveGeometryOptions'
import curveVertexArrays from './curveVertexArrays'

/**
 * @class CurveGeometry
 * @extends GeometryBuffers
 */
export default class CurveGeometry extends GeometryBuffers {

  /**
   * @class CurveGeometry
   * @constructor
   * @param [options] {CurveGeometryOptions}
   */
  constructor(options: CurveGeometryOptions = {}) {
    super(curveVertexArrays(options))
  }
}
