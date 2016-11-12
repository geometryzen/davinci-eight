import { Material } from './Material';
import Attribute from './Attribute';
import computeAttributes from './computeAttributes';
import computeCount from './computeCount';
import computePointers from './computePointers';
import computeStride from './computeStride';
import ContextManager from './ContextManager';
import GeometryBase from './GeometryBase';
import isNull from '../checks/isNull';
import isObject from '../checks/isObject';
import isUndefined from '../checks/isUndefined';
import mustBeObject from '../checks/mustBeObject';
import Primitive from './Primitive';
import SpinorE3 from '../math/SpinorE3';
import vertexArraysFromPrimitive from './vertexArraysFromPrimitive';
import VertexBuffer from './VertexBuffer';

/**
 *
 * @example
 *     const engine = new EIGHT.Engine()
 *
 *     const geometry = new EIGHT.GeometryArrays(void 0, engine)
 *     geometry.mode = EIGHT.BeginMode.LINES
 *     geometry.setAttribute('aPosition', {values: [0, 0, 1, 0, 0, 0, 0, 1], size: 2})
 *     geometry.setAttribute('aColor', {values: [0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0], size: 3})
 *
 *     geometry.draw(material)
 *
 *     geometry.release()
 */
export default class GeometryArrays extends GeometryBase {

    /**
     * The <code>first</code> parameter in the drawArrays call.
     * This is currently hard-code to zero because this class only supportes buffering one primitive.
     */
    private first: number = 0

    /**
     * The <code>count</code> parameter in the drawArrays call.
     * This is currently maintained at this level because this class only supportes buffering one primitive.
     */
    private count: number
    private attributes: { [name: string]: Attribute }
    private vbo: VertexBuffer;

    constructor(primitive: Primitive, contextManager: ContextManager, options: { order?: string[]; tilt?: SpinorE3 } = {}, levelUp = 0) {
        super(options.tilt, contextManager, levelUp + 1);
        mustBeObject('contextManager', contextManager);
        this.setLoggingName('GeometryArrays');
        this.attributes = {};
        this.vbo = new VertexBuffer(contextManager);
        // FIXME: order as an option
        const data = vertexArraysFromPrimitive(primitive, options.order);
        if (!isNull(data) && !isUndefined(data)) {
            if (isObject(data)) {
                this.mode = data.mode;
                this.vbo.data = new Float32Array(data.attributes);
                // FIXME: Hacky
                this.count = data.attributes.length / (data.stride / 4);
                // FIXME: stride is not quite appropriate here because we don't have BYTES.
                this._stride = data.stride;
                this._pointers = data.pointers;
            }
            else {
                throw new TypeError("data must be an object");
            }
        }
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
        const contextProvider = this.contextProvider;
        if (contextProvider) {
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
        }
        return this;
    }

    draw(material: Material): GeometryArrays {
        const contextProvider = this.contextProvider;
        if (contextProvider) {
            this.contextProvider.drawArrays(this.mode, this.first, this.count);
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

    getAttribute(name: string): Attribute {
        return this.attributes[name]
    }

    setAttribute(name: string, attribute: Attribute): void {
        this.attributes[name] = attribute
        const aNames = Object.keys(this.attributes)
        this.count = computeCount(this.attributes, aNames)
        this._stride = computeStride(this.attributes, aNames)
        this._pointers = computePointers(this.attributes, aNames)
        const array = computeAttributes(this.attributes, aNames)
        this.vbo.data = new Float32Array(array)
    }
}
