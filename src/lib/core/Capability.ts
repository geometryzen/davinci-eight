/**
 * A capability that may be enabled or disabled for a WebGL rendering context.
 */
export enum Capability {
    /**
     * Let polygons be culled.
     */
    CULL_FACE = 0x0b44,
    /**
     * Blend computed fragment color values with color buffer values.
     */
    BLEND = 0x0be2,
    /**
     *
     */
    DITHER = 0x0bd0,
    /**
     *
     */
    STENCIL_TEST = 0x0b90,
    /**
     * Enable updates of the depth buffer.
     */
    DEPTH_TEST = 0x0b71,
    /**
     * Abandon fragments outside a scissor rectangle.
     */
    SCISSOR_TEST = 0x0c11,
    /**
     * Add an offset to the depth values of a polygon's fragments.
     */
    POLYGON_OFFSET_FILL = 0x8037,
    /**
     *
     */
    SAMPLE_ALPHA_TO_COVERAGE = 0x809e,
    /**
     *
     */
    SAMPLE_COVERAGE = 0x80a0
}
