import Primitive from '../geometries/Primitive';

interface IGeometry<T> {
    setPosition(position: { x: number, y: number, z: number }): T
    toPrimitives(): Primitive[];
    enableTextureCoords(enable: boolean): T
}

export default IGeometry;
