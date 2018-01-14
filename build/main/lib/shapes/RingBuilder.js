"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Approximation_1 = require("../transforms/Approximation");
var Direction_1 = require("../transforms/Direction");
var Duality_1 = require("../transforms/Duality");
var GraphicsProgramSymbols_1 = require("../core/GraphicsProgramSymbols");
var GridTriangleStrip_1 = require("../atoms/GridTriangleStrip");
var AxialShapeBuilder_1 = require("./AxialShapeBuilder");
var RingTransform_1 = require("../transforms/RingTransform");
var Rotation_1 = require("../transforms/Rotation");
var Scaling_1 = require("../transforms/Scaling");
var Translation_1 = require("../transforms/Translation");
var CoordsTransform2D_1 = require("../transforms/CoordsTransform2D");
var Vector3_1 = require("../math/Vector3");
/**
 * Constructs a one-sided ring using a TRIANGLE_STRIP.
 */
var RingBuilder = /** @class */ (function (_super) {
    tslib_1.__extends(RingBuilder, _super);
    function RingBuilder() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /**
         * The radius of the hole in the ring.
         */
        _this.innerRadius = 0;
        /**
         * The radius of the outer edge of the ring.
         */
        _this.outerRadius = 1;
        /**
         * The number of segments in the radial direction.
         */
        _this.radialSegments = 1;
        /**
         * The number of segments in the angular direction.
         */
        _this.thetaSegments = 32;
        /**
         * The direction of the normal vector perpendicular to the plane of the ring.
         */
        _this.e = Vector3_1.Vector3.vector(0, 1, 0);
        /**
         * The direction from which a slice is created.
         */
        _this.cutLine = Vector3_1.Vector3.vector(0, 0, 1);
        /**
         * The orientation of the slice relative to the cutLine.
         */
        _this.clockwise = true;
        return _this;
    }
    /**
     *
     */
    RingBuilder.prototype.toPrimitive = function () {
        // Define local constants so that names in shader programs will reflect the current program symbols.
        var aPosition = GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_POSITION;
        var aTangent = GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_TANGENT;
        var aNormal = GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_NORMAL;
        this.transforms.push(new RingTransform_1.RingTransform(this.e, this.cutLine, this.clockwise, this.outerRadius, this.innerRadius, this.sliceAngle, aPosition, aTangent));
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
    return RingBuilder;
}(AxialShapeBuilder_1.AxialShapeBuilder));
exports.RingBuilder = RingBuilder;
