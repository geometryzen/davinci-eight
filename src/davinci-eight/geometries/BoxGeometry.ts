import Geometry from '../scene/Geometry';
import Primitive from '../core/Primitive';
import mustBeNumber from '../checks/mustBeNumber';
import CuboidGeometry from './CuboidGeometry';

function primitives(width: number, height: number, depth: number): Primitive[] {
    mustBeNumber('width', width)
    mustBeNumber('height', height)
    mustBeNumber('depth', depth)
    const builder = new CuboidGeometry()
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
