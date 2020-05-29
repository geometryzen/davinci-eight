"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CylindricalShellBuilder = void 0;
var tslib_1 = require("tslib");
var Approximation_1 = require("../transforms/Approximation");
var Direction_1 = require("../transforms/Direction");
var Duality_1 = require("../transforms/Duality");
var GraphicsProgramSymbols_1 = require("../core/GraphicsProgramSymbols");
var GridTriangleStrip_1 = require("../atoms/GridTriangleStrip");
var AxialShapeBuilder_1 = require("./AxialShapeBuilder");
var CylinderTransform_1 = require("../transforms/CylinderTransform");
var Rotation_1 = require("../transforms/Rotation");
var Scaling_1 = require("../transforms/Scaling");
var Translation_1 = require("../transforms/Translation");
var CoordsTransform2D_1 = require("../transforms/CoordsTransform2D");
var Vector3_1 = require("../math/Vector3");
/**
 * This implementation only builds the walls of the cylinder (by wrapping a grid)
 */
var CylindricalShellBuilder = /** @class */ (function (_super) {
    tslib_1.__extends(CylindricalShellBuilder, _super);
    function CylindricalShellBuilder() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.radialSegments = 1;
        _this.thetaSegments = 32;
        /**
         * The axis of symmetry and the height.
         */
        _this.height = Vector3_1.Vector3.vector(0, 1, 0);
        /**
         * The initial direction and the radius vector.
         */
        _this.cutLine = Vector3_1.Vector3.vector(0, 0, 1);
        _this.clockwise = true;
        _this.convex = true;
        return _this;
    }
    /**
     *
     */
    CylindricalShellBuilder.prototype.toPrimitive = function () {
        // Define local constants so that names in shader programs will reflect the current program symbols.
        var aPosition = GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_POSITION;
        var aTangent = GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_TANGENT;
        var aNormal = GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_NORMAL;
        var orientation = this.convex ? +1 : -1;
        this.transforms.push(new CylinderTransform_1.CylinderTransform(this.height, this.cutLine, this.clockwise, this.sliceAngle, orientation, aPosition, aTangent));
        this.transforms.push(new Scaling_1.Scaling(this.stress, [aPosition, aTangent]));
        this.transforms.push(new Rotation_1.Rotation(this.tilt, [aPosition, aTangent]));
        this.transforms.push(new Translation_1.Translation(this.offset, [aPosition]));
        // Use a duality transformation with a sign change to convert the tangent planes to vectors.
        this.transforms.push(new Duality_1.Duality(aTangent, aNormal, true, true));
        // Normalize the normal vectors.
        this.transforms.push(new Direction_1.Direction(aNormal));
        // Discard insignificant coordinates.
        this.transforms.push(new Approximation_1.Approximation(9, [aPosition, aNormal]));
        if (this.useTextureCoord) {
            this.transforms.push(new CoordsTransform2D_1.CoordsTransform2D(false, false, false));
        }
        var grid = new GridTriangleStrip_1.GridTriangleStrip(this.thetaSegments, this.radialSegments);
        var iLength = grid.uLength;
        for (var i = 0; i < iLength; i++) {
            var jLength = grid.vLength;
            for (var j = 0; j < jLength; j++) {
                this.applyTransforms(grid.vertex(i, j), i, j, iLength, jLength);
            }
        }
        return grid.toPrimitive();
    };
    return CylindricalShellBuilder;
}(AxialShapeBuilder_1.AxialShapeBuilder));
exports.CylindricalShellBuilder = CylindricalShellBuilder;
