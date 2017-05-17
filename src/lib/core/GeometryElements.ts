import { BeginMode } from './BeginMode';
import { ContextManager } from './ContextManager';
import { DataType } from './DataType';
import { GeometryBase } from './GeometryBase';
import { IndexBuffer } from './IndexBuffer';
import { isArray } from '../checks/isArray';
import { isNull } from '../checks/isNull';
import { isUndefined } from '../checks/isUndefined';
import { Material } from './Material';
import { mustBeArray } from '../checks/mustBeArray';
import { mustBeNonNullObject } from '../checks/mustBeNonNullObject';
import { Primitive } from './Primitive';
import { SpinorE3 } from '../math/SpinorE3';
import { VectorE3 } from '../math/VectorE3';
import { VertexAttribPointer } from './VertexAttribPointer';
import { vertexArraysFromPrimitive } from './vertexArraysFromPrimitive';
import { VertexBuffer } from './VertexBuffer';
import { Usage } from './Usage';

/**
 * A Geometry that supports interleaved vertex buffers.
 */
export class GeometryElements extends GeometryBase {
    /**
     *
     */
    private mode: BeginMode;
    /**
     * 
     */
    private count: number;
    /**
     * Hard-coded to zero right now.
     * This suggests that the index buffer could be used for several gl.drawElements(...)
     */
    private offset = 0;
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
    private ibo: IndexBuffer;
    /**
     * 
     */
    private vbo: VertexBuffer;

    /**
     * 
     */
    constructor(contextManager: ContextManager, primitive: Primitive, options: { axis?: VectorE3; meridian?: VectorE3; order?: string[]; tilt?: SpinorE3 } = {}, levelUp = 0) {
        super(contextManager, levelUp + 1);
        this.setLoggingName('GeometryElements');

        mustBeNonNullObject('primitive', primitive);
        const vertexArrays = vertexArraysFromPrimitive(primitive, options.order);
        this.mode = vertexArrays.mode;
        this.count = vertexArrays.indices.length;
        this.ibo = new IndexBuffer(contextManager, new Uint16Array(vertexArrays.indices), Usage.STATIC_DRAW);

        this.stride = vertexArrays.stride;
        if (!isNull(vertexArrays.pointers) && !isUndefined(vertexArrays.pointers)) {
            if (isArray(vertexArrays.pointers)) {
                this.pointers = vertexArrays.pointers;
            }
            else {
                mustBeArray('data.pointers', vertexArrays.pointers);
            }
        }
        else {
            this.pointers = [];
        }
        this.vbo = new VertexBuffer(contextManager, new Float32Array(vertexArrays.attributes), Usage.STATIC_DRAW);
        if (levelUp === 0) {
            this.synchUp();
        }
    }

    /**
     * 
     */
    protected resurrector(levelUp: number): void {
        super.resurrector(levelUp + 1);
        this.setLoggingName('GeometryElements');
        this.ibo.addRef();
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
        this.ibo.release();
        this.vbo.release();
        super.destructor(levelUp + 1);
    }

    public contextFree(): void {
        this.ibo.contextFree();
        this.vbo.contextFree();
        super.contextFree();
    }

    public contextGain(): void {
        this.ibo.contextGain();
        this.vbo.contextGain();
        super.contextGain();
    }

    public contextLost(): void {
        this.ibo.contextLost();
        this.vbo.contextLost();
        super.contextLost();
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
        this.ibo.bind();
        return this;
    }

    unbind(material: Material): this {
        this.ibo.unbind();
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

    draw(): GeometryElements {
        if (this.gl) {
            if (this.count) {
                this.gl.drawElements(this.mode, this.count, DataType.UNSIGNED_SHORT, this.offset);
            }
        }
        return this;
    }
}
