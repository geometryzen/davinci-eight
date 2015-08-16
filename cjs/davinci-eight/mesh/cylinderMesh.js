var GeometryAdapter = require('../geometries/GeometryAdapter');
var CylinderGeometry = require('../geometries/CylinderGeometry');
var adapterOptions = require('../mesh/adapterOptions');
function cylinderGeometry(options) {
    options = options || {};
    return new CylinderGeometry(options.radiusTop, options.radiusBottom, options.height, options.radialSegments, options.heightSegments, options.openEnded, options.thetaStart, options.thetaLength);
}
function cylinderMesh(options) {
    var base = new GeometryAdapter(cylinderGeometry(options), adapterOptions(options));
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
module.exports = cylinderMesh;
