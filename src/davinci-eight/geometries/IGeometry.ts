import VectorE3 = require('../math/VectorE3')
import DrawPrimitive = require('../geometries/DrawPrimitive')

interface IGeometry<T> {
  setPosition(position: VectorE3): T
  toPrimitives(): DrawPrimitive[];
  enableTextureCoords(enable: boolean): T
}
export = IGeometry