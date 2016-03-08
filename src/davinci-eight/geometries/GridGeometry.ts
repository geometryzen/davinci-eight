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
   * @param [level = 0] {number}
   */
  constructor(options: GridGeometryOptions = {}, level = 0) {
    super('GridGeometry', gridVertexArrays(options), options.engine, incLevel(level))
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
