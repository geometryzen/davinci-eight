import { BeginMode } from './BeginMode';
import { ContextManager } from './ContextManager';
import { GeometryBase } from './GeometryBase';
import { Material } from './Material';
import { mustBeNonNullObject } from '../checks/mustBeNonNullObject';
import { Primitive } from './Primitive';
import { SpinorE3 } from '../math/SpinorE3';
import { Usage } from './Usage';
import { VertexAttribPointer } from './VertexAttribPointer';
import { vertexArraysFromPrimitive } from './vertexArraysFromPrimitive';
import { VertexBuffer } from './VertexBuffer';

/**
 * A concrete Geometry for supporting drawArrays.
 */
export class GeometryArrays extends GeometryBase {
    /**
     *
     */
    private mode: BeginMode;
    /**
     * The <code>first</code> parameter in the drawArrays call.
     * This is currently hard-code to zero because this class only supportes buffering one primitive.
     */
    private first = 0;
    /**
     * The <code>count</code> parameter in the drawArrays call.
     * This is currently maintained at this level because this class only supportes buffering one primitive.
     */
    private count: number;
    /**
     * The number of bytes for each element.
     *
     * This is used in the vertexAttribPointer method.
     * Normally, we will use gl.FLOAT for each number which takes 4 bytes.
     */
    private stride: number;
    /**
     * 
     */
    private pointers: VertexAttribPointer[];
    /**
     * 
     */
    private vbo: VertexBuffer;
    /**
     * 
     */
    constructor(contextManager: ContextManager, primitive: Primitive, options: { order?: string[]; tilt?: SpinorE3 } = {}, levelUp = 0) {
        super(contextManager, levelUp + 1);
        mustBeNonNullObject('primitive', primitive);
        this.setLoggingName('GeometryArrays');
        // FIXME: order as an option
        const vertexArrays = vertexArraysFromPrimitive(primitive, options.order);
        this.mode = vertexArrays.mode;
        this.vbo = new VertexBuffer(contextManager, new Float32Array(vertexArrays.attributes), Usage.STATIC_DRAW);
        // FIXME: Hacky
        this.count = vertexArrays.attributes.length / (vertexArrays.stride / 4);
        // FIXME: stride is not quite appropriate here because we don't have BYTES.
        this.stride = vertexArrays.stride;
        this.pointers = vertexArrays.pointers;
        if (levelUp === 0) {
            this.synchUp();
        }
    }

    /**
     * 
     */
    protected resurrector(levelUp: number): void {
        super.resurrector(levelUp + 1);
        this.setLoggingName('GeometryArrays');
        this.vbo.addRef();
        if (levelUp === 0) {
            this.synchUp();
        }
    }
    /**
     * 
     */
    protected destructor(levelUp: number): void {
        if (levelUp === 0) {
            this.cleanUp();
        }
        this.vbo.release();
        super.destructor(levelUp + 1);
    }

    bind(material: Material): this {
        this.vbo.bind();
        const pointers = this.pointers;
        if (pointers) {
            const iLength = pointers.length;
            for (let i = 0; i < iLength; i++) {
                const pointer = pointers[i];
                const attrib = material.getAttrib(pointer.name);
                if (attrib) {
                    attrib.config(pointer.size, pointer.type, pointer.normalized, this.stride, pointer.offset);
                    attrib.enable();
                }
            }
        }
        return this;
    }

    draw(): this {
        if (this.gl) {
            this.gl.drawArrays(this.mode, this.first, this.count);
        }
        return this;
    }

    unbind(material: Material): this {
        const pointers = this.pointers;
        if (pointers) {
            const iLength = pointers.length;
            for (let i = 0; i < iLength; i++) {
                const pointer = pointers[i];
                const attrib = material.getAttrib(pointer.name);
                if (attrib) {
                    attrib.disable();
                }
            }
        }
        this.vbo.unbind();
        return this;
    }
}
