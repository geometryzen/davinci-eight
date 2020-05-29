"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initWebGL = void 0;
var isDefined_1 = require("../checks/isDefined");
/**
 * Returns the WebGLRenderingContext given a canvas.
 * canvas
 * attributes
 * If the canvas is undefined then an undefined value is returned for the context.
 */
function initWebGL(canvas, attributes) {
    // We'll be hyper-functional. An undefined canvas begets an undefined context.
    // Clients must check their context output or canvas input.
    if (isDefined_1.isDefined(canvas)) {
        var context;
        try {
            // Try to grab the standard context. If it fails, fallback to experimental.
            context = (canvas.getContext('webgl', attributes) || canvas.getContext('experimental-webgl', attributes));
        }
        catch (e) {
            // Do nothing.
        }
        if (context) {
            return context;
        }
        else {
            throw new Error("Unable to initialize WebGL. Your browser may not support it.");
        }
    }
    else {
        // An undefined canvas results in an undefined context.
        return void 0;
    }
}
exports.initWebGL = initWebGL;
