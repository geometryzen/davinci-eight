import BeginMode from '../../core/BeginMode'
import GeometryPrimitive from './GeometryPrimitive'
import mustBeGE from '../../checks/mustBeGE'
import mustBeLT from '../../checks/mustBeLT'
import mustBeBoolean from '../../checks/mustBeBoolean'
import mustBeInteger from '../../checks/mustBeInteger'
import numPostsForFence from './numPostsForFence'
import numVerticesForCurve from './numVerticesForCurve'
import readOnly from '../../i18n/readOnly'
import Transform from './Transform'
import Vertex from './Vertex'

/**
 * @module EIGHT
 * @submodule primitives
 */

/**
 * @class CurvePrimitive
 * @extends GeometryPrimitive
 */
export default class CurvePrimitive extends GeometryPrimitive {

    /**
     * @property _uSegments
     * @type number
     * @private
     */
    private _uSegments: number;

    /**
     * @property _uClosed
     * @type boolean
     * @private
     */
    private _uClosed: boolean;

    /**
     * @class CurvePrimitive
     * @constructor
     * @param mode
     * @param uSegments
     * @param uClosed
     */
    constructor(mode: BeginMode, uSegments: number, uClosed: boolean) {
        super(mode, numVerticesForCurve(uSegments), 1)
        mustBeInteger('uSegments', uSegments)
        mustBeGE('uSegments', uSegments, 0)
        mustBeBoolean('uClosed', uClosed)
        this._uSegments = uSegments
        this._uClosed = uClosed
        const uLength = this.uLength
        for (let uIndex = 0; uIndex < uLength; uIndex++) {
            const coords = this.vertex(uIndex).coords
            coords.setComponent(0, uIndex)
        }
    }

    /**
     * @property uSegments
     * @type number
     * @readOnly
     */
    get uSegments(): number {
        return this._uSegments
    }
    set uSegments(unused: number) {
        throw new Error(readOnly('uSegments').message)
    }

    /**
     * uLength = uSegments + 1
     *
     * @property uLength
     * @type number
     * @readOnly
     */
    get uLength(): number {
        return numPostsForFence(this._uSegments, this._uClosed)
    }
    set uLength(unused: number) {
        throw new Error(readOnly('uLength').message)
    }

    /**
     * @method vertexTransform
     * @param transform {Transform}
     * @return {void}
     */
    public vertexTransform(transform: Transform): void {
        const iLen = this.vertices.length
        for (var i = 0; i < iLen; i++) {
            const vertex = this.vertices[i]
            const u = vertex.coords.getComponent(0)
            transform.exec(vertex, u, 0, this.uLength, 0)
        }
    }

    /**
     * @method vertex
     * @param uIndex {number}
     * @return {Vertex}
     */
    public vertex(uIndex: number): Vertex {
        mustBeInteger('uIndex', uIndex)
        mustBeGE('uIndex', uIndex, 0)
        mustBeLT('uIndex', uIndex, this.uLength)
        return this.vertices[uIndex]
    }
}
