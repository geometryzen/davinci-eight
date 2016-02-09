import IContextListener from '../core/IContextListener';
import Mesh from './Mesh';
import IUnknownArray from '../collections/IUnknownArray';
import Facet from '../core/Facet';

/**
 * @module EIGHT
 * @submodule core
 */

/**
 * @class IDrawList
 * @extends IContextConsumer
 */
interface IDrawList extends IContextListener {

    /**
     * Adds the specified mesh to this list.
     *
     * @method add
     * @param mesh {Mesh}
     * @return {void}
     */
    add(mesh: Mesh): void;

    /**
     * Determines whether this list contains the specified mesh.
     *
     * @method contains
     * @param mesh {Mesh}
     * @return {boolean}
     */
    contains(mesh: Mesh): boolean;

    /**
     * @method draw
     * @param ambients {Facet[]}
     * @return {void}
     */
    draw(ambients: Facet[]): void;

    /**
     * Finds all meshes that satisfy the specified test.
     *
     * @method findByName
     * @param match {(mesh: Mesh) => boolean}
     * @return {IUnknownArray}
     */
    find(match: (mesh: Mesh) => boolean): IUnknownArray<Mesh>;

    /**
     * Finds a mesh that matches the specified test.
     *
     * @method findOne
     * @param match {(mesh: Mesh) => boolean}
     * @return {Mesh}
     */
    findOne(match: (mesh: Mesh) => boolean): Mesh;

    /**
     * Finds a mesh that has the specified name.
     *
     * @method findOneByName
     * @param name {string}
     * @return {Mesh}
     */
    findOneByName(name: string): Mesh;

    /**
     * Finds all meshes that have the specified name.
     *
     * @method findByName
     * @param name {string}
     * @return {IUnknownArray}
     */
    findByName(name: string): IUnknownArray<Mesh>;

    /**
     * Removes the specified mesh from this list.
     *
     * @method remove
     * @param mesh {Mesh}
     */
    remove(mesh: Mesh): void;
}

export default IDrawList;
