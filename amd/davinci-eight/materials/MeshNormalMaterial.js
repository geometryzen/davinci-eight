var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
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
     * @class MeshNormalMaterial
     * @extends Material
     */
    var MeshNormalMaterial = (function (_super) {
        __extends(MeshNormalMaterial, _super);
        // A super call must be the first statement in the constructor when a class
        // contains initialized propertied or has parameter properties (TS2376).
        /**
         * @class MeshNormalMaterial
         * @constructor
         */
        function MeshNormalMaterial(contexts, parameters) {
            _super.call(this, contexts, LOGGING_NAME);
            //
            // Perform state initialization here.
            //
        }
        return MeshNormalMaterial;
    })(Material);
    return MeshNormalMaterial;
});
