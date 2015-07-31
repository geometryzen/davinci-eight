import RenderingContextUser = require('../core/RenderingContextUser');
import World = require('../worlds/World');
import UniformProvider = require('../core/UniformProvider');
/**
 * @class Renderer
 * @extends RenderingContextUser
 */
interface Renderer extends RenderingContextUser {
    /**
     * @method render
     * @param world {World}
     * @param views {UniformProvider[]}
     */
    render(world: World, views: UniformProvider[]): void;
}
export = Renderer;
