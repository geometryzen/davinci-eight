import IContextProvider from '../core/IContextProvider';
import IUnknownArray from '../collections/IUnknownArray';
import Primitive from '../core/Primitive';
import PrimitiveBuffer from './PrimitiveBuffer'
import readOnly from '../i18n/readOnly';
import Shareable from '../core/Shareable';

/**
 * A collection of PrimitiveBuffer(s) with functions
 * that reflect the dependency on the WebGL context events.
 * @class GraphicsBuffers
 * @extends Shareable
 */
export default class GraphicsBuffers extends Shareable {

    /**
     * @property buffers
     * @private
     */
    private buffers: IUnknownArray<PrimitiveBuffer>;

    /**
     * @class GraphicsBuffers
     * @constructor
     * @param primitives {Primitive[]}
     */
    constructor(primitives: Primitive[]) {
        super('GraphicsBuffers');
        this.buffers = new IUnknownArray<PrimitiveBuffer>()
        const iLen = primitives.length
        for (let i = 0; i < iLen; i++) {
            const dataSource = primitives[i]
            this.buffers.pushWeakRef(new PrimitiveBuffer(dataSource))
        }
    }
    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void {
        this.buffers.release()
        this.buffers = void 0
        super.destructor()
    }

    get length(): number {
        return this.buffers.length;
    }
    set length(unused) {
        throw new Error(readOnly('length').message)
    }

    get(index: number) {
        return this.buffers.get(index)
    }

    getWeakRef(index: number) {
        return this.buffers.getWeakRef(index)
    }

    /**
     * @method contextFree
     * @param 
     */
    contextFree(manager: IContextProvider): void {
        this.buffers.forEach(function(buffer) {
            buffer.contextFree(manager)
        })
    }

    /**
     * @method contextGain
     * @param manager {IContextProvider}
     * @return {void}
     */
    contextGain(manager: IContextProvider): void {
        this.buffers.forEach(function(buffer) {
            buffer.contextGain(manager)
        })
    }

    /**
     * @method contextLost
     * @return {void}
     */
    contextLost(): void {
        this.buffers.forEach(function(buffer) {
            buffer.contextLost()
        })
    }
}
