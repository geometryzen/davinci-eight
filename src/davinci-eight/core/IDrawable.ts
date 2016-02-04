import Facet from '../core/Facet';
import IGraphicsBuffers from '../core/IGraphicsBuffers';
import IGraphicsProgram from '../core/IGraphicsProgram';
import IResource from '../core/IResource';

/**
 * <p>
 * The IDrawable interface indicates that the implementation can make a call
 * to either drawArrays or drawElements on the WebGL rendering context.
 * It also contains other meta-data that may be used to optimize the rendering.
 * e.g. transparency, visibility, bounding volumes, etc.
 * </p>
 *
 * @class IDrawable
 * @extends IResource
 */
interface IDrawable extends IResource {
    /**
     * @property graphicsBuffers
     * @type {IGraphicsBuffers}
     */
    graphicsBuffers: IGraphicsBuffers;

    /**
     * @property graphicsProgram
     * @type {IGraphicsProgram}
     */
    graphicsProgram: IGraphicsProgram;

    setUniforms();

    /**
     * User assigned name of the drawable object.
     * Allows a drawable object to be found in a scene.
     * @property name
     * @type {string}
     * @optional
     */
    name: string;

    /**
     * @method getFacet
     * @param name {string}
     * @return {Facet}
     */
    getFacet(name: string): Facet;

    /**
     * @method setFacet
     * @param name {string}
     * @param facet {Facet}
     * @return {void}
     */
    setFacet(name: string, facet: Facet): void;
}

export default IDrawable;
