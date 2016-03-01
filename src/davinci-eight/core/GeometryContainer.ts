import IContextProvider from './IContextProvider'
import ShareableArray from '../collections/ShareableArray'
import Material from './Material'
import Matrix4 from '../math/Matrix4'
import Geometry from './Geometry'
import readOnly from '../i18n/readOnly'
import Shareable from '../core/Shareable'
import shouldBeImplementedBy from '../i18n/shouldBeImplementedBy'
import Spinor3 from '../math/Spinor3'
import SpinorE3 from '../math/SpinorE3'

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
 * @extends Shareable
 */
export default class GeometryContainer extends Shareable implements Geometry {

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
     * @param type {string}
     * @param tilt {SpinorE3}
     */
    constructor(type: string, tilt: SpinorE3) {
        super(type)
        this._parts = new ShareableArray<Geometry>()
        if (tilt && !Spinor3.isOne(tilt)) {
            this.Kidentity = false
            this.K.rotation(tilt)
            this.Kinv.copy(this.K).inv()
        }
    }

    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void {
        this._parts.release()
        this._parts = void 0
        super.destructor()
    }

    public isLeaf(): boolean {
        return false
    }

    get partsLength(): number {
        return this._parts.length;
    }
    set partsLength(unused) {
        throw new Error(readOnly('partsLength').message)
    }

    addPart(geometry: Geometry): void {
        this._parts.push(geometry)
    }

    removePart(index: number): void {
        const removals = this._parts.splice(index, 1)
        removals.release()
    }

    getPart(index: number): Geometry {
        return this._parts.get(index)
    }

    draw(material: Material): void {
        // FIXME: Use for loop.
        this._parts.forEach(function(buffer) {
            buffer.draw(material)
        })
    }

    /**
     * @method contextFree
     * @param 
     */
    contextFree(manager: IContextProvider): void {
        this._parts.forEach(function(buffer) {
            buffer.contextFree(manager)
        })
    }

    /**
     * @method contextGain
     * @param manager {IContextProvider}
     * @return {void}
     */
    contextGain(manager: IContextProvider): void {
        this._parts.forEach(function(buffer) {
            buffer.contextGain(manager)
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
