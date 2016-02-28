import CylinderBuilder from './CylinderBuilder'
import notSupported from '../i18n/notSupported'
import GeometryContainer from '../core/GeometryContainer'
import GeometryBuffers from '../core/GeometryBuffers'
import R3 from '../math/R3'
import vertexArraysFromPrimitive from '../core/vertexArraysFromPrimitive'

/**
 * @module EIGHT
 * @submodule geometries
 */

/**
 * A convenience class for creating a Cylinder.
 *
 * @example
 *   const geometry = new EIGHT.CylinderGeometry()
 *   const material = new EIGHT.MeshMaterial()
 *   const cylinder = new EIGHT.Mesh()
 *   scene.add(cylinder)
 *
 * @class CylinderGeometry
 * @extends GeometryContainer
 */
export default class CylinderGeometry extends GeometryContainer {

    /**
     * @class CylinderGeometry
     * @constructor
     * @param [options = {}] {}
     */
    constructor(options: {} = {}) {
        super('CylinderGeometry')
        const builder = new CylinderBuilder(R3.e2, R3.e3, false)
        builder.openBottom = false
        builder.openTop = false
        //        builder.stress.copy(stress)
        //        builder.tilt.copy(tilt)
        //        builder.offset.copy(offset)
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
     * @property radius
     * @type number
     */
    get radius(): number {
        return this.getPrincipalScale('radius')
    }
    set radius(radius: number) {
        this.setPrincipalScale('radius', radius)
    }

    /**
     * @property length
     * @type number
     */
    get length(): number {
        return this.getPrincipalScale('length')
    }
    set length(length: number) {
        this.setPrincipalScale('length', length)
    }

    /**
     * @method getPrincipalScale
     * @param name {string}
     * @return {number}
     */
    getPrincipalScale(name: string): number {
        switch (name) {
            case 'length': {
                return this.scaling.getElement(1, 1)
            }
                break
            case 'radius': {
                return this.scaling.getElement(0, 0)
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
        switch (name) {
            case 'length': {
                this.scaling.setElement(1, 1, value)
            }
                break
            case 'radius': {
                this.scaling.setElement(0, 0, value)
                this.scaling.setElement(2, 2, value)
            }
                break
            default: {
                throw new Error(notSupported(`getPrincipalScale('${name}')`).message)
            }
        }
    }
}
