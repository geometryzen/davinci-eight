define(["require", "exports"], function (require, exports) {
    /**
     * <p>
     * A geometry holds the elements or arrays sent to the GLSL pipeline.
     * </p>
     * <p>
     * These instructions are in a compact form suitable for populating WebGLBuffer(s).
     * </p>
     *
     * @class SerialGeometry
     */
    var SerialGeometry = (function () {
        /**
         * @class SerialGeometry
         * @constructor
         * @param data {SerialGeometryElements} The instructions for drawing the geometry.
         * @param meta {GeometryMeta}
         */
        function SerialGeometry(data, meta) {
            this.data = data;
            this.meta = meta;
        }
        return SerialGeometry;
    })();
    return SerialGeometry;
});
