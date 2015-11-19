var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../materials/GraphicsProgram', '../materials/GraphicsProgramBuilder', '../core/GraphicsProgramSymbols'], function (require, exports, GraphicsProgram, GraphicsProgramBuilder, GraphicsProgramSymbols) {
    /**
     * Name used for reference count monitoring and logging.
     */
    var LOGGING_NAME = 'PointMaterial';
    function nameBuilder() {
        return LOGGING_NAME;
    }
    /**
     * @class PointMaterial
     * @extends GraphicsProgram
     */
    var PointMaterial = (function (_super) {
        __extends(PointMaterial, _super);
        // A super call must be the first statement in the constructor when a class
        // contains initialized propertied or has parameter properties (TS2376).
        /**
         * @class PointMaterial
         * @constructor
         * @param monitors [IContextMonitor[]=[]]
         * @parameters [MeshNormalParameters]
         */
        function PointMaterial(monitors, parameters) {
            if (monitors === void 0) { monitors = []; }
            _super.call(this, monitors, LOGGING_NAME);
        }
        PointMaterial.prototype.createGraphicsProgram = function () {
            var smb = new GraphicsProgramBuilder();
            smb.attribute(GraphicsProgramSymbols.ATTRIBUTE_POSITION, 3);
            smb.uniform(GraphicsProgramSymbols.UNIFORM_COLOR, 'vec3');
            smb.uniform(GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX, 'mat4');
            smb.uniform(GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX, 'mat4');
            smb.uniform(GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX, 'mat4');
            smb.uniform(GraphicsProgramSymbols.UNIFORM_POINT_SIZE, 'float');
            return smb.build(this.monitors);
        };
        return PointMaterial;
    })(GraphicsProgram);
    return PointMaterial;
});
