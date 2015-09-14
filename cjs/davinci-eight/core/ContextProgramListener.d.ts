interface ContextProgramListener {
    contextFree(): void;
    contextGain(context: WebGLRenderingContext, program: WebGLProgram): void;
    contextLoss(): void;
}
export = ContextProgramListener;
