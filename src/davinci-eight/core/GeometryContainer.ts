import ContextProvider from './ContextProvider'
import ShareableArray from '../collections/ShareableArray'
import {Material} from './Material'
import incLevel from '../base/incLevel'
import Matrix4 from '../math/Matrix4'
import notSupported from '../i18n/notSupported'
import {Geometry} from './Geometry'
import readOnly from '../i18n/readOnly'
import {ShareableBase} from '../core/ShareableBase'
import shouldBeImplementedBy from '../i18n/shouldBeImplementedBy'
import Spinor3 from '../math/Spinor3'
import SpinorE3 from '../math/SpinorE3'
import VertexArrays from './VertexArrays'

/**
 * @module EIGHT
 * @submodule core
 */

/**
 * A collection of Geometry(s) with functions
 * that reflect the dependency on the WebGL context events.
 * This class is designed to be extended in order to implement the scaling methods.
 *
 * @class GeometryContainer
 * @extends ShareableBase
 */
export default class GeometryContainer extends ShareableBase implements Geometry {

    /**
     * @property _parts
     * @private
     */
    private _parts: ShareableArray<Geometry>;

    /**
     * @property scaling
     * @type Matrix4
     * @default diag(1, 1, 1, 1)
     */
    public scaling = Matrix4.one()

    private canonicalScale = Matrix4.one()
    private K = Matrix4.one()
    private Kinv = Matrix4.one()
    private Kidentity = true

    /**
     * @class GeometryContainer
     * @constructor
     * @param tilt {SpinorE3}
     */
    constructor(tilt: SpinorE3) {
        super()
        this.setLoggingName('GeometryContainer')
        this._parts = new ShareableArray<Geometry>([])
        if (tilt && !Spinor3.isOne(tilt)) {
            this.Kidentity = false
            this.K.rotation(tilt)
            this.Kinv.copy(this.K).inv()
        }
    }

    /**
     * @method destructor
     * @param level {number}
     * @return {void}
     * @protected
     */
    protected destructor(level: number): void {
        this._parts.release()
        this._parts = void 0
        super.destructor(incLevel(level))
    }

    /**
     * @property data
     * @type VertexArrays
     */
    public get data(): VertexArrays {
        throw new Error(notSupported('data').message)
    }
    public set data(data: VertexArrays) {
        throw new Error(notSupported('data').message)
    }

    /**
     * @method isLeaf
     * @return {boolean} Returns <code>false</code>.
     */
    public isLeaf(): boolean {
        return false
    }

    /**
     * @property partsLength
     * @return {number}
     * @readOnly
     */
    get partsLength(): number {
        return this._parts.length;
    }
    set partsLength(unused: number) {
        throw new Error(readOnly('partsLength').message)
    }

    /**
     * @method addPart
     * @param geometry {Geometry}
     * @return {void}
     */
    addPart(geometry: Geometry): void {
        this._parts.push(geometry)
    }

    /**
     * @method removePart
     * @param index {number}
     * @return {void}
     */
    removePart(index: number): void {
        const removals = this._parts.splice(index, 1)
        removals.release()
    }

    /**
     *
     */
    getPart(index: number): Geometry {
        return this._parts.get(index)
    }

    /**
     * @method draw
     * @param material {Material}
     * @return {void}
     */
    draw(material: Material): void {
        const iLen = this.partsLength;
        for (let i = 0; i < iLen; i++) {
            const part = this._parts.getWeakRef(i);
            part.draw(material);
        }
    }

    /**
     * @method contextFree
     * @param contextProvider {ContextProvider}
     * @return {void}
     */
    contextFree(contextProvider: ContextProvider): void {
        this._parts.forEach(function(buffer) {
            buffer.contextFree(contextProvider)
        })
    }

    /**
     * @method contextGain
     * @param contextProvider {ContextProvider}
     * @return {void}
     */
    contextGain(contextProvider: ContextProvider): void {
        this._parts.forEach(function(buffer) {
            buffer.contextGain(contextProvider)
        })
    }

    /**
     * @method contextLost
     * @return {void}
     */
    contextLost(): void {
        this._parts.forEach(function(buffer) {
            buffer.contextLost()
        })
    }

    /**
     * @method hasPrincipalScale
     * @param name {string}
     * @return {boolean}
     */
    public hasPrincipalScale(name: string): boolean {
        throw new Error(shouldBeImplementedBy('hasPrincipalScale', this._type).message)
    }

    /**
     * @method getPrincipalScale
     * @param name {string}
     * @return {number}
     */
    public getPrincipalScale(name: string): number {
        throw new Error(shouldBeImplementedBy('getPrincipalScale', this._type).message)
    }

    /**
     * @method setPrincipalScale
     * @param name {string}
     * @param value {number}
     * @return {void}
     */
    public setPrincipalScale(name: string, value: number): void {
        throw new Error(shouldBeImplementedBy('setPrincipalScale', this._type).message)
    }

    /**
     * @method setScale
     * @param x {number}
     * @param y {number}
     * @param z {number}
     * @return {void}
     * @protected
     */
    protected setScale(x: number, y: number, z: number): void {
        if (this.Kidentity) {
            this.scaling.setElement(0, 0, x)
            this.scaling.setElement(1, 1, y)
            this.scaling.setElement(2, 2, z)
        }
        else {
            this.canonicalScale.copy(this.Kinv).mul(this.scaling).mul(this.K)
            this.canonicalScale.setElement(0, 0, x)
            this.canonicalScale.setElement(1, 1, y)
            this.canonicalScale.setElement(2, 2, z)
            this.scaling.copy(this.K).mul(this.canonicalScale).mul(this.Kinv)
        }
    }
}
