var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../materials/Material', '../materials/SmartMaterialBuilder', '../core/Symbolic'], function (require, exports, Material, SmartMaterialBuilder, Symbolic) {
    /**
     * Name used for reference count monitoring and logging.
     */
    var LOGGING_NAME = 'EmptyMaterial';
    function nameBuilder() {
        return LOGGING_NAME;
    }
    /**
     * @class EmptyMaterial
     * @extends Material
     */
    var EmptyMaterial = (function (_super) {
        __extends(EmptyMaterial, _super);
        /**
         * This will be used when rendering empty simplices!
         * @class EmptyMaterial
         * @constructor
         * @param monitors [IContextMonitor[]=[]]
         * @parameters [MeshNormalParameters]
         */
        function EmptyMaterial(monitors, parameters) {
            if (monitors === void 0) { monitors = []; }
            _super.call(this, monitors, LOGGING_NAME);
        }
        EmptyMaterial.prototype.createMaterial = function () {
            var smb = new SmartMaterialBuilder();
            smb.attribute(Symbolic.ATTRIBUTE_POSITION, 3);
            smb.uniform(Symbolic.UNIFORM_COLOR, 'vec3');
            smb.uniform(Symbolic.UNIFORM_MODEL_MATRIX, 'mat4');
            smb.uniform(Symbolic.UNIFORM_PROJECTION_MATRIX, 'mat4');
            smb.uniform(Symbolic.UNIFORM_VIEW_MATRIX, 'mat4');
            smb.uniform(Symbolic.UNIFORM_POINT_SIZE, 'float');
            return smb.build(this.monitors);
        };
        return EmptyMaterial;
    })(Material);
    return EmptyMaterial;
});
