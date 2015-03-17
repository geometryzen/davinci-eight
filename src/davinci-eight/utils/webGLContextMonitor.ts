var webGLContextMonitor = function(canvas: HTMLCanvasElement, contextLoss: () => void, contextGain: (gl: WebGLRenderingContext) => void) {

    var webGLContextLost = function(event) {
        event.preventDefault();
        contextLoss();
    };

    var webGLContextRestored = function(event) {
        event.preventDefault();
        var gl: WebGLRenderingContext = canvas.getContext('webgl');
        contextGain(gl);
    };

    var that = {
        start: function() {
            canvas.addEventListener('webglcontextlost', webGLContextLost, false);
            canvas.addEventListener('webglcontextrestored', webGLContextRestored, false);
        },
        stop: function() {
            canvas.removeEventListener('webglcontextrestored', webGLContextRestored, false);
            canvas.removeEventListener('webglcontextlost', webGLContextLost, false);
        }
    };

    return that;
};

export = webGLContextMonitor;
