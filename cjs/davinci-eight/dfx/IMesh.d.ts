import IProgram = require('../core/IProgram');
import IUnknown = require('../core/IUnknown');
/**
 * @interface IMesh
 */
interface IMesh extends IUnknown {
    /**
     * @property uuid
     */
    uuid: string;
    bind(program: IProgram, aNameToKeyName?: {
        [name: string]: string;
    }): void;
    draw(): void;
    unbind(): void;
}
export = IMesh;
