var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../materials/Material'], function (require, exports, Material) {
    /**
     * Name used for reference count monitoring and logging.
     */
    var LOGGING_NAME = 'MeshNormalMaterial';
    function nameBuilder() {
        return LOGGING_NAME;
    }
    /**
     * @module EIGHT
     * @class MeshNormalMaterial
     * @extends Material
     */
    var MeshNormalMaterial = (function (_super) {
        __extends(MeshNormalMaterial, _super);
        // A super call must be the first statement in the constructor when a class
        // contains initialized propertied or has parameter properties (TS2376).
        function MeshNormalMaterial(contexts) {
            _super.call(this, contexts, LOGGING_NAME);
            //
            // Perform state initialization here.
            //
        }
        MeshNormalMaterial.prototype.contextGain = function (manager) {
            console.warn(LOGGING_NAME + ' contextGain method TODO');
        };
        return MeshNormalMaterial;
    })(Material);
    return MeshNormalMaterial;
});
