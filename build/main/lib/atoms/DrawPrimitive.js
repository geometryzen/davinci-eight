"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mustBeArray_1 = require("../checks/mustBeArray");
var mustBeInteger_1 = require("../checks/mustBeInteger");
var mustBeObject_1 = require("../checks/mustBeObject");
var context = function () { return "DrawPrimitive constructor"; };
/**
 * A convenience class for implementing the Primitive interface.
 */
var DrawPrimitive = (function () {
    function DrawPrimitive(mode, indices, attributes) {
        this.attributes = {};
        this.mode = mustBeInteger_1.mustBeInteger('mode', mode, context);
        this.indices = mustBeArray_1.mustBeArray('indices', indices, context);
        this.attributes = mustBeObject_1.mustBeObject('attributes', attributes, context);
    }
    return DrawPrimitive;
}());
exports.DrawPrimitive = DrawPrimitive;
