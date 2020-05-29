"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Capability = void 0;
/**
 * A capability that may be enabled or disabled for a WebGLRenderingContext.
 */
var Capability;
(function (Capability) {
    /**
     * Let polygons be culled.
     */
    Capability[Capability["CULL_FACE"] = 2884] = "CULL_FACE";
    /**
     * Blend computed fragment color values with color buffer values.
     */
    Capability[Capability["BLEND"] = 3042] = "BLEND";
    /**
     *
     */
    Capability[Capability["DITHER"] = 3024] = "DITHER";
    /**
     *
     */
    Capability[Capability["STENCIL_TEST"] = 2960] = "STENCIL_TEST";
    /**
     * Enable updates of the depth buffer.
     */
    Capability[Capability["DEPTH_TEST"] = 2929] = "DEPTH_TEST";
    /**
     * Abandon fragments outside a scissor rectangle.
     */
    Capability[Capability["SCISSOR_TEST"] = 3089] = "SCISSOR_TEST";
    /**
     * Add an offset to the depth values of a polygon's fragments.
     */
    Capability[Capability["POLYGON_OFFSET_FILL"] = 32823] = "POLYGON_OFFSET_FILL";
    /**
     *
     */
    Capability[Capability["SAMPLE_ALPHA_TO_COVERAGE"] = 32926] = "SAMPLE_ALPHA_TO_COVERAGE";
    /**
     *
     */
    Capability[Capability["SAMPLE_COVERAGE"] = 32928] = "SAMPLE_COVERAGE";
})(Capability = exports.Capability || (exports.Capability = {}));
