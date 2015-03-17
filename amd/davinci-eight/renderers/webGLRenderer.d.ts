declare var webGLRenderer: (parameters?: any) => {
    canvas: HTMLCanvasElement;
    context: WebGLRenderingContext;
    onContextGain: (context: WebGLRenderingContext) => void;
    onContextLoss: () => void;
    clearColor: (r: number, g: number, b: number, a: number) => void;
    render: (scene: any, camera: {
        projectionMatrix: any;
    }) => void;
    viewport: (x: any, y: any, width: any, height: any) => void;
    setSize: (width: any, height: any, updateStyle: any) => void;
};
export = webGLRenderer;
