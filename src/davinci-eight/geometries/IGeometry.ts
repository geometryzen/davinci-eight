import DrawPrimitive = require('../geometries/DrawPrimitive')

interface IGeometry {
  regenerate(): void;
  toPrimitives(): DrawPrimitive[];
}
export = IGeometry