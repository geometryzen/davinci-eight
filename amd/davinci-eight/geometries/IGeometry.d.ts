import Cartesian3 = require('../math/Cartesian3');
import DrawPrimitive = require('../geometries/DrawPrimitive');
interface IGeometry<T> {
    setPosition(position: Cartesian3): T;
    toPrimitives(): DrawPrimitive[];
    enableTextureCoords(enable: boolean): T;
}
export = IGeometry;
