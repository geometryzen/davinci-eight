var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../materials/GraphicsProgramBuilder', '../core/GraphicsProgramSymbols', '../core/ShareableWebGLProgram'], function (require, exports, GraphicsProgramBuilder_1, GraphicsProgramSymbols_1, ShareableWebGLProgram_1) {
    function vertexShader() {
        var gpb = new GraphicsProgramBuilder_1.default();
        gpb.attribute(GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION, 3);
        gpb.attribute(GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL, 3);
        gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_COLOR, 'vec3');
        gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_MODEL_MATRIX, 'mat4');
        gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_NORMAL_MATRIX, 'mat3');
        gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_PROJECTION_MATRIX, 'mat4');
        gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_VIEW_MATRIX, 'mat4');
        gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_AMBIENT_LIGHT, 'vec3');
        gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_COLOR, 'vec3');
        gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION, 'vec3');
        return gpb.vertexShader();
    }
    function fragmentShader() {
        var gpb = new GraphicsProgramBuilder_1.default();
        gpb.attribute(GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION, 3);
        gpb.attribute(GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL, 3);
        gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_COLOR, 'vec3');
        gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_MODEL_MATRIX, 'mat4');
        gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_NORMAL_MATRIX, 'mat3');
        gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_PROJECTION_MATRIX, 'mat4');
        gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_VIEW_MATRIX, 'mat4');
        gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_AMBIENT_LIGHT, 'vec3');
        gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_COLOR, 'vec3');
        gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION, 'vec3');
        return gpb.fragmentShader();
    }
    var MeshMaterial = (function (_super) {
        __extends(MeshMaterial, _super);
        function MeshMaterial() {
            _super.call(this, vertexShader(), fragmentShader());
        }
        return MeshMaterial;
    })(ShareableWebGLProgram_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = MeshMaterial;
});
