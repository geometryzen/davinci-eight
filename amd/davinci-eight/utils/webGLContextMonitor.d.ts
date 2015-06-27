declare var webGLContextMonitor: (canvas: HTMLCanvasElement, contextFree: () => void, contextGain: (gl: WebGLRenderingContext, contextGainId: string) => void, contextLoss: () => void) => {
    start: (context: WebGLRenderingContext) => void;
    stop: () => void;
};
export = webGLContextMonitor;
