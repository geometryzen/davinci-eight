import IContextProvider from '../core/IContextProvider';
import IContextCommand from '../core/IContextCommand';
import mustBeNumber from '../checks/mustBeNumber';
import Shareable from '../utils/Shareable';

/**
 * <p>
 * clearColor(red: number, green: number, blue: number, alpha: number): void
 * <p> 
 * @class WebGLClearColor
 * @extends Shareable
 */
export default class WebGLClearColor extends Shareable implements IContextCommand {
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

    /**
     * @method contextFree
     * @param canvasId {number}
     * @return {void}
     */
    contextFree(canvasId: number): void {
        // Do nothing;
    }

    /**
     * @method contextGain
     * @param manager {IContextProvider}
     * @return {void}
     */
    contextGain(manager: IContextProvider): void {
        mustBeNumber('red', this.red)
        mustBeNumber('green', this.green)
        mustBeNumber('blue', this.blue)
        mustBeNumber('alpha', this.alpha)
        manager.gl.clearColor(this.red, this.green, this.blue, this.alpha)
    }

    /**
     * @method contextLost
     * @param canvasId {number}
     * @return {void}
     */
    contextLost(canvasId: number): void {
        // Do nothing;
    }
}
