"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KleinBottleSimplexGeometry = void 0;
var tslib_1 = require("tslib");
var GridSimplexBuilder_1 = require("../geometries/GridSimplexBuilder");
var Vector3_1 = require("../math/Vector3");
var cos = Math.cos;
var sin = Math.sin;
var pi = Math.PI;
function klein(u, v) {
    var point = new Vector3_1.Vector3();
    u = u * 2 * pi;
    v = v * 2 * pi;
    if (u < pi) {
        point.x = 3 * cos(u) * (1 + sin(u)) + (2 * (1 - cos(u) / 2)) * cos(u) * cos(v);
        point.z = -8 * sin(u) - 2 * (1 - cos(u) / 2) * sin(u) * cos(v);
    }
    else {
        point.x = 3 * cos(u) * (1 + sin(u)) + (2 * (1 - cos(u) / 2)) * cos(v + pi);
        point.z = -8 * sin(u);
    }
    point.y = -2 * (1 - cos(u) / 2) * sin(v);
    return point.scale(0.1);
}
var KleinBottleSimplexGeometry = /** @class */ (function (_super) {
    tslib_1.__extends(KleinBottleSimplexGeometry, _super);
    function KleinBottleSimplexGeometry(uSegments, vSegments) {
        return _super.call(this, klein, uSegments, vSegments) || this;
    }
    return KleinBottleSimplexGeometry;
}(GridSimplexBuilder_1.GridSimplexBuilder));
exports.KleinBottleSimplexGeometry = KleinBottleSimplexGeometry;
