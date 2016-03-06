import GeometryElements from '../core/GeometryElements'
import GridGeometryOptions from './GridGeometryOptions'
import gridVertexArrays from './gridVertexArrays'

/**
 * @class GridGeometry
 * @extends GeometryElements
 */
export default class GridGeometry extends GeometryElements {

  /**
   * @class GridGeometry
   * @constructor
   * @param [options] {GridGeometryOptions}
   */
  constructor(options: GridGeometryOptions = {}) {
    super(gridVertexArrays(options), options.engine)
  }
}
