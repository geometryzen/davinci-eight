define(["require", "exports"], function (require, exports) {
    /**
     * <p>
     * A geometry holds the elements or arrays sent to the GLSL pipeline.
     * </p>
     * <p>
     * These instructions are in a compact form suitable for populating WebGLBuffer(s).
     * </p>
     *
     * @class GeometryElements
     */
    var GeometryElements = (function () {
        /**
         * @class GeometryElements
         * @constructor
         * @param data {GeometryData} The instructions for drawing the geometry.
         * @param meta {GeometryMeta}
         */
        function GeometryElements(data, meta) {
            this.data = data;
            this.meta = meta;
        }
        return GeometryElements;
    })();
    return GeometryElements;
});
