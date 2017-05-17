import * as tslib_1 from "tslib";
import { SimplexPrimitivesBuilder } from '../geometries/SimplexPrimitivesBuilder';
var SliceSimplexPrimitivesBuilder = (function (_super) {
    tslib_1.__extends(SliceSimplexPrimitivesBuilder, _super);
    function SliceSimplexPrimitivesBuilder() {
        var _this = _super.call(this) || this;
        _this.sliceAngle = 2 * Math.PI;
        return _this;
    }
    return SliceSimplexPrimitivesBuilder;
}(SimplexPrimitivesBuilder));
export { SliceSimplexPrimitivesBuilder };
