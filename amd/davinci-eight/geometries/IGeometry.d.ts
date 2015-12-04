import Primitive = require('../geometries/Primitive');
interface IGeometry<T> {
    setPosition(position: {
        x: number;
        y: number;
        z: number;
    }): T;
    toPrimitives(): Primitive[];
    enableTextureCoords(enable: boolean): T;
}
export = IGeometry;
