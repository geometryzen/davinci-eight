"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isDefined_1 = require("../checks/isDefined");
var Vector3_1 = require("../math/Vector3");
function scaleFromBoxOptions(options) {
    var x = isDefined_1.isDefined(options.width) ? options.width : 1;
    return Vector3_1.Vector3.vector(x, 0, 0);
}
exports.scaleFromBoxOptions = scaleFromBoxOptions;
