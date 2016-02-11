import IContextProvider from './IContextProvider';
import ShareableArray from '../collections/ShareableArray';
import Material from './Material'
import Geometry from './Geometry'
import readOnly from '../i18n/readOnly';
import Shareable from '../core/Shareable';

/**
 * @module EIGHT
 * @submodule core
 */

/**
 * A collection of GeometryPrimitive(s) with functions
 * that reflect the dependency on the WebGL context events.
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
     * @class GeometryContainer
     * @constructor
     */
    constructor() {
        super('GeometryContainer');
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
}
