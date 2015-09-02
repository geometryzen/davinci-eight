
interface RenderingContextProgramUser {
  contextFree(): void;
  contextGain(context: WebGLRenderingContext, program: WebGLProgram): void;
  contextLoss(): void;
}

export = RenderingContextProgramUser;