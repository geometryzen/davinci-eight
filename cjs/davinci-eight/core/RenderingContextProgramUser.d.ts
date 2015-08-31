interface RenderingContextProgramUser {
    contextFree(): void;
    contextGain(context: WebGLRenderingContext, program: WebGLProgram, contextId: string): void;
    contextLoss(): void;
}
export = RenderingContextProgramUser;
