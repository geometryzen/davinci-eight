interface RenderingContextProgramUser {
  // addRef();
  //release(): void;
  contextGain(context: WebGLRenderingContext, program: WebGLProgram): void;
  contextLoss(): void;
}

export = RenderingContextProgramUser;