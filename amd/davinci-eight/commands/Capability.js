define(["require", "exports"], function (require, exports) {
    /**
     * A capability that may be enabled or disabled for a <code>WebGLRenderingContext</code>.
     * @class Capability
     */
    var Capability;
    (function (Capability) {
        /**
         * Blend computed fragment color values with color buffer values.
         * @property BLEND
         * @type {Capability}
         */
        Capability[Capability["BLEND"] = 0] = "BLEND";
        /**
         * Let polygons be culled.
         * @property CULL_FACE
         * @type {Capability}
         */
        Capability[Capability["CULL_FACE"] = 1] = "CULL_FACE";
        /**
         * Enable updates of the depth buffer.
         * @property DEPTH_TEST
         * @type {Capability}
         */
        Capability[Capability["DEPTH_TEST"] = 2] = "DEPTH_TEST";
        /**
         * Add an offset to the depth values of a polygon's fragments.
         * @property POLYGON_OFFSET_FILL
         * @type {Capability}
         */
        Capability[Capability["POLYGON_OFFSET_FILL"] = 3] = "POLYGON_OFFSET_FILL";
        /**
         * Abandon fragments outside a scissor rectangle.
         * @property SCISSOR_TEST
         * @type {Capability}
         */
        Capability[Capability["SCISSOR_TEST"] = 4] = "SCISSOR_TEST";
    })(Capability || (Capability = {}));
    return Capability;
});
