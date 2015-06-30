/// <reference path="../geometries/Geometry.d.ts" />
function computeUsage(geometry, context) {
    return geometry.dynamic() ? context.DYNAMIC_DRAW : context.STATIC_DRAW;
}
function existsLocation(location) {
    return location >= 0;
}
// TODO: Maybe this should be called simply AttributeArray?
var VertexAttribArray = (function () {
    function VertexAttribArray(name, size, normalized, stride, offset) {
        this.name = name;
        this.size = size;
        this.normalized = normalized;
        this.stride = stride;
        this.offset = offset;
    }
    VertexAttribArray.prototype.contextFree = function (context) {
        if (this.buffer) {
            context.deleteBuffer(this.buffer);
            this.contextLoss();
        }
    };
    VertexAttribArray.prototype.contextGain = function (context, program) {
        this.location = context.getAttribLocation(program, this.name);
        if (existsLocation(this.location)) {
            this.buffer = context.createBuffer();
        }
    };
    VertexAttribArray.prototype.contextLoss = function () {
        this.location = void 0;
        this.buffer = void 0;
    };
    // Not really bind so much as describing
    VertexAttribArray.prototype.bind = function (context) {
        if (existsLocation(this.location)) {
            // TODO: We could assert that we have a buffer.
            context.bindBuffer(context.ARRAY_BUFFER, this.buffer);
            // 6.14 Fixed point support.
            // The WebGL API does not support the GL_FIXED data type.
            // Consequently, we hard-code the FLOAT constant.
            context.vertexAttribPointer(this.location, this.size, context.FLOAT, this.normalized, this.stride, this.offset);
        }
    };
    VertexAttribArray.prototype.bufferData = function (context, geometry) {
        if (existsLocation(this.location)) {
            var data = geometry.getVertexAttribArrayData(this.name);
            if (data) {
                context.bindBuffer(context.ARRAY_BUFFER, this.buffer);
                context.bufferData(context.ARRAY_BUFFER, data, computeUsage(geometry, context));
            }
            else {
                // We expect this to be detected by the mesh long before we get here.
                throw new Error("Geometry implementation does not support the attribute " + this.name);
            }
        }
    };
    VertexAttribArray.prototype.enable = function (context) {
        if (existsLocation(this.location)) {
            context.enableVertexAttribArray(this.location);
        }
    };
    VertexAttribArray.prototype.disable = function (context) {
        if (existsLocation(this.location)) {
            context.disableVertexAttribArray(this.location);
        }
    };
    return VertexAttribArray;
})();
module.exports = VertexAttribArray;
