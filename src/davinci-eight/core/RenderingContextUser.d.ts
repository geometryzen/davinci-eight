interface RenderingContextUser {
  /**
   * Called to request the dependent to free any WebGL resources acquired and owned.
   */
  contextFree(context: WebGLRenderingContext): void
  /**
   * Called to inform the dependent of a new WebGLRenderingContext.
   * @param gl
   * @param contextGainId
   */
  contextGain(context: WebGLRenderingContext, contextGainId: string): void
  /**
   * Called to inform the dependent of a loss of WebGLRenderingContext.
   * The dependent must assume that any cached context is invalid.
   * The dependent must not try to use and cached context to free resources.
   * The dependent should reset its state to that for which there is no context.
   */
  contextLoss(): void
  /**
   * Determines whether the context user has a context.
   */ 
  hasContext(): boolean;
}