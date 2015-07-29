define(["require", "exports", '../geometries/GeometryAdapter', '../geometries/SphereGeometry', '../mesh/adapterOptions'], function (require, exports, GeometryAdapter, SphereGeometry, adapterOptions) {
    function sphereGeometry(options) {
        options = options || {};
        return new SphereGeometry(options.radius, options.widthSegments, options.heightSegments, options.phiStart, options.phiLength, options.thetaStart, options.thetaLength);
    }
    function sphereMesh(options) {
        var base = new GeometryAdapter(sphereGeometry(options), adapterOptions(options));
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
    return sphereMesh;
});
