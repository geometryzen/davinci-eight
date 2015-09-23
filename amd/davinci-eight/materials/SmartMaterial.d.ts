import ContextMonitor = require('../core/ContextMonitor');
import IMaterial = require('../core/IMaterial');
import Material = require('../materials/Material');
/**
 * <p>
 * SmartMaterial constructs a vertex shader and a fragment shader.
 * The shader codes are configured by specifying attributes, uniforms and varyings.
 * The default configuration is produces minimal shaders.
 * <p>
 * @class SmartMaterial
 * @extends Material
 */
declare class SmartMaterial extends Material {
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
     * @class SmartMaterial
     * @constructor
     * @param contexts {ContextMonitor[]}
     * @param geometry {GeometryMeta} This parameter determines the attributes used in the shaders.
     */
    constructor(contexts: ContextMonitor[], aParams: {
        [name: string]: {
            glslType: string;
        };
    }, uParams: {
        [name: string]: {
            glslType: string;
        };
    }, vColor: boolean, vLight: boolean);
    protected createProgram(): IMaterial;
    vertexShader: string;
    fragmentShader: string;
}
export = SmartMaterial;
