import DrawPrimitive = require('../geometries/DrawPrimitive');
import GeometryMeta = require('../geometries/GeometryMeta');
import Simplex = require('../geometries/Simplex');
declare function simplicesToDrawPrimitive(simplices: Simplex[], geometryMeta?: GeometryMeta): DrawPrimitive;
export = simplicesToDrawPrimitive;
