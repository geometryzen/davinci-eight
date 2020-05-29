import { __extends } from "tslib";
import { SimplexPrimitivesBuilder } from '../geometries/SimplexPrimitivesBuilder';
var SliceSimplexPrimitivesBuilder = /** @class */ (function (_super) {
    __extends(SliceSimplexPrimitivesBuilder, _super);
    function SliceSimplexPrimitivesBuilder() {
        var _this = _super.call(this) || this;
        _this.sliceAngle = 2 * Math.PI;
        return _this;
    }
    return SliceSimplexPrimitivesBuilder;
}(SimplexPrimitivesBuilder));
export { SliceSimplexPrimitivesBuilder };
