/**
 * A capability that may be enabled or disabled for a <code>WebGLRenderingContext</code>.
 * @class Capability
 */
declare enum Capability {
    /**
     * Blend computed fragment color values with color buffer values.
     * @property BLEND
     * @type {Capability}
     */
    BLEND = 0,
    /**
     * Let polygons be culled.
     * @property CULL_FACE
     * @type {Capability}
     */
    CULL_FACE = 1,
    /**
     * Enable updates of the depth buffer.
     * @property DEPTH_TEST
     * @type {Capability}
     */
    DEPTH_TEST = 2,
    /**
     * Add an offset to the depth values of a polygon's fragments.
     * @property POLYGON_OFFSET_FILL
     * @type {Capability}
     */
    POLYGON_OFFSET_FILL = 3,
    /**
     * Abandon fragments outside a scissor rectangle.
     * @property SCISSOR_TEST
     * @type {Capability}
     */
    SCISSOR_TEST = 4,
}
export = Capability;
