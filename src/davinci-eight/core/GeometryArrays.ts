import { Material } from './Material';
import Attribute from './Attribute';
import ContextManager from './ContextManager';
import GeometryBase from './GeometryBase';
import mustBeObject from '../checks/mustBeObject';
import Primitive from './Primitive';
import SpinorE3 from '../math/SpinorE3';
import Usage from './Usage';
import vertexArraysFromPrimitive from './vertexArraysFromPrimitive';
import VertexBuffer from './VertexBuffer';

/**
 * A concrete Geometry for supporting drawArrays.
 */
export default class GeometryArrays extends GeometryBase {

    /**
     * The <code>first</code> parameter in the drawArrays call.
     * This is currently hard-code to zero because this class only supportes buffering one primitive.
     */
    private first: number = 0;

    /**
     * The <code>count</code> parameter in the drawArrays call.
     * This is currently maintained at this level because this class only supportes buffering one primitive.
     */
    private count: number;
    private attributes: { [name: string]: Attribute };
    private vbo: VertexBuffer;

    constructor(contextManager: ContextManager, primitive: Primitive, options: { order?: string[]; tilt?: SpinorE3 } = {}, levelUp = 0) {
        super(options.tilt, contextManager, levelUp + 1);
        mustBeObject('contextManager', contextManager);
        mustBeObject('primitive', primitive);
        this.setLoggingName('GeometryArrays');
        this.attributes = {};
        // FIXME: order as an option
        const vertexArrays = vertexArraysFromPrimitive(primitive, options.order);
        this._mode = vertexArrays.mode;
        this.vbo = new VertexBuffer(contextManager, new Float32Array(vertexArrays.attributes), Usage.STATIC_DRAW);
        // FIXME: Hacky
        this.count = vertexArrays.attributes.length / (vertexArrays.stride / 4);
        // FIXME: stride is not quite appropriate here because we don't have BYTES.
        this._stride = vertexArrays.stride;
        this._pointers = vertexArrays.pointers;
        if (levelUp === 0) {
            this.synchUp();
        }
    }

    protected destructor(levelUp: number): void {
        if (levelUp === 0) {
            this.cleanUp();
        }
        this.vbo.release();
        this.vbo = void 0;
        super.destructor(levelUp + 1);
    }

    bind(material: Material): GeometryArrays {
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
        return this;
    }

    draw(): GeometryArrays {
        if (this.gl) {
            this.gl.drawArrays(this._mode, this.first, this.count);
        }
        return this;
    }

    unbind(material: Material): GeometryArrays {
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
}
