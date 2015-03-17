declare var webGLContextMonitor: (canvas: HTMLCanvasElement, contextLoss: () => void, contextGain: (gl: WebGLRenderingContext) => void) => {
    start: () => void;
    stop: () => void;
};
export = webGLContextMonitor;
