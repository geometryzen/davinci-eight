import Color from '../core/Color';
import Cylinder from './Cylinder';
import ColorFacet from '../facets/ColorFacet';
import Drawable from '../scene/Drawable';
import Facet from '../core/Facet';
import G3 from '../math/G3';
import IContextProvider from '../core/IContextProvider';
import ModelFacet from '../facets/ModelFacet';
import readOnly from '../i18n/readOnly';
import visualCache from './visualCache';

const COLOR_FACET_NAME = 'color';
const MODEL_FACET_NAME = 'model';

export default function(): Cylinder {
    const axis = G3.e2.clone();
    let graphicsBuffers = visualCache.cylinder();
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

    const axisHandler = function(eventName: string, key: string, value: number, source: G3) {
        const model = <ModelFacet>drawable.getFacet(MODEL_FACET_NAME);
        const R = model.R;
        R.rotorFromDirections(axis, G3.e2);
        model.release();
    };

    axis.on('change', axisHandler);

    const arrow: Cylinder = {
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
        set R(unused) {
            throw new Error(readOnly('R').message);
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
        get axis() {
            // Somehow need to keep attitude updated when the axis changes.
            return axis;
        },
        set axis(value: G3) {
            axis.copy(value);
            // throw new Error(readOnly('axis').message);
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
            const refCount = drawable.release();
            if (refCount === 0) {
                axis.off('change', axisHandler);
            }
            return refCount;
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

    return arrow;
}
