/**
 * Canonical variable names, which also act as semantic identifiers for name overrides.
 * These names must be stable to avoid breaking custom vertex and fragment shaders.
 * @class Symbolic
 */
class Symbolic {
  public static ATTRIBUTE_COLOR    = 'aVertexColor';
  public static ATTRIBUTE_NORMAL   = 'aVertexNormal';
  public static ATTRIBUTE_POSITION = 'aVertexPosition';
  public static ATTRIBUTE_TEXTURE  = 'aTexCoord';

  public static UNIFORM_AMBIENT_LIGHT               = 'uAmbientLight';
  public static UNIFORM_COLOR                       = 'uColor';
  public static UNIFORM_DIRECTIONAL_LIGHT_COLOR     = 'uDirectionalLightColor';
  public static UNIFORM_DIRECTIONAL_LIGHT_DIRECTION = 'uDirectionalLightDirection';
  public static UNIFORM_POINT_LIGHT_COLOR           = 'uPointLightColor';
  public static UNIFORM_POINT_LIGHT_POSITION        = 'uPointLightPosition';
  public static UNIFORM_PROJECTION_MATRIX           = 'uProjectionMatrix';
  public static UNIFORM_MODEL_MATRIX                = 'uModelMatrix';
  public static UNIFORM_NORMAL_MATRIX               = 'uNormalMatrix';
  public static UNIFORM_VIEW_MATRIX                 = 'uViewMatrix';

  public static VARYING_COLOR                       = 'vColor';
  public static VARYING_LIGHT                       = 'vLight';
}

export = Symbolic;
