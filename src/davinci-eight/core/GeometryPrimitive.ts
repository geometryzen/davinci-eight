import PrimitiveBuffers from '../core/PrimitiveBuffers'
import IContextProvider from '../core/IContextProvider'
import notSupported from '../i18n/notSupported';
import Material from '../core/Material'
import Geometry from './Geometry'
import Primitive from './Primitive'
import readOnly from '../i18n/readOnly';
import ShareableContextListener from './ShareableContextListener'

/**
 * @module EIGHT
 * @submodule core
 */

/**
 * A buffer for drawing a single primitive
 * that can endure context loss and gain events.
 *
 * @class GeometryPrimitive
 * @extends Shareable
 */
export default class GeometryPrimitive extends ShareableContextListener implements Geometry {

    /**
     * The always available source of primitive data that
     * allows us to recover from context loss events.
     * @property dataSource
     * @type Primitive
     * @private
     */
    private _dataSource: Primitive;

    /**
     * The primitive buffer associated with the source that may
     * come and go according to context loss and gain events.
     * @proprty dataBuffer
     * @type PrimitiveBuffers
     * @private
     */
    private _dataBuffer: PrimitiveBuffers;

    /**
     * @class GeometryPrimitive
     * @constructor
     * @param dataSource {Primitive}
     */
    constructor(dataSource: Primitive) {
        super('GeometryPrimitive')
        this._dataSource = dataSource;
    }

    protected destructor(): void {
        super.destructor()
    }

    get partsLength(): number {
        return 0
    }
    set partsLength(unused) {
        throw new Error(readOnly('partsLength').message)
    }

    addPart(geometry: Geometry): void {
        throw new Error(notSupported('addPart').message)
    }

    removePart(index: number): void {
        throw new Error(notSupported('removePart').message)
    }

    getPart(index: number): Geometry {
        throw new Error(notSupported('getPart').message)
    }

    public contextFree(context: IContextProvider): void {
        this.dropBuffer()
        super.contextFree(context)
    }

    public contextGain(context: IContextProvider): void {
        if (!this._dataBuffer) {
            this._dataBuffer = context.createPrimitiveBuffers(this._dataSource)
        }
        super.contextGain(context)
    }

    public contextLost(): void {
        this.dropBuffer()
        super.contextLost()
    }

    private dropBuffer(): void {
        if (this._dataBuffer) {
            this._dataBuffer.release();
            this._dataBuffer = void 0;
        }
    }

    /**
     * @method draw
     * @param material {Material}
     * @return {void}
     */
    draw(material: Material): void {
        if (this._dataBuffer) {
            this._dataBuffer.bind(material)
            this._dataBuffer.draw()
            this._dataBuffer.unbind()
        }
    }
}
