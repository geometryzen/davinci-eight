var GeometryAdapter = require('../geometries/GeometryAdapter');
var ArrowGeometry = require('../geometries/ArrowGeometry');
var adapterOptions = require('../mesh/adapterOptions');
var checkMeshArgs = require('../mesh/checkMeshArgs');
function arrowGeometry(options) {
    return new ArrowGeometry();
}
function arrowMesh(options) {
    var checkedOptions = checkMeshArgs(options);
    var base = new GeometryAdapter(arrowGeometry(checkedOptions), adapterOptions(checkedOptions));
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
module.exports = arrowMesh;
