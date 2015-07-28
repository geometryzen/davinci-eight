define(["require", "exports", '../core/DrawMode'], function (require, exports, DrawMode) {
    function adapterOptions(options) {
        if (options === void 0) { options = { wireFrame: false }; }
        var drawMode = options.wireFrame ? DrawMode.LINES : DrawMode.TRIANGLES;
        return {
            drawMode: drawMode
        };
    }
    return adapterOptions;
});
