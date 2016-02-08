import IContextListener from '../core/IContextListener';
import Mesh from './Mesh';
import IUnknownArray from '../collections/IUnknownArray';
import Facet from '../core/Facet';

/**
 * @class IDrawList
 * @extends IContextConsumer
 */
interface IDrawList extends IContextListener {

    /**
     * @method add
     * @param composit {Mesh}
     * @return {void}
     */
    add(composite: Mesh): void;

    /**
     * @method containsDrawable
     * @param composite {Mesh}
     * @return {boolean}
     */
    containsDrawable(composite: Mesh): boolean;

    /**
     * @method draw
     * @param ambients {Facet[]}
     * @return {void}
     */
    draw(ambients: Facet[]): void;

    /**
     * Finds a composite that matches the specified match test.
     *
     * @method findOne
     * @param match {(composite: ID) => boolean}
     * @return {Mesh}
     */
    findOne(match: (composite: Mesh) => boolean): Mesh;

    /**
     * Gets any composite that has the specified name.
     *
     * @method getDrawableByName
     * @param name {string}
     * @return {Mesh}
     */
    getDrawableByName(name: string): Mesh;

    /**
     * Gets a collection of composite elements by name.
     * @method getDrawablesByName
     * @param name {string}
     * @return {IUnknownArray}
     */
    getDrawablesByName(name: string): IUnknownArray<Mesh>;

    /**
     * @method remove
     * @param composite {Mesh}
     */
    remove(composite: Mesh): void;
}

export default IDrawList;
