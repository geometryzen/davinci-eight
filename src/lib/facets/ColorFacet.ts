import { mustBeNumber } from "../checks/mustBeNumber";
import { Color } from "../core/Color";
import { Facet } from "../core/Facet";
import { FacetVisitor } from "../core/FacetVisitor";
import { GraphicsProgramSymbols } from "../core/GraphicsProgramSymbols";

/**
 * Sets the 'uColor' uniform to the color RGB value.
 */
export class ColorFacet implements Facet {
    /**
     * @hidden
     */
    public static PROP_RGB = "rgb";

    /**
     * @hidden
     */
    public static PROP_RED = "r";

    /**
     * @hidden
     */
    public static PROP_GREEN = "g";

    /**
     * @hidden
     */
    public static PROP_BLUE = "b";

    /**
     *
     */
    public color = Color.fromRGB(1, 1, 1);

    /**
     * @param uColorName The name of the WebL uniform that this facet will affect.
     */
    constructor(public uColorName = GraphicsProgramSymbols.UNIFORM_COLOR) {}

    /**
     * The red component of the color.
     */
    get r(): number {
        return this.color.r;
    }
    set r(r: number) {
        mustBeNumber("r", r);
        this.color.r = r;
    }

    /**
     * The green component of the color.
     */
    get g(): number {
        return this.color.g;
    }
    set g(g: number) {
        mustBeNumber("g", g);
        this.color.g = g;
    }

    /**
     * The blue component of the color.
     */
    get b(): number {
        return this.color.b;
    }
    set b(b: number) {
        mustBeNumber("b", b);
        this.color.b = b;
    }

    scaleRGB(α: number): this {
        this.r *= α;
        this.g *= α;
        this.b *= α;
        return this;
    }

    setRGB(r: number, g: number, b: number): this {
        this.r = r;
        this.g = g;
        this.b = b;
        return this;
    }

    /**
     *
     */
    setUniforms(visitor: FacetVisitor): void {
        const uColorName = this.uColorName;
        if (uColorName) {
            const color = this.color;
            visitor.uniform3f(uColorName, color.r, color.g, color.b);
        }
    }
}
