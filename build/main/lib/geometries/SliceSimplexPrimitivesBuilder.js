"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var SimplexPrimitivesBuilder_1 = require("../geometries/SimplexPrimitivesBuilder");
var SliceSimplexPrimitivesBuilder = (function (_super) {
    tslib_1.__extends(SliceSimplexPrimitivesBuilder, _super);
    function SliceSimplexPrimitivesBuilder() {
        var _this = _super.call(this) || this;
        _this.sliceAngle = 2 * Math.PI;
        return _this;
    }
    return SliceSimplexPrimitivesBuilder;
}(SimplexPrimitivesBuilder_1.SimplexPrimitivesBuilder));
exports.SliceSimplexPrimitivesBuilder = SliceSimplexPrimitivesBuilder;
