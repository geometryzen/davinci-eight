var MonitorList = require('../scene/MonitorList');
var refChange = require('../utils/refChange');
var uuid4 = require('../utils/uuid4');
var LOGGING_NAME = 'Material';
function ctorContext() {
    return LOGGING_NAME + " constructor";
}
// FIXME: Exposing  the WebGLProgram goes against the IUnknown mechanism.
/**
 * @module EIGHT
 * @class Material
 * @implements IProgram
 */
var Material = (function () {
    function Material(monitors, name) {
        this.programId = uuid4().generate();
        this._refCount = 1;
        MonitorList.verify('monitors', monitors, ctorContext);
        this._monitors = MonitorList.copy(monitors);
        // FIXME multi-context support.
        this._name = name;
        this._monitors.addContextListener(this);
        refChange(this.programId, this._name, this._refCount);
    }
    Material.prototype.addRef = function () {
        this._refCount++;
        refChange(this.programId, this._name, +1);
        return this._refCount;
    };
    Material.prototype.release = function () {
        this._refCount--;
        refChange(this.programId, this._name, -1);
        if (this._refCount === 0) {
            this._monitors.removeContextListener(this);
        }
        return this._refCount;
    };
    // FIXME; I'm going to need to know which monitor.
    Material.prototype.use = function () {
        // FIXME TODO
    };
    Object.defineProperty(Material.prototype, "attributes", {
        get: function () {
            return void 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Material.prototype, "uniforms", {
        get: function () {
            return void 0;
        },
        enumerable: true,
        configurable: true
    });
    Material.prototype.enableAttrib = function (name) {
    };
    Material.prototype.disableAttrib = function (name) {
    };
    Material.prototype.contextFree = function () {
    };
    Material.prototype.contextGain = function (manager) {
        console.error("Material.contextGain method is virtual.");
    };
    Material.prototype.contextLoss = function () {
    };
    Material.prototype.uniform1f = function (name, x) {
        // FIXME. Hope this works with multi-program.
    };
    Material.prototype.uniform2f = function (name, x, y) {
    };
    Material.prototype.uniform3f = function (name, x, y, z) {
    };
    Material.prototype.uniform4f = function (name, x, y, z, w) {
    };
    Material.prototype.uniformMatrix1 = function (name, transpose, matrix) {
    };
    Material.prototype.uniformMatrix2 = function (name, transpose, matrix) {
    };
    Material.prototype.uniformMatrix3 = function (name, transpose, matrix) {
    };
    Material.prototype.uniformMatrix4 = function (name, transpose, matrix) {
    };
    Material.prototype.uniformVector1 = function (name, vector) {
    };
    Material.prototype.uniformVector2 = function (name, vector) {
    };
    Material.prototype.uniformVector3 = function (name, vector) {
    };
    Material.prototype.uniformVector4 = function (name, vector) {
    };
    return Material;
})();
module.exports = Material;
