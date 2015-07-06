declare class WebGLRenderer implements Renderer {
    private renderer;
    constructor();
    render(world: World, ambientUniforms: VertexUniformProvider): void;
    contextFree(context: WebGLRenderingContext): void;
    contextGain(context: WebGLRenderingContext, contextId: string): void;
    contextLoss(): void;
    hasContext(): boolean;
    clearColor(r: number, g: number, b: number, a: number): void;
    setClearColor(color: number, alpha?: number): void;
    setSize(width: number, height: number): void;
    domElement: HTMLCanvasElement;
}
export = WebGLRenderer;
