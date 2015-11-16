var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../curves/CubicBezierCurve', '../curves/CurvePath', '../geometries/isClockWise', '../curves/LineCurve', '../geometries/PathKind', '../curves/QuadraticBezierCurve', '../geometries/Shape'], function (require, exports, CubicBezierCurve, CurvePath, isClockWise, LineCurve, PathKind, QuadraticBezierCurve, Shape) {
    /**
     * @class Path
     */
    var Path = (function (_super) {
        __extends(Path, _super);
        /**
         * <code>Path</code> is a utility for buiding a <em>path</em> of points.
         * @class Path
         * @constructor
         */
        function Path(points) {
            _super.call(this);
            this.actions = [];
            if (points) {
                this.fromPoints(points);
            }
        }
        /**
         * @method fromPoints
         * @return {void}
         */
        Path.prototype.fromPoints = function (points) {
            if (points.length > 0) {
                this.moveTo(points[0]);
                for (var i = 1, iLength = points.length; i < iLength; i++) {
                    this.lineTo(points[i]);
                }
            }
        };
        /**
         * @method getSpacedPoints
         * @param [divisions = 40] {number}
         * @param closedPath [boolean]
         * @return {Euclidean3[]}
         */
        Path.prototype.getSpacedPoints = function (divisions, closedPath) {
            if (divisions === void 0) { divisions = 40; }
            var points = [];
            for (var i = 0; i < divisions; i++) {
                points.push(this.getPoint(i / divisions));
            }
            // if ( closedPath ) {
            //
            //   points.push( points[ 0 ] )
            //
            // }
            return points;
        };
        /**
         * @method getPoints
         * @param [divisiions = 12] {number}
         * @param closedPath [boolean]
         * @return {Euclidean3[]}
         */
        Path.prototype.getPoints = function (divisions, closedPath) {
            if (this.useSpacedPoints) {
                return this.getSpacedPoints(divisions, closedPath);
            }
            divisions = divisions || 12;
            var points = [];
            var beginPoint;
            var controlBegin;
            var endPoint;
            var controlEnd;
            for (var i = 0, il = this.actions.length; i < il; i++) {
                var item = this.actions[i];
                var action = item.action;
                var data = item.data;
                switch (action) {
                    case PathKind.MOVE_TO:
                        points.push(data.endPoint);
                        break;
                    case PathKind.LINE_TO:
                        points.push(data.endPoint);
                        break;
                    case PathKind.QUADRATIC_CURVE_TO:
                        controlBegin = data.controlBegin;
                        endPoint = data.endPoint;
                        if (points.length > 0) {
                            beginPoint = points[points.length - 1];
                        }
                        else {
                            beginPoint = this.actions[i - 1].data.endPoint;
                        }
                        for (var j = 1; j <= divisions; j++) {
                            points.push(beginPoint.quadraticBezier(j / divisions, controlBegin, endPoint));
                        }
                        break;
                    case PathKind.BEZIER_CURVE_TO:
                        controlBegin = data.controlBegin;
                        controlEnd = data.controlEnd;
                        endPoint = data.endPoint;
                        if (points.length > 0) {
                            beginPoint = points[points.length - 1];
                        }
                        else {
                            beginPoint = this.actions[i - 1].data.endPoint;
                        }
                        for (j = 1; j <= divisions; j++) {
                            points.push(beginPoint.cubicBezier(j / divisions, controlBegin, controlEnd, endPoint));
                        }
                        break;
                    case PathKind.CSPLINE_THRU:
                        /*
                        let laste = this.actions[i - 1].data;
    
                        var last = new Vector2(laste[laste.length - 2], laste[laste.length - 1]);
                        var spts: Euclidean3 = [last];
    
                        var n = divisions * data[0].length;
    
                        spts = spts.concat(args[0]);
    
                        var spline = new SplineCurve(spts);
    
                        for (j = 1; j <= n; j++) {
    
                            points.push(spline.getPointAt(j / n));
    
                        }
                        */
                        break;
                    case PathKind.ARC:
                        /*
                        endPoint = data.endPoint;  // a is the center of the arc
                        var aRadius = data.radius;
                        var aStartAngle = args[3];
                        var aEndAngle = args[4];
                        var aClockwise = !!args[5];
    
                        var deltaAngle = aEndAngle - aStartAngle;
                        var angle;
                        var tdivisions = divisions * 2;
    
                        for (j = 1; j <= tdivisions; j++) {
    
                            t = j / tdivisions;
    
                            if (!aClockwise) {
    
                                t = 1 - t;
    
                            }
    
                            angle = aStartAngle + t * deltaAngle;
    
                            tx = aX + aRadius * Math.cos(angle);
                            ty = aY + aRadius * Math.sin(angle);
    
                            //console.log('t', t, 'angle', angle, 'tx', tx, 'ty', ty);
    
                            points.push(new Vector2(tx, ty));
    
                        }
    
                        //console.log(points);
                        */
                        break;
                    case PathKind.ELLIPSE:
                        /*
                        var aX = args[0], aY = args[1],
                            xRadius = args[2],
                            yRadius = args[3],
                            aStartAngle = args[4], aEndAngle = args[5],
                            aClockwise = !!args[6];
    
    
                        var deltaAngle = aEndAngle - aStartAngle;
                        var angle;
                        var tdivisions = divisions * 2;
    
                        for (j = 1; j <= tdivisions; j++) {
    
                            t = j / tdivisions;
    
                            if (!aClockwise) {
    
                                t = 1 - t;
    
                            }
    
                            angle = aStartAngle + t * deltaAngle;
    
                            tx = aX + xRadius * Math.cos(angle);
                            ty = aY + yRadius * Math.sin(angle);
    
                            //console.log('t', t, 'angle', angle, 'tx', tx, 'ty', ty);
    
                            points.push(new Vector2(tx, ty));
    
                        }
    
                        //console.log(points);
                        */
                        break;
                } // end switch
            }
            // Normalize to remove the closing point by default.
            var firstPoint = points[0];
            var lastPoint = points[points.length - 1];
            lastPoint.distanceTo(firstPoint);
            var EPSILON = 0.0000000001;
            if (lastPoint.distanceTo(firstPoint) < EPSILON) {
                points.splice(points.length - 1, 1);
            }
            if (closedPath) {
                points.push(points[0]);
            }
            return points;
        };
        ;
        Path.prototype.execute = function (action, args) {
            // switch on the action and call the method.
            throw new Error("TODO Path.execute");
        };
        /**
         * @method moveTo
         * @param point {Euclidean3}
         * @return {void}
         */
        Path.prototype.moveTo = function (point) {
            this.actions.push({ action: PathKind.MOVE_TO, data: { endPoint: point } });
        };
        /**
         * @method lineTo
         * @param point {Euclidean3}
         * @return {void}
         */
        Path.prototype.lineTo = function (point) {
            var prevArgs = this.actions[this.actions.length - 1].data;
            var beginPoint = prevArgs.endPoint;
            var curve = new LineCurve(beginPoint, point);
            this.curves.push(curve);
            this.actions.push({ action: PathKind.LINE_TO, data: { endPoint: point } });
        };
        /**
         * @method quadraticCurveTo
         * @param controlPoint {Euclidean3}
         * @param endPoint {Euclidean3}
         * @return {void}
         */
        Path.prototype.quadraticCurveTo = function (controlPoint, point) {
            var prevArgs = this.actions[this.actions.length - 1].data;
            var beginPoint = prevArgs.endPoint;
            var curve = new QuadraticBezierCurve(beginPoint, controlPoint, point);
            this.curves.push(curve);
            this.actions.push({ action: PathKind.QUADRATIC_CURVE_TO, data: { controlBegin: controlPoint, endPoint: point } });
        };
        /**
         * @method bezierCurveTo
         * @param controlBegin {Euclidean3}
         * @param controlEnd {Euclidean3}
         * @param endPoint {Euclidean3}
         * @return {void}
         */
        Path.prototype.bezierCurveTo = function (controlBegin, controlEnd, point) {
            var prevArgs = this.actions[this.actions.length - 1].data;
            var beginPoint = prevArgs.endPoint;
            var curve = new CubicBezierCurve(beginPoint, controlBegin, controlEnd, point);
            this.curves.push(curve);
            this.actions.push({ action: PathKind.BEZIER_CURVE_TO, data: { controlBegin: controlBegin, controlEnd: controlEnd, endPoint: point } });
        };
        //
        // Breaks path into shapes
        //
        //  Assumptions (if parameter isCCW==true the opposite holds):
        //  - solid shapes are defined clockwise (CW)
        //  - holes are defined counterclockwise (CCW)
        //
        //  If parameter noHoles==true:
        //  - all subPaths are regarded as solid shapes
        //  - definition order CW/CCW has no relevance
        //
        Path.prototype.toShapes = function (isCCW, noHoles) {
            function extractSubpaths(inActions) {
                var subPaths = [];
                var lastPath = new Path();
                for (var i = 0, il = inActions.length; i < il; i++) {
                    var action = inActions[i];
                    var args = action.data;
                    var kind = action.action; // FIXME => kind
                    if (kind === PathKind.MOVE_TO) {
                        if (lastPath.actions.length != 0) {
                            subPaths.push(lastPath);
                            lastPath = new Path();
                        }
                    }
                    lastPath.execute(kind, args);
                }
                if (lastPath.actions.length != 0) {
                    subPaths.push(lastPath);
                }
                return subPaths;
            }
            function toShapesNoHoles(inSubpaths) {
                var shapes = [];
                for (var i = 0, il = inSubpaths.length; i < il; i++) {
                    var tmpPath = inSubpaths[i];
                    var tmpShape = new Shape();
                    tmpShape.actions = tmpPath.actions;
                    tmpShape.curves = tmpPath.curves;
                    shapes.push(tmpShape);
                }
                //console.log("shape", shapes);
                return shapes;
            }
            ;
            function isPointInsidePolygon(inPt, inPolygon) {
                var EPSILON = 0.0000000001;
                var polyLen = inPolygon.length;
                // inPt on polygon contour => immediate success    or
                // toggling of inside/outside at every single! intersection point of an edge
                //  with the horizontal line through inPt, left of inPt
                //  not counting lowerY endpoints of edges and whole edges on that line
                var inside = false;
                for (var p = polyLen - 1, q = 0; q < polyLen; p = q++) {
                    var edgeLowPt = inPolygon[p];
                    var edgeHighPt = inPolygon[q];
                    var edgeDx = edgeHighPt.x - edgeLowPt.x;
                    var edgeDy = edgeHighPt.y - edgeLowPt.y;
                    if (Math.abs(edgeDy) > EPSILON) {
                        if (edgeDy < 0) {
                            edgeLowPt = inPolygon[q];
                            edgeDx = -edgeDx;
                            edgeHighPt = inPolygon[p];
                            edgeDy = -edgeDy;
                        }
                        if ((inPt.y < edgeLowPt.y) || (inPt.y > edgeHighPt.y))
                            continue;
                        if (inPt.y == edgeLowPt.y) {
                            if (inPt.x == edgeLowPt.x)
                                return true; // inPt is on contour ?
                        }
                        else {
                            var perpEdge = edgeDy * (inPt.x - edgeLowPt.x) - edgeDx * (inPt.y - edgeLowPt.y);
                            if (perpEdge == 0)
                                return true; // inPt is on contour ?
                            if (perpEdge < 0)
                                continue;
                            inside = !inside; // true intersection left of inPt
                        }
                    }
                    else {
                        if (inPt.y != edgeLowPt.y)
                            continue; // parallel
                        // egde lies on the same horizontal line as inPt
                        if (((edgeHighPt.x <= inPt.x) && (inPt.x <= edgeLowPt.x)) ||
                            ((edgeLowPt.x <= inPt.x) && (inPt.x <= edgeHighPt.x)))
                            return true; // inPt: Euclidean3 on contour !
                    }
                }
                return inside;
            }
            var subPaths = extractSubpaths(this.actions);
            if (subPaths.length == 0)
                return [];
            if (noHoles === true)
                return toShapesNoHoles(subPaths);
            var solid;
            var tmpPath;
            var tmpShape;
            var shapes = [];
            if (subPaths.length == 1) {
                tmpPath = subPaths[0];
                tmpShape = new Shape();
                tmpShape.actions = tmpPath.actions;
                tmpShape.curves = tmpPath.curves;
                shapes.push(tmpShape);
                return shapes;
            }
            var holesFirst = !isClockWise(subPaths[0].getPoints());
            holesFirst = isCCW ? !holesFirst : holesFirst;
            // console.log("Holes first", holesFirst);
            var betterShapeHoles = [];
            var newShapes = [];
            var newShapeHoles = [];
            var mainIdx = 0;
            var tmpPoints;
            newShapes[mainIdx] = undefined;
            newShapeHoles[mainIdx] = [];
            for (var i = 0, il = subPaths.length; i < il; i++) {
                tmpPath = subPaths[i];
                tmpPoints = tmpPath.getPoints();
                solid = isClockWise(tmpPoints);
                solid = isCCW ? !solid : solid;
                if (solid) {
                    if ((!holesFirst) && (newShapes[mainIdx]))
                        mainIdx++;
                    newShapes[mainIdx] = { s: new Shape(), p: tmpPoints };
                    newShapes[mainIdx].s.actions = tmpPath.actions;
                    newShapes[mainIdx].s.curves = tmpPath.curves;
                    if (holesFirst)
                        mainIdx++;
                    newShapeHoles[mainIdx] = [];
                }
                else {
                    newShapeHoles[mainIdx].push({ h: tmpPath, p: tmpPoints[0] });
                }
            }
            // only Holes? -> probably all Shapes with wrong orientation
            if (!newShapes[0])
                return toShapesNoHoles(subPaths);
            if (newShapes.length > 1) {
                var ambigious = false;
                var toChange = [];
                for (var sIdx = 0, sLen = newShapes.length; sIdx < sLen; sIdx++) {
                    betterShapeHoles[sIdx] = [];
                }
                for (var sIdx = 0, sLen = newShapes.length; sIdx < sLen; sIdx++) {
                    var sho = newShapeHoles[sIdx];
                    for (var hIdx = 0; hIdx < sho.length; hIdx++) {
                        var ho = sho[hIdx];
                        var hole_unassigned = true;
                        for (var s2Idx = 0; s2Idx < newShapes.length; s2Idx++) {
                            if (isPointInsidePolygon(ho.p, newShapes[s2Idx].p)) {
                                if (sIdx != s2Idx)
                                    toChange.push({ froms: sIdx, tos: s2Idx, hole: hIdx });
                                if (hole_unassigned) {
                                    hole_unassigned = false;
                                    betterShapeHoles[s2Idx].push(ho);
                                }
                                else {
                                    ambigious = true;
                                }
                            }
                        }
                        if (hole_unassigned) {
                            betterShapeHoles[sIdx].push(ho);
                        }
                    }
                }
                // console.log("ambigious: ", ambigious);
                if (toChange.length > 0) {
                    // console.log("to change: ", toChange);
                    if (!ambigious)
                        newShapeHoles = betterShapeHoles;
                }
            }
            var tmpHoles;
            for (var i = 0, il = newShapes.length; i < il; i++) {
                tmpShape = newShapes[i].s;
                shapes.push(tmpShape);
                tmpHoles = newShapeHoles[i];
                for (var j = 0, jl = tmpHoles.length; j < jl; j++) {
                    tmpShape.holes.push(tmpHoles[j].h);
                }
            }
            //console.log("shape", shapes);
            return shapes;
        };
        return Path;
    })(CurvePath);
    return Path;
});
