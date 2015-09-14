/**
 * Canonical variable names, which also act as semantic identifiers for name overrides.
 * These names must be stable to avoid breaking custom vertex and fragment shaders.
 * @class Symbolic
 */
class Symbolic {
  public static ATTRIBUTE_COLOR: string                     = 'aColor';
  public static ATTRIBUTE_NORMAL: string                    = 'aNormal';
  public static ATTRIBUTE_POSITION: string                  = 'aPosition';
  public static ATTRIBUTE_TEXTURE_COORDS: string            = 'aTextureCoords';

  public static UNIFORM_AMBIENT_LIGHT: string               = 'uAmbientLight';
  public static UNIFORM_COLOR: string                       = 'uColor';
  public static UNIFORM_DIRECTIONAL_LIGHT_COLOR: string     = 'uDirectionalLightColor';
  public static UNIFORM_DIRECTIONAL_LIGHT_DIRECTION: string = 'uDirectionalLightDirection';
  public static UNIFORM_POINT_LIGHT_COLOR: string           = 'uPointLightColor';
  public static UNIFORM_POINT_LIGHT_POSITION: string        = 'uPointLightPosition';
  public static UNIFORM_PROJECTION_MATRIX: string           = 'uProjection';
  public static UNIFORM_MODEL_MATRIX: string                = 'uModel';
  public static UNIFORM_NORMAL_MATRIX: string               = 'uNormal';
  public static UNIFORM_VIEW_MATRIX: string                 = 'uView';

  public static VARYING_COLOR: string                       = 'vColor';
  public static VARYING_LIGHT: string                       = 'vLight';
}

export = Symbolic;
