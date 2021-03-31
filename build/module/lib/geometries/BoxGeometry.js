import { __extends } from "tslib";
import { GridTriangleStrip } from '../atoms/GridTriangleStrip';
import { reduce } from '../atoms/reduce';
import { isDefined } from '../checks/isDefined';
import { mustBeBoolean } from '../checks/mustBeBoolean';
import { mustBeNumber } from '../checks/mustBeNumber';
import { GeometryElements } from '../core/GeometryElements';
import { GraphicsProgramSymbols } from '../core/GraphicsProgramSymbols';
import { computeFaceNormals } from '../geometries/computeFaceNormals';
import { quadrilateral as quad } from '../geometries/quadrilateral';
import { Simplex } from '../geometries/Simplex';
import { SimplexMode } from '../geometries/SimplexMode';
import { SimplexPrimitivesBuilder } from '../geometries/SimplexPrimitivesBuilder';
import { Geometric3 } from '../math/Geometric3';
import { vec, vectorCopy } from '../math/R3';
import { Spinor3 } from '../math/Spinor3';
import { Vector1 } from '../math/Vector1';
import { Vector2 } from '../math/Vector2';
import { Vector3 } from '../math/Vector3';
import { GeometryMode } from './GeometryMode';
import { PrimitivesBuilder } from './PrimitivesBuilder';
/**
 * @hidden
 */
var canonicalAxis = vec(0, 1, 0);
/**
 * @hidden
 */
var canonicalMeridian = vec(0, 0, 1);
/**
 * e1
 * @hidden
 */
var DEFAULT_A = vec(1, 0, 0);
/**
 * e2
 * @hidden
 */
var DEFAULT_B = vec(0, 1, 0);
/**
 * e3
 * @hidden
 */
var DEFAULT_C = vec(0, 0, 1);
/**
 * @hidden
 */
var CuboidSimplexPrimitivesBuilder = /** @class */ (function (_super) {
    __extends(CuboidSimplexPrimitivesBuilder, _super);
    function CuboidSimplexPrimitivesBuilder(a, b, c, k, subdivide, boundary) {
        if (k === void 0) { k = SimplexMode.TRIANGLE; }
        if (subdivide === void 0) { subdivide = 0; }
        if (boundary === void 0) { boundary = 0; }
        var _this = _super.call(this) || this;
        _this._isModified = true;
        _this._a = Vector3.copy(a);
        _this._b = Vector3.copy(b);
        _this._c = Vector3.copy(c);
        _this.k = k;
        _this.subdivide(subdivide);
        _this.boundary(boundary);
        _this.regenerate();
        return _this;
    }
    Object.defineProperty(CuboidSimplexPrimitivesBuilder.prototype, "a", {
        get: function () {
            return this._a;
        },
        set: function (a) {
            this._a = a;
            this._isModified = true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CuboidSimplexPrimitivesBuilder.prototype, "b", {
        get: function () {
            return this._b;
        },
        set: function (b) {
            this._b = b;
            this._isModified = true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CuboidSimplexPrimitivesBuilder.prototype, "c", {
        get: function () {
            return this._c;
        },
        set: function (c) {
            this._c = c;
            this._isModified = true;
        },
        enumerable: false,
        configurable: true
    });
    CuboidSimplexPrimitivesBuilder.prototype.isModified = function () {
        return this._isModified || _super.prototype.isModified.call(this);
    };
    CuboidSimplexPrimitivesBuilder.prototype.setModified = function (modified) {
        this._isModified = modified;
        _super.prototype.setModified.call(this, modified);
        return this;
    };
    CuboidSimplexPrimitivesBuilder.prototype.regenerate = function () {
        var _this = this;
        this.setModified(false);
        // Define the anchor points relative to the origin.
        var pos = [0, 1, 2, 3, 4, 5, 6, 7].map(function () { return void 0; });
        pos[0] = new Vector3().sub(this._a).sub(this._b).add(this._c).divByScalar(2);
        pos[1] = new Vector3().add(this._a).sub(this._b).add(this._c).divByScalar(2);
        pos[2] = new Vector3().add(this._a).add(this._b).add(this._c).divByScalar(2);
        pos[3] = new Vector3().sub(this._a).add(this._b).add(this._c).divByScalar(2);
        pos[4] = new Vector3().copy(pos[3]).sub(this._c);
        pos[5] = new Vector3().copy(pos[2]).sub(this._c);
        pos[6] = new Vector3().copy(pos[1]).sub(this._c);
        pos[7] = new Vector3().copy(pos[0]).sub(this._c);
        // Perform the scale, tilt, offset active transformation.
        pos.forEach(function (point) {
            // point.scale(this.scale.x)
            point.rotate(_this.tilt);
            point.add(_this.offset);
        });
        function simplex(indices) {
            var simplex = new Simplex(indices.length - 1);
            for (var i = 0; i < indices.length; i++) {
                simplex.vertices[i].attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = pos[indices[i]];
                simplex.vertices[i].attributes[GraphicsProgramSymbols.ATTRIBUTE_GEOMETRY_INDEX] = new Vector1([i]);
            }
            return simplex;
        }
        switch (this.k) {
            case SimplexMode.POINT: {
                var points = [[0], [1], [2], [3], [4], [5], [6], [7]];
                this.data = points.map(function (point) { return simplex(point); });
                break;
            }
            case SimplexMode.LINE: {
                var lines = [[0, 1], [1, 2], [2, 3], [3, 0], [0, 7], [1, 6], [2, 5], [3, 4], [4, 5], [5, 6], [6, 7], [7, 4]];
                this.data = lines.map(function (line) { return simplex(line); });
                break;
            }
            case SimplexMode.TRIANGLE: {
                var faces = [0, 1, 2, 3, 4, 5].map(function () { return void 0; });
                faces[0] = quad(pos[0], pos[1], pos[2], pos[3]);
                faces[1] = quad(pos[1], pos[6], pos[5], pos[2]);
                faces[2] = quad(pos[7], pos[0], pos[3], pos[4]);
                faces[3] = quad(pos[6], pos[7], pos[4], pos[5]);
                faces[4] = quad(pos[3], pos[2], pos[5], pos[4]);
                faces[5] = quad(pos[7], pos[6], pos[1], pos[0]);
                this.data = faces.reduce(function (a, b) { return a.concat(b); }, []);
                this.data.forEach(function (simplex) {
                    computeFaceNormals(simplex);
                });
                break;
            }
            default: {
                // Do nothing.
            }
        }
        // Compute the meta data.
        this.check();
    };
    return CuboidSimplexPrimitivesBuilder;
}(SimplexPrimitivesBuilder));
/**
 * @hidden
 */
function side(tilt, offset, basis, uSegments, vSegments) {
    // The normal will be the same for all vertices in the side, so we compute it once here.
    // Perform the stress ant tilt transformations on the tangent bivector before computing the normal.
    var tangent = Spinor3.wedge(basis[0], basis[1]).rotate(tilt);
    var normal = Vector3.dual(tangent, true).normalize();
    var aNeg = Vector3.copy(basis[0]).scale(-0.5);
    var aPos = Vector3.copy(basis[0]).scale(+0.5);
    var bNeg = Vector3.copy(basis[1]).scale(-0.5);
    var bPos = Vector3.copy(basis[1]).scale(+0.5);
    var cPos = Vector3.copy(basis[2]).scale(+0.5);
    var side = new GridTriangleStrip(uSegments, vSegments);
    for (var uIndex = 0; uIndex < side.uLength; uIndex++) {
        for (var vIndex = 0; vIndex < side.vLength; vIndex++) {
            var u = uIndex / uSegments;
            var v = vIndex / vSegments;
            var a = Vector3.copy(aNeg).lerp(aPos, u);
            var b = Vector3.copy(bNeg).lerp(bPos, v);
            var vertex = side.vertex(uIndex, vIndex);
            var position = Vector3.copy(a).add(b).add(cPos);
            // Perform the stress, tilt, offset transformations (in that order)
            position.rotate(tilt);
            position.add(offset);
            vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = position;
            vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_NORMAL] = normal;
            vertex.attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS] = new Vector2([u, 1 - v]);
        }
    }
    return side;
}
/**
 * @hidden
 */
var CuboidPrimitivesBuilder = /** @class */ (function (_super) {
    __extends(CuboidPrimitivesBuilder, _super);
    function CuboidPrimitivesBuilder() {
        var _this = _super.call(this) || this;
        _this.iSegments = 1;
        _this.jSegments = 1;
        _this.kSegments = 1;
        _this.openBack = false;
        _this.openBase = false;
        _this.openFront = false;
        _this.openLeft = false;
        _this.openRight = false;
        _this.openCap = false;
        /**
         * The "width" direction. The default value is e1.
         */
        _this._a = Vector3.vector(1, 0, 0);
        /**
         * The "height" direction. The default value is e2.
         */
        _this._b = Vector3.vector(0, 1, 0);
        /**
         * The "depth" direction. The default value is e3.
         */
        _this._c = Vector3.vector(0, 0, 1);
        _this.sides = [];
        return _this;
    }
    Object.defineProperty(CuboidPrimitivesBuilder.prototype, "width", {
        get: function () {
            return this._a.magnitude();
        },
        set: function (width) {
            mustBeNumber('width', width);
            this._a.normalize().scale(width);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CuboidPrimitivesBuilder.prototype, "height", {
        get: function () {
            return this._b.magnitude();
        },
        set: function (height) {
            mustBeNumber('height', height);
            this._b.normalize().scale(height);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CuboidPrimitivesBuilder.prototype, "depth", {
        get: function () {
            return this._c.magnitude();
        },
        set: function (depth) {
            mustBeNumber('depth', depth);
            this._c.normalize().scale(depth);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Creates six TRIANGLE_STRIP faces using the GridTriangleStrip helper.
     */
    CuboidPrimitivesBuilder.prototype.regenerate = function () {
        this.sides = [];
        var t = this.tilt;
        var o = this.offset;
        if (!this.openFront) {
            this.sides.push(side(t, o, [this._a, this._b, this._c], this.iSegments, this.jSegments));
        }
        if (!this.openRight) {
            this.sides.push(side(t, o, [Vector3.copy(this._c).scale(-1), this._b, this._a], this.kSegments, this.jSegments));
        }
        if (!this.openLeft) {
            this.sides.push(side(t, o, [this._c, this._b, Vector3.copy(this._a).scale(-1)], this.kSegments, this.jSegments));
        }
        if (!this.openBack) {
            this.sides.push(side(t, o, [Vector3.copy(this._a).scale(-1), this._b, Vector3.copy(this._c).scale(-1)], this.iSegments, this.jSegments));
        }
        if (!this.openCap) {
            this.sides.push(side(t, o, [this._a, Vector3.copy(this._c).scale(-1), this._b], this.iSegments, this.kSegments));
        }
        if (!this.openBase) {
            this.sides.push(side(t, o, [this._a, this._c, Vector3.copy(this._b).scale(-1)], this.iSegments, this.kSegments));
        }
    };
    CuboidPrimitivesBuilder.prototype.toPrimitives = function () {
        this.regenerate();
        return this.sides.map(function (side) { return side.toPrimitive(); });
    };
    return CuboidPrimitivesBuilder;
}(PrimitivesBuilder));
/**
 * @hidden
 */
function boxPrimitive(options) {
    if (options === void 0) { options = { kind: 'BoxGeometry' }; }
    var width = isDefined(options.width) ? mustBeNumber('width', options.width) : 1;
    var height = isDefined(options.height) ? mustBeNumber('height', options.height) : 1;
    var depth = isDefined(options.depth) ? mustBeNumber('depth', options.depth) : 1;
    var axis = isDefined(options.axis) ? vectorCopy(options.axis).direction() : vec(0, 1, 0);
    var meridian = (isDefined(options.meridian) ? vectorCopy(options.meridian) : vec(0, 0, 1)).rejectionFrom(axis).direction();
    var tilt = Geometric3.rotorFromFrameToFrame([canonicalAxis, canonicalMeridian, canonicalAxis.cross(canonicalMeridian)], [axis, meridian, axis.cross(meridian)]);
    var mode = isDefined(options.mode) ? options.mode : GeometryMode.MESH;
    switch (mode) {
        case GeometryMode.POINT: {
            var a = DEFAULT_A.scale(width);
            var b = DEFAULT_B.scale(height);
            var c = DEFAULT_C.scale(depth);
            var builder = new CuboidSimplexPrimitivesBuilder(a, b, c, SimplexMode.POINT);
            if (options.stress) {
                builder.stress.copy(options.stress);
            }
            builder.tilt.copy(tilt);
            if (options.offset) {
                builder.offset.copy(options.offset);
            }
            var primitives = builder.toPrimitives();
            if (primitives.length === 1) {
                return primitives[0];
            }
            else {
                throw new Error("Expecting CuboidSimplexPrimitivesBuilder to return one Primitive.");
            }
        }
        case GeometryMode.WIRE: {
            var a = DEFAULT_A.scale(width);
            var b = DEFAULT_B.scale(height);
            var c = DEFAULT_C.scale(depth);
            var builder = new CuboidSimplexPrimitivesBuilder(a, b, c, SimplexMode.LINE);
            if (options.stress) {
                builder.stress.copy(options.stress);
            }
            builder.tilt.copy(tilt);
            if (options.offset) {
                builder.offset.copy(options.offset);
            }
            var primitives = builder.toPrimitives();
            if (primitives.length === 1) {
                return primitives[0];
            }
            else {
                throw new Error("Expecting CuboidSimplexPrimitivesBuilder to return one Primitive.");
            }
        }
        default: {
            var builder = new CuboidPrimitivesBuilder();
            builder.width = width;
            builder.height = height;
            builder.depth = depth;
            if (isDefined(options.openBack)) {
                builder.openBack = mustBeBoolean('openBack', options.openBack);
            }
            if (isDefined(options.openBase)) {
                builder.openBase = mustBeBoolean('openBase', options.openBase);
            }
            if (isDefined(options.openFront)) {
                builder.openFront = mustBeBoolean('openFront', options.openFront);
            }
            if (isDefined(options.openLeft)) {
                builder.openLeft = mustBeBoolean('openLeft', options.openLeft);
            }
            if (isDefined(options.openRight)) {
                builder.openRight = mustBeBoolean('openRight', options.openRight);
            }
            if (isDefined(options.openCap)) {
                builder.openCap = mustBeBoolean('openCap', options.openCap);
            }
            if (options.stress) {
                builder.stress.copy(options.stress);
            }
            builder.tilt.copy(tilt);
            if (options.offset) {
                builder.offset.copy(options.offset);
            }
            return reduce(builder.toPrimitives());
        }
    }
}
/**
 * A convenience class for creating a BoxGeometry.
 * @hidden
 */
var BoxGeometry = /** @class */ (function (_super) {
    __extends(BoxGeometry, _super);
    /**
     *
     */
    function BoxGeometry(contextManager, options, levelUp) {
        if (options === void 0) { options = { kind: 'BoxGeometry' }; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, contextManager, boxPrimitive(options), options, levelUp + 1) || this;
        _this.setLoggingName('BoxGeometry');
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    /**
     *
     */
    BoxGeometry.prototype.resurrector = function (levelUp) {
        _super.prototype.resurrector.call(this, levelUp + 1);
        this.setLoggingName('BoxGeometry');
        if (levelUp === 0) {
            this.synchUp();
        }
    };
    /**
     *
     */
    BoxGeometry.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    return BoxGeometry;
}(GeometryElements));
export { BoxGeometry };
