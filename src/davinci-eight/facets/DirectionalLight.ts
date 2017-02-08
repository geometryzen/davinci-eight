import Color from '../core/Color';
import Facet from '../core/Facet';
import FacetVisitor from '../core/FacetVisitor';
import Geometric3 from '../math/Geometric3';
import mustBeObject from '../checks/mustBeObject';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import VectorE3 from '../math/VectorE3';
import Vector3 from '../math/Vector3';

/**
 *
 */
export class DirectionalLight implements Facet {

    private readonly direction_: Geometric3;
    private readonly color_: Color;

    constructor(direction: VectorE3 = Vector3.vector(0, 0, 1).neg(), color: { r: number; g: number; b: number } = Color.white) {
        mustBeObject('direction', direction);
        mustBeObject('color', color);
        this.direction_ = Geometric3.fromVector(direction).normalize();
        this.color_ = Color.copy(color);
    }

    get color(): Color {
        return this.color_;
    }
    set color(color: Color) {
        this.color_.copy(Color.mustBe('color', color));
    }

    get direction(): Geometric3 {
        return this.direction_;
    }
    set direction(direction: Geometric3) {
        mustBeObject('direction', direction);
        this.direction_.copy(direction);
    }

    setUniforms(visitor: FacetVisitor): void {
        const direction = this.direction_;
        visitor.uniform3f(GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION, direction.x, direction.y, direction.z);
        const color = this.color_;
        visitor.uniform3f(GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR, color.r, color.g, color.b);
    }
}

export default DirectionalLight;
