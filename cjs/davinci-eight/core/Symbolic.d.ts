/**
 * Canonical variable names, which also act as semantic identifiers for name overrides.
 * These names must be stable to avoid breaking custom vertex and fragment shaders.
 * @class Symbolic
 */
declare class Symbolic {
    static ATTRIBUTE_COLOR: string;
    static ATTRIBUTE_NORMAL: string;
    static ATTRIBUTE_POSITION: string;
    static ATTRIBUTE_TEXTURE_COORDS: string;
    static UNIFORM_AMBIENT_LIGHT: string;
    static UNIFORM_COLOR: string;
    static UNIFORM_DIRECTIONAL_LIGHT_COLOR: string;
    static UNIFORM_DIRECTIONAL_LIGHT_DIRECTION: string;
    static UNIFORM_POINT_LIGHT_COLOR: string;
    static UNIFORM_POINT_LIGHT_POSITION: string;
    static UNIFORM_PROJECTION_MATRIX: string;
    static UNIFORM_MODEL_MATRIX: string;
    static UNIFORM_NORMAL_MATRIX: string;
    static UNIFORM_VIEW_MATRIX: string;
    static VARYING_COLOR: string;
    static VARYING_LIGHT: string;
}
export = Symbolic;
