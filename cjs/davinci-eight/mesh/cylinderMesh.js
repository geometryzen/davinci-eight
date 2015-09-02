var GeometryAdapter = require('../geometries/GeometryAdapter');
var CylinderGeometry = require('../geometries/CylinderGeometry');
var adapterOptions = require('../mesh/adapterOptions');
function cylinderGeometry(options) {
    options = options || {};
    return new CylinderGeometry(options.radiusTop, options.radiusBottom, options.height, options.radialSegments, options.heightSegments, options.openEnded, options.thetaStart, options.thetaLength);
}
function cylinderMesh(options) {
    var base = new GeometryAdapter(cylinderGeometry(options), adapterOptions(options));
    var refCount = 0;
    var publicAPI = {
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
    return publicAPI;
}
module.exports = cylinderMesh;
