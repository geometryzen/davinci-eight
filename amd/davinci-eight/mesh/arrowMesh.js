define(["require", "exports", '../geometries/GeometryAdapter', '../geometries/ArrowGeometry', '../mesh/adapterOptions', '../math/Spinor3'], function (require, exports, GeometryAdapter, ArrowGeometry, adapterOptions, Spinor3) {
    function arrowGeometry(options) {
        options = options || {};
        var scale = 1;
        var attitude = new Spinor3();
        var segments = 12;
        var length = 1;
        var radiusShaft = 0.01;
        var radiusCone = 0.08;
        var lengthCone = 0.20;
        var axis = options.axis;
        return new ArrowGeometry(scale, attitude, segments, length, radiusShaft, radiusCone, lengthCone, axis);
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
            getVertexAttributeData: function (name) {
                return base.getVertexAttributeData(name);
            },
            getAttributeMetaInfos: function () {
                return base.getAttributeMetaInfos();
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
            hasElements: function () {
                return base.hasElements();
            },
            getElements: function () {
                return base.getElements();
            }
        };
        return publicAPI;
    }
    return arrowMesh;
});
