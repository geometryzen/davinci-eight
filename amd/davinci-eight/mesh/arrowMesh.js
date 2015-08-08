define(["require", "exports", '../geometries/GeometryAdapter', '../geometries/ArrowGeometry', '../mesh/adapterOptions', '../math/Spinor3'], function (require, exports, GeometryAdapter, ArrowGeometry, adapterOptions, Spinor3) {
    function arrowGeometry(options) {
        options = options || {};
        var scale = 1;
        var attitude = new Spinor3();
        var segments = 12;
        var length = 1;
        var radiusShaft = 0.01;
        var radiusCone = 0.08;
        return new ArrowGeometry(scale, attitude, segments, length, radiusShaft, radiusCone, options.coneHeight, options.axis);
    }
    function arrowMesh(options) {
        var base = new GeometryAdapter(arrowGeometry(options), adapterOptions(options));
        var publicAPI = {
            draw: function (context) {
                return base.draw(context);
            },
            update: function (attributes) {
                return base.update(attributes);
            },
            getAttribArray: function (name) {
                return base.getAttribArray(name);
            },
            getAttribMeta: function () {
                return base.getAttribMeta();
            },
            get drawMode() {
                return base.drawMode;
            },
            set drawMode(value) {
                base.drawMode = value;
            },
            get dynamic() {
                return base.dynamic;
            },
            hasElementArray: function () {
                return base.hasElementArray();
            },
            getElementArray: function () {
                return base.getElementArray();
            }
        };
        return publicAPI;
    }
    return arrowMesh;
});
