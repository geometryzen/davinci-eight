import { SpinorE3 } from '../math/SpinorE3';
import { VectorE3 } from '../math/VectorE3';
import { ContextManager } from './ContextManager';
import { GeometryBase } from './GeometryBase';
import { Material } from './Material';
import { Primitive } from './Primitive';
/**
 * A Geometry that supports interleaved vertex buffers.
 * @hidden
 */
export declare class GeometryElements extends GeometryBase {
    /**
     *
     */
    private mode;
    /**
     *
     */
    private count;
    /**
     * Hard-coded to zero right now.
     * This suggests that the index buffer could be used for several gl.drawElements(...)
     */
    private offset;
    /**
     * The number of bytes for each element.
     *
     * This is used in the vertexAttribPointer method.
     * Normally, we will use gl.FLOAT for each number which takes 4 bytes.
     */
    private stride;
    /**
     *
     */
    private pointers;
    /**
     *
     */
    private ibo;
    /**
     *
     */
    private vbo;
    /**
     *
     */
    constructor(contextManager: ContextManager, primitive: Primitive, options?: {
        axis?: VectorE3;
        meridian?: VectorE3;
        order?: string[];
        tilt?: SpinorE3;
    }, levelUp?: number);
    /**
     * @hidden
     */
    protected resurrector(levelUp: number): void;
    /**
     * @hidden
     */
    protected destructor(levelUp: number): void;
    contextFree(): void;
    contextGain(): void;
    contextLost(): void;
    bind(material: Material): this;
    unbind(material: Material): this;
    draw(): GeometryElements;
}
