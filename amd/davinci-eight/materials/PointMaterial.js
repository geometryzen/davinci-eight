var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../materials/GraphicsProgram', '../materials/GraphicsProgramBuilder', '../core/GraphicsProgramSymbols'], function (require, exports, GraphicsProgram_1, GraphicsProgramBuilder_1, GraphicsProgramSymbols_1) {
    var LOGGING_NAME = 'PointMaterial';
    function nameBuilder() {
        return LOGGING_NAME;
    }
    var PointMaterial = (function (_super) {
        __extends(PointMaterial, _super);
        function PointMaterial(parameters, monitors) {
            _super.call(this, LOGGING_NAME, monitors);
        }
        PointMaterial.prototype.createGraphicsProgram = function () {
            var gpb = new GraphicsProgramBuilder_1.default();
            gpb.attribute(GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION, 3);
            gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_COLOR, 'vec3');
            gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_MODEL_MATRIX, 'mat4');
            gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_PROJECTION_MATRIX, 'mat4');
            gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_VIEW_MATRIX, 'mat4');
            gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_POINT_SIZE, 'float');
            return gpb.build(this.monitors);
        };
        return PointMaterial;
    })(GraphicsProgram_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = PointMaterial;
});
