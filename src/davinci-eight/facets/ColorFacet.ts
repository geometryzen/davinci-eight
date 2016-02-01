import Color from '../core/Color';
import core from '../core';
import Mat3R from '../math/Mat3R';
import Mat4R from '../math/Mat4R';
import mustBeNumber from '../checks/mustBeNumber';
import Shareable from '../utils/Shareable';
import SpinG3 from '../math/SpinG3';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import Facet from '../core/Facet';
import FacetVisitor from '../core/FacetVisitor';
import IAnimationTarget from '../slideshow/IAnimationTarget';
import IUnknownExt from '../core/IUnknownExt';

const COORD_R = 0
const COORD_G = 1
const COORD_B = 2

function checkPropertyName(name: string): void {
    if (typeof name !== 'string') {
        const msg = "ColorFacet property 'name' must be a string.";
        if (core.strict) {
            throw new TypeError(msg);
        }
        else {
            console.warn(msg);
        }
    }
    switch (name) {
        case ColorFacet.PROP_RGB: return;
        default: {
            const msg = `ColorFacet property 'name' must be one of ${[ColorFacet.PROP_RGB, ColorFacet.PROP_RGBA, ColorFacet.PROP_RED, ColorFacet.PROP_GREEN, ColorFacet.PROP_BLUE, ColorFacet.PROP_ALPHA]}.`;
            if (core.strict) {
                throw new Error(msg);
            }
            else {
                console.warn(msg);
            }
        }
    }
}

/**
 * @class ColorFacet
 */
export default class ColorFacet extends Shareable implements Facet, IAnimationTarget, IUnknownExt<ColorFacet> {
    /**
     * property PROP_RGB
     * @type {string}
     * @static
     */
    public static PROP_RGB = 'rgb';

    /**
     * property PROP_RGBA
     * @type {string}
     * @static
     */
    public static PROP_RGBA = 'rgba';

    /**
     * property PROP_RED
     * @type {string}
     * @static
     */
    public static PROP_RED = 'r';

    /**
     * property PROP_GREEN
     * @type {string}
     * @static
     */
    public static PROP_GREEN = 'g';

    /**
     * property PROP_BLUE
     * @type {string}
     * @static
     */
    public static PROP_BLUE = 'b';

    /**
     * property PROP_ALPHA
     * @type {string}
     * @static
     */
    public static PROP_ALPHA = 'a';

    /**
     * @property xyz
     * @type {number[]}
     * @private
     */
    private xyz: number[] = [1, 1, 1];
    /**
     * @property a
     * @type {number}
     * @private
     */
    private a: number = 1;

    /**
     * The name of the GLSL uniform variable that will be set.
     * @property uAlphaName
     * @type {string}
     * @optional
     */
    public uAlphaName: string;

    /**
     * @property uColorName
     * @type {string}
     * @optional
     */
    public uColorName: string;

    /**
     * @class ColorFacet
     * @constructor
     */
    constructor() {
        super('ColorFacet')
        this.uColorName = GraphicsProgramSymbols.UNIFORM_COLOR
        this.uAlphaName = GraphicsProgramSymbols.UNIFORM_ALPHA
    }

    /**
     * @method destructor
     * @return {void}
     * @protected
     */
    protected destructor(): void {
        this.xyz = void 0
        super.destructor()
    }

    incRef(): ColorFacet {
        this.addRef()
        return this
    }

    decRef(): ColorFacet {
        this.release()
        return this
    }

    /**
     * The red component of the color.
     * @property r
     * @type {number}
     */
    get r(): number {
        return this.xyz[COORD_R]
    }
    set r(red: number) {
        mustBeNumber('red', red)
        this.xyz[COORD_R] = red
    }

    /**
     * The green component of the color.
     * @property g
     * @type {number}
     */
    get g(): number {
        return this.xyz[COORD_G]
    }
    set g(green: number) {
        mustBeNumber('green', green)
        this.xyz[COORD_G] = green
    }

    /**
     * The blue component of the color.
     * @property b
     * @type {number}
     */
    get b(): number {
        return this.xyz[COORD_B]
    }
    set b(blue: number) {
        this.xyz[COORD_B] = blue
    }

    /**
     * The alpha component of the color.
     * @property α
     * @type {number}
     */
    get α(): number {
        return this.a
    }
    set α(α: number) {
        this.a = α
    }

    /**
     * @method scaleRGB
     * @param α {number}
     * @return {ColorFacet}
     * @chainable
     */
    scaleRGB(α: number): ColorFacet {
        this.r *= α
        this.g *= α
        this.b *= α
        return this
    }

    /**
     * @method scaleRGBA
     * @param α {number}
     * @return {ColorFacet}
     * @chainable
     */
    scaleRGBA(α: number): ColorFacet {
        this.r *= α
        this.g *= α
        this.b *= α
        this.α *= α
        return this
    }

    /**
     * @method setRGB
     * @param red {number}
     * @param green {number}
     * @param blue {number}
     * @return {ColorFacet}
     * @chainable
     */
    setRGB(red: number, green: number, blue: number): ColorFacet {
        this.r = red
        this.g = green
        this.b = blue
        return this
    }


    /**
     * @method setRGBA
     * @param red {number}
     * @param green {number}
     * @param blue {number}
     * @param α {number}
     * @return {ColorFacet}
     * @chainable
     */
    setRGBA(red: number, green: number, blue: number, α: number): ColorFacet {
        this.r = red
        this.g = green
        this.b = blue
        this.α = α
        return this
    }

    /**
     * @method getProperty
     * @param name {string}
     * @return {number[]}
     */
    getProperty(name: string): number[] {
        checkPropertyName(name);
        switch (name) {
            case ColorFacet.PROP_RGB: {
                return [this.r, this.g, this.b]
            }
            case ColorFacet.PROP_RED: {
                return [this.r]
            }
            case ColorFacet.PROP_GREEN: {
                return [this.g]
            }
            default: {
                return void 0
            }
        }
    }

    /**
     * @method setProperty
     * @param name {string}
     * @param data {number[]}
     * @return {void}
     */
    setProperty(name: string, data: number[]): void {
        checkPropertyName(name);
        switch (name) {
            case ColorFacet.PROP_RGB: {
                this.r = data[COORD_R]
                this.g = data[COORD_G]
                this.b = data[COORD_B]
                break
            }
            case ColorFacet.PROP_RED: {
                this.r = data[COORD_R]
                break
            }
            default: {
            }
        }
    }

    /**
     * @method setUniforms
     * @param visitor {FacetVisitor}
     * @param [canvasId] {number}
     * @return {void}
     */
    setUniforms(visitor: FacetVisitor, canvasId?: number): void {
        if (this.uColorName) {
            visitor.vector3(this.uColorName, this.xyz, canvasId)
        }
        if (this.uAlphaName) {
            visitor.uniform1f(this.uAlphaName, this.a, canvasId)
        }
    }
}
