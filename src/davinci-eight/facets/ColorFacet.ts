import Color = require('../core/Color')
import Mat3R = require('../math/Mat3R')
import Mat4R = require('../math/Mat4R')
import mustBeNumber = require('../checks/mustBeNumber')
import Shareable = require('../utils/Shareable')
import SpinG3 = require('../math/SpinG3')
import GraphicsProgramSymbols = require('../core/GraphicsProgramSymbols')
import IFacet = require('../core/IFacet')
import ColorRGB = require('../core/ColorRGB')
import ColorRGBA = require('../core/ColorRGBA')
import IFacetVisitor = require('../core/IFacetVisitor')
import IAnimationTarget = require('../slideshow/IAnimationTarget')
import IUnknownExt = require('../core/IUnknownExt')

let COORD_R = 0
let COORD_G = 1
let COORD_B = 2

/**
 * @class ColorFacet
 */
class ColorFacet extends Shareable implements ColorRGBA, IFacet, IAnimationTarget, IUnknownExt<ColorFacet> {
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
    public static PROP_RED = 'red';

    /**
     * property PROP_GREEN
     * @type {string}
     * @static
     */
    public static PROP_GREEN = 'green';

    /**
     * property PROP_BLUE
     * @type {string}
     * @static
     */
    public static PROP_BLUE = 'blue';

    /**
     * property PROP_ALPHA
     * @type {string}
     * @static
     */
    public static PROP_ALPHA = 'alpha';

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
     * @method setColorRGB
     * @param color {ColorRGB}
     * @return {ColorFacet}
     * @chainable
     */
    setColorRGB(color: ColorRGB): ColorFacet {
        this.r = color.r
        this.g = color.g
        this.b = color.b
        return this
    }


    /**
     * @method setColorRGBA
     * @param color {ColorRGBA}
     * @return {ColorFacet}
     * @chainable
     */
    setColorRGBA(color: ColorRGBA): ColorFacet {
        this.r = color.r
        this.g = color.g
        this.b = color.b
        this.α = color.α
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
                console.warn("ColorFacet.getProperty " + name)
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
                console.warn("ColorFacet.setProperty " + name)
            }
        }
    }

    /**
     * @method setUniforms
     * @param visitor {IFacetVisitor}
     * @param [canvasId] {number}
     * @return {void}
     */
    setUniforms(visitor: IFacetVisitor, canvasId?: number): void {
        if (this.uColorName) {
            visitor.vector3(this.uColorName, this.xyz, canvasId)
        }
        if (this.uAlphaName) {
            visitor.uniform1f(this.uAlphaName, this.a, canvasId)
        }
    }
}

export = ColorFacet
