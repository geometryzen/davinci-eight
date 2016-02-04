import IBufferGeometry from '../geometries/IBufferGeometry';
import IContextProvider from '../core/IContextProvider';
import IGraphicsBuffers from '../core/IGraphicsBuffers';
import IGraphicsProgram from '../core/IGraphicsProgram';
import IUnknownArray from '../collections/IUnknownArray';
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
     * @property buffers
     * @private
     */
    private buffers: IUnknownArray<IBufferGeometry>;

    /**
     * @class GraphicsBuffers
     * @constructor
     * @param primitives {Primitive[]}
     */
    constructor(primitives: Primitive[]) {
        super('GraphicsBuffers');
        this.primitives = primitives
    }
    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void {
        this.primitives = void 0;
        if (this.buffers) {
            this.buffers.release();
        }
        super.destructor();
    }

    /**
     * @method contextFree
     * @param 
     */
    contextFree(manager: IContextProvider): void {
        if (this.buffers) {
            this.buffers.release();
        }
    }

    /**
     * @method contextGain
     * @param manager {IContextProvider}
     * @return {void}
     */
    contextGain(manager: IContextProvider): void {
        if (!this.buffers) {
            this.buffers = new IUnknownArray<IBufferGeometry>([])
            const buffers = this.buffers
            const iLength = this.primitives.length;
            for (let i = 0; i < iLength; i++) {
                const primitive = this.primitives[i]
                buffers.pushWeakRef(manager.createBufferGeometry(primitive))
            }
        }
    }

    /**
     * @method contextLost
     * @return {void}
     */
    contextLost(): void {
        this.buffers = void 0;
    }

    /**
     * @method draw
     * @param program {IGraphicsProgram}
     * @return {void}
     */
    draw(program: IGraphicsProgram): void {
        if (this.buffers) {
            const iLength = this.buffers.length;
            for (let i = 0; i < iLength; i++) {
                const buffer = this.buffers.getWeakRef(i)
                buffer.bind(program/*, aNameToKeyName*/) // FIXME: Why not part of the API?
                buffer.draw()
                buffer.unbind()
            }
        }
    }
}
