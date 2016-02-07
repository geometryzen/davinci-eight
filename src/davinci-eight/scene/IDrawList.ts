import IContextListener from '../core/IContextListener';
import Composite from './Composite';
import ShareableWebGLProgram from '../core/ShareableWebGLProgram';
import IUnknown from '../core/IUnknown';
import IUnknownArray from '../collections/IUnknownArray';
import Facet from '../core/Facet';

/**
 * @class IDrawList
 * @extends IContextConsumer
 */
interface IDrawList extends IContextListener {

    /**
     * @method add
     * @param composit {Composite}
     * @return {void}
     */
    add(composite: Composite): void;

    /**
     * @method containsDrawable
     * @param composite {Composite}
     * @return {boolean}
     */
    containsDrawable(composite: Composite): boolean;

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
     * @return {Composite}
     */
    findOne(match: (composite: Composite) => boolean): Composite;

    /**
     * Gets any composite that has the specified name.
     *
     * @method getDrawableByName
     * @param name {string}
     * @return {Composite}
     */
    getDrawableByName(name: string): Composite;

    /**
     * Gets a collection of composite elements by name.
     * @method getDrawablesByName
     * @param name {string}
     * @return {IUnknownArray}
     */
    getDrawablesByName(name: string): IUnknownArray<Composite>;

    /**
     * @method remove
     * @param composite {Composite}
     */
    remove(composite: Composite): void;
}

export default IDrawList;
