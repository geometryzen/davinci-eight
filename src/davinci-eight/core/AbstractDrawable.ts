import Facet from './Facet'
import Geometry from './Geometry'
import ContextConsumer from './ContextConsumer'
import Material from './Material'

/**
 * @module EIGHT
 * @submodule core
 */

/**
 * @class AbstractDrawable
 * @extends ContextConsumer
 */
interface AbstractDrawable extends ContextConsumer {

    /**
     * @property name
     * @type string
     */
    name: string

    /**
     * <p>
     * A shortcut to the <code>material.fragmentShaderSrc</code> property.
     * </p>
     *
     * @property fragmentShaderSrc
     * @type string
     */
    fragmentShaderSrc: string

    /**
     * <p>
     * The <code>Geometry</code> that provides the buffered vertex attributes for this <code>AbstractDrawable</code>.
     * </p>
     *
     * <p>
     * Geometry is a shareable WebGL resource and so is reference counted.
     * Consequently, accessing the <code>geometry</code> property increments the <code>Geometry</code> instance reference count.
     * <em>Be sure to call <code>release()</code> on shareable WebGL resources in order to prevent memory leaks.</em>
     * </p>
     *
     * @property geometry
     * @type Geometry
     */
    geometry: Geometry

    /**
     * <p>
     * The <code>Material</code> that provides the WebGLProgram for this <code>AbstractDrawable</code>.
     * </p>
     *
     * <p>
     * Material is a shareable WebGL resource and so is reference counted.
     * Consequently, accessing the <code>material</code> property increments the <code>Material</code> instance reference count.
     * <em>Be sure to call <code>release()</code> on shareable WebGL resources in order to prevent memory leaks.</em>
     * </p>
     *
     * @property material
     * @type Material
     */
    material: Material

    /**
     * <p>
     * A shortcut to the <code>material.vertexShaderSrc</code> property.
     * </p>
     *
     * @property vertexShaderSrc
     * @type string
     */
    vertexShaderSrc: string

    /**
     * Determines whether this <code>AbstractDrawable</code> will be drawn.
     *
     * @property visible
     * @type boolean
     */
    visible: boolean

    /**
     * @method draw
     * @param ambients {Facet[]}
     * @return {void}
     */
    draw(ambients: Facet[]): void

    /**
     * @method setUniforms
     * @return {void}
     */
    setUniforms(): void

}

export default AbstractDrawable
