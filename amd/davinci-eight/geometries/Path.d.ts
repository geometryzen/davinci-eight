import CurvePath = require('../curves/CurvePath');
import Euclidean3 = require('../math/Euclidean3');
import PathAction = require('../geometries/PathAction');
import PathArgs = require('../geometries/PathArgs');
import Shape = require('../geometries/Shape');
/**
 * @class Path
 */
declare class Path extends CurvePath {
    actions: PathAction[];
    private useSpacedPoints;
    /**
     * <code>Path</code> is a utility for buiding a <em>path</em> of points.
     * @class Path
     * @constructor
     */
    constructor(points?: Euclidean3[]);
    /**
     * @method fromPoints
     * @return {void}
     */
    fromPoints(points: Euclidean3[]): void;
    /**
     * @method getSpacedPoints
     * @param [divisions = 40] {number}
     * @param closedPath [boolean]
     * @return {Euclidean3[]}
     */
    getSpacedPoints(divisions?: number, closedPath?: boolean): Euclidean3[];
    /**
     * @method getPoints
     * @param [divisiions = 12] {number}
     * @param closedPath [boolean]
     * @return {Euclidean3[]}
     */
    getPoints(divisions?: number, closedPath?: boolean): Euclidean3[];
    execute(action: string, args: PathArgs): void;
    /**
     * @method moveTo
     * @param point {Euclidean3}
     * @return {void}
     */
    moveTo(point: Euclidean3): void;
    /**
     * @method lineTo
     * @param point {Euclidean3}
     * @return {void}
     */
    lineTo(point: Euclidean3): void;
    /**
     * @method quadraticCurveTo
     * @param controlPoint {Euclidean3}
     * @param endPoint {Euclidean3}
     * @return {void}
     */
    quadraticCurveTo(controlPoint: Euclidean3, point: Euclidean3): void;
    /**
     * @method bezierCurveTo
     * @param controlBegin {Euclidean3}
     * @param controlEnd {Euclidean3}
     * @param endPoint {Euclidean3}
     * @return {void}
     */
    bezierCurveTo(controlBegin: Euclidean3, controlEnd: Euclidean3, point: Euclidean3): void;
    toShapes(isCCW?: boolean, noHoles?: boolean): Shape[];
}
export = Path;
