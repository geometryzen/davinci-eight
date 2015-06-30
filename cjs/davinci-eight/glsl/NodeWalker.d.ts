/// <reference path="../../../src/davinci-eight/glsl/Node.d.ts" />
/// <reference path="../../../src/davinci-eight/glsl/NodeEventHandler.d.ts" />
declare class NodeWalker {
    constructor();
    walk(node: GLSL.Node, handler: GLSL.NodeEventHandler): void;
}
export = NodeWalker;
