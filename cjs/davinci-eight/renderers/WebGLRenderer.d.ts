import RenderingContextUser = require('../core/RenderingContextUser');
import DrawList = require('../drawLists/DrawList');
import UniformProvider = require('../core/UniformProvider');
/**
 * @class WebGLRenderer
 * @extends RenderingContextUser
 */
interface WebGLRenderer extends RenderingContextUser {
    /**
     * @method render
     * @param drawList {DrawList}
     * @param views {UniformProvider[]}
     */
    render(drawList: DrawList, views: UniformProvider[]): void;
}
export = WebGLRenderer;
