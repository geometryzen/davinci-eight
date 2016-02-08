import Primitive from '../core/Primitive';

interface IPrimitivesBuilder<T> {
    setPosition(position: { x: number, y: number, z: number }): T
    toPrimitives(): Primitive[];
    enableTextureCoords(enable: boolean): T
}

export default IPrimitivesBuilder;
