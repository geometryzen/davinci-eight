import {Facet} from './Facet';
import {Geometry} from './Geometry';
import {Renderable} from './Renderable';
import {Material} from './Material';

/**
 *
 */
export interface AbstractDrawable extends Renderable {

    /**
     *
     */
    name: string;

    /**
     * <p>
     * A shortcut to the <code>material.fragmentShaderSrc</code> property.
     * </p>
     *
     */
    fragmentShaderSrc: string;

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
     */
    geometry: Geometry;

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
     */
    material: Material;

    /**
     * A shortcut to the <code>material.vertexShaderSrc</code> property.
     */
    vertexShaderSrc: string;

    /**
     * Determines whether this object will be drawn.
     */
    visible: boolean;

    /**
     * Determines when this object will be drawn.
     * Transparent objects should be rendered after non-transparent objects.
     */
    transparent: boolean;

    /**
     * A convenience method for geometry.bind(material).
     */
    bind(): AbstractDrawable;

    /**
     * Calls the underlying drawArrays or drawElements method on the WebGLRenderingContext.
     * The use of the ambients parameter with this method is deprecated.
     */
    draw(ambients?: Facet[]): AbstractDrawable;

    /**
     * High-Level rendering convenience method equivalent to...
     *
     * use()
     * bind()
     * setAmbients(ambients)
     * setUniforms()
     * draw()
     * unbind()
     */
    render(ambients: Facet[]): AbstractDrawable;

    /**
     * 
     */
    setAmbients(ambients: Facet[]): AbstractDrawable;

    /**
     * 
     */
    setUniforms(): AbstractDrawable;

    /**
     * A convenience method for geometry.unbind(material).
     */
    unbind(): AbstractDrawable;

    /**
     * A convenience method for material.use().
     */
    use(): AbstractDrawable;
}
