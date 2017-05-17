"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mustSatisfy_1 = require("../checks/mustSatisfy");
var isInteger_1 = require("../checks/isInteger");
function beCanvasId() {
    return "be a `number` which is also an integer";
}
function mustBeCanvasId(name, value, contextBuilder) {
    mustSatisfy_1.mustSatisfy(name, isInteger_1.isInteger(value), beCanvasId, contextBuilder);
    return value;
}
exports.mustBeCanvasId = mustBeCanvasId;
