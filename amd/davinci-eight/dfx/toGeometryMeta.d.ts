import GeometryMeta = require('../dfx/GeometryMeta');
import Simplex = require('../dfx/Simplex');
/**
 * Returns undefined (void 0) for an empty geometry.
 */
declare function toGeometryMeta(geometry: Simplex[]): GeometryMeta;
export = toGeometryMeta;
