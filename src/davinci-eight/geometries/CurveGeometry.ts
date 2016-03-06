import GeometryElements from '../core/GeometryElements'
import CurveGeometryOptions from './CurveGeometryOptions'
import curveVertexArrays from './curveVertexArrays'

/**
 * @class CurveGeometry
 * @extends GeometryElements
 */
export default class CurveGeometry extends GeometryElements {

  /**
   * @class CurveGeometry
   * @constructor
   * @param [options] {CurveGeometryOptions}
   */
  constructor(options: CurveGeometryOptions = {}) {
    super(curveVertexArrays(options), options.engine)
  }
}
