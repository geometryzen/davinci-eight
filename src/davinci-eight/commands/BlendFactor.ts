/**
 * <p>
 * The enumerated blending factors for use with <code>WebGLBlendFunc</code>.
 * </p>
 * <p>
 * These values correspond to the values required for <code>gl.blendFunc</code>
 * but are not the same values.
 * </p>
 * <p>
 * Assuming destination with RGBA values of (R<sub>d</sub>, G<sub>d</sub>, B<sub>d</sub>, A<sub>d</sub>),
 * and source fragment with values (R<sub>s</sub>, G<sub>s</sub>, B<sub>s</sub>, A<sub>s</sub>),
 * <ul>
 * <li>R<sub>result</sub> = R<sub>s</sub> * S<sub>r</sub> + R<sub>d</sub> * D<sub>r</sub></li>
 * </ul>
 * </p>
 * @class BlendFactor
 */
enum BlendFactor {
    /**
     * @property DST_ALPHA
     * @type {BlendFactor}
     */
    DST_ALPHA,

    /**
     * @property DST_COLOR
     * @type {BlendFactor}
     */
    DST_COLOR,

    /**
     * @property ONE
     * @type {BlendFactor}
     */
    ONE,

    /**
     * @property ONE_MINUS_DST_ALPHA
     * @type {BlendFactor}
     */
    ONE_MINUS_DST_ALPHA,

    /**
     * @property ONE_MINUS_DST_COLOR
     * @type {BlendFactor}
     */
    ONE_MINUS_DST_COLOR,

    /**
     * @property ONE_MINUS_SRC_ALPHA
     * @type {BlendFactor}
     */
    ONE_MINUS_SRC_ALPHA,

    /**
     * @property ONE_MINUS_SRC_COLOR
     * @type {BlendFactor}
     */
    ONE_MINUS_SRC_COLOR,

    /**
     * @property SRC_ALPHA
     * @type {BlendFactor}
     */
    SRC_ALPHA,

    /**
     * @property SRC_ALPHA_SATURATE
     * @type {BlendFactor}
     */
    SRC_ALPHA_SATURATE,

    /**
     * @property SRC_COLOR
     * @type {BlendFactor}
     */
    SRC_COLOR,

    /**
     * @property ZERO
     * @type {BlendFactor}
     */
    ZERO
}

export default BlendFactor;
