import GeometryElements = require('../geometries/GeometryElements');
import GeometryMeta = require('../geometries/GeometryMeta');
import Simplex = require('../geometries/Simplex');
declare function toGeometryData(simplices: Simplex[], geometryMeta?: GeometryMeta): GeometryElements;
export = toGeometryData;
