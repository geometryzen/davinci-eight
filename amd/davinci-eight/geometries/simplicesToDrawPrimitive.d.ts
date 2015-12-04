import GeometryMeta = require('../geometries/GeometryMeta');
import Primitive = require('../geometries/Primitive');
import Simplex = require('../geometries/Simplex');
declare function simplicesToDrawPrimitive(simplices: Simplex[], geometryMeta?: GeometryMeta): Primitive;
export = simplicesToDrawPrimitive;
