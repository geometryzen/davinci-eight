import { ContextManager } from '../core/ContextManager';
import { mustBeNumber } from '../checks/mustBeNumber';
import { ShareableBase } from '../core/ShareableBase';

export class WebGLClearColor extends ShareableBase {
    public r: number;
    public g: number;
    public b: number;
    public a: number;

    constructor(private contextManager: ContextManager, r = 0, g = 0, b = 0, a = 1) {
        super();
        this.setLoggingName('WebGLClearColor');
        this.r = mustBeNumber('r', r);
        this.g = mustBeNumber('g', g);
        this.b = mustBeNumber('b', b);
        this.a = mustBeNumber('a', a);
    }

    /**
     *
     */
    destructor(levelUp: number): void {
        this.r = void 0;
        this.g = void 0;
        this.b = void 0;
        this.a = void 0;
        super.destructor(levelUp + 1);
    }

    contextFree(): void {
        // Do nothing;
    }

    contextGain(): void {
        mustBeNumber('r', this.r);
        mustBeNumber('g', this.g);
        mustBeNumber('b', this.b);
        mustBeNumber('a', this.a);
        this.contextManager.gl.clearColor(this.r, this.g, this.b, this.a);
    }

    contextLost(): void {
        // Do nothing;
    }
}
