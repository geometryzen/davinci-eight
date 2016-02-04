import AttribLocation from '../core/AttribLocation';
import IContextConsumer from '../core/IContextConsumer';
import IContextProvider from '../core/IContextProvider';
import makeWebGLProgram from '../programs/makeWebGLProgram';
import mustBeArray from '../checks/mustBeArray';
import mustBeObject from '../checks/mustBeObject';
import mustBeString from '../checks/mustBeString';
import UniformLocation from '../core/UniformLocation';
import Shareable from '../utils/Shareable';

/**
 * @class SimpleWebGLProgram
 * @extends Shareable
 */
export default class SimpleWebGLProgram extends Shareable implements IContextConsumer {

    /**
     * @property context
     * @type {IContextProvider}
     * @private
     */
    private context: IContextProvider;

    /**
     * @property vertexShader
     * @type {string}
     * @private
     */
    private vertexShader: string;

    /**
     * @property fragmentShader
     * @type {string}
     * @private
     */
    private fragmentShader: string;

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
    private program: WebGLProgram;

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
     * @class SimpleWebGLProgram
     * @constructor
     * @param context {IContextProvider} The context that this program will work with.
     * @param vertexShader {string} The vertex shader source code.
     * @param fragmentShader {string} The fragment shader source code.
     * @param [attribs] {Array&lt;string&gt;} The attribute ordering.
     */
    constructor(context: IContextProvider, vertexShader: string, fragmentShader: string, attribs: string[] = []) {
        super('SimpleWebGLProgram')
        this.context = mustBeObject('context', context)
        context.addRef()
        this.vertexShader = mustBeString('vertexShader', vertexShader)
        this.fragmentShader = mustBeString('fragmentShader', fragmentShader)
        this.attribs = mustBeArray('attribs', attribs)
        context.addContextListener(this)
        context.synchronize(this)
    }

    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void {
        let context = this.context
        let canvasId = context.canvasId
        // If the program has been allocated, find out what to do with it.
        // (we may have been disconnected from listening)
        if (this.program) {
            let gl = context.gl
            if (gl) {
                if (gl.isContextLost()) {
                    this.contextLost(canvasId)
                }
                else {
                    this.contextFree(context)
                }
            }
            else {
                console.warn("memory leak: WebGLProgram has not been deleted because WebGLRenderingContext is not available anymore.")
            }
        }
        context.removeContextListener(this)
        this.context.release()
        this.context = void 0
    }

    contextGain(manager: IContextProvider): void {
        let context = this.context
        let gl = context.gl
        if (!this.program) {
            this.program = makeWebGLProgram(context.gl, this.vertexShader, this.fragmentShader, this.attribs)
            let program = this.program
            let attributes = this.attributes
            let uniforms = this.uniforms
            let activeAttributes: number = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES)
            for (var a = 0; a < activeAttributes; a++) {
                let activeAttribInfo: WebGLActiveInfo = gl.getActiveAttrib(program, a)
                let name: string = activeAttribInfo.name
                if (!attributes[name]) {
                    attributes[name] = new AttribLocation(context, name)
                }
            }
            let activeUniforms: number = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS)
            for (var u = 0; u < activeUniforms; u++) {
                let activeUniformInfo: WebGLActiveInfo = gl.getActiveUniform(program, u)
                let name: string = activeUniformInfo.name
                if (!uniforms[name]) {
                    uniforms[name] = new UniformLocation(context, name)
                }
            }
            for (var aName in attributes) {
                if (attributes.hasOwnProperty(aName)) {
                    attributes[aName].contextGain(gl, program);
                }
            }
            for (var uName in uniforms) {
                if (uniforms.hasOwnProperty(uName)) {
                    uniforms[uName].contextGain(gl, program);
                }
            }
        }
    }

    contextLost(unused?: number): void {
        this.program = void 0
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
    }

    contextFree(manager: IContextProvider): void {
        if (this.program) {
            let gl = this.context.gl
            if (gl) {
                if (!gl.isContextLost()) {
                    gl.deleteProgram(this.program)
                }
                else {
                    // WebGL has lost the context, effectively cleaning up everything.
                }
            }
            else {
                console.warn("memory leak: WebGLProgram has not been deleted because WebGLRenderingContext is not available anymore.")
            }
            this.program = void 0
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
    }

    /**
     * @method use
     * @return {void}
     */
    use(): void {
        this.context.gl.useProgram(this.program)
    }
}
