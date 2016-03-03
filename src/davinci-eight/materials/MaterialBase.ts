import AttribLocation from '../core/AttribLocation';
import IContextProvider from '../core/IContextProvider';
import makeWebGLProgram from '../core/makeWebGLProgram';
import Matrix2 from '../math/Matrix2';
import Matrix3 from '../math/Matrix3';
import Matrix4 from '../math/Matrix4';
import mustBeArray from '../checks/mustBeArray';
import mustBeString from '../checks/mustBeString';
import mustBeUndefined from '../checks/mustBeUndefined';
import readOnly from '../i18n/readOnly';
import ShareableContextListener from '../core/ShareableContextListener';
import UniformLocation from '../core/UniformLocation';
import VectorE2 from '../math/VectorE2';
import VectorE3 from '../math/VectorE3';
import VectorE4 from '../math/VectorE4';

/**
 * @module EIGHT
 * @submodule materials
 */

/**
 * @class MaterialBase
 * @extends ShareableContextListener
 */
export default class MaterialBase extends ShareableContextListener {

    /**
     * @property _vertexShader
     * @type string
     * @private
     */
    private _vertexShader: string

    /**
     * @property _fragmentShader
     * @type string
     * @private
     */
    private _fragmentShader: string

    /**
     * @property _attribs
     * @type string[]
     * @private
     */
    private _attribs: string[]

    /**
     * @property _program
     * @type WebGLProgram
     * @private
     */
    private _program: WebGLProgram

    /**
     * @property _attributes
     * @type {[name: string]: AttribLocation}
     * @private
     */
    private _attributes: { [name: string]: AttribLocation } = {}

    /**
     * @property _uniforms
     * @type {{[name: string]: UniformLocation}}
     * @private
     */
    private _uniforms: { [name: string]: UniformLocation } = {}

    /**
     * @class MaterialBase
     * @constructor
     * @param vertexShader {string} The vertex shader source code.
     * @param fragmentShader {string} The fragment shader source code.
     * @param [attribs = []] {string[]} The attribute ordering.
     */
    constructor(vertexShader: string, fragmentShader: string, attribs: string[] = []) {
        super('MaterialBase')
        this._vertexShader = mustBeString('vertexShader', vertexShader)
        this._fragmentShader = mustBeString('fragmentShader', fragmentShader)
        this._attribs = mustBeArray('attribs', attribs)
    }

    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void {
        super.destructor()
        mustBeUndefined(this._type, this._program)
    }

    /**
     * @method contextGain
     * @param context {IContextProvider}
     * @return {void}
     */
    contextGain(context: IContextProvider): void {
        const gl = context.gl
        if (!this._program) {
            this._program = makeWebGLProgram(gl, this._vertexShader, this._fragmentShader, this._attribs)
            this._attributes = {}
            this._uniforms = {}

            const aLen: number = gl.getProgramParameter(this._program, gl.ACTIVE_ATTRIBUTES)
            for (let a = 0; a < aLen; a++) {
                const attribInfo: WebGLActiveInfo = gl.getActiveAttrib(this._program, a)
                this._attributes[attribInfo.name] = new AttribLocation(attribInfo)
            }

            const uLen: number = gl.getProgramParameter(this._program, gl.ACTIVE_UNIFORMS)
            for (let u = 0; u < uLen; u++) {
                const uniformInfo: WebGLActiveInfo = gl.getActiveUniform(this._program, u)
                this._uniforms[uniformInfo.name] = new UniformLocation(uniformInfo)
            }

            for (let aName in this._attributes) {
                if (this._attributes.hasOwnProperty(aName)) {
                    this._attributes[aName].contextGain(gl, this._program);
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
     * @method contextLost
     * @return {void}
     */
    contextLost(): void {
        this._program = void 0
        for (var aName in this._attributes) {
            if (this._attributes.hasOwnProperty(aName)) {
                this._attributes[aName].contextLost()
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
     * @method contextFree
     * @param context {IContextProvider}
     * @return {void}
     */
    contextFree(context: IContextProvider): void {
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
        for (let aName in this._attributes) {
            if (this._attributes.hasOwnProperty(aName)) {
                this._attributes[aName].contextFree()
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
     * @method use
     * @return {void}
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
     * @property vertexShader
     * @type string
     * @readOnly
     */
    get vertexShader(): string {
        return this._vertexShader
    }
    set vertexShader(unused) {
        throw new Error(readOnly('vertexShader').message)
    }

    /**
     * @property fragmentShader
     * @type string
     * @readOnly
     */
    get fragmentShader(): string {
        return this._fragmentShader
    }
    set fragmentShader(unused) {
        throw new Error(readOnly('fragmentShader').message)
    }

    /**
     * @property attributeNames
     * @type string[]
     * @readOnly
     */
    get attributeNames(): string[] {
        const attributes = this._attributes
        if (attributes) {
            return Object.keys(attributes)
        }
        else {
            return void 0
        }
    }
    set attributeNames(unused) {
        throw new Error(readOnly('attributeNames').message)
    }

    /**
     * @method enableAttrib
     * @param name {string}
     * @return {void}
     */
    enableAttrib(name: string): void {
        const attribLoc = this._attributes[name]
        if (attribLoc) {
            attribLoc.enable()
        }
    }

    /**
     * @method enableAttribs
     * @return {void}
     */
    enableAttribs(): void {
        const attribLocations = this._attributes
        if (attribLocations) {
            // TODO: Store loactions as a plain array in order to avoid temporaries (aNames)
            const aNames = Object.keys(attribLocations)
            for (var i = 0, iLength = aNames.length; i < iLength; i++) {
                attribLocations[aNames[i]].enable()
            }
        }
    }

    /**
     * @method disableAttrib
     * @param name {string}
     * @return {void}
     */
    disableAttrib(name: string): void {
        const attribLoc = this._attributes[name]
        if (attribLoc) {
            attribLoc.disable()
        }
    }

    /**
     * @method disableAttribs
     * @return {void}
     */
    disableAttribs(): void {
        const attribLocations = this._attributes
        if (attribLocations) {
            // TODO: Store loactions as a plain array in order to avoid temporaries (aNames)
            const aNames = Object.keys(attribLocations)
            for (var i = 0, iLength = aNames.length; i < iLength; i++) {
                attribLocations[aNames[i]].disable()
            }
        }
    }

    /**
     * Returns the location (index) of the attribute with the specified name.
     * Returns <code>-1</code> if the name does not correspond to an attribute.
     *
     * @method getAttribLocation
     * @param name {string}
     * @return {number}
     */
    getAttribLocation(name: string): number {
        const attribLoc = this._attributes[name]
        if (attribLoc) {
            return attribLoc.index
        }
        else {
            return -1
        }
    }

    /**
     * @method vertexPointer
     * @param name {string}
     * @param size {number}
     * @param normalized {boolean}
     * @param stride {number}
     * @param offset {number}
     * @return {void}
     */
    vertexPointer(name: string, size: number, normalized: boolean, stride: number, offset: number): void {
        const attributeLocation = this._attributes[name]
        attributeLocation.vertexPointer(size, normalized, stride, offset)
    }

    /**
     * @method uniform1f
     * @param name {string}
     * @param x {number}
     * @return {void}
     */
    uniform1f(name: string, x: number): void {
        const uniformLoc = this._uniforms[name]
        if (uniformLoc) {
            uniformLoc.uniform1f(x)
        }
    }

    /**
     * @method uniform2f
     * @param name {string}
     * @param x {number}
     * @param y {number}
     * @return {void}
     */
    uniform2f(name: string, x: number, y: number): void {
        const uniformLoc = this._uniforms[name]
        if (uniformLoc) {
            uniformLoc.uniform2f(x, y)
        }
    }

    /**
     * @method uniform3f
     * @param name {string}
     * @param x {number}
     * @param y {number}
     * @param z {number}
     * @return {void}
     */
    uniform3f(name: string, x: number, y: number, z: number): void {
        const uniformLoc = this._uniforms[name]
        if (uniformLoc) {
            uniformLoc.uniform3f(x, y, z)
        }
    }

    /**
     * @method uniform4f
     * @param name {string}
     * @param x {number}
     * @param y {number}
     * @param z {number}
     * @param w {number}
     * @return {void}
     */
    uniform4f(name: string, x: number, y: number, z: number, w: number): void {
        const uniformLoc = this._uniforms[name]
        if (uniformLoc) {
            uniformLoc.uniform4f(x, y, z, w)
        }
    }

    /**
     * @method mat2
     * @param name {string}
     * @param matrix {Matrix2}
     * @param transpose {boolean}
     * @return {void}
     */
    mat2(name: string, matrix: Matrix2, transpose: boolean): void {
        const uniformLoc = this._uniforms[name]
        if (uniformLoc) {
            uniformLoc.mat2(matrix, transpose)
        }
    }

    /**
     * @method mat3
     * @param name {string}
     * @param matrix {Matrix3}
     * @param transpose {boolean}
     * @return {void}
     */
    mat3(name: string, matrix: Matrix3, transpose: boolean) {
        const uniformLoc = this._uniforms[name]
        if (uniformLoc) {
            uniformLoc.mat3(matrix, transpose)
        }
    }

    /**
     * @method mat4
     * @param name {string}
     * @param matrix {Matrix4}
     * @param transpose {boolean}
     * @return {void}
     */
    mat4(name: string, matrix: Matrix4, transpose: boolean) {
        const uniformLoc = this._uniforms[name]
        if (uniformLoc) {
            uniformLoc.mat4(matrix, transpose)
        }
    }

    /**
     * @method vec2
     * @param name {string}
     * @param vector {VectorE2}
     * @return {void}
     */
    vec2(name: string, vector: VectorE2) {
        const uniformLoc = this._uniforms[name]
        if (uniformLoc) {
            uniformLoc.vec2(vector)
        }
    }

    /**
     * @method vec3
     * @param name {string}
     * @param vector {VectorE3}
     * @return {void}
     */
    vec3(name: string, vector: VectorE3) {
        const uniformLoc = this._uniforms[name]
        if (uniformLoc) {
            uniformLoc.vec3(vector)
        }
    }

    /**
     * @method vec4
     * @param name {string}
     * @param vector {VectorE4}
     * @return {void}
     */
    vec4(name: string, vector: VectorE4) {
        const uniformLoc = this._uniforms[name]
        if (uniformLoc) {
            uniformLoc.vec4(vector)
        }
    }

    /**
     * @method vector2
     * @param name {string}
     * @param data {number[]}
     * @return {void}
     */
    vector2(name: string, data: number[]): void {
        const uniformLoc = this._uniforms[name]
        if (uniformLoc) {
            uniformLoc.vector2(data)
        }
    }

    /**
     * @method vector3
     * @param name {string}
     * @param data {number[]}
     * @return {void}
     */
    vector3(name: string, data: number[]): void {
        const uniformLoc = this._uniforms[name]
        if (uniformLoc) {
            uniformLoc.vector3(data)
        }
    }

    /**
     * @method vector4
     * @param name {string}
     * @param data {number[]}
     * @return {void}
     */
    vector4(name: string, data: number[]): void {
        const uniformLoc = this._uniforms[name]
        if (uniformLoc) {
            uniformLoc.vector4(data)
        }
    }
}
