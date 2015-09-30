import GeometryData = require('../geometries/GeometryData');
import GeometryMeta = require('../geometries/GeometryMeta');
import Simplex = require('../geometries/Simplex');
declare function toGeometryData(simplices: Simplex[], geometryMeta?: GeometryMeta): GeometryData;
export = toGeometryData;
