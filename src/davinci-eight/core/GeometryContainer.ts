import ContextProvider from './ContextProvider'
import {Engine} from './Engine'
import ShareableArray from '../collections/ShareableArray'
import {Material} from './Material'
import notSupported from '../i18n/notSupported'
import {Geometry} from './Geometry'
import GeometryBase from './GeometryBase'
import readOnly from '../i18n/readOnly'
import shouldBeImplementedBy from '../i18n/shouldBeImplementedBy'
import SpinorE3 from '../math/SpinorE3'
import VertexArrays from './VertexArrays'

/**
 * A collection of Geometry(s) with functions
 * that reflect the dependency on the WebGL context events.
 * This class is designed to be extended in order to implement the scaling methods.
 */
export default class GeometryContainer extends GeometryBase {

    /**
     * @property _parts
     * @private
     */
    private _parts: ShareableArray<Geometry>;

    /**
     *
     * @param tilt
     * @param engine
     * @param levelUp
     */
    constructor(tilt: SpinorE3, engine: Engine, levelUp: number) {
        super(tilt, engine, levelUp + 1);
        this.setLoggingName('GeometryContainer');
        this._parts = new ShareableArray<Geometry>([]);
    }

    protected destructor(levelUp: number): void {
        this._parts.release();
        this._parts = void 0;
        super.destructor(levelUp + 1);
    }

    public get data(): VertexArrays {
        throw new Error(notSupported('data').message)
    }
    public set data(data: VertexArrays) {
        throw new Error(notSupported('data').message)
    }

    public isLeaf(): boolean {
        return false
    }

    get partsLength(): number {
        return this._parts.length;
    }
    set partsLength(unused: number) {
        throw new Error(readOnly('partsLength').message)
    }

    /**
     * Adds a part to this geometry container.
     */
    addPart(geometry: Geometry): void {
        this._parts.push(geometry)
    }

    /**
     * Removes the part from this container.
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
     * 
     */
    bind(material: Material): void {
        // This does not make sense, so we delegate to the draw method.
    }

    /**
     * 
     */
    unbind(material: Material): void {
        // This does not make sense, so we delegate to the draw method.
    }

    /**
     * 
     */
    draw(material: Material): void {
        const iLen = this.partsLength;
        for (let i = 0; i < iLen; i++) {
            const part = this._parts.getWeakRef(i);
            part.bind(material);
            part.draw(material);
            part.unbind(material);
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
}
