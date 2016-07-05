import Attrib from '../core/Attrib';
import config from '../config';
import ContextProvider from '../core/ContextProvider';
import isDefined from '../checks/isDefined';
import isString from '../checks/isString';
import isNull from '../checks/isNull';
import makeWebGLProgram from '../core/makeWebGLProgram';
import {Material} from '../core/Material'
import {Engine} from '../core/Engine';
import ErrorMode from '../core/ErrorMode';
import mustBeArray from '../checks/mustBeArray';
import mustBeString from '../checks/mustBeString';
import mustBeUndefined from '../checks/mustBeUndefined';
import readOnly from '../i18n/readOnly';
import {ShareableContextConsumer} from '../core/ShareableContextConsumer';
import Uniform from '../core/Uniform';

/**
 *
 */
export class ShaderMaterial extends ShareableContextConsumer implements Material {

    /**
     *
     */
    private _vertexShaderSrc: string

    /**
     *
     */
    private _fragmentShaderSrc: string

    /**
     *
     */
    private _attribs: string[]

    /**
     *
     */
    private _program: WebGLProgram

    /**
     *
     */
    private _attributesByName: { [name: string]: Attrib } = {}
    private _attributesByIndex: Attrib[] = [];

    /**
     *
     */
    private _uniforms: { [name: string]: Uniform } = {}

    /**
     * @param vertexShaderSrc The vertex shader source code.
     * @param fragmentShaderSrc The fragment shader source code.
     * @param attribs The attribute ordering.
     * @param engine The <code>Engine</code> to subscribe to or <code>null</code> for deferred subscription.
     */
    constructor(vertexShaderSrc: string, fragmentShaderSrc: string, attribs: string[], engine: Engine, levelUp: number) {
        super(engine)
        this.setLoggingName('ShaderMaterial')
        if (isDefined(vertexShaderSrc) && !isNull(vertexShaderSrc)) {
            this._vertexShaderSrc = mustBeString('vertexShaderSrc', vertexShaderSrc)
        }
        if (isDefined(fragmentShaderSrc) && !isNull(fragmentShaderSrc)) {
            this._fragmentShaderSrc = mustBeString('fragmentShaderSrc', fragmentShaderSrc)
        }
        this._attribs = mustBeArray('attribs', attribs)
        if (levelUp === 0) {
            this.synchUp();
        }
    }

    protected destructor(levelUp: number): void {
        if (levelUp === 0) {
            this.cleanUp()
        }
        mustBeUndefined(this._type, this._program)
        super.destructor(levelUp + 1)
    }

    /**
     * @param context
     */
    contextGain(context: ContextProvider): void {
        const gl = context.gl
        if (!this._program && isString(this._vertexShaderSrc) && isString(this._fragmentShaderSrc)) {
            this._program = makeWebGLProgram(gl, this._vertexShaderSrc, this._fragmentShaderSrc, this._attribs)
            this._attributesByName = {};
            this._attributesByIndex = [];
            this._uniforms = {}

            const aLen: number = gl.getProgramParameter(this._program, gl.ACTIVE_ATTRIBUTES)
            for (let a = 0; a < aLen; a++) {
                const attribInfo: WebGLActiveInfo = gl.getActiveAttrib(this._program, a);
                const attrib = new Attrib(attribInfo);
                this._attributesByName[attribInfo.name] = attrib;
                this._attributesByIndex.push(attrib);
            }

            const uLen: number = gl.getProgramParameter(this._program, gl.ACTIVE_UNIFORMS)
            for (let u = 0; u < uLen; u++) {
                const uniformInfo: WebGLActiveInfo = gl.getActiveUniform(this._program, u)
                this._uniforms[uniformInfo.name] = new Uniform(uniformInfo)
            }

            // TODO: This would be more efficient over the array.
            for (let aName in this._attributesByName) {
                if (this._attributesByName.hasOwnProperty(aName)) {
                    this._attributesByName[aName].contextGain(gl, this._program);
                }
            }
            for (let uName in this._uniforms) {
                if (this._uniforms.hasOwnProperty(uName)) {
                    this._uniforms[uName].contextGain(gl, this._program);
                }
            }
        }
        super.contextGain(context)
    }

    /**
     *
     */
    contextLost(): void {
        this._program = void 0
        for (var aName in this._attributesByName) {
            // TODO: This would be better over the array.
            if (this._attributesByName.hasOwnProperty(aName)) {
                this._attributesByName[aName].contextLost()
            }
        }
        for (var uName in this._uniforms) {
            if (this._uniforms.hasOwnProperty(uName)) {
                this._uniforms[uName].contextLost()
            }
        }
        super.contextLost()
    }

    /**
     * @param context
     */
    contextFree(context: ContextProvider): void {
        if (this._program) {
            const gl = context.gl
            if (gl) {
                if (!gl.isContextLost()) {
                    gl.deleteProgram(this._program)
                }
                else {
                    // WebGL has lost the context, effectively cleaning up everything.
                }
            }
            else {
                console.warn("memory leak: WebGLProgram has not been deleted because WebGLRenderingContext is not available anymore.")
            }
            this._program = void 0
        }
        // TODO
        for (let aName in this._attributesByName) {
            if (this._attributesByName.hasOwnProperty(aName)) {
                this._attributesByName[aName].contextFree()
            }
        }
        for (let uName in this._uniforms) {
            if (this._uniforms.hasOwnProperty(uName)) {
                this._uniforms[uName].contextFree()
            }
        }
        super.contextFree(context)
    }

    /**
     *
     */
    use(): void {
        const gl = this.gl
        if (gl) {
            gl.useProgram(this._program)
        }
        else {
            console.warn(`${this._type}.use() missing WebGL rendering context.`)
        }
    }

    /**
     *
     */
    get vertexShaderSrc(): string {
        return this._vertexShaderSrc
    }
    set vertexShaderSrc(vertexShaderSrc: string) {
        this._vertexShaderSrc = mustBeString('vertexShaderSrc', vertexShaderSrc)
        if (this.contextProvider) {
            this.contextProvider.addRef()
            const contextProvider = this.contextProvider
            try {
                this.contextFree(contextProvider)
                this.contextGain(contextProvider)
            }
            finally {
                contextProvider.release()
            }
        }
    }

    /**
     *
     */
    get fragmentShaderSrc(): string {
        return this._fragmentShaderSrc
    }
    set fragmentShaderSrc(fragmentShaderSrc: string) {
        this._fragmentShaderSrc = mustBeString('fragmentShaderSrc', fragmentShaderSrc)
        if (this.contextProvider) {
            this.contextProvider.addRef()
            const contextProvider = this.contextProvider
            try {
                this.contextFree(contextProvider)
                this.contextGain(contextProvider)
            }
            finally {
                contextProvider.release()
            }
        }
    }

    /**
     *
     */
    get attributeNames(): string[] {
        // I wonder if it might be better to use the array and preserve order. 
        const attributes = this._attributesByName;
        if (attributes) {
            return Object.keys(attributes);
        }
        else {
            return void 0;
        }
    }
    set attributeNames(unused) {
        throw new Error(readOnly('attributeNames').message)
    }

    /**
     * Convenience method for dereferencing the name to an attribute location, followed by enabling the attribute.
     */
    enableAttrib(indexOrName: number | string): void {
        if (typeof indexOrName === 'number') {
            if (this.gl) {
                this.gl.enableVertexAttribArray(indexOrName);
            }
        }
        else if (typeof indexOrName === 'string') {
            const attribLoc = this._attributesByName[indexOrName]
            if (attribLoc) {
                attribLoc.enable()
            }
        }
        else {
            throw new TypeError("indexOrName must have type number or string.");
        }
    }

    /**
     *
     */
    enableAttribs(): void {
        const attribLocations = this._attributesByName
        if (attribLocations) {
            // TODO: Store loactions as a plain array in order to avoid temporaries (aNames)
            const aNames = Object.keys(attribLocations)
            for (var i = 0, iLength = aNames.length; i < iLength; i++) {
                attribLocations[aNames[i]].enable()
            }
        }
    }

    /**
     *
     */
    disableAttrib(indexOrName: number | string): void {
        if (typeof indexOrName === 'number') {
            if (this.gl) {
                this.gl.disableVertexAttribArray(indexOrName);
            }
        }
        else if (typeof indexOrName === 'string') {
            const attribLoc = this._attributesByName[indexOrName]
            if (attribLoc) {
                attribLoc.disable()
            }
        }
        else {
            throw new TypeError("indexOrName must have type number or string.");
        }
    }

    /**
     *
     */
    disableAttribs(): void {
        const attribLocations = this._attributesByName
        if (attribLocations) {
            // TODO: Store loactions as a plain array in order to avoid temporaries (aNames)
            const aNames = Object.keys(attribLocations)
            for (var i = 0, iLength = aNames.length; i < iLength; i++) {
                attribLocations[aNames[i]].disable()
            }
        }
    }

    getAttrib(indexOrName: number | string): Attrib {
        if (typeof indexOrName === 'number') {
            // FIXME
            return this._attributesByIndex[indexOrName]
        }
        else if (typeof indexOrName === 'string') {
            return this._attributesByName[indexOrName]
        }
        else {
            throw new TypeError("indexOrName must be a number or a string");
        }
    }

    /**
     * Returns the location (index) of the attribute with the specified name.
     * Returns <code>-1</code> if the name does not correspond to an attribute.
     */
    getAttribLocation(name: string): number {
        const attribLoc = this._attributesByName[name]
        if (attribLoc) {
            return attribLoc.index
        }
        else {
            return -1
        }
    }

    /**
     * <p>
     * Returns a <code>Uniform</code> object corresponding to the <code>uniform</code>
     * parameter of the same name in the shader code. If a uniform parameter of the specified name
     * does not exist, this method throws a descriptive <code>Error</code>.
     * </p>
     *
     * @param name
     * @returns The location object bound to the specified name.
     */
    getUniform(name: string): Uniform {
        const uniforms = this._uniforms
        if (uniforms[name]) {
            return uniforms[name]
        }
        else {
            const msg = `uniform ${name} not found.`
            switch (config.errorMode) {
                case ErrorMode.WARNME: {
                    console.warn(msg)
                    return new Uniform(null)
                }
                case ErrorMode.IGNORE: {
                    return new Uniform(null)
                }
                default: {
                    // In STRICT mode, throwing an Error is consistent with the the other modes
                    // returning a null-like Uniform. Returning void 0 would be inconsistent
                    // even though it allows testing for the existence of a uniform. 
                    throw new Error(msg)
                }
            }
        }
    }

    /**
     * @deprecated Use getUniform instead.
     */
    getUniformLocation(name: string): Uniform {
        console.warn("getUniformLocation is deprecated. Please use getUniform instead.")
        return this.getUniform(name);
    }

    /**
     * <p>
     * Determines whether a <code>uniform</code> with the specified <code>name</code> exists in the <code>WebGLProgram</code>.
     * </p>
     */
    hasUniformLocation(name: string): boolean {
        return isDefined(this._uniforms[name])
    }

    uniform1f(name: string, x: number): void {
        const uniformLoc = this._uniforms[name]
        if (uniformLoc) {
            uniformLoc.uniform1f(x)
        }
    }

    uniform2f(name: string, x: number, y: number): void {
        const uniformLoc = this._uniforms[name]
        if (uniformLoc) {
            uniformLoc.uniform2f(x, y)
        }
    }

    uniform3f(name: string, x: number, y: number, z: number): void {
        const uniformLoc = this._uniforms[name]
        if (uniformLoc) {
            uniformLoc.uniform3f(x, y, z)
        }
    }

    uniform4f(name: string, x: number, y: number, z: number, w: number): void {
        const uniformLoc = this._uniforms[name]
        if (uniformLoc) {
            uniformLoc.uniform4f(x, y, z, w)
        }
    }

    matrix2fv(name: string, matrix: Float32Array, transpose: boolean): void {
        const uniformLoc = this._uniforms[name]
        if (uniformLoc) {
            uniformLoc.matrix2fv(transpose, matrix)
        }
    }

    matrix3fv(name: string, matrix: Float32Array, transpose: boolean) {
        const uniformLoc = this._uniforms[name]
        if (uniformLoc) {
            uniformLoc.matrix3fv(transpose, matrix)
        }
    }

    matrix4fv(name: string, matrix: Float32Array, transpose: boolean) {
        const uniformLoc = this._uniforms[name]
        if (uniformLoc) {
            uniformLoc.matrix4fv(transpose, matrix)
        }
    }

    vector2fv(name: string, data: Float32Array): void {
        const uniformLoc = this._uniforms[name]
        if (uniformLoc) {
            uniformLoc.uniform2fv(data)
        }
    }

    vector3fv(name: string, data: Float32Array): void {
        const uniformLoc = this._uniforms[name]
        if (uniformLoc) {
            uniformLoc.uniform3fv(data)
        }
    }

    vector4fv(name: string, data: Float32Array): void {
        const uniformLoc = this._uniforms[name]
        if (uniformLoc) {
            uniformLoc.uniform4fv(data)
        }
    }
}
