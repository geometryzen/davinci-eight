import {Material} from './Material';
import ContextProvider from './ContextProvider';
import config from '../config';
import {Engine} from './Engine';
import ErrorMode from './ErrorMode';
import GeometryLeaf from './GeometryLeaf';
import IndexBuffer from './IndexBuffer';
import isArray from '../checks/isArray';
import isNull from '../checks/isNull';
import isObject from '../checks/isObject';
import isUndefined from '../checks/isUndefined';
import mustBeArray from '../checks/mustBeArray';
import mustBeObject from '../checks/mustBeObject';
import readOnly from '../i18n/readOnly';
import VertexArrays from './VertexArrays';
import VertexAttribPointer from './VertexAttribPointer';
import VertexBuffer from './VertexBuffer';

/**
 * A Geometry that supports interleaved vertex buffers.
 */
export default class GeometryElements extends GeometryLeaf {

    private _indices: number[];
    private _attributes: number[];
    private count: number;

    /**
     * Hard-coded to zero right now.
     * This suggests that the index buffer could be used for several gl.drawElements(...)
     */
    private offset = 0;

    private ibo: IndexBuffer;
    private vbo: VertexBuffer;

    constructor(data: VertexArrays, engine: Engine, levelUp = 0) {
        super(engine, levelUp + 1);
        this.setLoggingName('GeometryElements');
        this.ibo = new IndexBuffer(engine);
        this.vbo = new VertexBuffer(engine);

        if (!isNull(data) && !isUndefined(data)) {
            if (isObject(data)) {
                this.drawMode = data.drawMode;
                this.setIndices(data.indices);

                this._attributes = data.attributes;
                this._stride = data.stride
                if (!isNull(data.pointers) && !isUndefined(data.pointers)) {
                    if (isArray(data.pointers)) {
                        this._pointers = data.pointers
                    }
                    else {
                        mustBeArray('data.pointers', data.pointers)
                    }
                }
                else {
                    this._pointers = []
                }
                this.vbo.data = new Float32Array(data.attributes)
            }
            else {
                mustBeObject('data', data)
            }
        }
        else {
            this._pointers = []
        }
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

    public get attributes(): number[] {
        return this._attributes
    }
    public set attributes(attributes: number[]) {
        if (isArray(attributes)) {
            this._attributes = attributes
            this.vbo.data = new Float32Array(attributes)
        }
    }

    private get data(): VertexArrays {
        // FIXME: This should return a deep copy.
        return {
            drawMode: this.drawMode,
            indices: this._indices,
            attributes: this._attributes,
            stride: this._stride,
            pointers: this._pointers
        }
    }
    private set data(data: VertexArrays) {
        throw new Error(readOnly('data').message)
    }

    public get indices(): number[] {
        return this._indices
    }
    public set indices(indices: number[]) {
        this.setIndices(indices)
    }

    private setIndices(indices: number[]): void {
        if (!isNull(indices) && !isUndefined(indices)) {
            if (isArray(indices)) {
                this._indices = indices;
                this.count = indices.length
                this.ibo.data = new Uint16Array(indices)
            }
            else {
                mustBeArray('indices', indices)
            }
        }
        else {
            // TBD
        }
    }

    public get pointers(): VertexAttribPointer[] {
        return this._pointers
    }
    public set pointers(pointers: VertexAttribPointer[]) {
        this._pointers = pointers
    }

    /**
     * The total number of <em>bytes</em> for each element.
     */
    public get stride(): number {
        return this._stride
    }
    public set stride(stride: number) {
        this._stride = stride
    }

    public contextFree(contextProvider: ContextProvider): void {
        this.ibo.contextFree(contextProvider)
        this.vbo.contextFree(contextProvider)
        super.contextFree(contextProvider)
    }

    public contextGain(contextProvider: ContextProvider): void {
        this.ibo.contextGain(contextProvider)
        this.vbo.contextGain(contextProvider)
        super.contextGain(contextProvider)
    }

    public contextLost(): void {
        this.ibo.contextLost()
        this.vbo.contextLost()
        super.contextLost()
    }

    bind(material: Material): void {
        const contextProvider = this.contextProvider
        if (contextProvider) {
            this.vbo.bind()
            const pointers = this._pointers
            if (pointers) {
                const iLength = pointers.length
                for (let i = 0; i < iLength; i++) {
                    const pointer = pointers[i]
                    const attrib = material.getAttrib(pointer.name)
                    if (attrib) {
                        attrib.config(pointer.size, pointer.type, pointer.normalized, this._stride, pointer.offset);
                        attrib.enable();
                    }
                }
            }
            else {
                switch (config.errorMode) {
                    case ErrorMode.WARNME: {
                        console.warn(`${this._type}.pointers must be an array.`)
                    }
                    default: {
                        // Do nothing.
                    }
                }
            }
            this.ibo.bind()
        }
    }

    unbind(material: Material): void {
        const contextProvider = this.contextProvider
        if (contextProvider) {
            this.ibo.unbind();
            const pointers = this._pointers
            if (pointers) {
                const iLength = pointers.length
                for (let i = 0; i < iLength; i++) {
                    const pointer = pointers[i]
                    const attrib = material.getAttrib(pointer.name)
                    if (attrib) {
                        attrib.disable();
                    }
                }
            }
            this.vbo.unbind();
        }
    }

    draw(material: Material): void {
        const contextProvider = this.contextProvider
        if (contextProvider) {
            if (this.count) {
                contextProvider.drawElements(this.drawMode, this.count, this.offset)
            }
            else {
                switch (config.errorMode) {
                    case ErrorMode.WARNME: {
                        console.warn(`${this._type}.indices must be an array.`)
                    }
                    default: {
                        // Do nothing.
                    }
                }
            }
        }
    }
}
