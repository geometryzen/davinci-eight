import { ContextManager } from './ContextManager';
import { GeometryBase } from './GeometryBase';
import { Material } from './Material';
import { Primitive } from './Primitive';
import { SpinorE3 } from '../math/SpinorE3';
/**
 * A concrete Geometry for supporting drawArrays.
 */
export declare class GeometryArrays extends GeometryBase {
    /**
     *
     */
    private mode;
    /**
     * The <code>first</code> parameter in the drawArrays call.
     * This is currently hard-code to zero because this class only supportes buffering one primitive.
     */
    private first;
    /**
     * The <code>count</code> parameter in the drawArrays call.
     * This is currently maintained at this level because this class only supportes buffering one primitive.
     */
    private count;
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
    private vbo;
    /**
     *
     */
    constructor(contextManager: ContextManager, primitive: Primitive, options?: {
        order?: string[];
        tilt?: SpinorE3;
    }, levelUp?: number);
    /**
     *
     */
    protected resurrector(levelUp: number): void;
    /**
     *
     */
    protected destructor(levelUp: number): void;
    bind(material: Material): this;
    draw(): this;
    unbind(material: Material): this;
}
