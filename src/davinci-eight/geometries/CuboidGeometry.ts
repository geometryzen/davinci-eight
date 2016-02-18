import GeometryContainer from '../core/GeometryContainer';
import GeometryPrimitive from '../core/GeometryPrimitive';
import isDefined from '../checks/isDefined'
import Primitive from '../core/Primitive';
import mustBeBoolean from '../checks/mustBeBoolean';
import mustBeNumber from '../checks/mustBeNumber';
import CuboidPrimitivesBuilder from './CuboidPrimitivesBuilder';
import CuboidSimplexPrimitivesBuilder from './CuboidSimplexPrimitivesBuilder';
import G3 from '../math/G3'
import Simplex from './Simplex'

/**
 * @module EIGHT
 * @submodule geometries
 */

function primitives(width: number, height: number, depth: number, wireFrame: boolean): Primitive[] {
    mustBeNumber('width', width)
    mustBeNumber('height', height)
    mustBeNumber('depth', depth)
    mustBeBoolean('wireFrame', wireFrame)
    if (wireFrame) {
        const builder = new CuboidSimplexPrimitivesBuilder(G3.e1, G3.e2, G3.e3, Simplex.LINE, 0, 1)
        return builder.toPrimitives()
    }
    else {
        const builder = new CuboidPrimitivesBuilder()
        builder.width = width
        builder.height = height
        builder.depth = depth
        return builder.toPrimitives()
    }
}

/**
 * A convenience class for creating a CuboidGeometry.
 *
 * @class CuboidGeometry
 * @extends Geometry
 */
export default class CuboidGeometry extends GeometryContainer {
    /**
     * @class CuboidGeometry
     * @constructor
     * @param [options = {}] {{ width?: number; height?: number; depth?: number }}
     */
    constructor(options: { width?: number; height?: number; depth?: number, wireFrame?: boolean } = {}) {
        super()
        const width = isDefined(options.width) ? mustBeNumber('width', options.width) : 1
        const height = isDefined(options.height) ? mustBeNumber('height', options.height) : 1
        const depth = isDefined(options.depth) ? mustBeNumber('depth', options.depth) : 1
        const wireFrame = isDefined(options.wireFrame) ? mustBeBoolean('wireFrame', options.wireFrame) : false
        const ps = primitives(width, height, depth, wireFrame)
        const iLen = ps.length
        for (let i = 0; i < iLen; i++) {
            const dataSource = ps[i]
            const geometry = new GeometryPrimitive(dataSource)
            this.addPart(geometry)
            geometry.release()
        }
    }
}
