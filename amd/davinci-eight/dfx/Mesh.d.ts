import ShaderProgram = require('../core/ShaderProgram');
import IUnknown = require('../core/IUnknown');
interface Mesh extends IUnknown {
    uuid: string;
    bind(program: ShaderProgram, aNameToKeyName?: {
        [name: string]: string;
    }): void;
    draw(): void;
    unbind(): void;
}
export = Mesh;
