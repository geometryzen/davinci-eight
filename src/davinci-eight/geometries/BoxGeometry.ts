import GeometryContainer from '../core/GeometryContainer'
import GeometryBuffers from '../core/GeometryBuffers'
import isDefined from '../checks/isDefined'
import Primitive from '../core/Primitive'
import mustBeBoolean from '../checks/mustBeBoolean'
import mustBeNumber from '../checks/mustBeNumber'
import notSupported from '../i18n/notSupported'
import CuboidPrimitivesBuilder from './CuboidPrimitivesBuilder';
import CuboidSimplexPrimitivesBuilder from './CuboidSimplexPrimitivesBuilder'
import R3 from '../math/R3'
import Simplex from './Simplex'
import vertexArraysFromPrimitive from '../core/vertexArraysFromPrimitive'

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
        const builder = new CuboidSimplexPrimitivesBuilder(R3.e1, R3.e2, R3.e3, Simplex.LINE, 0, 1)
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
 * A convenience class for creating a BoxGeometry.
 *
 * @class BoxGeometry
 * @extends Geometry
 */
export default class BoxGeometry extends GeometryContainer {

    /**
     * @class BoxGeometry
     * @constructor
     * @param [options = {}] {{ width?: number; height?: number; depth?: number }}
     */
    constructor(options: { width?: number; height?: number; depth?: number, wireFrame?: boolean } = {}) {
        super('BoxGeometry')
        const width = isDefined(options.width) ? mustBeNumber('width', options.width) : 1
        const height = isDefined(options.height) ? mustBeNumber('height', options.height) : 1
        const depth = isDefined(options.depth) ? mustBeNumber('depth', options.depth) : 1
        const wireFrame = isDefined(options.wireFrame) ? mustBeBoolean('wireFrame', options.wireFrame) : false
        const ps = primitives(width, height, depth, wireFrame)
        const iLen = ps.length
        for (let i = 0; i < iLen; i++) {
            const dataSource = ps[i]
            const geometry = new GeometryBuffers(vertexArraysFromPrimitive(dataSource))
            this.addPart(geometry)
            geometry.release()
        }
    }

    /**
     * @method getPrincipalScale
     * @param name {string}
     * @return {number}
     */
    getPrincipalScale(name: string): number {
        switch (name) {
            case 'width': {
                return this.scaling.getElement(0, 0)
            }
                break
            case 'height': {
                return this.scaling.getElement(1, 1)
            }
                break
            case 'depth': {
                return this.scaling.getElement(2, 2)
            }
                break
            default: {
                throw new Error(notSupported(`getPrincipalScale('${name}')`).message)
            }
        }
    }

    /**
     * @method setPrincipalScale
     * @param name {string}
     * @param value {number}
     * @return {void}
     */
    setPrincipalScale(name: string, value: number): void {
        // TODO: Validation goes here.
        switch (name) {
            case 'width': {
                this.scaling.setElement(0, 0, value)
            }
                break
            case 'height': {
                this.scaling.setElement(1, 1, value)
            }
                break
            case 'depth': {
                this.scaling.setElement(2, 2, value)
            }
                break
            default: {
                throw new Error(notSupported(`setPrincipalScale('${name}')`).message)
            }
        }
    }
}
