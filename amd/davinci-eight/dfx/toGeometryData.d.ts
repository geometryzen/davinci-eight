import GeometryData = require('../dfx/GeometryData');
import GeometryMeta = require('../dfx/GeometryMeta');
import Simplex = require('../dfx/Simplex');
declare function toGeometryData(simplices: Simplex[], geometryMeta?: GeometryMeta): GeometryData;
export = toGeometryData;
