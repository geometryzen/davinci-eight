import RenderingContextUser = require('../core/RenderingContextUser');
import UniformProvider = require('../core/UniformProvider');
import World = require('../worlds/World');
/**
 * @class Viewport
 */
interface Viewport extends RenderingContextUser {
    /**
     * @property canvas
     * @type HTMLCanvasElement
     */
    canvas: HTMLCanvasElement;
    /**
     * @property x
     * @type number
     */
    x: number;
    /**
     * @property y
     * @type number
     */
    y: number;
    /**
     * @property width
     * @type number
     */
    width: number;
    /**
     * @property height
     * @type number
     */
    height: number;
    /**
     * @method render
     * @param world {World}
     * @param views {UniformProvider[]}
     */
    render(world: World, views: UniformProvider[]): void;
    /**
     * @method clearColor
     * @param red {number}
     * @param green {number}
     * @param blue {number}
     * @param alpha {number}
     */
    clearColor(red: number, green: number, blue: number, alpha: number): void;
    /**
     * @deprecated
     */
    setSize(width: number, height: number): void;
}
export = Viewport;
