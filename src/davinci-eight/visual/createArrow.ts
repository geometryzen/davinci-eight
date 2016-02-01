import Arrow from './Arrow';
import ArrowGeometry from '../geometries/ArrowGeometry';
import ColorFacet from '../facets/ColorFacet';
import Drawable from '../scene/Drawable';
import Facet from '../core/Facet';
import IContextProvider from '../core/IContextProvider';
import MeshLambertMaterial from '../materials/MeshLambertMaterial';
import ModelFacet from '../facets/ModelFacet';
import readOnly from '../i18n/readOnly';
import VectorE3 from '../math/VectorE3';

export default function(axis: VectorE3): Arrow {
    const geometry = new ArrowGeometry(axis);
    const primitives = geometry.toPrimitives();
    const program = new MeshLambertMaterial();
    const drawable = new Drawable(primitives, program);
    drawable.setFacet('model', new ModelFacet());
    drawable.setFacet('color', new ColorFacet());

    const arrow: Arrow = {
        get material() {
            return drawable.material;
        },
        set material(unused) {
            throw new Error(readOnly('material').message);
        },
        get name() {
            return drawable.name;
        },
        set name(value: string) {
            drawable.name = value;
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

    return arrow;
}
