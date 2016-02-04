import IBufferGeometry from '../geometries/IBufferGeometry';
import IContextProvider from '../core/IContextProvider';
import IGraphicsBuffers from '../core/IGraphicsBuffers';
import IGraphicsProgram from '../core/IGraphicsProgram';
import IUnknownArray from '../collections/IUnknownArray';
import NumberIUnknownMap from '../collections/NumberIUnknownMap';
import Primitive from '../geometries/Primitive';

import Shareable from '../utils/Shareable';

/**
 * @class GraphicsBuffers
 * @extends Shareable
 */
export default class GraphicsBuffers extends Shareable implements IGraphicsBuffers {

    /**
     * @property primitives
     * @type {Primitive[]}
     * @private
     */
    private primitives: Primitive[];

    /**
     * @property buffersByCanvasId
     * @private
     */
    private buffersByCanvasId: NumberIUnknownMap<IUnknownArray<IBufferGeometry>>;

    /**
     * @class GraphicsBuffers
     * @constructor
     * @param primitives {Primitive[]}
     */
    constructor(primitives: Primitive[]) {
        super('GraphicsBuffers');
        this.primitives = primitives
        this.buffersByCanvasId = new NumberIUnknownMap<IUnknownArray<IBufferGeometry>>()
    }
    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void {
        this.primitives = void 0;
        this.buffersByCanvasId.release();
        this.buffersByCanvasId = void 0;
        super.destructor();
    }

    /**
     * @method contextFree
     * @param canvasId {number}
     */
    contextFree(manager: IContextProvider): void {
        if (this.buffersByCanvasId.exists(manager.canvasId)) {
            this.buffersByCanvasId.remove(manager.canvasId);
        }
    }

    /**
     * @method contextGain
     * @param manager {IContextProvider}
     * @return {void}
     */
    contextGain(manager: IContextProvider): void {
        if (!this.buffersByCanvasId.exists(manager.canvasId)) {
            this.buffersByCanvasId.putWeakRef(manager.canvasId, new IUnknownArray<IBufferGeometry>([]))
            const buffers = this.buffersByCanvasId.getWeakRef(manager.canvasId)
            const iLength = this.primitives.length;
            for (let i = 0; i < iLength; i++) {
                const primitive = this.primitives[i]
                buffers.pushWeakRef(manager.createBufferGeometry(primitive))
            }
        }
    }

    /**
     * @method contextLost
     * @param canvasId {number}
     * @return {void}
     */
    contextLost(canvasId: number): void {
        if (this.buffersByCanvasId.exists(canvasId)) {
            this.buffersByCanvasId.remove(canvasId);
        }
    }

    /**
     * @method draw
     * @param program {IGraphicsProgram}
     * @param canvasId {number}
     * @return {void}
     */
    draw(program: IGraphicsProgram, canvasId: number): void {
        const buffers: IUnknownArray<IBufferGeometry> = this.buffersByCanvasId.getWeakRef(canvasId)
        if (buffers) {
            const iLength = buffers.length;
            for (let i = 0; i < iLength; i++) {
                const buffer = buffers.getWeakRef(i)
                buffer.bind(program/*, aNameToKeyName*/) // FIXME: Why not part of the API?
                buffer.draw()
                buffer.unbind()
            }
        }
    }
}
