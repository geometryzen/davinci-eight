/**
 * @class Symbolic
 * Canonical variable names, which act as semantic identifiers.
 */
class Symbolic {
  public static ATTRIBUTE_COLOR    = 'vertexColor';
  public static ATTRIBUTE_NORMAL   = 'vertexNormal';
  public static ATTRIBUTE_POSITION = 'vertexPosition';

  public static UNIFORM_AMBIENT_LIGHT               = 'ambientLight';
  public static UNIFORM_COLOR                       = 'color';
  public static UNIFORM_DIRECTIONAL_LIGHT_COLOR     = 'directionalLightColor';
  public static UNIFORM_DIRECTIONAL_LIGHT_DIRECTION = 'directionalLightDirection';
  public static UNIFORM_POINT_LIGHT_COLOR           = 'pointLightColor';
  public static UNIFORM_POINT_LIGHT_POSITION        = 'pointLightPosition';
  public static UNIFORM_PROJECTION_MATRIX           = 'projectionMatrix';
  public static UNIFORM_MODEL_MATRIX                = 'modelMatrix';
  public static UNIFORM_NORMAL_MATRIX               = 'normalMatrix';
  public static UNIFORM_VIEW_MATRIX                 = 'viewMatrix';

  public static VARYING_COLOR                       = 'vColor';
  public static VARYING_LIGHT                       = 'vLight';

  // FIXME: These are stems, not uniform variable names.
  public static UNIFORM_DIRECTIONAL_LIGHT = 'DirectionalLight';
  public static UNIFORM_POINT_LIGHT       = 'PointLight';
}

export = Symbolic;
