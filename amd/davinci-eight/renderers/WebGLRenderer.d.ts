declare class WebGLRenderer implements Renderer {
    private renderer;
    constructor();
    render(scene: Scene, ambientUniforms: UniformProvider): void;
    contextFree(context: WebGLRenderingContext): void;
    contextGain(context: WebGLRenderingContext, contextId: string): void;
    contextLoss(): void;
    hasContext(): boolean;
    setSize(width: number, height: number): void;
    domElement: HTMLCanvasElement;
}
export = WebGLRenderer;
