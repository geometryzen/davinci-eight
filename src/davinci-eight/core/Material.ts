import AttribLocation from './AttribLocation';
import IContextProvider from './IContextProvider';
import makeWebGLProgram from './makeWebGLProgram';
import Mat2R from '../math/Mat2R';
import Mat3R from '../math/Mat3R';
import Mat4R from '../math/Mat4R';
import mustBeArray from '../checks/mustBeArray';
import mustBeObject from '../checks/mustBeObject';
import mustBeString from '../checks/mustBeString';
import mustBeUndefined from '../checks/mustBeUndefined';
import readOnly from '../i18n/readOnly';
import ShareableContextListener from './ShareableContextListener';
import UniformLocation from './UniformLocation';
import VectorE2 from '../math/VectorE2';
import VectorE3 from '../math/VectorE3';
import VectorE4 from '../math/VectorE4';

/**
 * @class Material
 * @extends Shareable
 */
export default class Material extends ShareableContextListener {

    /**
     * @property _vertexShader
     * @type {string}
     * @private
     */
    private _vertexShader: string;

    /**
     * @property fragmentShader
     * @type {string}
     * @private
     */
    private _fragmentShader: string;

    /**
     * @property attribs
     * @type {Array&lt;string&gt;}
     * @private
     */
    private attribs: string[];

    /**
     * @property program
     * @type {WebGLProgram}
     * @private
     */
    private _program: WebGLProgram;

    /**
     * @property attributes
     * @type {{[name: string]: AttribLocation}}
     */
    public attributes: { [name: string]: AttribLocation } = {};

    /**
     * @property uniforms
     * @type {{[name: string]: UniformLocation}}
     */
    public uniforms: { [name: string]: UniformLocation } = {};

    /**
     * This class is <em>simple</em> because it assumes exactly
     * one vertex shader and one fragment shader.
     * This class assumes that it will only be supporting a single WebGL rendering context.
     * The existence of the context in the constructor enables it to enforce this invariant.
     * @class Material
     * @constructor
     * @param context {IContextProvider} The context that this program will work with.
     * @param vertexShader {string} The vertex shader source code.
     * @param fragmentShader {string} The fragment shader source code.
     * @param [attribs] {Array&lt;string&gt;} The attribute ordering.
     */
    constructor(vertexShader: string, fragmentShader: string, attribs: string[] = []) {
        super('Material')
        this._vertexShader = mustBeString('vertexShader', vertexShader)
        this._fragmentShader = mustBeString('fragmentShader', fragmentShader)
        this.attribs = mustBeArray('attribs', attribs)
    }

    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void {
//      this.detachFromMonitor()
        super.destructor()
        mustBeUndefined(this._type, this._program)
    }

    contextGain(context: IContextProvider): void {
        mustBeObject('context', context)
        const gl = context.gl
        if (!this._program) {
            this._program = makeWebGLProgram(gl, this._vertexShader, this._fragmentShader, this.attribs)
            const program = this._program
            const attributes = this.attributes
            const uniforms = this.uniforms
            const activeAttributes: number = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES)
            for (let a = 0; a < activeAttributes; a++) {
                const activeAttribInfo: WebGLActiveInfo = gl.getActiveAttrib(program, a)
                const name: string = activeAttribInfo.name
                if (!attributes[name]) {
                    attributes[name] = new AttribLocation(name)
                }
            }
            const activeUniforms: number = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS)
            for (let u = 0; u < activeUniforms; u++) {
                const activeUniformInfo: WebGLActiveInfo = gl.getActiveUniform(program, u)
                const name: string = activeUniformInfo.name
                if (!uniforms[name]) {
                    uniforms[name] = new UniformLocation(name)
                }
            }
            for (let aName in attributes) {
                if (attributes.hasOwnProperty(aName)) {
                    attributes[aName].contextGain(gl, program);
                }
            }
            for (let uName in uniforms) {
                if (uniforms.hasOwnProperty(uName)) {
                    uniforms[uName].contextGain(gl, program);
                }
            }
        }
        super.contextGain(context)
    }

    contextLost(): void {
        this._program = void 0
        for (var aName in this.attributes) {
            if (this.attributes.hasOwnProperty(aName)) {
                this.attributes[aName].contextLost();
            }
        }
        for (var uName in this.uniforms) {
            if (this.uniforms.hasOwnProperty(uName)) {
                this.uniforms[uName].contextLost();
            }
        }
        super.contextLost()
    }

    contextFree(context: IContextProvider): void {
        mustBeObject('context', context)
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
        for (var aName in this.attributes) {
            if (this.attributes.hasOwnProperty(aName)) {
                this.attributes[aName].contextFree();
            }
        }
        for (var uName in this.uniforms) {
            if (this.uniforms.hasOwnProperty(uName)) {
                this.uniforms[uName].contextFree();
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
     */
    get vertexShader(): string {
        return this._vertexShader;
    }
    set vertexShader(unused) {
        throw new Error(readOnly('vertexShader').message)
    }

    /**
     * @property fragmentShader
     * @type string
     */
    get fragmentShader(): string {
        return this._fragmentShader;
    }
    set fragmentShader(unused) {
        throw new Error(readOnly('fragmentShader').message)
    }

    /**
     * @method enableAttrib
     * @param name {string}
     * @return {void}
     */
    enableAttrib(name: string): void {
        const attribLoc = this.attributes[name]
        if (attribLoc) {
            attribLoc.enable()
        }
    }

    /**
     * @method disableAttrib
     * @param name {string}
     * @return {void}
     */
    disableAttrib(name: string): void {
        const attribLoc = this.attributes[name]
        if (attribLoc) {
            attribLoc.disable()
        }
    }

    /**
     * @method uniform1f
     * @param name {string}
     * @param x {number}
     * @return {void}
     */
    uniform1f(name: string, x: number): void {
        const uniformLoc = this.uniforms[name]
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
        const uniformLoc = this.uniforms[name]
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
        const uniformLoc = this.uniforms[name]
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
        const uniformLoc = this.uniforms[name]
        if (uniformLoc) {
            uniformLoc.uniform4f(x, y, z, w)
        }
    }
    mat2(name: string, matrix: Mat2R, transpose: boolean) {
        const uniformLoc = this.uniforms[name]
        if (uniformLoc) {
            uniformLoc.mat2(matrix, transpose)
        }
    }
    mat3(name: string, matrix: Mat3R, transpose: boolean) {
        const uniformLoc = this.uniforms[name]
        if (uniformLoc) {
            uniformLoc.mat3(matrix, transpose)
        }
    }
    mat4(name: string, matrix: Mat4R, transpose: boolean) {
        const uniformLoc = this.uniforms[name]
        if (uniformLoc) {
            uniformLoc.mat4(matrix, transpose)
        }
    }
    vec2(name: string, vector: VectorE2) {
        const uniformLoc = this.uniforms[name]
        if (uniformLoc) {
            uniformLoc.vec2(vector)
        }
    }
    vec3(name: string, vector: VectorE3) {
        const uniformLoc = this.uniforms[name]
        if (uniformLoc) {
            uniformLoc.vec3(vector)
        }
    }
    vec4(name: string, vector: VectorE4) {
        const uniformLoc = this.uniforms[name]
        if (uniformLoc) {
            uniformLoc.vec4(vector)
        }
    }
    vector2(name: string, data: number[]): void {
        const uniformLoc = this.uniforms[name]
        if (uniformLoc) {
            uniformLoc.vector2(data)
        }
    }
    vector3(name: string, data: number[]): void {
        const uniformLoc = this.uniforms[name]
        if (uniformLoc) {
            uniformLoc.vector3(data)
        }
    }
    vector4(name: string, data: number[]): void {
        const uniformLoc = this.uniforms[name]
        if (uniformLoc) {
            uniformLoc.vector4(data)
        }
    }
}
