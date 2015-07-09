import Geometry = require('../geometries/Geometry');
/**
 * @author zz85 / https://github.com/zz85
 * Parametric Surfaces Geometry
 * based on the brilliant article by @prideout http://prideout.net/blog/?p=44
 *
 * new ParametricGeometry( parametricFunction, uSegments, vSegments );
 */
declare class ParametricGeometry extends Geometry {
    constructor(parametricFunction: (u: number, v: number) => Vector3, uSegments: number, vSegments: number);
}
export = ParametricGeometry;
