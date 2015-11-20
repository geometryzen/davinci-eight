import AttribLocation = require('../core/AttribLocation')
import IContextConsumer = require('../core/IContextConsumer')
import IContextProvider = require('../core/IContextProvider')
import makeWebGLProgram = require('../programs/makeWebGLProgram')
import mustBeArray = require('../checks/mustBeArray')
import mustBeObject = require('../checks/mustBeObject')
import mustBeString = require('../checks/mustBeString')
import UniformLocation = require('../core/UniformLocation')
import Shareable = require('../utils/Shareable')

/**
 * @class SimpleWebGLProgram
 * @extends Shareable
 */
class SimpleWebGLProgram extends Shareable implements IContextConsumer {

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
                    this.contextFree(canvasId)
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

    /**
     * @method contextGain
     * @param context {IContextProvider}
     * @return {void}
     */
    contextGain(unused: IContextProvider): void {
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
                attributes[aName].contextGain(gl, program)
            }
            for (var uName in uniforms) {
                uniforms[uName].contextGain(gl, program)
            }
        }
    }

    /**
     * @method contextLost
     * @param [canvasId] {number}
     * @return {void}
     */
    contextLost(unused?: number): void {
        this.program = void 0
        for (var aName in this.attributes) {
            this.attributes[aName].contextLost()
        }
        for (var uName in this.uniforms) {
            this.uniforms[uName].contextLost()
        }
    }

    /**
     * @method contextFree
     * @param [canvasId] number
     * @return {void} 
     */
    contextFree(unused?: number): void {
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
            this.attributes[aName].contextFree()
        }
        for (var uName in this.uniforms) {
            this.uniforms[uName].contextFree()
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

export = SimpleWebGLProgram
