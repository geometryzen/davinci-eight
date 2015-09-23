import ContextListener = require('../core/ContextListener');
import IDrawable = require('../core/IDrawable');
import IMaterial = require('../core/IMaterial');
import IUnknown = require('../core/IUnknown');
import UniformData = require('../core/UniformData');
/**
 * @class IDrawList
 * @extends ContextListener
 * @extends IUnknown
 */
interface IDrawList extends ContextListener, IUnknown {
    add(drawable: IDrawable): void;
    remove(drawable: IDrawable): void;
    draw(ambients: UniformData, canvasId: number): void;
    traverse(callback: (drawable: IDrawable) => void, canvasId: number, prolog: (program: IMaterial) => void): void;
}
export = IDrawList;
