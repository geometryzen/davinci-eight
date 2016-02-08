import fragmentShader from '../programs/fragmentShader';
import Material from '../core/Material';
import vertexShader from '../programs/vertexShader';

/**
 * <p>
 * SmartGraphicsProgram constructs a vertex shader and a fragment shader.
 * The shader codes are configured by specifying attributes, uniforms and varyings.
 * The default configuration is produces minimal shaders.
 * <p> 
 * @class SmartGraphicsProgram
 * @extends Material
 */
export default class SmartGraphicsProgram extends Material {
    /**
     * @class SmartGraphicsProgram
     * @constructor
     * @param aParams
     * @param uParams
     * @param vColor {boolean}
     * @param vLight {boolean}
     */
    constructor(
        aParams: { [name: string]: { glslType: string } },
        uParams: { [name: string]: { glslType: string } },
        vColor: boolean,
        vLight: boolean
    ) {
        super(vertexShader(aParams, uParams, vColor, vLight), fragmentShader(aParams, uParams, vColor, vLight));
    }
}
