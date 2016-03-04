import CurvePrimitive from './CurvePrimitive';
import DrawMode from '../../core/DrawMode';
import elementsForCurve from './elementsForCurve';
import mustBeGE from '../../checks/mustBeGE';
import mustBeInteger from '../../checks/mustBeInteger';
import mustBeLT from '../../checks/mustBeLT';
import Vertex from './Vertex'

/**
 * @module EIGHT
 * @submodule primitives
 */

export default class LineStrip extends CurvePrimitive {

  /**
   * @class LineStrip
   * @constructor
   * @param uSegments {number}
   */
  constructor(uSegments: number) {
    super(DrawMode.LINE_STRIP, uSegments, false)
    // We are rendering a LINE_STRIP so the figure will not be closed.
    this.elements = elementsForCurve(uSegments, false)
  }

  /**
   * @method vertex
   * @param uIndex {number} An integer. 0 <= uIndex < uLength
   * @return {Vertex}
   */
  vertex(uIndex: number): Vertex {
    mustBeInteger('uIndex', uIndex)
    mustBeGE('uIndex', uIndex, 0)
    mustBeLT('uIndex', uIndex, this.uLength)
    return this.vertices[uIndex]
  }
}
