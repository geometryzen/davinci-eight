import ContextProvider from '../core/ContextProvider';
import mustBeNumber from '../checks/mustBeNumber';
import ShareableBase from '../core/ShareableBase';

/**
 * <p>
 * clearColor(red: number, green: number, blue: number, alpha: number): void
 * <p> 
 * @class WebGLClearColor
 * @extends ShareableBase
 */
export default class WebGLClearColor extends ShareableBase {
    public red: number;
    public green: number;
    public blue: number;
    public alpha: number;

    /**
     * @class WebGLClearColor
     * @constructor
     * @param [red = 0] {number}
     * @param [green = 0] {number}
     * @param [blue = 0] {number}
     * @param [alpha = 1] {number}
     */
    constructor(red = 0, green = 0, blue = 0, alpha = 1) {
        super('WebGLClearColor')
        this.red = mustBeNumber('red', red)
        this.green = mustBeNumber('green', green)
        this.blue = mustBeNumber('blue', blue)
        this.alpha = mustBeNumber('alpha', alpha)
    }

    /**
     * @method destructor
     * @return {void}
     */
    destructor(): void {
        this.red = void 0
        this.green = void 0
        this.blue = void 0
        this.alpha = void 0
        super.destructor()
    }

    contextFree(manager: ContextProvider): void {
        // Do nothing;
    }

    contextGain(manager: ContextProvider): void {
        mustBeNumber('red', this.red)
        mustBeNumber('green', this.green)
        mustBeNumber('blue', this.blue)
        mustBeNumber('alpha', this.alpha)
        manager.gl.clearColor(this.red, this.green, this.blue, this.alpha)
    }

    contextLost(): void {
        // Do nothing;
    }
}
