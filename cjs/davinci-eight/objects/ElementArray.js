function computeUsage(geometry, context) {
    return geometry.dynamic() ? context.DYNAMIC_DRAW : context.STATIC_DRAW;
}
var ElementArray = (function () {
    function ElementArray() {
    }
    ElementArray.prototype.contextFree = function (context) {
        if (this.buffer) {
            context.deleteBuffer(this.buffer);
            this.buffer = void 0;
        }
    };
    ElementArray.prototype.contextGain = function (context) {
        this.buffer = context.createBuffer();
    };
    ElementArray.prototype.contextLoss = function () {
        this.buffer = void 0;
    };
    ElementArray.prototype.bufferData = function (context, geometry) {
        var elements = geometry.getElements();
        if (elements) {
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
