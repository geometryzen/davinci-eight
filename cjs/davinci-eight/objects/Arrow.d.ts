import Color = require('../core/Color');
import Drawable = require('../core/Drawable');
import Spinor3 = require('../math/Spinor3');
import UniformProvider = require('../core/UniformProvider');
import Vector3 = require('../math/Vector3');
declare class Arrow implements Drawable {
    drawGroupName: string;
    private $length;
    private model;
    private headModel;
    private tailModel;
    private head;
    private tail;
    constructor(ambients: UniformProvider);
    length: number;
    setLength(length: number): Arrow;
    color: Color;
    position: Vector3;
    positione: Vector3;
    attitude: Spinor3;
    useProgram(): void;
    draw(ambients: UniformProvider): void;
    contextFree(): void;
    contextGain(context: WebGLRenderingContext, contextId: string): void;
    contextLoss(): void;
    hasContext(): boolean;
}
export = Arrow;
