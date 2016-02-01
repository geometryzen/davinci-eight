var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../curves/CubicBezierCurve', '../curves/CurvePath', '../geometries/isClockWise', '../curves/LineCurve', '../geometries/PathKind', '../curves/QuadraticBezierCurve', '../geometries/Shape'], function (require, exports, CubicBezierCurve_1, CurvePath_1, isClockWise_1, LineCurve_1, PathKind_1, QuadraticBezierCurve_1, Shape_1) {
    var Path = (function (_super) {
        __extends(Path, _super);
        function Path(points) {
            _super.call(this);
            this.actions = [];
            if (points) {
                this.fromPoints(points);
            }
        }
        Path.prototype.fromPoints = function (points) {
            if (points.length > 0) {
                this.moveTo(points[0]);
                for (var i = 1, iLength = points.length; i < iLength; i++) {
                    this.lineTo(points[i]);
                }
            }
        };
        Path.prototype.getSpacedPoints = function (divisions, closedPath) {
            if (divisions === void 0) { divisions = 40; }
            var points = [];
            for (var i = 0; i < divisions; i++) {
                points.push(this.getPoint(i / divisions));
            }
            return points;
        };
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
                    case PathKind_1.default.MOVE_TO:
                        points.push(data.endPoint);
                        break;
                    case PathKind_1.default.LINE_TO:
                        points.push(data.endPoint);
                        break;
                    case PathKind_1.default.QUADRATIC_CURVE_TO:
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
                    case PathKind_1.default.BEZIER_CURVE_TO:
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
                    case PathKind_1.default.CSPLINE_THRU:
                        break;
                    case PathKind_1.default.ARC:
                        break;
                    case PathKind_1.default.ELLIPSE:
                        break;
                }
            }
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
            throw new Error("TODO Path.execute");
        };
        Path.prototype.moveTo = function (point) {
            this.actions.push({ action: PathKind_1.default.MOVE_TO, data: { endPoint: point } });
        };
        Path.prototype.lineTo = function (point) {
            var prevArgs = this.actions[this.actions.length - 1].data;
            var beginPoint = prevArgs.endPoint;
            var curve = new LineCurve_1.default(beginPoint, point);
            this.curves.push(curve);
            this.actions.push({ action: PathKind_1.default.LINE_TO, data: { endPoint: point } });
        };
        Path.prototype.quadraticCurveTo = function (controlPoint, point) {
            var prevArgs = this.actions[this.actions.length - 1].data;
            var beginPoint = prevArgs.endPoint;
            var curve = new QuadraticBezierCurve_1.default(beginPoint, controlPoint, point);
            this.curves.push(curve);
            this.actions.push({ action: PathKind_1.default.QUADRATIC_CURVE_TO, data: { controlBegin: controlPoint, endPoint: point } });
        };
        Path.prototype.bezierCurveTo = function (controlBegin, controlEnd, point) {
            var prevArgs = this.actions[this.actions.length - 1].data;
            var beginPoint = prevArgs.endPoint;
            var curve = new CubicBezierCurve_1.default(beginPoint, controlBegin, controlEnd, point);
            this.curves.push(curve);
            this.actions.push({ action: PathKind_1.default.BEZIER_CURVE_TO, data: { controlBegin: controlBegin, controlEnd: controlEnd, endPoint: point } });
        };
        Path.prototype.toShapes = function (isCCW, noHoles) {
            function extractSubpaths(inActions) {
                var subPaths = [];
                var lastPath = new Path();
                for (var i = 0, il = inActions.length; i < il; i++) {
                    var action = inActions[i];
                    var args = action.data;
                    var kind = action.action;
                    if (kind === PathKind_1.default.MOVE_TO) {
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
                    var tmpShape = new Shape_1.default();
                    tmpShape.actions = tmpPath.actions;
                    tmpShape.curves = tmpPath.curves;
                    shapes.push(tmpShape);
                }
                return shapes;
            }
            ;
            function isPointInsidePolygon(inPt, inPolygon) {
                var EPSILON = 0.0000000001;
                var polyLen = inPolygon.length;
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
                                return true;
                        }
                        else {
                            var perpEdge = edgeDy * (inPt.x - edgeLowPt.x) - edgeDx * (inPt.y - edgeLowPt.y);
                            if (perpEdge == 0)
                                return true;
                            if (perpEdge < 0)
                                continue;
                            inside = !inside;
                        }
                    }
                    else {
                        if (inPt.y != edgeLowPt.y)
                            continue;
                        if (((edgeHighPt.x <= inPt.x) && (inPt.x <= edgeLowPt.x)) ||
                            ((edgeLowPt.x <= inPt.x) && (inPt.x <= edgeHighPt.x)))
                            return true;
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
                tmpShape = new Shape_1.default();
                tmpShape.actions = tmpPath.actions;
                tmpShape.curves = tmpPath.curves;
                shapes.push(tmpShape);
                return shapes;
            }
            var holesFirst = !isClockWise_1.default(subPaths[0].getPoints());
            holesFirst = isCCW ? !holesFirst : holesFirst;
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
                solid = isClockWise_1.default(tmpPoints);
                solid = isCCW ? !solid : solid;
                if (solid) {
                    if ((!holesFirst) && (newShapes[mainIdx]))
                        mainIdx++;
                    newShapes[mainIdx] = { s: new Shape_1.default(), p: tmpPoints };
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
                if (toChange.length > 0) {
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
            return shapes;
        };
        return Path;
    })(CurvePath_1.default);
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Path;
});
