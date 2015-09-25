import IContextProgramConsumer = require('../core/IContextProgramConsumer');
import IContextProvider = require('../core/IContextProvider');
/**
 * Utility class for managing a shader attribute variable.
 * While this class may be created directly by the user, it is preferable
 * to use the AttribLocation instances managed by the Program because
 * there will be improved integrity and context loss management.
 * @class AttribLocation
 * @implements IContextProgramConsumer
 */
declare class AttribLocation implements IContextProgramConsumer {
    private _name;
    private _index;
    private _context;
    /**
     * Convenience class that assists in the lifecycle management of an atrribute used in a vertex shader.
     * In particular, this class manages buffer allocation, location caching, and data binding.
     * @class AttribLocation
     * @constructor
     * @param manager {IContextProvider} Unused. May be used later e.g. for mirroring.
     * @param name {string} The name of the variable as it appears in the GLSL program.
     */
    constructor(manager: IContextProvider, name: string);
    index: number;
    contextFree(): void;
    contextGain(context: WebGLRenderingContext, program: WebGLProgram): void;
    contextLost(): void;
    /**
     * @method vertexPointer
     * @param size {number} The number of components per attribute. Must be 1,2,3, or 4.
     * @param normalized {boolean} Used for WebGL rendering context vertexAttribPointer method.
     * @param stride {number} Used for WebGL rendering context vertexAttribPointer method.
     * @param offset {number} Used for WebGL rendering context vertexAttribPointer method.
     */
    vertexPointer(size: number, normalized?: boolean, stride?: number, offset?: number): void;
    /**
     * @method enable
     */
    enable(): void;
    /**
     * @method disable
     */
    disable(): void;
    /**
     * @method toString
     */
    toString(): string;
}
export = AttribLocation;
