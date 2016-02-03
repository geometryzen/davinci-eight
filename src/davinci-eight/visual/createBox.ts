import Box from './Box';
import Color from '../core/Color';
import ColorFacet from '../facets/ColorFacet';
import Drawable from '../scene/Drawable';
import Facet from '../core/Facet';
import G3 from '../math/G3';
import IContextProvider from '../core/IContextProvider';
import ModelFacet from '../facets/ModelFacet';
import mustBeNumber from '../checks/mustBeNumber';
import readOnly from '../i18n/readOnly';
import visualCache from './visualCache';

const COLOR_FACET_NAME = 'color';
const MODEL_FACET_NAME = 'model';

export default function(): Box {
    let graphicsBuffers = visualCache.box();
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

    const box: Box = {
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
            model.R.copySpinor(R);
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
        get width() {
            const model = <ModelFacet>drawable.getFacet(MODEL_FACET_NAME);
            const width = model.scaleXYZ.x;
            model.release();
            return width;
        },
        set width(width: number) {
            mustBeNumber('width', width);
            const model = <ModelFacet>drawable.getFacet(MODEL_FACET_NAME);
            model.scaleXYZ.x = width;
            model.release();
        },
        get height() {
            const model = <ModelFacet>drawable.getFacet(MODEL_FACET_NAME);
            const height = model.scaleXYZ.y;
            model.release();
            return height;
        },
        set height(height: number) {
            mustBeNumber('height', height);
            const model = <ModelFacet>drawable.getFacet(MODEL_FACET_NAME);
            model.scaleXYZ.y = height;
            model.release();
        },
        get depth() {
            const model = <ModelFacet>drawable.getFacet(MODEL_FACET_NAME);
            const depth = model.scaleXYZ.z;
            model.release();
            return depth;
        },
        set depth(depth: number) {
            mustBeNumber('depth', depth);
            const model = <ModelFacet>drawable.getFacet(MODEL_FACET_NAME);
            model.scaleXYZ.z = depth;
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

    return box;
}
