var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../materials/Material', '../materials/SmartMaterialBuilder', '../core/Symbolic'], function (require, exports, Material, SmartMaterialBuilder, Symbolic) {
    /**
     * Name used for reference count monitoring and logging.
     */
    var LOGGING_NAME = 'MeshMaterial';
    function nameBuilder() {
        return LOGGING_NAME;
    }
    /**
     * @class MeshMaterial
     * @extends Material
     */
    var MeshMaterial = (function (_super) {
        __extends(MeshMaterial, _super);
        // A super call must be the first statement in the constructor when a class
        // contains initialized propertied or has parameter properties (TS2376).
        /**
         * @class MeshMaterial
         * @constructor
         * @param monitors [ContextMonitor[]=[]]
         * @parameters [MeshNormalParameters]
         */
        function MeshMaterial(monitors, parameters) {
            if (monitors === void 0) { monitors = []; }
            _super.call(this, monitors, LOGGING_NAME);
        }
        MeshMaterial.prototype.createProgram = function () {
            var smb = new SmartMaterialBuilder();
            smb.attribute(Symbolic.ATTRIBUTE_POSITION, 3);
            smb.attribute(Symbolic.ATTRIBUTE_NORMAL, 3);
            // smb.attribute(Symbolic.ATTRIBUTE_COLOR, 3);
            smb.uniform(Symbolic.UNIFORM_COLOR, 'vec3');
            smb.uniform(Symbolic.UNIFORM_MODEL_MATRIX, 'mat4');
            smb.uniform(Symbolic.UNIFORM_NORMAL_MATRIX, 'mat3');
            smb.uniform(Symbolic.UNIFORM_PROJECTION_MATRIX, 'mat4');
            smb.uniform(Symbolic.UNIFORM_VIEW_MATRIX, 'mat4');
            return smb.build(this.monitors);
        };
        return MeshMaterial;
    })(Material);
    return MeshMaterial;
});
