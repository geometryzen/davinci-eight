/**
 * @hidden
 */
export interface ContextProgramConsumer {
    contextFree(): void;
    contextGain(gl: WebGL2RenderingContext | WebGLRenderingContext, program: WebGLProgram): void;
    contextLost(): void;
}
