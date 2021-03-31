import { __extends } from "tslib";
import { PrimitivesBuilder } from '../geometries/PrimitivesBuilder';
/**
 * @hidden
 */
var AxialPrimitivesBuilder = /** @class */ (function (_super) {
    __extends(AxialPrimitivesBuilder, _super);
    function AxialPrimitivesBuilder() {
        var _this = _super.call(this) || this;
        /**
         * The sliceAngle is the angle from the cutLine to the end of the slice.
         * A positive slice angle represents a counter-clockwise rotation around
         * the symmetry axis direction.
         */
        _this.sliceAngle = 2 * Math.PI;
        return _this;
    }
    return AxialPrimitivesBuilder;
}(PrimitivesBuilder));
export { AxialPrimitivesBuilder };
