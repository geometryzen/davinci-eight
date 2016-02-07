import Composite from '../scene/Composite'
import ColorFacet from '../facets/ColorFacet';
import Color from '../core/Color';
import GraphicsBuffers from '../scene/GraphicsBuffers';
import G3 from '../math/G3';
import ShareableWebGLProgram from '../core/ShareableWebGLProgram';
import ModelFacet from '../facets/ModelFacet';
import VisualComponent from './VisualComponent'

const COLOR_FACET_NAME = 'color';
const MODEL_FACET_NAME = 'model';

export default class RigidBody extends Composite implements VisualComponent {
    constructor(buffers: GraphicsBuffers, program: ShareableWebGLProgram, type: string) {
        super(buffers, program, type)

        const modelFacet = new ModelFacet();
        this.setFacet(MODEL_FACET_NAME, modelFacet);
        modelFacet.release();

        const colorFacet = new ColorFacet();
        this.setFacet(COLOR_FACET_NAME, colorFacet);
        colorFacet.release();
    }
    protected destructor(): void {
        super.destructor();
    }
    get color() {
        const facet = <ColorFacet>this.getFacet(COLOR_FACET_NAME);
        const color = facet.color;
        facet.release();
        return color;
    }
    set color(color: Color) {
        const facet = <ColorFacet>this.getFacet(COLOR_FACET_NAME);
        facet.color.copy(color);
        facet.release();
    }
    get R() {
        const model = <ModelFacet>this.getFacet(MODEL_FACET_NAME);
        const R = model.R;
        model.release();
        return R;
    }
    set R(R: G3) {
        const model = <ModelFacet>this.getFacet(MODEL_FACET_NAME);
        model.R.copy(R);
        model.release();
    }
    get X() {
        const model = <ModelFacet>this.getFacet(MODEL_FACET_NAME);
        const X = model.X;
        model.release();
        return X;
    }
    set X(X: G3) {
        const model = <ModelFacet>this.getFacet(MODEL_FACET_NAME);
        model.X.copyVector(X);
        model.release();
    }
}
