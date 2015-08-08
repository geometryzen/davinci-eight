import Node = require('../uniforms/Node');
import UniformProvider = require('../core/UniformProvider');
import ArrowOptions = require('../mesh/ArrowOptions');
import Blade = require('../objects/Blade');
declare class Arrow3D implements Blade<Node> {
    drawGroupName: string;
    private $magnitude;
    private $coneHeight;
    model: Node;
    private headModel;
    private tailModel;
    private head;
    private tail;
    private shaders;
    constructor(ambients: UniformProvider, options?: ArrowOptions);
    magnitude: number;
    setMagnitude(magnitude: number): Blade<Node>;
    useProgram(): void;
    draw(ambients: UniformProvider): void;
    contextFree(): void;
    contextGain(context: WebGLRenderingContext, contextId: string): void;
    contextLoss(): void;
    hasContext(): boolean;
}
export = Arrow3D;
