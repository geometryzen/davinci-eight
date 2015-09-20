define(["require", "exports"], function (require, exports) {
    /**
     * <p>
     * A geometry holds the elements or arrays sent to the GLSL pipeline.
     * </p>
     * <p>
     * These instructions are in a compact form suitable for populating WebGLBuffer(s).
     * </p>
     *
     * @class Geometry
     */
    var Geometry = (function () {
        /**
         * @class Geometry
         * @constructor
         * @param data {GeometryData} The instructions for drawing the geometry.
         * @param meta {GeometryMeta}
         */
        function Geometry(data, meta) {
            this.data = data;
            this.meta = meta;
        }
        return Geometry;
    })();
    return Geometry;
});
