/**
 * @module EIGHT
 * @submodule core
 * @class IContextProgramConsumer
 */
interface IContextProgramConsumer {
    contextFree(): void;
    contextGain(gl: WebGLRenderingContext, program: WebGLProgram): void;
    contextLost(): void;
}

export default IContextProgramConsumer;
