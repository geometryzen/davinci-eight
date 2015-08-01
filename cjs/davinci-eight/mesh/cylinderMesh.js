var GeometryAdapter = require('../geometries/GeometryAdapter');
var CylinderGeometry = require('../geometries/CylinderGeometry');
var adapterOptions = require('../mesh/adapterOptions');
var checkMeshArgs = require('../mesh/checkMeshArgs');
function sphereGeometry(options) {
    return new CylinderGeometry();
}
function cylinderMesh(options) {
    var checkedOptions = checkMeshArgs(options);
    var base = new GeometryAdapter(sphereGeometry(checkedOptions), adapterOptions(checkedOptions));
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
