import IContextConsumer = require('../core/IContextConsumer');
import IDrawable = require('../core/IDrawable');
import IMaterial = require('../core/IMaterial');
import IUnknown = require('../core/IUnknown');
import IUnknownArray = require('../utils/IUnknownArray');
import IFacet = require('../core/IFacet');
/**
 * @class IDrawList
 * @extends IContextConsumer
 * @extends IUnknown
 */
interface IDrawList extends IContextConsumer, IUnknown {
    add(drawable: IDrawable): void;
    /**
     * @method draw
     * @param ambients {IFacet[]}
     * @param canvasId {number}
     * @return {void}
     */
    draw(ambients: IFacet[], canvasId: number): void;
    /**
     * Gets a collection of drawable elements by name.
     * @method getDrawablesByName
     * @param name {string}
     */
    getDrawablesByName(name: string): IUnknownArray<IDrawable>;
    remove(drawable: IDrawable): void;
    traverse(callback: (drawable: IDrawable) => void, canvasId: number, prolog: (program: IMaterial) => void): void;
}
export = IDrawList;
