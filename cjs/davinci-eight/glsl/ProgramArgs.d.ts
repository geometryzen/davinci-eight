/// <reference path="../../../src/davinci-eight/glsl/NodeEventHandler.d.ts" />
import DefaultNodeEventHandler = require('./DefaultNodeEventHandler');
import Declaration = require('./Declaration');
declare class ProgramArgs extends DefaultNodeEventHandler {
    attributes: Declaration[];
    uniforms: Declaration[];
    varyings: Declaration[];
    constructor();
    declaration(kind: string, modifiers: string[], type: string, names: string[]): void;
}
export = ProgramArgs;
