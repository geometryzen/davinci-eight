import GeometryBuffers from '../core/GeometryBuffers'
import GridGeometryOptions from './GridGeometryOptions'
import gridVertexArrays from './gridVertexArrays'

/**
 * @class GridGeometry
 * @extends GeometryBuffers
 */
export default class GridGeometry extends GeometryBuffers {

  /**
   * @class GridGeometry
   * @constructor
   * @param [options] {GridGeometryOptions}
   */
  constructor(options: GridGeometryOptions = {}) {
    super(gridVertexArrays(options))
  }
}
