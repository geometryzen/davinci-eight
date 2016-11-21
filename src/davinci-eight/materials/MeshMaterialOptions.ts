import MaterialOptions from './MaterialOptions';

/**
 *
 */
interface MeshMaterialOptions extends MaterialOptions {

  /**
   * A mapping from the attribute name to the size of the vector.
   * For example, 'aPosition': 3 produces 'attribute vec3 aPosition;'.
   */
  attributes?: { [name: string]: number };

  /**
   * A mapping from the uniform name to the type name.
   * For example, 'uModel': 'mat4' produces 'uniform mat4 uModel;'.
   */
  uniforms?: { [name: string]: string };
}

export default MeshMaterialOptions;
