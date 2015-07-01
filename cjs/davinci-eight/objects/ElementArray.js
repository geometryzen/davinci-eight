/// <reference path="../geometries/Geometry.d.ts" />
function computeUsage(geometry, context) {
    return geometry.dynamic() ? context.DYNAMIC_DRAW : context.STATIC_DRAW;
}
/**
 * Manages the (optional) WebGLBuffer used to support gl.drawElements().
 */
var ElementArray = (function () {
    function ElementArray(geometry) {
        this.geometry = geometry;
    }
    ElementArray.prototype.contextFree = function (context) {
        if (this.buffer) {
            context.deleteBuffer(this.buffer);
            this.buffer = void 0;
        }
    };
    ElementArray.prototype.contextGain = function (context) {
        if (this.geometry.hasElements()) {
            this.buffer = context.createBuffer();
        }
    };
    ElementArray.prototype.contextLoss = function () {
        this.buffer = void 0;
    };
    ElementArray.prototype.bufferData = function (context, geometry) {
        if (this.buffer) {
            var elements = geometry.getElements();
            context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, this.buffer);
            var usage = computeUsage(geometry, context);
            context.bufferData(context.ELEMENT_ARRAY_BUFFER, elements, usage);
        }
    };
    ElementArray.prototype.bind = function (context) {
        if (this.buffer) {
            context.bindBuffer(context.ELEMENT_ARRAY_BUFFER, this.buffer);
        }
    };
    return ElementArray;
})();
module.exports = ElementArray;
