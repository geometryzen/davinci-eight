import IContextProvider from './IContextProvider'
import ShareableArray from '../collections/ShareableArray'
import Material from './Material'
import Matrix4 from '../math/Matrix4'
import Geometry from './Geometry'
import readOnly from '../i18n/readOnly'
import Shareable from '../core/Shareable'
import shouldBeImplementedBy from '../i18n/shouldBeImplementedBy'

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

    /**
     * @class GeometryContainer
     * @constructor
     * @param type {string}
     */
    constructor(type: string) {
        super(type)
        this._parts = new ShareableArray<Geometry>()
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
}
