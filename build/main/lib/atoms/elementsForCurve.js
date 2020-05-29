"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.elementsForCurve = void 0;
var isDefined_1 = require("../checks/isDefined");
var mustBeArray_1 = require("../checks/mustBeArray");
var numPostsForFence_1 = require("./numPostsForFence");
function elementsForCurve(uSegments, uClosed, elements) {
    // Make sure that we have somewhere valid to store the result.
    elements = isDefined_1.isDefined(elements) ? mustBeArray_1.mustBeArray('elements', elements) : [];
    // The number of fence posts depends upon whether the curve is open or closed.
    var uLength = numPostsForFence_1.numPostsForFence(uSegments, uClosed);
    for (var u = 0; u < uLength; u++) {
        elements.push(u);
    }
    return elements;
}
exports.elementsForCurve = elementsForCurve;
