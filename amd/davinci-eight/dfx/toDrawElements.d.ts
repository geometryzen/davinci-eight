import DrawElements = require('../dfx/DrawElements');
import GeometryInfo = require('../dfx/GeometryInfo');
import Simplex = require('../dfx/Simplex');
declare function toDrawElements(geometry: Simplex[], geometryInfo?: GeometryInfo): DrawElements;
export = toDrawElements;
