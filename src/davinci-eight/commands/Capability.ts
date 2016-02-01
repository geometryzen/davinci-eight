/**
 * A capability that may be enabled or disabled for a <code>WebGLRenderingContext</code>.
 * @class Capability
 */
enum Capability {
    /**
     * Blend computed fragment color values with color buffer values.
     * @property BLEND
     * @type {Capability}
     */
    BLEND,

    /**
     * Let polygons be culled.
     * @property CULL_FACE
     * @type {Capability}
     */
    CULL_FACE,

    /**
     * Enable updates of the depth buffer.
     * @property DEPTH_TEST
     * @type {Capability}
     */
    DEPTH_TEST,

    /**
     * Add an offset to the depth values of a polygon's fragments.
     * @property POLYGON_OFFSET_FILL
     * @type {Capability}
     */
    POLYGON_OFFSET_FILL,

    /**
     * Abandon fragments outside a scissor rectangle.
     * @property SCISSOR_TEST
     * @type {Capability}
     */
    SCISSOR_TEST
}

export default Capability;
