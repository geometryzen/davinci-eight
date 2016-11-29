import { Material } from './Material';
import ContextManager from './ContextManager';
import DataType from './DataType';
import GeometryBase from './GeometryBase';
import IndexBuffer from './IndexBuffer';
import isArray from '../checks/isArray';
import isNull from '../checks/isNull';
import isUndefined from '../checks/isUndefined';
import mustBeArray from '../checks/mustBeArray';
import mustBeObject from '../checks/mustBeObject';
import Primitive from './Primitive';
import SpinorE3 from '../math/SpinorE3';
import vertexArraysFromPrimitive from './vertexArraysFromPrimitive';
import VertexBuffer from './VertexBuffer';
import Usage from './Usage';

/**
 * A Geometry that supports interleaved vertex buffers.
 */
export default class GeometryElements extends GeometryBase {

    private _attributes: number[];
    private count: number;

    /**
     * Hard-coded to zero right now.
     * This suggests that the index buffer could be used for several gl.drawElements(...)
     */
    private offset = 0;

    private ibo: IndexBuffer;
    private vbo: VertexBuffer;

    constructor(contextManager: ContextManager, primitive: Primitive, options: { order?: string[]; tilt?: SpinorE3 } = {}, levelUp = 0) {
        super(options.tilt, contextManager, levelUp + 1);

        mustBeObject('primitive', primitive);
        mustBeObject('contextManager', contextManager);

        this.setLoggingName('GeometryElements');


        const vertexArrays = vertexArraysFromPrimitive(primitive, options.order);
        this._mode = vertexArrays.mode;
        this.count = vertexArrays.indices.length;
        this.ibo = new IndexBuffer(contextManager, new Uint16Array(vertexArrays.indices), Usage.STATIC_DRAW);

        this._attributes = vertexArrays.attributes;
        this._stride = vertexArrays.stride;
        if (!isNull(vertexArrays.pointers) && !isUndefined(vertexArrays.pointers)) {
            if (isArray(vertexArrays.pointers)) {
                this._pointers = vertexArrays.pointers;
            }
            else {
                mustBeArray('data.pointers', vertexArrays.pointers);
            }
        }
        else {
            this._pointers = [];
        }
        this.vbo = new VertexBuffer(contextManager, new Float32Array(vertexArrays.attributes), Usage.STATIC_DRAW);
        if (levelUp === 0) {
            this.synchUp();
        }
    }

    protected destructor(levelUp: number): void {
        if (levelUp === 0) {
            this.cleanUp();
        }
        this.ibo.release();
        this.ibo = void 0;
        this.vbo.release();
        this.vbo = void 0;
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

    bind(material: Material): GeometryElements {
        this.vbo.bind();
        const pointers = this._pointers;
        if (pointers) {
            const iLength = pointers.length;
            for (let i = 0; i < iLength; i++) {
                const pointer = pointers[i];
                const attrib = material.getAttrib(pointer.name);
                if (attrib) {
                    attrib.config(pointer.size, pointer.type, pointer.normalized, this._stride, pointer.offset);
                    attrib.enable();
                }
            }
        }
        this.ibo.bind();
        return this;
    }

    unbind(material: Material): GeometryElements {
        this.ibo.unbind();
        const pointers = this._pointers;
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
                this.gl.drawElements(this._mode, this.count, DataType.UNSIGNED_SHORT, this.offset);
            }
        }
        return this;
    }
}
