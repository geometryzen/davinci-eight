import GeometryData = require('../dfx/GeometryData');
import GeometryMeta = require('../dfx/GeometryMeta');
import Simplex = require('../dfx/Simplex');
declare function toGeometryData(geometry: Simplex[], geometryInfo?: GeometryMeta): GeometryData;
export = toGeometryData;
