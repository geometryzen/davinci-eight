/**
 * @module EIGHT
 * @submodule core
 * @class ContextProgramConsumer
 */
interface ContextProgramConsumer {
    contextFree(): void;
    contextGain(gl: WebGLRenderingContext, program: WebGLProgram): void;
    contextLost(): void;
}

export default ContextProgramConsumer;
