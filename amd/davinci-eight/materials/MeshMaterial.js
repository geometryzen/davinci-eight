var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../materials/GraphicsProgram', '../materials/GraphicsProgramBuilder', '../core/GraphicsProgramSymbols'], function (require, exports, GraphicsProgram, GraphicsProgramBuilder, GraphicsProgramSymbols) {
    /**
     * Name used for reference count monitoring and logging.
     */
    var LOGGING_NAME = 'MeshMaterial';
    function nameBuilder() {
        return LOGGING_NAME;
    }
    /**
     * @class MeshMaterial
     * @extends GraphicsProgram
     */
    var MeshMaterial = (function (_super) {
        __extends(MeshMaterial, _super);
        /**
         * @class MeshMaterial
         * @constructor
         * @param monitors [IContextMonitor[]=[]]
         * @parameters [MeshNormalParameters]
         */
        function MeshMaterial(monitors, parameters) {
            if (monitors === void 0) { monitors = []; }
            _super.call(this, monitors, LOGGING_NAME);
        }
        /**
         * @method destructor
         * @return {void}
         * @protected
         */
        MeshMaterial.prototype.destructor = function () {
            _super.prototype.destructor.call(this);
        };
        /**
         * @method createGraphicsProgram
         * @return {IGraphicsProgram}
         * @protected
         */
        MeshMaterial.prototype.createGraphicsProgram = function () {
            var smb = new GraphicsProgramBuilder();
            smb.attribute(GraphicsProgramSymbols.ATTRIBUTE_POSITION, 3);
            smb.attribute(GraphicsProgramSymbols.ATTRIBUTE_NORMAL, 3);
            // smb.attribute(GraphicsProgramSymbols.ATTRIBUTE_COLOR, 3);
            smb.uniform(GraphicsProgramSymbols.UNIFORM_COLOR, 'vec3');
            smb.uniform(GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX, 'mat4');
            smb.uniform(GraphicsProgramSymbols.UNIFORM_NORMAL_MATRIX, 'mat3');
            smb.uniform(GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX, 'mat4');
            smb.uniform(GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX, 'mat4');
            smb.uniform(GraphicsProgramSymbols.UNIFORM_AMBIENT_LIGHT, 'vec3');
            smb.uniform(GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR, 'vec3');
            smb.uniform(GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION, 'vec3');
            return smb.build(this.monitors);
        };
        return MeshMaterial;
    })(GraphicsProgram);
    return MeshMaterial;
});
