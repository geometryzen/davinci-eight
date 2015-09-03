import DrawableVisitor = require('../core/DrawableVisitor');
import ShaderProgram = require('../core/ShaderProgram');
import Node = require('../uniforms/Node');
import UniformProvider = require('../core/UniformProvider');
import ArrowOptions = require('../mesh/ArrowOptions');
import Blade = require('../objects/Blade');
declare class Arrow3D implements Blade<Node> {
    private $magnitude;
    private $coneHeight;
    model: Node;
    program: ShaderProgram;
    private headModel;
    private tailModel;
    private head;
    private tail;
    private _refCount;
    constructor(ambients: UniformProvider, options?: ArrowOptions);
    magnitude: number;
    setMagnitude(magnitude: number): Blade<Node>;
    /**
     *
     */
    accept(visitor: DrawableVisitor): void;
    addRef(): void;
    release(): void;
    contextFree(): void;
    contextGain(context: WebGLRenderingContext): void;
    contextLoss(): void;
    hasContext(): boolean;
}
export = Arrow3D;
