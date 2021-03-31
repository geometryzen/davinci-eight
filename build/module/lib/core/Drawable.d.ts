import { ContextManager } from '../core/ContextManager';
import { Facet } from '../core/Facet';
import { ShareableContextConsumer } from '../core/ShareableContextConsumer';
import { AbstractDrawable } from './AbstractDrawable';
import { Geometry } from './Geometry';
import { Material } from './Material';
/**
 * This class may be used as either a base class or standalone.
 */
export declare class Drawable<G extends Geometry, M extends Material> extends ShareableContextConsumer implements AbstractDrawable<G, M> {
    name: string;
    /**
     * The (private) reference to an instance that extends Geometry.
     */
    private _geometry;
    /**
     * The (private) reference to an instance that extends Material.
     */
    private _material;
    private _visible;
    private _transparent;
    private facetMap;
    /**
     *
     */
    constructor(geometry: G, material: M, contextManager: ContextManager, levelUp?: number);
    /**
     * @hidden
     */
    protected resurrector(levelUp: number): void;
    /**
     * @hidden
     */
    protected destructor(levelUp: number): void;
    get opacity(): number;
    set opacity(newOpacity: number);
    get pointSize(): number;
    set pointSize(newPointSize: number);
    /**
     * A convenience method for calling geometry.bind(material).
     */
    bind(): Drawable<G, M>;
    /**
     * Sets the Material uniforms from the Facets of this composite object.
     */
    setUniforms(): Drawable<G, M>;
    /**
     *
     */
    draw(): Drawable<G, M>;
    contextFree(): void;
    contextGain(): void;
    contextLost(): void;
    /**
     * @param name The name of the Facet.
     */
    getFacet(name: string): Facet;
    /**
     * A convenience method for performing all of the methods required for rendering.
     * The following methods are called in order.
     * use()
     * bind()
     * setAmbients(ambients)
     * setUniforms()
     * draw()
     * unbind()
     * In particle simulations it may be useful to call the underlying methods directly.
     */
    render(ambients: Facet[]): Drawable<G, M>;
    /**
     * Updates the Material uniforms from the ambient Facets argument.
     */
    setAmbients(ambients: Facet[]): Drawable<G, M>;
    removeFacet(name: string): Facet;
    /**
     * @param name The name of the Facet.
     * @param facet The Facet.
     */
    setFacet(name: string, facet: Facet): void;
    unbind(): Drawable<G, M>;
    use(): Drawable<G, M>;
    /**
     * Provides a reference counted reference to the geometry property.
     * Getting the geometry property will cause the
     */
    get geometry(): G;
    set geometry(geometry: G);
    /**
     * Provides a reference counted reference to the material property.
     */
    get material(): M;
    set material(material: M);
    /**
     * @default true
     */
    get visible(): boolean;
    set visible(visible: boolean);
    /**
     * @default false
     */
    get transparent(): boolean;
    set transparent(transparent: boolean);
}
