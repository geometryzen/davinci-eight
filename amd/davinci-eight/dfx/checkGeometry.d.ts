import GeometryInfo = require('../dfx/GeometryInfo');
import Simplex = require('../dfx/Simplex');
/**
 * Returns undefined (void 0) for an empty geometry.
 */
declare function checkGeometry(geometry: Simplex[]): GeometryInfo;
export = checkGeometry;
