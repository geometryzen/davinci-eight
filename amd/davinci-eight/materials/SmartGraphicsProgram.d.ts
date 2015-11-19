import IContextMonitor = require('../core/IContextMonitor');
import IGraphicsProgram = require('../core/IGraphicsProgram');
import GraphicsProgram = require('../materials/GraphicsProgram');
/**
 * <p>
 * SmartGraphicsProgram constructs a vertex shader and a fragment shader.
 * The shader codes are configured by specifying attributes, uniforms and varyings.
 * The default configuration is produces minimal shaders.
 * <p>
 * @class SmartGraphicsProgram
 * @extends GraphicsProgram
 */
declare class SmartGraphicsProgram extends GraphicsProgram {
    aParams: {
        [name: string]: {
            glslType: string;
        };
    };
    uParams: {
        [name: string]: {
            glslType: string;
        };
    };
    private vColor;
    private vLight;
    /**
     * @class SmartGraphicsProgram
     * @constructor
     * @param contexts {IContextMonitor[]}
     * @param aParams
     * @param uParams
     * @param vColor {boolean}
     * @param vLight {boolean}
     */
    constructor(contexts: IContextMonitor[], aParams: {
        [name: string]: {
            glslType: string;
        };
    }, uParams: {
        [name: string]: {
            glslType: string;
        };
    }, vColor: boolean, vLight: boolean);
    /**
     * @method createGraphicsProgram
     * @return {IGraphicsProgram}
     */
    protected createGraphicsProgram(): IGraphicsProgram;
    /**
     * @property vertexShader
     * @type {string}
     * @readOnly
     */
    vertexShader: string;
    /**
     * @property fragmentShader
     * @type {string}
     * @readOnly
     */
    fragmentShader: string;
}
export = SmartGraphicsProgram;
