var GeometryAdapter = require('../geometries/GeometryAdapter');
var BoxGeometry = require('../geometries/BoxGeometry');
var adapterOptions = require('../mesh/adapterOptions');
function boxGeometry(options) {
    return new BoxGeometry(options.width, options.height, options.depth, options.widthSegments, options.heightSegments, options.depthSegments, options.wireFrame);
}
function checkBoxArgs(options) {
    options = options || {};
    var width = typeof options.width === 'undefined' ? 1 : options.width;
    var height = typeof options.height === 'undefined' ? 1 : options.height;
    var depth = typeof options.depth === 'undefined' ? 1 : options.depth;
    var widthSegments = typeof options.widthSegments === 'undefined' ? 1 : options.widthSegments;
    var heightSegments = typeof options.heightSegments === 'undefined' ? 1 : options.heightSegments;
    var depthSegments = typeof options.depthSegments === 'undefined' ? 1 : options.depthSegments;
    var wireFrame = typeof options.wireFrame === 'undefined' ? false : options.wireFrame;
    return {
        width: width,
        height: height,
        depth: depth,
        widthSegments: widthSegments,
        heightSegments: heightSegments,
        depthSegments: depthSegments,
        wireFrame: wireFrame
    };
}
function boxMesh(options) {
    var checkedOptions = checkBoxArgs(options);
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
