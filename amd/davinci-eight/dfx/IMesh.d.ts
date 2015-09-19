import IProgram = require('../core/IProgram');
import IUnknown = require('../core/IUnknown');
interface IMesh extends IUnknown {
    uuid: string;
    bind(program: IProgram, aNameToKeyName?: {
        [name: string]: string;
    }): void;
    draw(): void;
    unbind(): void;
}
export = IMesh;
