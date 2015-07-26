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
module.exports = cylinderMesh;
