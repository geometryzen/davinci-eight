import { AttributeSizeType } from '../core/AttributeSizeType';
import { UniformGlslType } from '../core/UniformGlslType';
import { GLSLESVersion } from './glslVersion';
/**
 * A specification of the attributes and uniforms required in the Material.
 * @hidden
 */
export interface MaterialOptions {
    /**
     * A mapping from the attribute name to the size of the float or vector.
     * 'aThing': 1 => 'attribute float aThing'
     * 'aThing': 2 => 'attribute vec2 aThing;'
     * 'aThing': 3 => 'attribute vec3 aThing;'
     * 'aThing': 4 => 'attribute vec4 aThing;'
     */
    attributes?: {
        [name: string]: AttributeSizeType;
    };
    /**
     * A mapping from the uniform name to the type name.
     * For example, 'M': 'mat4' produces 'uniform mat4 M;'.
     */
    uniforms?: {
        [name: string]: UniformGlslType;
    };
    /**
     * An optional GLSL version that can be used to override the default algorithm for shader version.
     */
    version?: GLSLESVersion;
}
