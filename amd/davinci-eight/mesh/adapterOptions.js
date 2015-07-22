define(["require", "exports", '../core/DrawMode'], function (require, exports, DrawMode) {
    function adapterOptions(options) {
        var drawMode = options.wireFrame ? DrawMode.LINES : DrawMode.TRIANGLES;
        return {
            drawMode: drawMode
        };
    }
    return adapterOptions;
});
