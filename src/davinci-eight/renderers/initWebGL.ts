function initWebGL(canvas: HTMLCanvasElement, attributes: any): WebGLRenderingContext {
  var context: WebGLRenderingContext;
  
  try {
    // Try to grab the standard context. If it fails, fallback to experimental.
    context = <WebGLRenderingContext>(canvas.getContext('webgl', attributes) || canvas.getContext('experimental-webgl', attributes));
  }
  catch(e) {
  }
  
  if (context) {
    return context;
  }
  else {
    throw new Error("Unable to initialize WebGL. Your browser may not support it.");
  }
}

export = initWebGL;