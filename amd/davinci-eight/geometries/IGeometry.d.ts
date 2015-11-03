import DrawPrimitive = require('../geometries/DrawPrimitive');
interface IGeometry<T> {
    setPosition(position: {
        x: number;
        y: number;
        z: number;
    }): T;
    toPrimitives(): DrawPrimitive[];
    enableTextureCoords(enable: boolean): T;
}
export = IGeometry;
