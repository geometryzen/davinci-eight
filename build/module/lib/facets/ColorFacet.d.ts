import { Color } from '../core/Color';
import { Facet } from '../core/Facet';
import { FacetVisitor } from '../core/FacetVisitor';
/**
 * Sets the 'uColor' uniform to the color RGB value.
 */
export declare class ColorFacet implements Facet {
    uColorName: string;
    /**
     * @hidden
     */
    static PROP_RGB: string;
    /**
     * @hidden
     */
    static PROP_RED: string;
    /**
     * @hidden
     */
    static PROP_GREEN: string;
    /**
     * @hidden
     */
    static PROP_BLUE: string;
    /**
     *
     */
    color: Color;
    /**
     * @param uColorName The name of the WebL uniform that this facet will affect.
     */
    constructor(uColorName?: string);
    /**
     * The red component of the color.
     */
    get r(): number;
    set r(r: number);
    /**
     * The green component of the color.
     */
    get g(): number;
    set g(g: number);
    /**
     * The blue component of the color.
     */
    get b(): number;
    set b(b: number);
    scaleRGB(α: number): this;
    setRGB(r: number, g: number, b: number): this;
    /**
     *
     */
    setUniforms(visitor: FacetVisitor): void;
}
