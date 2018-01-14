"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ShapeBuilder_1 = require("./ShapeBuilder");
/**
 *
 */
var AxialShapeBuilder = /** @class */ (function (_super) {
    tslib_1.__extends(AxialShapeBuilder, _super);
    /**
     *
     */
    function AxialShapeBuilder() {
        var _this = _super.call(this) || this;
        /**
         * The sliceAngle is the angle from the cutLine to the end of the slice.
         * A positive slice angle represents a counter-clockwise rotation around
         * the symmetry axis direction.
         */
        _this.sliceAngle = 2 * Math.PI;
        return _this;
    }
    return AxialShapeBuilder;
}(ShapeBuilder_1.ShapeBuilder));
exports.AxialShapeBuilder = AxialShapeBuilder;
