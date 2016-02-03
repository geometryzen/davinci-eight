import Sphere from './Sphere';
import Color from '../core/Color';
import ColorFacet from '../facets/ColorFacet';
import Drawable from '../scene/Drawable';
import Facet from '../core/Facet';
import G3 from '../math/G3';
import IContextProvider from '../core/IContextProvider';
import ModelFacet from '../facets/ModelFacet';
import mustBeNumber from '../checks/mustBeNumber';
import readOnly from '../i18n/readOnly';
import VectorE3 from '../math/VectorE3';
import visualCache from './visualCache';

const COLOR_FACET_NAME = 'color';
const MODEL_FACET_NAME = 'model';

export default function(axis: VectorE3): Sphere {
    let graphicsBuffers = visualCache.sphere();
    let graphicsProgram = visualCache.program();
    const drawable = new Drawable(graphicsBuffers, graphicsProgram);
    graphicsBuffers.release();
    graphicsBuffers = void 0;
    graphicsProgram.release();
    graphicsProgram = void 0;

    let modelFacet = new ModelFacet();
    drawable.setFacet(MODEL_FACET_NAME, modelFacet);
    modelFacet.release();
    modelFacet = void 0;

    let colorFacet = new ColorFacet();
    drawable.setFacet(COLOR_FACET_NAME, colorFacet);
    colorFacet.release();
    colorFacet = void 0;

    const sphere: Sphere = {
        get color() {
            const facet = <ColorFacet>drawable.getFacet(COLOR_FACET_NAME);
            const color = facet.color;
            facet.release();
            return color;
        },
        set color(color: Color) {
            const facet = <ColorFacet>drawable.getFacet(COLOR_FACET_NAME);
            facet.color.copy(color);
            facet.release();
        },
        get graphicsProgram() {
            return drawable.graphicsProgram;
        },
        set graphicsProgram(unused) {
            throw new Error(readOnly('graphicsProgram').message);
        },
        get name() {
            return drawable.name;
        },
        set name(value: string) {
            drawable.name = value;
        },
        get R() {
            const model = <ModelFacet>drawable.getFacet(MODEL_FACET_NAME);
            const R = model.R;
            model.release();
            return R;
        },
        set R(R: G3) {
            const model = <ModelFacet>drawable.getFacet(MODEL_FACET_NAME);
            model.R.copy(R);
            model.release();
        },
        get X() {
            const model = <ModelFacet>drawable.getFacet(MODEL_FACET_NAME);
            const X = model.X;
            model.release();
            return X;
        },
        set X(X: G3) {
            const model = <ModelFacet>drawable.getFacet(MODEL_FACET_NAME);
            model.X.copyVector(X);
            model.release();
        },
        get radius() {
            const model = <ModelFacet>drawable.getFacet(MODEL_FACET_NAME);
            const radius = model.scaleXYZ.x;
            model.release();
            return radius;
        },
        set radius(radius: number) {
            mustBeNumber('radius', radius);
            const model = <ModelFacet>drawable.getFacet(MODEL_FACET_NAME);
            model.scaleXYZ.x = radius;
            model.scaleXYZ.y = radius;
            model.scaleXYZ.z = radius;
            model.release();
        },
        getFacet(name: string): Facet {
            return drawable.getFacet(name);
        },
        setFacet(name: string, facet: Facet): void {
            drawable.setFacet(name, facet);
        },
        draw(canvasId?: number): void {
            return drawable.draw(canvasId);
        },
        addRef(): number {
            return drawable.addRef();
        },
        release(): number {
            return drawable.release();
        },
        contextFree(canvasId?: number): void {
            return drawable.contextFree(canvasId);
        },
        contextGain(manager: IContextProvider): void {
            return drawable.contextGain(manager);
        },
        contextLost(canvasId?: number): void {
            return drawable.contextLost(canvasId);
        }
    };

    return sphere;
}
