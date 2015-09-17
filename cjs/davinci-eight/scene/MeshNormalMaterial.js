var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Material = require('../scene/Material');
var MonitorList = require('../scene/MonitorList');
/**
 * Name used for reference count monitoring and logging.
 */
var LOGGING_NAME = 'MeshNormalMaterial';
function ctorContext() {
    return LOGGING_NAME + " constructor";
}
/**
 * @module EIGHT
 * @class MeshNormalMaterial
 * @extends Material
 */
var MeshNormalMaterial = (function (_super) {
    __extends(MeshNormalMaterial, _super);
    function MeshNormalMaterial(monitors) {
        _super.call(this, MonitorList.verify('monitors', monitors, ctorContext), LOGGING_NAME);
    }
    MeshNormalMaterial.prototype.contextGain = function (manager) {
        console.warn(LOGGING_NAME + '.contextGain method TODO');
    };
    return MeshNormalMaterial;
})(Material);
module.exports = MeshNormalMaterial;
