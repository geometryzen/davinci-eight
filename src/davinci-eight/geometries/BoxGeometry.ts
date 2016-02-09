import Geometry from '../core/Geometry';
import Primitive from '../core/Primitive';
import mustBeNumber from '../checks/mustBeNumber';
import CuboidPrimitivesBuilder from './CuboidPrimitivesBuilder';

/**
 * @module EIGHT
 * @submodule geometries
 */

function primitives(width: number, height: number, depth: number): Primitive[] {
    mustBeNumber('width', width)
    mustBeNumber('height', height)
    mustBeNumber('depth', depth)
    const builder = new CuboidPrimitivesBuilder()
    builder.width = width
    builder.height = height
    builder.depth = depth
    return builder.toPrimitives()
}

/**
 * A convenience class for creating a cuboid.
 *
 * @class BoxGeometry
 * @extends Geometry
 */
export default class BoxGeometry extends Geometry {
    /**
     * @class BoxGeometry
     * @constructor
     * @param width {number}
     * @param height {number}
     * @param depth {number}
     */
    constructor(width: number, height: number, depth: number) {
        super(primitives(width, height, depth))
    }
}
