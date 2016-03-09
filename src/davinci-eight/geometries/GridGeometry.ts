import GeometryElements from '../core/GeometryElements'
import GridGeometryOptions from './GridGeometryOptions'
import gridVertexArrays from './gridVertexArrays'
import incLevel from '../base/incLevel'

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
    this.setLoggingName('GridGeometry')
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
