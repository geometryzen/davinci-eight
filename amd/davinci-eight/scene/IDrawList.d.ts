import IContextConsumer = require('../core/IContextConsumer');
import IDrawable = require('../core/IDrawable');
import IGraphicsProgram = require('../core/IGraphicsProgram');
import IUnknownArray = require('../collections/IUnknownArray');
import IFacet = require('../core/IFacet');
/**
 * @class IDrawList
 * @extends IContextConsumer
 */
interface IDrawList extends IContextConsumer {
    /**
     * @method add
     * @param drawable {IDrawable}
     * @return {void}
     */
    add(drawable: IDrawable): void;
    /**
     * @method containsDrawable
     * @param drawable {IDrawable}
     * @return {boolean}
     */
    containsDrawable(drawable: IDrawable): boolean;
    /**
     * @method draw
     * @param ambients {IFacet[]}
     * @param [canvasId] {number}
     * @return {void}
     */
    draw(ambients: IFacet[], canvasId?: number): void;
    /**
     * Gets a collection of drawable elements by name.
     * @method getDrawablesByName
     * @param name {string}
     * @return {IUnknownArray}
     */
    getDrawablesByName(name: string): IUnknownArray<IDrawable>;
    /**
     * @method remove
     * @param drawable {IDrawable}
     */
    remove(drawable: IDrawable): void;
    /**
     * @method traverse
     * @param callback {(drawable: IDrawable) => void}
     * @param canvasId {number}
     * @param prolog {(material: IGraphicsProgram => void)}
     * @return {void}
     */
    traverse(callback: (drawable: IDrawable) => void, canvasId: number, prolog: (material: IGraphicsProgram) => void): void;
}
export = IDrawList;
