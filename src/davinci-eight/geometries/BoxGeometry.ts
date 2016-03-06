import BoxGeometryOptions from './BoxGeometryOptions'
import GeometryContainer from '../core/GeometryContainer'
import GeometryElements from '../core/GeometryElements'
import isDefined from '../checks/isDefined'
import mustBeBoolean from '../checks/mustBeBoolean'
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
    private w = 1
    private h = 1
    private d = 1

    /**
     * @class BoxGeometry
     * @constructor
     * @param [options = {}] {BoxGeometryOptions}
     */
    constructor(options: BoxGeometryOptions = {}) {
        super('BoxGeometry', options.tilt)

        const builder = new CuboidPrimitivesBuilder()
        builder.width = isDefined(options.width) ? mustBeNumber('width', options.width) : 1
        builder.height = isDefined(options.height) ? mustBeNumber('height', options.height) : 1
        builder.depth = isDefined(options.depth) ? mustBeNumber('depth', options.depth) : 1

        if (isDefined(options.openBack)) {
            builder.openBack = mustBeBoolean('openBack', options.openBack)
        }
        if (isDefined(options.openBase)) {
            builder.openBase = mustBeBoolean('openBase', options.openBase)
        }
        if (isDefined(options.openFront)) {
            builder.openFront = mustBeBoolean('openFront', options.openFront)
        }
        if (isDefined(options.openLeft)) {
            builder.openLeft = mustBeBoolean('openLeft', options.openLeft)
        }
        if (isDefined(options.openRight)) {
            builder.openRight = mustBeBoolean('openRight', options.openRight)
        }
        if (isDefined(options.openCap)) {
            builder.openCap = mustBeBoolean('openCap', options.openCap)
        }

        if (options.tilt) {
            builder.tilt.copy(options.tilt)
        }
        if (options.offset) {
            builder.offset.copy(options.offset)
        }
        const ps = builder.toPrimitives()

        const iLen = ps.length
        for (let i = 0; i < iLen; i++) {
            const dataSource = ps[i]
            const geometry = new GeometryElements(vertexArraysFromPrimitive(dataSource), options.engine)
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
                return this.w
            }
            case 'height': {
                return this.h
            }
            case 'depth': {
                return this.d
            }
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
        switch (name) {
            case 'width': {
                this.w = value
            }
                break
            case 'height': {
                this.h = value
            }
                break
            case 'depth': {
                this.d = value
            }
                break
            default: {
                throw new Error(notSupported(`setPrincipalScale('${name}')`).message)
            }
        }
        this.setScale(this.w, this.h, this.d)
    }
}
