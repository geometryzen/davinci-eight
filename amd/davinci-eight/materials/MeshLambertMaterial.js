var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../materials/GraphicsProgramBuilder', '../core/GraphicsProgramSymbols', '../core/Material'], function (require, exports, GraphicsProgramBuilder_1, GraphicsProgramSymbols_1, Material_1) {
    function vertexShader() {
        var smb = new GraphicsProgramBuilder_1.default();
        smb.attribute(GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION, 3);
        smb.attribute(GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL, 3);
        smb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_COLOR, 'vec3');
        smb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_MODEL_MATRIX, 'mat4');
        smb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_NORMAL_MATRIX, 'mat3');
        smb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_PROJECTION_MATRIX, 'mat4');
        smb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_VIEW_MATRIX, 'mat4');
        smb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_COLOR, 'vec3');
        smb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION, 'vec3');
        return smb.vertexShader();
    }
    function fragmentShader() {
        var smb = new GraphicsProgramBuilder_1.default();
        smb.attribute(GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION, 3);
        smb.attribute(GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL, 3);
        smb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_COLOR, 'vec3');
        smb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_MODEL_MATRIX, 'mat4');
        smb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_NORMAL_MATRIX, 'mat3');
        smb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_PROJECTION_MATRIX, 'mat4');
        smb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_VIEW_MATRIX, 'mat4');
        smb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_COLOR, 'vec3');
        smb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION, 'vec3');
        return smb.fragmentShader();
    }
    var MeshLambertMaterial = (function (_super) {
        __extends(MeshLambertMaterial, _super);
        function MeshLambertMaterial() {
            _super.call(this, vertexShader(), fragmentShader());
        }
        return MeshLambertMaterial;
    })(Material_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = MeshLambertMaterial;
});
