var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../materials/Material', '../materials/SmartMaterialBuilder', '../core/Symbolic'], function (require, exports, Material, SmartMaterialBuilder, Symbolic) {
    /**
     * Name used for reference count monitoring and logging.
     */
    var LOGGING_NAME = 'LineMaterial';
    function nameBuilder() {
        return LOGGING_NAME;
    }
    /**
     * @class LineMaterial
     * @extends Material
     */
    var LineMaterial = (function (_super) {
        __extends(LineMaterial, _super);
        // A super call must be the first statement in the constructor when a class
        // contains initialized propertied or has parameter properties (TS2376).
        /**
         * @class LineMaterial
         * @constructor
         * @param monitors [IContextMonitor[]=[]]
         * @parameters [MeshNormalParameters]
         */
        function LineMaterial(monitors, parameters) {
            if (monitors === void 0) { monitors = []; }
            _super.call(this, monitors, LOGGING_NAME);
        }
        LineMaterial.prototype.createMaterial = function () {
            var smb = new SmartMaterialBuilder();
            smb.attribute(Symbolic.ATTRIBUTE_POSITION, 3);
            smb.uniform(Symbolic.UNIFORM_COLOR, 'vec3');
            smb.uniform(Symbolic.UNIFORM_MODEL_MATRIX, 'mat4');
            smb.uniform(Symbolic.UNIFORM_PROJECTION_MATRIX, 'mat4');
            smb.uniform(Symbolic.UNIFORM_VIEW_MATRIX, 'mat4');
            return smb.build(this.monitors);
        };
        return LineMaterial;
    })(Material);
    return LineMaterial;
});
