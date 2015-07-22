var GeometryAdapter = require('../geometries/GeometryAdapter');
var BoxGeometry = require('../geometries/BoxGeometry');
var adapterOptions = require('../mesh/adapterOptions');
var checkMeshArgs = require('../mesh/checkMeshArgs');
function boxGeometry(options) {
    return new BoxGeometry(1, 1, 1);
}
function boxMesh(options) {
    var checkedOptions = checkMeshArgs(options);
    var base = new GeometryAdapter(boxGeometry(checkedOptions), adapterOptions(checkedOptions));
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
        dynamics: function () {
            return base.dynamics();
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
module.exports = boxMesh;
