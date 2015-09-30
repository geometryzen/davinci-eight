import GeometryMeta = require('../geometries/GeometryMeta');
import Simplex = require('../geometries/Simplex');
/**
 * Returns undefined (void 0) for an empty geometry.
 */
declare function toGeometryMeta(geometry: Simplex[]): GeometryMeta;
export = toGeometryMeta;
