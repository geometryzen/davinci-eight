import AttribLocation = require('../core/AttribLocation');
import IContextConsumer = require('../core/IContextConsumer');
import IContextProvider = require('../core/IContextProvider');
import UniformLocation = require('../core/UniformLocation');
import Shareable = require('../utils/Shareable');
/**
 * @class SimpleWebGLProgram
 * @extends Shareable
 */
declare class SimpleWebGLProgram extends Shareable implements IContextConsumer {
    /**
     * @property context
     * @type {IContextProvider}
     * @private
     */
    private context;
    /**
     * @property vertexShader
     * @type {string}
     * @private
     */
    private vertexShader;
    /**
     * @property fragmentShader
     * @type {string}
     * @private
     */
    private fragmentShader;
    /**
     * @property attribs
     * @type {Array&lt;string&gt;}
     * @private
     */
    private attribs;
    /**
     * @property program
     * @type {WebGLProgram}
     * @private
     */
    private program;
    /**
     * @property attributes
     * @type {{[name: string]: AttribLocation}}
     */
    attributes: {
        [name: string]: AttribLocation;
    };
    /**
     * @property uniforms
     * @type {{[name: string]: UniformLocation}}
     */
    uniforms: {
        [name: string]: UniformLocation;
    };
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
    constructor(context: IContextProvider, vertexShader: string, fragmentShader: string, attribs?: string[]);
    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void;
    /**
     * @method contextGain
     * @param context {IContextProvider}
     * @return {void}
     */
    contextGain(unused: IContextProvider): void;
    /**
     * @method contextLost
     * @param [canvasId] {number}
     * @return {void}
     */
    contextLost(unused?: number): void;
    /**
     * @method contextFree
     * @param [canvasId] number
     * @return {void}
     */
    contextFree(unused?: number): void;
    /**
     * @method use
     * @return {void}
     */
    use(): void;
}
export = SimpleWebGLProgram;
