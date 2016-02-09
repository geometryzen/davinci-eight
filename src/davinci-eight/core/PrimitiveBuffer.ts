import IBufferGeometry from '../core/IBufferGeometry'
import IContextConsumer from '../core/IContextConsumer'
import IContextProvider from '../core/IContextProvider'
import Material from '../core/Material'
import Primitive from '../core/Primitive'
import Shareable from '../core/Shareable'

/**
 * @module EIGHT
 * @submodule core
 */

/**
 * A buffer for drawing a single primitive
 * that can endure context loss and gain events.
 * @class PrimitiveBuffer;
 */
export default class PrimitiveBuffer extends Shareable implements IContextConsumer {

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
     * @type IBufferGeometry
     * @private
     */
    private _dataBuffer: IBufferGeometry;

    /**
     * @class PrimitiveBuffer
     * @constructor
     * @param dataSource {Primitive}
     */
    constructor(dataSource: Primitive) {
        super('PrimitiveBuffer')
        this._dataSource = dataSource;
    }

    protected destructor(): void {
        this.dropBuffer()
        super.destructor()
    }

    public contextFree(manager: IContextProvider): void {
        this.dropBuffer()
    }

    public contextGain(manager: IContextProvider): void {
        if (!this._dataBuffer) {
            this._dataBuffer = manager.createBufferGeometry(this._dataSource)
        }
    }

    public contextLost(): void {
        this.dropBuffer()
    }

    private dropBuffer(): void {
        if (this._dataBuffer) {
            this._dataBuffer.release();
            this._dataBuffer = void 0;
        }
    }

    /**
     * @method draw
     * @param program {Material}
     * @return {void}
     */
    draw(program: Material): void {
        if (this._dataBuffer) {
            this._dataBuffer.bind(program/*, aNameToKeyName*/) // FIXME: Why not part of the API?
            this._dataBuffer.draw()
            this._dataBuffer.unbind()
        }
    }
}
