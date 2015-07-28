var GeometryAdapter = require('../geometries/GeometryAdapter');
var BoxGeometry = require('../geometries/BoxGeometry');
var adapterOptions = require('../mesh/adapterOptions');
function boxGeometry(options) {
    options = options || {};
    return new BoxGeometry(options.width, options.height, options.depth, options.widthSegments, options.heightSegments, options.depthSegments, options.wireFrame);
}
function boxMesh(options) {
    var base = new GeometryAdapter(boxGeometry(options), adapterOptions(options));
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
module.exports = boxMesh;
