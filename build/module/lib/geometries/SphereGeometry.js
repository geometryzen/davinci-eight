import { __extends } from "tslib";
import { arc3 } from '../geometries/arc3';
import { Geometric3 } from '../math/Geometric3';
import { GeometryElements } from '../core/GeometryElements';
import { GeometryMode } from './GeometryMode';
import { isInteger } from '../checks/isInteger';
import { isNumber } from '../checks/isNumber';
import { isUndefined } from '../checks/isUndefined';
import { mustBeGE } from '../checks/mustBeGE';
import { mustBeInteger } from '../checks/mustBeInteger';
import { mustBeNumber } from '../checks/mustBeNumber';
import { vec } from '../math/R3';
import { SimplexPrimitivesBuilder } from '../geometries/SimplexPrimitivesBuilder';
import { SimplexMode } from './SimplexMode';
import { Spinor3 } from '../math/Spinor3';
import { Vector2 } from '../math/Vector2';
import { Vector3 } from '../math/Vector3';
import { mustBeDefined } from '../checks/mustBeDefined';
var PI = Math.PI;
var TAU = 2 * PI;
// TODO: These values should only be used for making the options complete.
// They should not be used directly in calculations.
// To do so would mean an option value is missing.
/**
 * e3 = vec(0, 0, 1)
 */
export var DEFAULT_MERIDIAN = vec(0, 0, 1);
/**
 * e2 = vec(0, 1, 0)
 */
export var DEFAULT_ZENITH = vec(0, 1, 0);
export var DEFAULT_STRESS = vec(1, 1, 1);
export var DEFAULT_TILT = Spinor3.one.clone(); // TODO: Should be locked.
export var DEFAULT_OFFSET = vec(0, 0, 0);
export var DEFAULT_AZIMUTH_START = 0;
export var DEFAULT_AZIMUTH_LENGTH = TAU;
/**
 * The default number of segments for the azimuth (phi) angle.
 * By making this value 36, each segment represents 10 degrees.
 */
export var DEFAULT_AZIMUTH_SEGMENTS = 36;
export var DEFAULT_ELEVATION_START = 0;
/**
 * The elevation ranges from zero to PI.
 */
export var DEFAULT_ELEVATION_LENGTH = PI;
/**
 * The default number of segments for the elevation (theta) angle.
 * By making this value 18, each segment represents 10 degrees.
 */
export var DEFAULT_ELEVATION_SEGMENTS = 18;
var DEFAULT_RADIUS = 1;
/**
 *
 * @param stress
 * @param tilt
 * @param offset
 * @param azimuthStart
 * @param azimuthLength
 * @param azimuthSegments Must be an integer.
 * @param elevationStart
 * @param elevationLength
 * @param elevationSegments Must be an integer.
 * @param points
 * @param uvs
 */
export function computeSphereVerticesAndCoordinates(zenith, meridian, stress, tilt, offset, azimuthStart, azimuthLength, azimuthSegments, elevationStart, elevationLength, elevationSegments, points, uvs) {
    mustBeDefined('points', points);
    mustBeDefined('uvs', uvs);
    mustBeDefined('zenith', zenith);
    mustBeDefined('meridian', meridian);
    mustBeDefined('stress', stress);
    mustBeDefined('tilt', tilt);
    mustBeDefined('offset', offset);
    mustBeNumber('azimuthStart', azimuthStart);
    mustBeNumber('azimuthLength', azimuthLength);
    mustBeInteger('azimuthSegments', azimuthSegments);
    mustBeNumber('elevationStart', elevationStart);
    mustBeNumber('elevationLength', elevationLength);
    mustBeInteger('elevationSegments', elevationSegments);
    var generator = Spinor3.dual(zenith, false);
    var iLength = elevationSegments + 1;
    var jLength = azimuthSegments + 1;
    for (var i = 0; i < iLength; i++) {
        /**
         * The elevation angle, zero at the zenith, PI/2 at the quator, PI at the nadir.
         */
        var theta = elevationStart + (elevationSegments ? i / elevationSegments : 0) * elevationLength;
        /**
         * arcRadius assumes that we have a unit sphere.
         */
        var arcRadius = Math.sin(theta);
        var R = Geometric3.fromSpinor(generator).scale(-azimuthStart / 2).exp();
        var begin = Geometric3.fromVector(meridian).rotate(R).scale(arcRadius);
        var arcPoints = arc3(begin, azimuthLength, generator, azimuthSegments);
        /**
         * Displacement that we need to add (in the axis direction) to each arc point to get the
         * distance position parallel to the axis correct.
         */
        var arcHeight = Math.cos(theta);
        /**
         * The y component of texture coordinates a.k.a 'v'.
         */
        var v = theta / PI;
        for (var j = 0; j < jLength; j++) {
            var arcPoint = arcPoints[j];
            var point = arcPoint.add(zenith, arcHeight);
            point.stress(stress).rotate(tilt).add(offset);
            points.push(point);
            /**
             * The azimuth angle, zero at the meridian, increasing eastwards to TAU back at the meridian.
             * Computed in order to compute the texture coordinate.
             */
            var phi = azimuthStart + (azimuthSegments ? j / azimuthSegments : 0) * azimuthLength;
            /**
             * The x component of texture coordinates a.k.a 'u'.
             */
            var u = phi / TAU;
            // TODO: Variation of texture coordinates with axis, meridian, stress, tilt, and offset.
            uvs.push(new Vector2([u, v]));
        }
    }
}
function quadIndex(i, j, innerSegments) {
    return i * (innerSegments + 1) + j;
}
function vertexIndex(qIndex, n, innerSegments) {
    switch (n) {
        case 0: return qIndex + 1;
        case 1: return qIndex;
        case 2: return qIndex + innerSegments + 1;
        case 3: return qIndex + innerSegments + 2;
    }
    throw new Error("n must be in the range [0, 3]");
}
function makeTriangles(points, uvs, radius, heightSegments, widthSegments, geometry) {
    for (var i = 0; i < heightSegments; i++) {
        for (var j = 0; j < widthSegments; j++) {
            var qIndex = quadIndex(i, j, widthSegments);
            // Form a quadrilateral. v0 through v3 give the indices into the points array.
            var v0 = vertexIndex(qIndex, 0, widthSegments);
            var v1 = vertexIndex(qIndex, 1, widthSegments);
            var v2 = vertexIndex(qIndex, 2, widthSegments);
            var v3 = vertexIndex(qIndex, 3, widthSegments);
            // The normal vectors for the sphere are simply the normalized position vectors.
            var n0 = Vector3.copy(points[v0]).normalize();
            var n1 = Vector3.copy(points[v1]).normalize();
            var n2 = Vector3.copy(points[v2]).normalize();
            var n3 = Vector3.copy(points[v3]).normalize();
            // Grab the uv coordinates too.
            var uv0 = uvs[v0].clone();
            var uv1 = uvs[v1].clone();
            var uv2 = uvs[v2].clone();
            var uv3 = uvs[v3].clone();
            // Special case the north and south poles by only creating one triangle.
            // FIXME: What's the geometric equivalent here?
            /*
            if (Math.abs(points[v0].y) === radius) {
              uv0.x = (uv0.x + uv1.x) / 2;
              geometry.triangle([points[v0], points[v2], points[v3]], [n0, n2, n3], [uv0, uv2, uv3])
            }
            else if (Math.abs(points[v2].y) === radius) {
              uv2.x = (uv2.x + uv3.x) / 2;
              geometry.triangle([points[v0], points[v1], points[v2]], [n0, n1, n2], [uv0, uv1, uv2])
            }
            else {
              // The other patches create two triangles.
              geometry.triangle([points[v0], points[v1], points[v3]], [n0, n1, n3], [uv0, uv1, uv3])
              geometry.triangle([points[v2], points[v3], points[v1]], [n2, n3, n1], [uv2, uv3, uv1])
            }
            */
            geometry.triangle([points[v0], points[v1], points[v3]], [n0, n1, n3], [uv0, uv1, uv3]);
            geometry.triangle([points[v2], points[v3], points[v1]], [n2, n3, n1], [uv2, uv3, uv1]);
        }
    }
}
function makeLineSegments(points, uvs, radius, heightSegments, widthSegments, geometry) {
    for (var i = 0; i < heightSegments; i++) {
        for (var j = 0; j < widthSegments; j++) {
            var qIndex = quadIndex(i, j, widthSegments);
            var v0 = vertexIndex(qIndex, 0, widthSegments);
            var v1 = vertexIndex(qIndex, 1, widthSegments);
            var v2 = vertexIndex(qIndex, 2, widthSegments);
            var v3 = vertexIndex(qIndex, 3, widthSegments);
            // The normal vectors for the sphere are simply the normalized position vectors.
            var n0 = Vector3.copy(points[v0]).normalize();
            var n1 = Vector3.copy(points[v1]).normalize();
            var n2 = Vector3.copy(points[v2]).normalize();
            var n3 = Vector3.copy(points[v3]).normalize();
            // Grab the uv coordinates too.
            var uv0 = uvs[v0].clone();
            var uv1 = uvs[v1].clone();
            var uv2 = uvs[v2].clone();
            var uv3 = uvs[v3].clone();
            // Special case the north and south poles by only creating one triangle.
            // FIXME: What's the geometric equivalent here?
            /*
            if (Math.abs(points[v0].y) === radius) {
              uv0.x = (uv0.x + uv1.x) / 2;
              geometry.triangle([points[v0], points[v2], points[v3]], [n0, n2, n3], [uv0, uv2, uv3])
            }
            else if (Math.abs(points[v2].y) === radius) {
              uv2.x = (uv2.x + uv3.x) / 2;
              geometry.triangle([points[v0], points[v1], points[v2]], [n0, n1, n2], [uv0, uv1, uv2])
            }
            else {
              geometry.lineSegment([points[v0], points[v1]], [n0, n1], [uv0, uv1])
              geometry.lineSegment([points[v1], points[v2]], [n1, n2], [uv1, uv2])
              geometry.lineSegment([points[v2], points[v3]], [n2, n3], [uv2, uv3])
              geometry.lineSegment([points[v3], points[v0]], [n3, n0], [uv3, uv0])
            }
            */
            geometry.lineSegment([points[v0], points[v1]], [n0, n1], [uv0, uv1]);
            geometry.lineSegment([points[v1], points[v2]], [n1, n2], [uv1, uv2]);
            geometry.lineSegment([points[v2], points[v3]], [n2, n3], [uv2, uv3]);
            geometry.lineSegment([points[v3], points[v0]], [n3, n0], [uv3, uv0]);
        }
    }
}
function makePoints(points, uvs, radius, heightSegments, widthSegments, geometry) {
    for (var i = 0; i < heightSegments; i++) {
        for (var j = 0; j < widthSegments; j++) {
            var qIndex = quadIndex(i, j, widthSegments);
            var v0 = vertexIndex(qIndex, 0, widthSegments);
            var v1 = vertexIndex(qIndex, 1, widthSegments);
            var v2 = vertexIndex(qIndex, 2, widthSegments);
            var v3 = vertexIndex(qIndex, 3, widthSegments);
            // The normal vectors for the sphere are simply the normalized position vectors.
            var n0 = Vector3.copy(points[v0]).normalize();
            var n1 = Vector3.copy(points[v1]).normalize();
            var n2 = Vector3.copy(points[v2]).normalize();
            var n3 = Vector3.copy(points[v3]).normalize();
            // Grab the uv coordinates too.
            var uv0 = uvs[v0].clone();
            var uv1 = uvs[v1].clone();
            var uv2 = uvs[v2].clone();
            var uv3 = uvs[v3].clone();
            // Special case the north and south poles by only creating one triangle.
            // FIXME: What's the geometric equivalent here?
            /*
            if (Math.abs(points[v0].y) === radius) {
              uv0.x = (uv0.x + uv1.x) / 2;
              geometry.triangle([points[v0], points[v2], points[v3]], [n0, n2, n3], [uv0, uv2, uv3])
            }
            else if (Math.abs(points[v2].y) === radius) {
              uv2.x = (uv2.x + uv3.x) / 2;
              geometry.triangle([points[v0], points[v1], points[v2]], [n0, n1, n2], [uv0, uv1, uv2])
            }
            else {
              geometry.point([points[v0]], [n0], [uv0])
              geometry.point([points[v1]], [n1], [uv1])
              geometry.point([points[v2]], [n2], [uv2])
              geometry.point([points[v3]], [n3], [uv3])
            }
            */
            geometry.point([points[v0]], [n0], [uv0]);
            geometry.point([points[v1]], [n1], [uv1]);
            geometry.point([points[v2]], [n2], [uv2]);
            geometry.point([points[v3]], [n3], [uv3]);
        }
    }
}
var SphereSimplexPrimitivesBuilder = /** @class */ (function (_super) {
    __extends(SphereSimplexPrimitivesBuilder, _super);
    function SphereSimplexPrimitivesBuilder() {
        var _this = _super.call(this) || this;
        _this.tilt = Spinor3.one.clone();
        _this.azimuthStart = DEFAULT_AZIMUTH_START;
        _this.azimuthLength = DEFAULT_AZIMUTH_LENGTH;
        _this.azimuthSegments = DEFAULT_AZIMUTH_SEGMENTS;
        _this.elevationStart = DEFAULT_ELEVATION_START;
        _this.elevationLength = DEFAULT_ELEVATION_LENGTH;
        _this.elevationSegments = DEFAULT_ELEVATION_SEGMENTS;
        _this.setModified(true);
        _this.regenerate();
        return _this;
    }
    Object.defineProperty(SphereSimplexPrimitivesBuilder.prototype, "radius", {
        get: function () {
            return this.stress.x;
        },
        set: function (radius) {
            mustBeNumber('radius', radius);
            this.stress.x = radius;
            this.stress.y = radius;
            this.stress.z = radius;
        },
        enumerable: false,
        configurable: true
    });
    SphereSimplexPrimitivesBuilder.prototype.isModified = function () {
        return _super.prototype.isModified.call(this);
    };
    SphereSimplexPrimitivesBuilder.prototype.setModified = function (modified) {
        _super.prototype.setModified.call(this, modified);
        return this;
    };
    SphereSimplexPrimitivesBuilder.prototype.regenerate = function () {
        this.data = [];
        // Output. Could this be {[name:string]:VertexN<number>}[]
        var points = [];
        var uvs = [];
        computeSphereVerticesAndCoordinates(this.zenith, this.meridian, this.stress, this.tilt, this.offset, this.azimuthStart, this.azimuthLength, this.azimuthSegments, this.elevationStart, this.elevationLength, this.elevationSegments, points, uvs);
        switch (this.k) {
            case SimplexMode.EMPTY: {
                makeTriangles(points, uvs, this.radius, this.elevationSegments, this.azimuthSegments, this);
                break;
            }
            case SimplexMode.POINT: {
                makePoints(points, uvs, this.radius, this.elevationSegments, this.azimuthSegments, this);
                break;
            }
            case SimplexMode.LINE: {
                makeLineSegments(points, uvs, this.radius, this.elevationSegments, this.azimuthSegments, this);
                break;
            }
            case SimplexMode.TRIANGLE: {
                makeTriangles(points, uvs, this.radius, this.elevationSegments, this.azimuthSegments, this);
                break;
            }
            default: {
                console.warn(this.k + "-simplex is not supported for geometry generation.");
            }
        }
        this.setModified(false);
    };
    return SphereSimplexPrimitivesBuilder;
}(SimplexPrimitivesBuilder));
function spherePrimitive(options) {
    if (options === void 0) { options = { kind: 'SphereGeometry' }; }
    var builder = new SphereSimplexPrimitivesBuilder();
    // Radius
    if (isNumber(options.radius)) {
        builder.radius = options.radius;
    }
    else if (isUndefined(options.radius)) {
        builder.radius = DEFAULT_RADIUS;
    }
    else {
        mustBeNumber('radius', options.radius);
    }
    if (isInteger(options.mode)) {
        switch (options.mode) {
            case GeometryMode.POINT: {
                builder.k = SimplexMode.POINT;
                break;
            }
            case GeometryMode.WIRE: {
                builder.k = SimplexMode.LINE;
                break;
            }
            case GeometryMode.MESH: {
                builder.k = SimplexMode.TRIANGLE;
                break;
            }
            default: {
                throw new Error("options.mode must be POINT=" + GeometryMode.POINT + " or WIRE=" + GeometryMode.WIRE + " or MESH=" + GeometryMode.MESH + ".");
            }
        }
    }
    else if (isUndefined(options.mode)) {
        builder.k = SimplexMode.TRIANGLE;
    }
    else {
        mustBeInteger('mode', options.mode);
    }
    // Azimuth Start
    if (isNumber(options.azimuthStart)) {
        builder.azimuthStart = options.azimuthStart;
    }
    else if (isUndefined(options.azimuthStart)) {
        builder.azimuthStart = DEFAULT_AZIMUTH_START;
    }
    else {
        mustBeNumber('azimuthStart', options.azimuthStart);
    }
    // Azimuth Length
    if (isNumber(options.azimuthLength)) {
        builder.azimuthLength = options.azimuthLength;
    }
    else if (isUndefined(options.azimuthLength)) {
        builder.azimuthLength = DEFAULT_AZIMUTH_LENGTH;
    }
    else {
        mustBeNumber('azimuthLength', options.azimuthLength);
    }
    // Azimuth Segments
    if (isInteger(options.azimuthSegments)) {
        builder.azimuthSegments = mustBeGE('azimuthSegements', options.azimuthSegments, 3);
    }
    else if (isUndefined(options.azimuthSegments)) {
        builder.azimuthSegments = DEFAULT_AZIMUTH_SEGMENTS;
    }
    else {
        mustBeInteger('azimuthSegments', options.azimuthSegments);
    }
    // Elevation Start
    if (isNumber(options.elevationStart)) {
        builder.elevationStart = options.elevationStart;
    }
    else if (isUndefined(options.elevationStart)) {
        builder.elevationStart = DEFAULT_ELEVATION_START;
    }
    else {
        mustBeNumber('elevationStart', options.elevationStart);
    }
    // Elevation Length
    if (isNumber(options.elevationLength)) {
        builder.elevationLength = options.elevationLength;
    }
    else if (isUndefined(options.elevationLength)) {
        builder.elevationLength = DEFAULT_ELEVATION_LENGTH;
    }
    else {
        mustBeNumber('elevationLength', options.elevationLength);
    }
    // Elevation Segments
    if (isInteger(options.elevationSegments)) {
        builder.elevationSegments = mustBeGE('elevationSegments', options.elevationSegments, 2);
    }
    else if (isUndefined(options.elevationSegments)) {
        builder.elevationSegments = DEFAULT_ELEVATION_SEGMENTS;
    }
    else {
        mustBeInteger('elevationSegments', options.elevationSegments);
    }
    if (options.axis) {
        builder.zenith.copy(options.axis);
    }
    else {
        builder.zenith.copy(DEFAULT_ZENITH);
    }
    if (options.meridian) {
        builder.meridian.copy(options.meridian);
    }
    else {
        builder.meridian.copy(DEFAULT_MERIDIAN);
    }
    if (options.stress) {
        builder.stress.copy(options.stress);
    }
    else {
        builder.stress.copy(DEFAULT_STRESS);
    }
    if (options.tilt) {
        builder.tilt.copy(options.tilt);
    }
    else {
        builder.tilt.copy(DEFAULT_TILT);
    }
    if (options.offset) {
        builder.offset.copy(options.offset);
    }
    else {
        builder.offset.copy(DEFAULT_OFFSET);
    }
    var primitives = builder.toPrimitives();
    if (primitives.length === 1) {
        return primitives[0];
    }
    else {
        throw new Error("Expecting SphereSimplexPrimitivesBuilder to return one Primitive.");
    }
}
/**
 * A convenience class for creating sphere geometry elements.
 */
var SphereGeometry = /** @class */ (function (_super) {
    __extends(SphereGeometry, _super);
    /**
     *
     */
    function SphereGeometry(contextManager, options, levelUp) {
        if (options === void 0) { options = { kind: 'SphereGeometry' }; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, contextManager, spherePrimitive(options), options, levelUp + 1) || this;
        _this.setLoggingName('SphereGeometry');
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    SphereGeometry.prototype.resurrector = function (levelUp) {
        _super.prototype.resurrector.call(this, levelUp + 1);
        this.setLoggingName('SphereGeometry');
        if (levelUp === 0) {
            this.synchUp();
        }
    };
    /**
     *
     */
    SphereGeometry.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    return SphereGeometry;
}(GeometryElements));
export { SphereGeometry };
