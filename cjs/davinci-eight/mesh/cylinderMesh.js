var GeometryAdapter = require('../geometries/GeometryAdapter');
var CylinderGeometry = require('../geometries/CylinderGeometry');
var adapterOptions = require('../mesh/adapterOptions');
function cylinderGeometry(options) {
    options = options || {};
    return new CylinderGeometry(options.radiusTop, options.radiusBottom, options.height, options.radialSegments, options.heightSegments, options.openEnded, options.thetaStart, options.thetaLength);
}
function cylinderMesh(monitor, options) {
    var base = new GeometryAdapter(monitor, cylinderGeometry(options), adapterOptions(options));
    var refCount = 1;
    var publicAPI = {
        draw: function () {
            return base.draw();
        },
        update: function () {
            return base.update();
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
        addRef: function () {
            refCount++;
            return refCount;
        },
        release: function () {
            refCount--;
            if (refCount === 0) {
                base.release();
                base = void 0;
            }
            return refCount;
        },
        contextFree: function () {
            return base.contextFree();
        },
        contextGain: function (context) {
            return base.contextGain(context);
        },
        contextLoss: function () {
            return base.contextLoss();
        }
    };
    return publicAPI;
}
module.exports = cylinderMesh;
