import IBufferGeometry from '../core/IBufferGeometry'
import IContextProvider from '../core/IContextProvider'
import Material from '../core/Material'
import Primitive from '../core/Primitive'
import ShareableContextListener from '../core/ShareableContextListener'

/**
 * @module EIGHT
 * @submodule core
 */

/**
 * A buffer for drawing a single primitive
 * that can endure context loss and gain events.
 *
 * @class GeometryPart
 * @extends Shareable
 */
export default class GeometryPart extends ShareableContextListener {

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
     * @class GeometryPart
     * @constructor
     * @param dataSource {Primitive}
     */
    constructor(dataSource: Primitive) {
        super('GeometryPart')
        this._dataSource = dataSource;
    }

    protected destructor(): void {
        super.destructor()
    }

    public contextFree(context: IContextProvider): void {
        this.dropBuffer()
        super.contextFree(context)
    }

    public contextGain(context: IContextProvider): void {
        if (!this._dataBuffer) {
            this._dataBuffer = context.createBufferGeometry(this._dataSource)
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
