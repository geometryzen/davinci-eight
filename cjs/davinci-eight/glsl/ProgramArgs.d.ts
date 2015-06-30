/// <reference path="../../../src/davinci-eight/glsl/NodeEventHandler.d.ts" />
import DefaultNodeEventHandler = require('./DefaultNodeEventHandler');
declare class ProgramArgs extends DefaultNodeEventHandler {
    constructor();
    declaration(kind: string, modifiers: string[], type: string, names: string[]): void;
}
export = ProgramArgs;
