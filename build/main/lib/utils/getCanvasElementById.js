"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mustBeString_1 = require("../checks/mustBeString");
var mustBeObject_1 = require("../checks/mustBeObject");
function getCanvasElementById(elementId, dom) {
    if (dom === void 0) { dom = window.document; }
    mustBeString_1.mustBeString('elementId', elementId);
    mustBeObject_1.mustBeObject('document', dom);
    var element = dom.getElementById(elementId);
    if (element instanceof HTMLCanvasElement) {
        return element;
    }
    else {
        throw new Error(elementId + " is not an HTMLCanvasElement.");
    }
}
exports.getCanvasElementById = getCanvasElementById;
