var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../materials/Material', '../materials/SmartMaterialBuilder', '../core/Symbolic'], function (require, exports, Material, SmartMaterialBuilder, Symbolic) {
    /**
     * Name used for reference count monitoring and logging.
     */
    var LOGGING_NAME = 'MeshLambertMaterial';
    function nameBuilder() {
        return LOGGING_NAME;
    }
    /**
     * @class MeshLambertMaterial
     * @extends Material
     */
    var MeshLambertMaterial = (function (_super) {
        __extends(MeshLambertMaterial, _super);
        /**
         *
         * @class MeshLambertMaterial
         * @constructor
         * @param monitors [IContextMonitor[]=[]]
         */
        function MeshLambertMaterial(monitors) {
            if (monitors === void 0) { monitors = []; }
            _super.call(this, monitors, LOGGING_NAME);
        }
        MeshLambertMaterial.prototype.destructor = function () {
            _super.prototype.destructor.call(this);
        };
        MeshLambertMaterial.prototype.createProgram = function () {
            var smb = new SmartMaterialBuilder();
            smb.attribute(Symbolic.ATTRIBUTE_POSITION, 3);
            smb.attribute(Symbolic.ATTRIBUTE_NORMAL, 3);
            smb.uniform(Symbolic.UNIFORM_COLOR, 'vec3');
            smb.uniform(Symbolic.UNIFORM_MODEL_MATRIX, 'mat4');
            smb.uniform(Symbolic.UNIFORM_NORMAL_MATRIX, 'mat3');
            smb.uniform(Symbolic.UNIFORM_PROJECTION_MATRIX, 'mat4');
            smb.uniform(Symbolic.UNIFORM_VIEW_MATRIX, 'mat4');
            smb.uniform(Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR, 'vec3');
            smb.uniform(Symbolic.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION, 'vec3');
            return smb.build(this.monitors);
        };
        return MeshLambertMaterial;
    })(Material);
    return MeshLambertMaterial;
});
