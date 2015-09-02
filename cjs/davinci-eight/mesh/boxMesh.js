var GeometryAdapter = require('../geometries/GeometryAdapter');
var BoxGeometry = require('../geometries/BoxGeometry');
var adapterOptions = require('../mesh/adapterOptions');
function boxGeometry(options) {
    options = options || {};
    return new BoxGeometry(options.width, options.height, options.depth, options.widthSegments, options.heightSegments, options.depthSegments, options.wireFrame);
}
function boxMesh(options) {
    var base = new GeometryAdapter(boxGeometry(options), adapterOptions(options));
    base.addRef();
    var refCount = 0;
    var self = {
        draw: function () {
            return base.draw();
        },
        update: function () {
            return base.update();
        },
        getAttribArray: function (name) {
            return base.getAttribArray(name);
        },
        getAttribData: function () {
            return base.getAttribData();
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
        },
        addRef: function () {
            refCount++;
        },
        release: function () {
            refCount--;
            if (refCount === 0) {
                base.release();
                base = void 0;
            }
        },
        contextFree: function () {
            return base.contextFree();
        },
        contextGain: function (context) {
            return base.contextGain(context);
        },
        contextLoss: function () {
            return base.contextLoss();
        },
        hasContext: function () {
            return base.hasContext();
        }
    };
    return self;
}
module.exports = boxMesh;
