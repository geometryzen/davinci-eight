/**
 * A capability that may be enabled or disabled for a WebGLRenderingContext.
 */
export declare enum Capability {
    /**
     * Let polygons be culled.
     */
    CULL_FACE = 2884,
    /**
     * Blend computed fragment color values with color buffer values.
     */
    BLEND = 3042,
    /**
     *
     */
    DITHER = 3024,
    /**
     *
     */
    STENCIL_TEST = 2960,
    /**
     * Enable updates of the depth buffer.
     */
    DEPTH_TEST = 2929,
    /**
     * Abandon fragments outside a scissor rectangle.
     */
    SCISSOR_TEST = 3089,
    /**
     * Add an offset to the depth values of a polygon's fragments.
     */
    POLYGON_OFFSET_FILL = 32823,
    /**
     *
     */
    SAMPLE_ALPHA_TO_COVERAGE = 32926,
    /**
     *
     */
    SAMPLE_COVERAGE = 32928
}
