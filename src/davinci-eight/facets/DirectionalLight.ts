import {Color} from '../core/Color';
import {Facet} from '../core/Facet';
import {FacetVisitor} from '../core/FacetVisitor';
import {Geometric3} from '../math/Geometric3';
import mustBeObject from '../checks/mustBeObject';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import VectorE3 from '../math/VectorE3';
import Vector3 from '../math/Vector3';

/**
 *
 */
export class DirectionalLight implements Facet {
    /**
     * The name of the property that designates the color.
     * @default 'color'
     */
    public static PROP_COLOR = 'color';

    /**
     * The name of the property that designates the direction.
     * @default 'direction'
     */
    public static PROP_DIRECTION = 'direction';

    /**
     *
     */
    private _direction: Geometric3;

    /**
     *
     */
    public _color: Color;

    /**
     *
     * @param direction
     * @param color
     */
    constructor(direction: VectorE3 = Vector3.vector(0, 0, 1).neg(), color: { r: number; g: number; b: number } = Color.white) {
        mustBeObject('direction', direction)
        mustBeObject('color', color)
        this._direction = Geometric3.fromVector(direction).normalize()
        this._color = Color.copy(color)
    }

    /**
     *
     */
    get color(): Color {
        return this._color
    }
    set color(color: Color) {
        this._color.copy(Color.mustBe('color', color))
    }

    /**
     *
     */
    get direction(): Geometric3 {
        return this._direction;
    }
    set direction(direction: Geometric3) {
        mustBeObject('direction', direction);
        this._direction.copy(direction);
    }

    /**
     * @param color
     * @returns this
     */
    setColor(color: { r: number; g: number; b: number }): DirectionalLight {
        mustBeObject('color', color);
        this._color.copy(color);
        return this;
    }

    /**
     * @param direction
     * @returns this
     */
    setDirection(direction: VectorE3): DirectionalLight {
        mustBeObject('direction', direction);
        this._direction.copyVector(direction).normalize();
        return this;
    }

    /**
     * @param visitor
     */
    setUniforms(visitor: FacetVisitor): void {
        const direction = this._direction;
        visitor.uniform3f(GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION, direction.x, direction.y, direction.z);
        const color = this.color;
        visitor.uniform3f(GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR, color.r, color.g, color.b);
    }
}
