import SerialGeometryElements = require('../dfx/SerialGeometryElements');
import GeometryMeta = require('../dfx/GeometryMeta');
import Simplex = require('../dfx/Simplex');
declare function toSerialGeometryElements(simplices: Simplex[], geometryMeta?: GeometryMeta): SerialGeometryElements;
export = toSerialGeometryElements;
