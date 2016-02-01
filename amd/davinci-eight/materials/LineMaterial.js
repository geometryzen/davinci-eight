var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../checks/isDefined', '../materials/GraphicsProgram', '../checks/mustBeInteger', '../materials/GraphicsProgramBuilder', '../core/GraphicsProgramSymbols'], function (require, exports, isDefined_1, GraphicsProgram_1, mustBeInteger_1, GraphicsProgramBuilder_1, GraphicsProgramSymbols_1) {
    var LineMaterial = (function (_super) {
        __extends(LineMaterial, _super);
        function LineMaterial(parameters, monitors) {
            if (parameters === void 0) { parameters = {}; }
            _super.call(this, 'LineMaterial', monitors);
            if (isDefined_1.default(parameters.size)) {
                this.size = mustBeInteger_1.default('parameters.size', parameters.size);
            }
            else {
                this.size = 3;
            }
        }
        LineMaterial.prototype.createGraphicsProgram = function () {
            var gpb = new GraphicsProgramBuilder_1.default();
            gpb.attribute(GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION, this.size);
            gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_COLOR, 'vec3');
            gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_MODEL_MATRIX, 'mat4');
            gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_PROJECTION_MATRIX, 'mat4');
            gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_VIEW_MATRIX, 'mat4');
            return gpb.build(this.monitors);
        };
        return LineMaterial;
    })(GraphicsProgram_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = LineMaterial;
});
