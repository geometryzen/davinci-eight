"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toStringCustom = void 0;
var stringFromCoordinates_1 = require("../math/stringFromCoordinates");
function toStringCustom(coordinates, coordToString, labels) {
    var quantityString = stringFromCoordinates_1.stringFromCoordinates(coordinates, coordToString, labels);
    return quantityString;
}
exports.toStringCustom = toStringCustom;
