var webGLContextMonitor = function(
  canvas: HTMLCanvasElement,
  contextFree: () => void,
  contextGain: (gl: WebGLRenderingContext, contextGainId: string) => void,
  contextLoss: () => void
  ) {

  var webGLContextLost = function(event: Event) {
    event.preventDefault();
    contextLoss();
  };

  var webGLContextRestored = function(event: Event) {
    event.preventDefault();
    var gl: WebGLRenderingContext = <WebGLRenderingContext>canvas.getContext('webgl');
    // Using Math.random() is good enough for now. The Birthday problem!
    contextGain(gl, Math.random().toString());
  };

  var publicAPI = {
    start: function(context: WebGLRenderingContext) {
      canvas.addEventListener('webglcontextlost', webGLContextLost, false);
      canvas.addEventListener('webglcontextrestored', webGLContextRestored, false);
      contextGain(context, Math.random().toString());
    },
    stop: function() {
      contextFree();
      canvas.removeEventListener('webglcontextrestored', webGLContextRestored, false);
      canvas.removeEventListener('webglcontextlost', webGLContextLost, false);
    }
  };

  return publicAPI;
};

export = webGLContextMonitor;
