/**
 * <p>
 * Canonical variable names, which also act as semantic identifiers for name overrides.
 * These names must be stable to avoid breaking custom vertex and fragment shaders.
 * </p>
 *
 * @class Symbolic
 */
class Symbolic {

  /**
   * 'aColor'
   * @property ATTRIBUTE_COLOR
   * @type {string}
   * @static
   */
  public static ATTRIBUTE_COLOR: string                     = 'aColor';

  /**
   * 'aMaterialIndex'
   * @property ATTRIBUTE_MATERIAL_INDEX
   * @type {string}
   * @static
   */
  public static ATTRIBUTE_MATERIAL_INDEX: string            = 'aMaterialIndex';

  /**
   * 'aNormal'
   * @property ATTRIBUTE_NORMAL
   * @type {string}
   * @static
   */
  public static ATTRIBUTE_NORMAL: string                    = 'aNormal';

  /**
   * 'aPosition'
   * @property ATTRIBUTE_POSITION
   * @type {string}
   * @static
   */
  public static ATTRIBUTE_POSITION: string                  = 'aPosition';

  /**
   * 'aTextureCoords'
   * @property ATTRIBUTE_TEXTURE_COORDS
   * @type {string}
   * @static
   */
  public static ATTRIBUTE_TEXTURE_COORDS: string            = 'aTextureCoords';

  /**
   * 'uAmbientLight'
   * @property UNIFORM_AMBIENT_LIGHT
   * @type {string}
   * @static
   */
  public static UNIFORM_AMBIENT_LIGHT: string               = 'uAmbientLight';

  public static UNIFORM_COLOR: string                       = 'uColor';
  public static UNIFORM_DIRECTIONAL_LIGHT_COLOR: string     = 'uDirectionalLightColor';
  public static UNIFORM_DIRECTIONAL_LIGHT_DIRECTION: string = 'uDirectionalLightDirection';
  public static UNIFORM_POINT_LIGHT_COLOR: string           = 'uPointLightColor';
  public static UNIFORM_POINT_LIGHT_POSITION: string        = 'uPointLightPosition';

  /**
   * 'uProjection'
   * @property UNIFORM_PROJECTION_MATRIX
   * @type {string}
   * @static
   */
  public static UNIFORM_PROJECTION_MATRIX: string           = 'uProjection';

  /**
   * 'uModel'
   */
  public static UNIFORM_MODEL_MATRIX: string                = 'uModel';
  public static UNIFORM_NORMAL_MATRIX: string               = 'uNormal';
  public static UNIFORM_VIEW_MATRIX: string                 = 'uView';

  /**
   * 'vColor'
   * @property VARYING_COLOR
   * @type {string}
   * @static
   */
  public static VARYING_COLOR: string                       = 'vColor';

  /**
   * 'vLight'
   * @property VARYING_LIGHT
   * @type {string}
   * @static
   */
  public static VARYING_LIGHT: string                       = 'vLight';
}

export = Symbolic;
