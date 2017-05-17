/**
 * A capability that may be enabled or disabled for a WebGLRenderingContext.
 */
export enum Capability {
    /**
     * Let polygons be culled.
     */
    CULL_FACE = 0x0B44,
    /**
     * Blend computed fragment color values with color buffer values.
     */
    BLEND = 0x0BE2,
    /**
     * 
     */
    DITHER = 0x0BD0,
    /**
     * 
     */
    STENCIL_TEST = 0x0B90,
    /**
     * Enable updates of the depth buffer.
     */
    DEPTH_TEST = 0x0B71,
    /**
     * Abandon fragments outside a scissor rectangle.
     */
    SCISSOR_TEST = 0x0C11,
    /**
     * Add an offset to the depth values of a polygon's fragments.
     */
    POLYGON_OFFSET_FILL = 0x8037,
    /**
     * 
     */
    SAMPLE_ALPHA_TO_COVERAGE = 0x809E,
    /**
     * 
     */
    SAMPLE_COVERAGE = 0x80A0
}
