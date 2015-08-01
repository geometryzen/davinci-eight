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
module.exports = boxMesh;
