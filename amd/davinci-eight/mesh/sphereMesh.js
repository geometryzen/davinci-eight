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
    return sphereMesh;
});
