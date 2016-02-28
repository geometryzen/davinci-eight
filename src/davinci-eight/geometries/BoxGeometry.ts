import BoxGeometryOptions from './BoxGeometryOptions'
import GeometryContainer from '../core/GeometryContainer'
import GeometryBuffers from '../core/GeometryBuffers'
import isDefined from '../checks/isDefined'
import mustBeNumber from '../checks/mustBeNumber'
import notSupported from '../i18n/notSupported'
import CuboidPrimitivesBuilder from './CuboidPrimitivesBuilder'
import vertexArraysFromPrimitive from '../core/vertexArraysFromPrimitive'

/**
 * @module EIGHT
 * @submodule geometries
 */

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
     * @param [options = {}] {BoxGeometryOptions}
     */
    constructor(options: BoxGeometryOptions = {}) {
        super('BoxGeometry')

        const builder = new CuboidPrimitivesBuilder()
        builder.width = isDefined(options.width) ? mustBeNumber('width', options.width) : 1
        builder.height = isDefined(options.height) ? mustBeNumber('height', options.height) : 1
        builder.depth = isDefined(options.depth) ? mustBeNumber('depth', options.depth) : 1
        if (isDefined(options.offset)) {
            builder.offset.copy(options.offset)
        }
        const ps = builder.toPrimitives()

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
