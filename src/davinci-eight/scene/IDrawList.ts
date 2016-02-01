import IContextConsumer from '../core/IContextConsumer';
import IDrawable from '../core/IDrawable';
import IGraphicsProgram from '../core/IGraphicsProgram';
import IUnknown from '../core/IUnknown';
import IUnknownArray from '../collections/IUnknownArray';
import Facet from '../core/Facet';

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
     * @param ambients {Facet[]}
     * @param [canvasId] {number}
     * @return {void}
     */
    draw(ambients: Facet[], canvasId?: number): void;

    /**
     * Finds a drawable that matches the specified match test.
     *
     * @method findOne
     * @param match {(drawable: ID) => boolean}
     * @return {IDrawable}
     */
    findOne(match: (drawable: IDrawable) => boolean): IDrawable;

    /**
     * Gets any drawable that has the specified name.
     *
     * @method getDrawableByName
     * @param name {string}
     * @return {IDrawable}
     */
    getDrawableByName(name: string): IDrawable;

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

export default IDrawList;
