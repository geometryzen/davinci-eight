import { __extends } from "tslib";
import { Geometric3 } from '../math/Geometric3';
import { GeometryElements } from '../core/GeometryElements';
import { GeometryMode } from './GeometryMode';
import { isDefined } from '../checks/isDefined';
import { mustBeBoolean } from '../checks/mustBeBoolean';
import { mustBeInteger } from '../checks/mustBeInteger';
import { mustBeNumber } from '../checks/mustBeNumber';
import { arc3 } from '../geometries/arc3';
import { SimplexPrimitivesBuilder } from '../geometries/SimplexPrimitivesBuilder';
import { Spinor3 } from '../math/Spinor3';
import { Vector2 } from '../math/Vector2';
import { Vector3 } from '../math/Vector3';
import { vec } from '../math/R3';
var canonicalAxis = vec(0, 1, 0);
// const canonicalMeridian = vec(0, 0, 1);
/**
 * @param height The vector in the height direction. The length also gives the cylinder length.
 * @param radius The vector in the radius direction. The length also gives the cylinder radius.
 * @param clockwise
 * @param stress
 * @param tilt
 * @param offset
 * @param angle
 * @param generator
 * @param heightSegments
 * @param thetaSegments
 * @param points
 * @param tangents
 * @param vertices
 * @param uvs
 */
function computeWallVertices(height, radius, clockwise, stress, tilt, offset, angle, generator, heightSegments, thetaSegments, points, tangents, vertices, uvs) {
    /**
     *
     */
    var halfHeight = Vector3.copy(height).scale(0.5);
    /**
     * A displacement in the direction of axis that we must move for each height step.
     */
    var stepH = Vector3.copy(height).scale(1 / heightSegments);
    var iLength = heightSegments + 1;
    for (var i = 0; i < iLength; i++) {
        /**
         * The displacement to the current level.
         */
        var dispH = Vector3.copy(stepH).scale(i).sub(halfHeight);
        var verticesRow = [];
        var uvsRow = [];
        /**
         * The texture coordinate in the north-south direction.
         */
        var v = (heightSegments - i) / heightSegments;
        /**
         * arcPoints.length => thetaSegments + 1
         */
        var arcPoints = arc3(radius, angle, generator, thetaSegments);
        /**
         * j < arcPoints.length => j <= thetaSegments
         */
        var jLength = arcPoints.length;
        for (var j = 0; j < jLength; j++) {
            // Starting with a point on the wall of the regular cylinder...
            var point = arcPoints[j];
            // Compute the tangent bivector before moving the point up the wall, it need not be normalized.
            var tangent = Spinor3.dual(point, false);
            // Add the displacement up the wall to get the point to the correct height.
            point.add(dispH);
            // Subject the point to the stress, tilt, offset transformations.
            point.stress(stress);
            point.rotate(tilt);
            point.add(offset);
            // Subject the tangent bivector to the stress and tilt (no need for offset).
            tangent.stress(stress);
            tangent.rotate(tilt);
            /**
             * u will vary from 0 to 1, because j goes from 0 to thetaSegments
             */
            var u = j / thetaSegments;
            points.push(point);
            tangents.push(tangent);
            verticesRow.push(points.length - 1);
            uvsRow.push(new Vector2([u, v]));
        }
        vertices.push(verticesRow);
        uvs.push(uvsRow);
    }
}
/**
 *
 */
var CylinderSimplexPrimitivesBuilder = /** @class */ (function (_super) {
    __extends(CylinderSimplexPrimitivesBuilder, _super);
    function CylinderSimplexPrimitivesBuilder(height, cutLine, clockwise, mode) {
        var _this = _super.call(this) || this;
        _this.mode = mode;
        _this.sliceAngle = 2 * Math.PI;
        _this.openBase = false;
        _this.openCap = false;
        _this.openWall = false;
        _this.height = Vector3.copy(height);
        _this.cutLine = Vector3.copy(cutLine);
        _this.clockwise = clockwise;
        _this.setModified(true);
        return _this;
    }
    CylinderSimplexPrimitivesBuilder.prototype.regenerate = function () {
        this.data = [];
        var heightSegments = this.flatSegments;
        var thetaSegments = this.curvedSegments;
        var generator = Spinor3.dual(Vector3.copy(this.height).normalize(), false);
        var heightHalf = 1 / 2;
        var points = [];
        var tangents = [];
        // The double array allows us to manage the i,j indexing more naturally.
        // The alternative is to use an indexing function.
        var vertices = [];
        var uvs = [];
        computeWallVertices(this.height, this.cutLine, this.clockwise, this.stress, this.tilt, this.offset, this.sliceAngle, generator, heightSegments, thetaSegments, points, tangents, vertices, uvs);
        if (!this.openWall) {
            for (var j = 0; j < thetaSegments; j++) {
                for (var i = 0; i < heightSegments; i++) {
                    /**
                     * We're going to touch every quadrilateral in the wall and split it into two triangles,
                     * 2-1-3 and 4-3-1 (both counter-clockwise when viewed from outside).
                     *
                     *  2-------3
                     *  |       |
                     *  |       |
                     *  |       |
                     *  1-------4
                     */
                    var v1 = vertices[i][j];
                    var v2 = vertices[i + 1][j];
                    var v3 = vertices[i + 1][j + 1];
                    var v4 = vertices[i][j + 1];
                    // Compute the normals and normalize them
                    var n1 = Vector3.dual(tangents[v1], true).normalize();
                    var n2 = Vector3.dual(tangents[v2], true).normalize();
                    var n3 = Vector3.dual(tangents[v3], true).normalize();
                    var n4 = Vector3.dual(tangents[v4], true).normalize();
                    var uv1 = uvs[i][j].clone();
                    var uv2 = uvs[i + 1][j].clone();
                    var uv3 = uvs[i + 1][j + 1].clone();
                    var uv4 = uvs[i][j + 1].clone();
                    switch (this.mode) {
                        case GeometryMode.MESH: {
                            this.triangle([points[v2], points[v1], points[v3]], [n2, n1, n3], [uv2, uv1, uv3]);
                            this.triangle([points[v4], points[v3], points[v1]], [n4, n3.clone(), n1.clone()], [uv4, uv3.clone(), uv1.clone()]);
                            break;
                        }
                        case GeometryMode.WIRE: {
                            this.lineSegment([points[v1], points[v2]], [n1, n2], [uv1, uv2]);
                            this.lineSegment([points[v2], points[v3]], [n2, n3], [uv2, uv3]);
                            this.lineSegment([points[v3], points[v3]], [n3, n4], [uv3, uv4]);
                            this.lineSegment([points[v4], points[v1]], [n4, n1], [uv4, uv1]);
                            break;
                        }
                        case GeometryMode.POINT: {
                            this.point([points[v1]], [n1], [uv1]);
                            this.point([points[v2]], [n2], [uv2]);
                            this.point([points[v3]], [n3], [uv3]);
                            this.point([points[v4]], [n4], [uv4]);
                            break;
                        }
                    }
                }
            }
        }
        if (!this.openCap) {
            // Push an extra point for the center of the cap.
            var top_1 = Vector3.copy(this.height).scale(heightHalf).add(this.offset);
            var tangent = Spinor3.dual(Vector3.copy(this.height).normalize(), false).stress(this.stress).rotate(this.tilt);
            var normal = Vector3.dual(tangent, true);
            points.push(top_1);
            for (var j = 0; j < thetaSegments; j++) {
                var v1 = vertices[heightSegments][j + 1];
                var v2 = points.length - 1;
                var v3 = vertices[heightSegments][j];
                // We probably should devise a way to either disable texturing or use a different texture.
                var uv1 = uvs[heightSegments][j + 1].clone();
                var uv3 = uvs[heightSegments][j].clone();
                // The texturing on the end is a funky continuation of the sides.
                // const uv2: Vector2 = new Vector2([(uv1.x + uv3.x) / 2, 1]);
                // The texturing on the end is a uniform continuation of the sides.
                var uv2 = new Vector2([(uv1.x + uv3.x) / 2, (uv1.y + uv3.y) / 2]);
                switch (this.mode) {
                    case GeometryMode.MESH: {
                        this.triangle([points[v1], points[v2], points[v3]], [normal, normal, normal], [uv1, uv2, uv3]);
                        break;
                    }
                    case GeometryMode.WIRE: {
                        this.lineSegment([points[v1], points[v2]], [normal, normal], [uv1, uv2]);
                        this.lineSegment([points[v2], points[v3]], [normal, normal], [uv2, uv3]);
                        this.lineSegment([points[v3], points[v1]], [normal, normal], [uv3, uv1]);
                        break;
                    }
                    case GeometryMode.POINT: {
                        this.point([points[v1]], [normal], [uv1]);
                        this.point([points[v2]], [normal], [uv2]);
                        this.point([points[v3]], [normal], [uv3]);
                        break;
                    }
                }
            }
        }
        if (!this.openBase) {
            // Push an extra point for the center of the base.
            var bottom = Vector3.copy(this.height).scale(-heightHalf).add(this.offset);
            var tangent = Spinor3.dual(Vector3.copy(this.height).normalize(), false).neg().stress(this.stress).rotate(this.tilt);
            var normal = Vector3.dual(tangent, true);
            points.push(bottom);
            for (var j = 0; j < thetaSegments; j++) {
                var v1 = vertices[0][j];
                var v2 = points.length - 1;
                var v3 = vertices[0][j + 1];
                // We probably should devise a way to either disable texturing or use a different texture.
                var uv1 = uvs[0][j].clone();
                var uv3 = uvs[0][j + 1].clone();
                // The texturing on the end is a funky continuation of the sides.
                // const uv2: Vector2 = new Vector2([(uv1.x + uv3.x) / 2, 0]);
                // The texturing on the end is a uniform continuation of the sides.
                var uv2 = new Vector2([(uv1.x + uv3.x) / 2, (uv1.y + uv3.y) / 2]);
                switch (this.mode) {
                    case GeometryMode.MESH: {
                        this.triangle([points[v1], points[v2], points[v3]], [normal, normal, normal], [uv1, uv2, uv3]);
                        break;
                    }
                    case GeometryMode.WIRE: {
                        this.lineSegment([points[v1], points[v2]], [normal, normal], [uv1, uv2]);
                        this.lineSegment([points[v2], points[v3]], [normal, normal], [uv2, uv3]);
                        this.lineSegment([points[v3], points[v1]], [normal, normal], [uv3, uv1]);
                        break;
                    }
                    case GeometryMode.POINT: {
                        this.point([points[v1]], [normal], [uv1]);
                        this.point([points[v2]], [normal], [uv2]);
                        this.point([points[v3]], [normal], [uv3]);
                        break;
                    }
                }
            }
        }
        this.setModified(false);
    };
    return CylinderSimplexPrimitivesBuilder;
}(SimplexPrimitivesBuilder));
function getAxis(options) {
    if (options === void 0) { options = { kind: 'CylinderGeometry' }; }
    if (isDefined(options.axis)) {
        return options.axis;
    }
    else if (isDefined(options.length)) {
        return vec(0, mustBeNumber('length', options.length), 0);
    }
    else {
        return vec(0, 1, 0);
    }
}
function getMeridian(options) {
    if (options === void 0) { options = { kind: 'CylinderGeometry' }; }
    if (isDefined(options.meridian)) {
        return options.meridian;
    }
    else if (isDefined(options.radius)) {
        return vec(0, 0, mustBeNumber('radius', options.radius));
    }
    else {
        return vec(0, 0, 1);
    }
}
/**
 * TODO: Support GeometryMode.
 */
function cylinderPrimitive(options) {
    if (options === void 0) { options = { kind: 'CylinderGeometry' }; }
    /**
     * The canonical axis is in the e2 direction.
     */
    var height = getAxis(options);
    /**
     * The canonical cutLine is in the e3 direction.
     */
    var cutLine = getMeridian(options);
    var mode = isDefined(options.mode) ? options.mode : GeometryMode.MESH;
    var builder = new CylinderSimplexPrimitivesBuilder(height, cutLine, false, mode);
    if (isDefined(options.openBase)) {
        builder.openBase = mustBeBoolean('openBase', options.openBase);
    }
    if (isDefined(options.openCap)) {
        builder.openCap = mustBeBoolean('openCap', options.openCap);
    }
    if (isDefined(options.openWall)) {
        builder.openWall = mustBeBoolean('openWall', options.openWall);
    }
    if (isDefined(options.heightSegments)) {
        builder.flatSegments = mustBeInteger("heightSegments", options.heightSegments);
    }
    if (isDefined(options.thetaSegments)) {
        builder.curvedSegments = mustBeInteger("thetaSegments", options.thetaSegments);
    }
    if (options.offset) {
        builder.offset.copy(options.offset);
    }
    var primitives = builder.toPrimitives();
    if (primitives.length === 1) {
        return primitives[0];
    }
    else {
        throw new Error("Expecting CylinderSimplexPrimitivesBuilder to return one Primitive.");
    }
}
function baseOptions(options) {
    var axis = getAxis(options);
    var tilt = Geometric3.rotorFromDirections(canonicalAxis, axis);
    return { tilt: tilt };
}
/**
 * A geometry for a Cylinder.
 */
var CylinderGeometry = /** @class */ (function (_super) {
    __extends(CylinderGeometry, _super);
    /**
     *
     */
    function CylinderGeometry(contextManager, options, levelUp) {
        if (options === void 0) { options = { kind: 'CylinderGeometry' }; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, contextManager, cylinderPrimitive(options), baseOptions(options), levelUp + 1) || this;
        _this.setLoggingName('CylinderGeometry');
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    CylinderGeometry.prototype.resurrector = function (levelUp) {
        _super.prototype.resurrector.call(this, levelUp + 1);
        this.setLoggingName('CylinderGeometry');
        if (levelUp === 0) {
            this.synchUp();
        }
    };
    /**
     *
     */
    CylinderGeometry.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    return CylinderGeometry;
}(GeometryElements));
export { CylinderGeometry };
