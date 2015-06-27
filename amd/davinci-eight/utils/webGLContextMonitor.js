define(["require", "exports"], function (require, exports) {
    var webGLContextMonitor = function (canvas, contextFree, contextGain, contextLoss) {
        var webGLContextLost = function (event) {
            event.preventDefault();
            contextLoss();
        };
        var webGLContextRestored = function (event) {
            event.preventDefault();
            var gl = canvas.getContext('webgl');
            // Using Math.random() is good enough for now. The Birthday problem!
            contextGain(gl, Math.random().toString());
        };
        var publicAPI = {
            start: function (context) {
                canvas.addEventListener('webglcontextlost', webGLContextLost, false);
                canvas.addEventListener('webglcontextrestored', webGLContextRestored, false);
                contextGain(context, Math.random().toString());
            },
            stop: function () {
                contextFree();
                canvas.removeEventListener('webglcontextrestored', webGLContextRestored, false);
                canvas.removeEventListener('webglcontextlost', webGLContextLost, false);
            }
        };
        return publicAPI;
    };
    return webGLContextMonitor;
});
