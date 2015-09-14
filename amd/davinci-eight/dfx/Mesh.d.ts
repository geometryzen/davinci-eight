import Program = require('../core/Program');
import IUnknown = require('../core/IUnknown');
interface Mesh extends IUnknown {
    uuid: string;
    bind(program: Program, aNameToKeyName?: {
        [name: string]: string;
    }): void;
    draw(): void;
    unbind(): void;
}
export = Mesh;
