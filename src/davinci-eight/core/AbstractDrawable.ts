import { Facet } from './Facet';
import { Geometry } from './Geometry';
import { Renderable } from './Renderable';
import { Material } from './Material';

/**
 *
 */
export interface AbstractDrawable<G extends Geometry, M extends Material> extends Renderable {

    /**
     *
     */
    name: string;

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
    geometry: G;

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
    material: M;

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
    bind(): AbstractDrawable<G, M>;

    /**
     * Calls the underlying drawArrays or drawElements method on the WebGLRenderingContext.
     */
    draw(): AbstractDrawable<G, M>;

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
    render(ambients: Facet[]): AbstractDrawable<G, M>;

    /**
     * 
     */
    setAmbients(ambients: Facet[]): AbstractDrawable<G, M>;

    /**
     * 
     */
    setUniforms(): AbstractDrawable<G, M>;

    /**
     * A convenience method for geometry.unbind(material).
     */
    unbind(): AbstractDrawable<G, M>;

    /**
     * A convenience method for material.use().
     */
    use(): AbstractDrawable<G, M>;
}
