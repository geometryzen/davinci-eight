/**
 * A specification of the attributes and uniforms required in the Material.
 */
interface MaterialOptions {
    /**
     * A mapping from the attribute name to the size of the float or vector.
     * 'aThing': 1 => 'attribute float aThing'
     * 'aThing': 2 => 'attribute vec2 aThing;'
     * 'aThing': 3 => 'attribute vec3 aThing;'
     * 'aThing': 4 => 'attribute vec4 aThing;'
     */
    attributes?: { [name: string]: 1 | 2 | 3 | 4 };
    /**
     * A mapping from the uniform name to the type name.
     * For example, 'uModel': 'mat4' produces 'uniform mat4 uModel;'.
     */
    uniforms?: { [name: string]: 'float' | 'mat2' | 'mat3' | 'mat4' | 'vec2' | 'vec3' | 'vec4' };
}

export default MaterialOptions;
