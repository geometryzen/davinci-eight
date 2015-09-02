var GeometryAdapter = require('../geometries/GeometryAdapter');
var VortexGeometry = require('../geometries/VortexGeometry');
var adapterOptions = require('../mesh/adapterOptions');
var checkMeshArgs = require('../mesh/checkMeshArgs');
function vortexGeometry(options) {
    return new VortexGeometry();
}
function vortexMesh(options) {
    var checkedOptions = checkMeshArgs(options);
    var base = new GeometryAdapter(vortexGeometry(checkedOptions), adapterOptions(checkedOptions));
    var refCount = 1;
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
    return publicAPI;
}
module.exports = vortexMesh;
