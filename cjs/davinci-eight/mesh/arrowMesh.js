var GeometryAdapter = require('../geometries/GeometryAdapter');
var ArrowGeometry = require('../geometries/ArrowGeometry');
var adapterOptions = require('../mesh/adapterOptions');
var Spinor3 = require('../math/Spinor3');
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
module.exports = arrowMesh;
