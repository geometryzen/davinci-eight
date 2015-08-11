import Geometry = require('../geometries/Geometry');
import Cartesian3 = require('../math/Cartesian3');
/**
 * @author zz85 / https://github.com/zz85
 * Parametric Surfaces Geometry
 * based on the brilliant article by @prideout http://prideout.net/blog/?p=44
 *
 * new ParametricSurfaceGeometry( parametricFunction, uSegments, vSegments );
 */
declare class ParametricSurfaceGeometry extends Geometry {
    constructor(parametricFunction: (u: number, v: number) => Cartesian3, uSegments: number, vSegments: number);
}
export = ParametricSurfaceGeometry;
