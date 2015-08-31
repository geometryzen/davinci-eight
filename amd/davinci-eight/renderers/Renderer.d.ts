import RenderingContextUser = require('../core/RenderingContextUser');
import DrawList = require('../drawLists/DrawList');
import UniformProvider = require('../core/UniformProvider');
/**
 * @class Renderer
 * @extends RenderingContextUser
 */
interface Renderer extends RenderingContextUser {
    /**
    * @property autoClear
    * Defines whether the renderer should automatically clear its output before rendering.
    */
    autoClear: boolean;
    /**
     *
     */
    clearColor(red: number, green: number, blue: number, alpha: number): Renderer;
    /**
      * @method render
      * @param drawList {DrawList}
      * @param ambients {UniformProvider} optional
      */
    render(drawList: DrawList, ambients?: UniformProvider): void;
}
export = Renderer;
