var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../checks/isDefined', '../materials/GraphicsProgram', '../checks/mustBeInteger', '../materials/GraphicsProgramBuilder', '../core/GraphicsProgramSymbols'], function (require, exports, isDefined, GraphicsProgram, mustBeInteger, GraphicsProgramBuilder, GraphicsProgramSymbols) {
    /**
     * @class LineMaterial
     * @extends GraphicsProgram
     */
    var LineMaterial = (function (_super) {
        __extends(LineMaterial, _super);
        /**
         * @class LineMaterial
         * @constructor
         * @param [monitors = []] {IContextMonitor[]}
         * @param [parameters = {}] {LineMaterialParameters}
         */
        function LineMaterial(monitors, parameters) {
            if (monitors === void 0) { monitors = []; }
            if (parameters === void 0) { parameters = {}; }
            _super.call(this, monitors, 'LineMaterial');
            if (isDefined(parameters.size)) {
                this.size = mustBeInteger('parameters.size', parameters.size);
            }
            else {
                this.size = 3;
            }
        }
        /**
         * @method createGraphicsProgram
         * @return {IGraphicsProgram}
         * @protected
         */
        LineMaterial.prototype.createGraphicsProgram = function () {
            var smb = new GraphicsProgramBuilder();
            smb.attribute(GraphicsProgramSymbols.ATTRIBUTE_POSITION, this.size);
            smb.uniform(GraphicsProgramSymbols.UNIFORM_COLOR, 'vec3');
            smb.uniform(GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX, 'mat4');
            smb.uniform(GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX, 'mat4');
            smb.uniform(GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX, 'mat4');
            return smb.build(this.monitors);
        };
        return LineMaterial;
    })(GraphicsProgram);
    return LineMaterial;
});
