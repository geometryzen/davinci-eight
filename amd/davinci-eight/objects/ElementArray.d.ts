declare class ElementArray {
    private buffer;
    constructor();
    contextFree(context: WebGLRenderingContext): void;
    contextGain(context: WebGLRenderingContext): void;
    contextLoss(): void;
    bufferData(context: WebGLRenderingContext, geometry: Geometry): void;
    bind(context: WebGLRenderingContext): void;
}
export = ElementArray;
