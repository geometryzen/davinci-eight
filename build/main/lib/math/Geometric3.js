"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var applyMixins_1 = require("../utils/applyMixins");
var approx_1 = require("./approx");
var arraysEQ_1 = require("./arraysEQ");
var dotVectorE3_1 = require("./dotVectorE3");
var extG3_1 = require("./extG3");
var gauss_1 = require("./gauss");
var isScalarG3_1 = require("./isScalarG3");
var isVectorE3_1 = require("./isVectorE3");
var isVectorG3_1 = require("./isVectorG3");
var lcoG3_1 = require("./lcoG3");
var Lockable_1 = require("../core/Lockable");
var maskG3_1 = require("./maskG3");
var mulE3_1 = require("./mulE3");
var mustBeEQ_1 = require("../checks/mustBeEQ");
var mustBeInteger_1 = require("../checks/mustBeInteger");
var randomRange_1 = require("./randomRange");
var rcoG3_1 = require("./rcoG3");
var rotorFromDirectionsE3_1 = require("./rotorFromDirectionsE3");
var scpG3_1 = require("./scpG3");
var squaredNormG3_1 = require("./squaredNormG3");
var stringFromCoordinates_1 = require("./stringFromCoordinates");
var wedgeXY_1 = require("./wedgeXY");
var wedgeYZ_1 = require("./wedgeYZ");
var wedgeZX_1 = require("./wedgeZX");
// Symbolic constants for the coordinate indices into the data array.
var COORD_SCALAR = 0;
var COORD_X = 1;
var COORD_Y = 2;
var COORD_Z = 3;
var COORD_XY = 4;
var COORD_YZ = 5;
var COORD_ZX = 6;
var COORD_PSEUDO = 7;
// FIXME: Change to Canonical ordering.
var BASIS_LABELS = ["1", "e1", "e2", "e3", "e12", "e23", "e31", "e123"];
var zero = function zero() {
    return [0, 0, 0, 0, 0, 0, 0, 0];
};
var scalar = function scalar(a) {
    var coords = zero();
    coords[COORD_SCALAR] = a;
    return coords;
};
var vector = function vector(x, y, z) {
    var coords = zero();
    coords[COORD_X] = x;
    coords[COORD_Y] = y;
    coords[COORD_Z] = z;
    return coords;
};
var bivector = function bivector(yz, zx, xy) {
    var coords = zero();
    coords[COORD_YZ] = yz;
    coords[COORD_ZX] = zx;
    coords[COORD_XY] = xy;
    return coords;
};
var spinor = function spinor(a, yz, zx, xy) {
    var coords = zero();
    coords[COORD_SCALAR] = a;
    coords[COORD_YZ] = yz;
    coords[COORD_ZX] = zx;
    coords[COORD_XY] = xy;
    return coords;
};
var multivector = function multivector(a, x, y, z, yz, zx, xy, b) {
    var coords = zero();
    coords[COORD_SCALAR] = a;
    coords[COORD_X] = x;
    coords[COORD_Y] = y;
    coords[COORD_Z] = z;
    coords[COORD_YZ] = yz;
    coords[COORD_ZX] = zx;
    coords[COORD_XY] = xy;
    coords[COORD_PSEUDO] = b;
    return coords;
};
var pseudo = function pseudo(b) {
    var coords = zero();
    coords[COORD_PSEUDO] = b;
    return coords;
};
function coordinates(m) {
    var coords = zero();
    coords[COORD_SCALAR] = m.a;
    coords[COORD_X] = m.x;
    coords[COORD_Y] = m.y;
    coords[COORD_Z] = m.z;
    coords[COORD_YZ] = m.yz;
    coords[COORD_ZX] = m.zx;
    coords[COORD_XY] = m.xy;
    coords[COORD_PSEUDO] = m.b;
    return coords;
}
/**
 * cos(a, b) = (a | b) / |a||b|
 */
function cosVectorVector(a, b) {
    function scp(c, d) {
        return c.x * d.x + c.y * d.y + c.z * d.z;
    }
    function norm(v) {
        return Math.sqrt(scp(v, v));
    }
    return scp(a, b) / (norm(a) * norm(b));
}
/**
 * Scratch variable for holding cosines.
 */
var cosines = [];
/**
 *
 */
var Geometric3 = (function () {
    /**
     * Constructs a <code>Geometric3</code>.
     * The multivector is initialized to zero.
     * coords [a, x, y, z, xy, yz, zx, b]
     */
    function Geometric3(coords) {
        if (coords === void 0) { coords = [0, 0, 0, 0, 0, 0, 0, 0]; }
        mustBeEQ_1.mustBeEQ('coords.length', coords.length, 8);
        this.coords_ = coords;
        this.modified_ = false;
    }
    Object.defineProperty(Geometric3.prototype, "length", {
        get: function () {
            return 8;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Geometric3.prototype, "modified", {
        get: function () {
            return this.modified_;
        },
        set: function (modified) {
            if (this.isLocked()) {
                throw new Lockable_1.TargetLockedError('set modified');
            }
            this.modified_ = modified;
        },
        enumerable: true,
        configurable: true
    });
    Geometric3.prototype.getComponent = function (i) {
        return this.coords_[i];
    };
    /**
     * Consistently set a coordinate value in the most optimized way,
     * by checking for a change from the old value to the new value.
     * The modified flag is only set to true if the value has changed.
     * Throws an exception if this multivector is locked.
     */
    Geometric3.prototype.setCoordinate = function (index, newValue, name) {
        if (this.isLocked()) {
            throw new Lockable_1.TargetLockedError("set " + name);
        }
        var coords = this.coords_;
        var oldValue = coords[index];
        if (newValue !== oldValue) {
            coords[index] = newValue;
            this.modified_ = true;
        }
    };
    Object.defineProperty(Geometric3.prototype, "a", {
        /**
         * The scalar part of this multivector.
         */
        get: function () {
            return this.coords_[COORD_SCALAR];
        },
        set: function (a) {
            this.setCoordinate(COORD_SCALAR, a, 'a');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Geometric3.prototype, "x", {
        /**
         * The coordinate corresponding to the <b>e</b><sub>1</sub> standard basis vector.
         */
        get: function () {
            return this.coords_[COORD_X];
        },
        set: function (x) {
            this.setCoordinate(COORD_X, x, 'x');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Geometric3.prototype, "y", {
        /**
         * The coordinate corresponding to the <b>e</b><sub>2</sub> standard basis vector.
         */
        get: function () {
            return this.coords_[COORD_Y];
        },
        set: function (y) {
            this.setCoordinate(COORD_Y, y, 'y');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Geometric3.prototype, "z", {
        /**
         * The coordinate corresponding to the <b>e</b><sub>3</sub> standard basis vector.
         */
        get: function () {
            return this.coords_[COORD_Z];
        },
        set: function (z) {
            this.setCoordinate(COORD_Z, z, 'z');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Geometric3.prototype, "yz", {
        /**
         * The coordinate corresponding to the <b>e</b><sub>2</sub><b>e</b><sub>3</sub> standard basis bivector.
         */
        get: function () {
            return this.coords_[COORD_YZ];
        },
        set: function (yz) {
            this.setCoordinate(COORD_YZ, yz, 'yz');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Geometric3.prototype, "zx", {
        /**
         * The coordinate corresponding to the <b>e</b><sub>3</sub><b>e</b><sub>1</sub> standard basis bivector.
         */
        get: function () {
            return this.coords_[COORD_ZX];
        },
        set: function (zx) {
            this.setCoordinate(COORD_ZX, zx, 'zx');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Geometric3.prototype, "xy", {
        /**
         * The coordinate corresponding to the <b>e</b><sub>1</sub><b>e</b><sub>2</sub> standard basis bivector.
         */
        get: function () {
            return this.coords_[COORD_XY];
        },
        set: function (xy) {
            this.setCoordinate(COORD_XY, xy, 'xy');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Geometric3.prototype, "b", {
        /**
         * The pseudoscalar part of this multivector.
         */
        get: function () {
            return this.coords_[COORD_PSEUDO];
        },
        set: function (b) {
            this.setCoordinate(COORD_PSEUDO, b, 'b');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Geometric3.prototype, "maskG3", {
        /**
         * A bitmask describing the grades.
         *
         * 0x0 = zero
         * 0x1 = scalar
         * 0x2 = vector
         * 0x4 = bivector
         * 0x8 = pseudoscalar
         */
        get: function () {
            var coords = this.coords_;
            var α = coords[COORD_SCALAR];
            var x = coords[COORD_X];
            var y = coords[COORD_Y];
            var z = coords[COORD_Z];
            var yz = coords[COORD_YZ];
            var zx = coords[COORD_ZX];
            var xy = coords[COORD_XY];
            var β = coords[COORD_PSEUDO];
            var mask = 0x0;
            if (α !== 0) {
                mask += 0x1;
            }
            if (x !== 0 || y !== 0 || z !== 0) {
                mask += 0x2;
            }
            if (yz !== 0 || zx !== 0 || xy !== 0) {
                mask += 0x4;
            }
            if (β !== 0) {
                mask += 0x8;
            }
            return mask;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Adds a multivector value to this multivector with optional scaling.
     *
     * this ⟼ this + M * alpha
     *
     * @param M The multivector to be added to this multivector.
     * @param alpha An optional scale factor that multiplies the multivector argument.
     *
     * @returns this + M * alpha
     */
    Geometric3.prototype.add = function (M, alpha) {
        if (alpha === void 0) { alpha = 1; }
        if (this.isLocked()) {
            return Lockable_1.lock(this.clone().add(M, alpha));
        }
        else {
            this.a += M.a * alpha;
            this.x += M.x * alpha;
            this.y += M.y * alpha;
            this.z += M.z * alpha;
            this.yz += M.yz * alpha;
            this.zx += M.zx * alpha;
            this.xy += M.xy * alpha;
            this.b += M.b * alpha;
            return this;
        }
    };
    /**
     * Adds a bivector value to this multivector.
     *
     * this ⟼ this + B
     *
     * @returns this + B
     */
    Geometric3.prototype.addBivector = function (B) {
        if (this.isLocked()) {
            return Lockable_1.lock(this.clone().addBivector(B));
        }
        else {
            this.yz += B.yz;
            this.zx += B.zx;
            this.xy += B.xy;
            return this;
        }
    };
    /**
     * Adds a pseudoscalar value to this multivector.
     *
     * this ⟼ this + I * β
     *
     * @param β The pseudoscalar value to be added to this multivector.
     * @returns this + I * β
     */
    Geometric3.prototype.addPseudo = function (β) {
        if (this.isLocked()) {
            return Lockable_1.lock(this.clone().addPseudo(β));
        }
        else {
            this.b += β;
            return this;
        }
    };
    /**
     * Adds a scalar value to this multivector.
     *
     * @param alpha The scalar value to be added to this multivector.
     * @return this + alpha
     */
    Geometric3.prototype.addScalar = function (alpha) {
        if (this.isLocked()) {
            return Lockable_1.lock(this.clone().addScalar(alpha));
        }
        else {
            this.a += alpha;
            return this;
        }
    };
    /**
     * Adds a vector value to this multivector.
     *
     * @param v The vector to be added.
     * @param alpha The scaling factor for the vector.
     * @returns this + v * alpha
     */
    Geometric3.prototype.addVector = function (v, alpha) {
        if (alpha === void 0) { alpha = 1; }
        if (this.isLocked()) {
            return this.clone().addVector(v, alpha);
        }
        else {
            this.x += v.x * alpha;
            this.y += v.y * alpha;
            this.z += v.z * alpha;
            return this;
        }
    };
    /**
     * <p>
     * <code>this ⟼ a + b</code>
     * </p>
     *
     * @param a
     * @param b
     */
    Geometric3.prototype.add2 = function (a, b) {
        if (this.isLocked()) {
            throw new Lockable_1.TargetLockedError('add2');
        }
        this.a = a.a + b.a;
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.z = a.z + b.z;
        this.yz = a.yz + b.yz;
        this.zx = a.zx + b.zx;
        this.xy = a.xy + b.xy;
        this.b = a.b + b.b;
        return this;
    };
    /**
     * arg(A) = grade(log(A), 2)
     *
     * @returns The arg of <code>this</code> multivector.
     */
    Geometric3.prototype.arg = function () {
        if (this.isLocked()) {
            return Lockable_1.lock(this.clone().arg());
        }
        else {
            return this.log().grade(2);
        }
    };
    /**
     * Sets any coordinate whose absolute value is less than pow(10, -n) times the absolute value of the largest coordinate.
     */
    Geometric3.prototype.approx = function (n) {
        if (this.isLocked()) {
            return Lockable_1.lock(this.clone().approx(n));
        }
        else {
            approx_1.approx(this.coords_, n);
            return this;
        }
    };
    /**
     * @returns <code>copy(this)</code>
     */
    Geometric3.prototype.clone = function () {
        return Geometric3.copy(this);
    };
    /**
     * The Clifford conjugate.
     * The multiplier for the grade x is (-1) raised to the power x * (x + 1) / 2
     * The pattern of grades is +--++--+
     *
     * @returns conj(this)
     */
    Geometric3.prototype.conj = function () {
        if (this.isLocked()) {
            return Lockable_1.lock(this.clone().conj());
        }
        else {
            // The grade 0 (scalar) coordinate is unchanged.
            // The grade 1 (vector) coordinates change sign.
            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;
            // The grade 2 (bivector) coordinates change sign.
            this.yz = -this.yz;
            this.zx = -this.zx;
            this.xy = -this.xy;
            // The grade 3 (pseudoscalar) coordinate is unchanged.
            return this;
        }
    };
    /**
     * Copies the coordinate values into this <code>Geometric3</code>.
     *
     * @param coordinates The coordinates in order a, x, y, z, yz, zx, xy, b.
     */
    Geometric3.prototype.copyCoordinates = function (coordinates) {
        if (this.isLocked()) {
            throw new Lockable_1.TargetLockedError('copyCoordinates');
        }
        // Copy using the setters so that the modified flag is updated.
        this.a = coordinates[COORD_SCALAR];
        this.x = coordinates[COORD_X];
        this.y = coordinates[COORD_Y];
        this.z = coordinates[COORD_Z];
        this.yz = coordinates[COORD_YZ];
        this.zx = coordinates[COORD_ZX];
        this.xy = coordinates[COORD_XY];
        this.b = coordinates[COORD_PSEUDO];
        return this;
    };
    /**
     * @param point
     */
    Geometric3.prototype.distanceTo = function (point) {
        if (point) {
            return Math.sqrt(this.quadranceTo(point));
        }
        else {
            throw new Error("point must be a VectorE3");
        }
    };
    /**
     * Computes the quadrance from this position (vector) to the specified point.
     */
    Geometric3.prototype.quadranceTo = function (point) {
        if (point) {
            var dx = this.x - point.x;
            var dy = this.y - point.y;
            var dz = this.z - point.z;
            return dx * dx + dy * dy + dz * dz;
        }
        else {
            throw new Error("point must be a VectorE3");
        }
    };
    /**
     * Left contraction of this multivector with another multivector.
     * @param m
     * @returns this << m
     */
    Geometric3.prototype.lco = function (m) {
        if (this.isLocked()) {
            return Lockable_1.lock(this.clone().lco(m));
        }
        else {
            return this.lco2(this, m);
        }
    };
    /**
     * Sets this multivector to a << b
     *
     * @param a
     * @param b
     * @returns a << b
     */
    Geometric3.prototype.lco2 = function (a, b) {
        if (this.isLocked()) {
            throw new Lockable_1.TargetLockedError('lco2');
        }
        return lcoG3_1.lcoG3(a, b, this);
    };
    /**
     * Right contraction.
     *
     * A >> B = grade(A * B, a - b) = <code>A.rco(B)</code>
     *
     * @returns this >> rhs
     */
    Geometric3.prototype.rco = function (m) {
        return this.rco2(this, m);
    };
    /**
     * <p>
     * <code>this ⟼ a >> b</code>
     * </p>
     *
     * @param a
     * @param b
     */
    Geometric3.prototype.rco2 = function (a, b) {
        if (this.isLocked()) {
            throw new Lockable_1.TargetLockedError('rco2');
        }
        return rcoG3_1.rcoG3(a, b, this);
    };
    /**
     * Sets this multivector to be a copy of another multivector.
     * @returns copy(M)
     */
    Geometric3.prototype.copy = function (M) {
        if (this.isLocked()) {
            throw new Lockable_1.TargetLockedError('copy');
        }
        this.a = M.a;
        this.x = M.x;
        this.y = M.y;
        this.z = M.z;
        this.yz = M.yz;
        this.zx = M.zx;
        this.xy = M.xy;
        this.b = M.b;
        return this;
    };
    /**
     * Sets this multivector to the value of the scalar, α.
     * The non-scalar components are set to zero.
     *
     * @param α The scalar to be copied.
     */
    Geometric3.prototype.copyScalar = function (α) {
        if (this.isLocked()) {
            throw new Lockable_1.TargetLockedError('copyScalar');
        }
        this.setCoordinate(COORD_SCALAR, α, 'a');
        this.setCoordinate(COORD_X, 0, 'x');
        this.setCoordinate(COORD_Y, 0, 'y');
        this.setCoordinate(COORD_Z, 0, 'z');
        this.setCoordinate(COORD_YZ, 0, 'yz');
        this.setCoordinate(COORD_ZX, 0, 'zx');
        this.setCoordinate(COORD_XY, 0, 'xy');
        this.setCoordinate(COORD_PSEUDO, 0, 'b');
        return this;
    };
    /**
     * Copies the spinor argument value into this multivector.
     * The non-spinor components are set to zero.
     *
     * @param spinor The spinor to be copied.
     */
    Geometric3.prototype.copySpinor = function (spinor) {
        if (this.isLocked()) {
            throw new Lockable_1.TargetLockedError('copySpinor');
        }
        this.setCoordinate(COORD_SCALAR, spinor.a, 'a');
        this.setCoordinate(COORD_X, 0, 'x');
        this.setCoordinate(COORD_Y, 0, 'y');
        this.setCoordinate(COORD_Z, 0, 'z');
        this.setCoordinate(COORD_YZ, spinor.yz, 'yz');
        this.setCoordinate(COORD_ZX, spinor.zx, 'zx');
        this.setCoordinate(COORD_XY, spinor.xy, 'xy');
        this.setCoordinate(COORD_PSEUDO, 0, 'b');
        return this;
    };
    /**
     * Copies the vector argument value into this multivector.
     * The non-vector components are set to zero.
     *
     * @param vector The vector to be copied.
     */
    Geometric3.prototype.copyVector = function (vector) {
        if (this.isLocked()) {
            throw new Lockable_1.TargetLockedError('copyVector');
        }
        this.setCoordinate(COORD_SCALAR, 0, 'a');
        this.setCoordinate(COORD_X, vector.x, 'x');
        this.setCoordinate(COORD_Y, vector.y, 'y');
        this.setCoordinate(COORD_Z, vector.z, 'z');
        this.setCoordinate(COORD_YZ, 0, 'yz');
        this.setCoordinate(COORD_ZX, 0, 'zx');
        this.setCoordinate(COORD_XY, 0, 'xy');
        this.setCoordinate(COORD_PSEUDO, 0, 'b');
        return this;
    };
    /**
     * Sets this multivector to the generalized vector cross product with another multivector.
     * <p>
     * <code>this ⟼ -I * (this ^ m)</code>
     * </p>
     */
    Geometric3.prototype.cross = function (m) {
        if (this.isLocked()) {
            return Lockable_1.lock(this.clone().cross(m));
        }
        else {
            this.ext(m);
            this.dual(this).neg();
            return this;
        }
    };
    /**
     * <p>
     * <code>this ⟼ this / m</code>
     * </p>
     *
     * @param m The multivector dividend.
     * @returns this / m
     */
    Geometric3.prototype.div = function (m) {
        if (isScalarG3_1.isScalarG3(m)) {
            return this.divByScalar(m.a);
        }
        else if (isVectorG3_1.isVectorG3(m)) {
            return this.divByVector(m);
        }
        else {
            if (this.isLocked()) {
                return Lockable_1.lock(this.clone().div(m));
            }
            else {
                var α = m.a;
                var x = m.x;
                var y = m.y;
                var z = m.z;
                var xy = m.xy;
                var yz = m.yz;
                var zx = m.zx;
                var β = m.b;
                var A = [
                    [α, x, y, z, -xy, -yz, -zx, -β],
                    [x, α, xy, -zx, -y, -β, z, -yz],
                    [y, -xy, α, yz, x, -z, -β, -zx],
                    [z, zx, -yz, α, -β, y, -x, -xy],
                    [xy, -y, x, β, α, zx, -yz, z],
                    [yz, β, -z, y, -zx, α, xy, x],
                    [zx, z, β, -x, yz, -xy, α, y],
                    [β, yz, zx, xy, z, x, y, α]
                ];
                var b = [1, 0, 0, 0, 0, 0, 0, 0];
                var X = gauss_1.gauss(A, b);
                var a0 = this.a;
                var a1 = this.x;
                var a2 = this.y;
                var a3 = this.z;
                var a4 = this.xy;
                var a5 = this.yz;
                var a6 = this.zx;
                var a7 = this.b;
                var b0 = X[0];
                var b1 = X[1];
                var b2 = X[2];
                var b3 = X[3];
                var b4 = X[4];
                var b5 = X[5];
                var b6 = X[6];
                var b7 = X[7];
                var c0 = mulE3_1.mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0);
                var c1 = mulE3_1.mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 1);
                var c2 = mulE3_1.mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 2);
                var c3 = mulE3_1.mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 3);
                var c4 = mulE3_1.mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 4);
                var c5 = mulE3_1.mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 5);
                var c6 = mulE3_1.mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 6);
                var c7 = mulE3_1.mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 7);
                this.a = c0;
                this.x = c1;
                this.y = c2;
                this.z = c3;
                this.xy = c4;
                this.yz = c5;
                this.zx = c6;
                this.b = c7;
            }
            return this;
        }
    };
    /**
     * Division of this multivector by a scalar.
     *
     * @returns this / alpha
     */
    Geometric3.prototype.divByScalar = function (alpha) {
        if (this.isLocked()) {
            return Lockable_1.lock(this.clone().divByScalar(alpha));
        }
        else {
            this.a /= alpha;
            this.x /= alpha;
            this.y /= alpha;
            this.z /= alpha;
            this.yz /= alpha;
            this.zx /= alpha;
            this.xy /= alpha;
            this.b /= alpha;
            return this;
        }
    };
    /**
     * this ⟼ this / v
     *
     * @param v The vector on the right hand side of the / operator.
     * @returns this / v
     */
    Geometric3.prototype.divByVector = function (v) {
        if (this.isLocked()) {
            return this.clone().divByVector(v);
        }
        else {
            var x = v.x;
            var y = v.y;
            var z = v.z;
            var squaredNorm = x * x + y * y + z * z;
            return this.mulByVector(v).divByScalar(squaredNorm);
        }
    };
    /**
     * this ⟼ a / b
     */
    Geometric3.prototype.div2 = function (a, b) {
        if (this.isLocked()) {
            throw new Lockable_1.TargetLockedError('div2');
        }
        else {
            // FIXME: Generalize
            var a0 = a.a;
            var a1 = a.yz;
            var a2 = a.zx;
            var a3 = a.xy;
            var b0 = b.a;
            var b1 = b.yz;
            var b2 = b.zx;
            var b3 = b.xy;
            // Compare this to the product for Quaternions
            // It would be interesting to DRY this out.
            this.a = a0 * b0 - a1 * b1 - a2 * b2 - a3 * b3;
            // this.a = a0 * b0 - dotVectorCartesianE3(a1, a2, a3, b1, b2, b3)
            this.yz = a0 * b1 + a1 * b0 - a2 * b3 + a3 * b2;
            this.zx = a0 * b2 + a1 * b3 + a2 * b0 - a3 * b1;
            this.xy = a0 * b3 - a1 * b2 + a2 * b1 + a3 * b0;
            return this;
        }
    };
    /**
     * this ⟼ dual(m) = I * m
     */
    Geometric3.prototype.dual = function (m) {
        if (this.isLocked()) {
            return this.clone().dual(m);
        }
        else {
            if (m) {
                var w = -m.b;
                var x = -m.yz;
                var y = -m.zx;
                var z = -m.xy;
                var yz = m.x;
                var zx = m.y;
                var xy = m.z;
                var β = m.a;
                this.a = w;
                this.x = x;
                this.y = y;
                this.z = z;
                this.yz = yz;
                this.zx = zx;
                this.xy = xy;
                this.b = β;
                return this;
            }
            else {
                return this.dual(this);
            }
        }
    };
    /**
     * @param other
     * @returns
     */
    Geometric3.prototype.equals = function (other) {
        if (other instanceof Geometric3) {
            var that = other;
            return arraysEQ_1.arraysEQ(this.coords_, that.coords_);
        }
        else {
            return false;
        }
    };
    /**
     * this ⟼ exp(this)
     */
    Geometric3.prototype.exp = function () {
        if (this.isLocked()) {
            return Lockable_1.lock(this.clone().exp());
        }
        else {
            // It's always the case that the scalar commutes with every other
            // grade of the multivector, so we can pull it out the front.
            var expW = Math.exp(this.a);
            // In Geometric3 we have the special case that the pseudoscalar also commutes.
            // And since it squares to -1, we get a exp(Iβ) = cos(β) + I * sin(β) factor.
            // let cosβ = cos(this.b)
            // let sinβ = sin(this.b)
            // We are left with the vector and bivector components.
            // For a bivector (usual case), let B = I * φ, where φ is a vector.
            // We would get cos(φ) + I * n * sin(φ), where φ = |φ|n and n is a unit vector.
            var yz = this.yz;
            var zx = this.zx;
            var xy = this.xy;
            // φ is actually the absolute value of one half the rotation angle.
            // The orientation of the rotation gets carried in the bivector components.
            var φ = Math.sqrt(yz * yz + zx * zx + xy * xy);
            var s = φ !== 0 ? Math.sin(φ) / φ : 1;
            var cosφ = Math.cos(φ);
            // For a vector a, we use exp(a) = cosh(a) + n * sinh(a)
            // The mixture of vector and bivector parts is more complex!
            this.a = cosφ;
            this.yz = yz * s;
            this.zx = zx * s;
            this.xy = xy * s;
            return this.scale(expW);
        }
    };
    /**
     * @returns inverse(this)
     */
    Geometric3.prototype.inv = function () {
        if (this.isLocked()) {
            return Lockable_1.lock(this.clone().inv());
        }
        else {
            var α = this.a;
            var x = this.x;
            var y = this.y;
            var z = this.z;
            var xy = this.xy;
            var yz = this.yz;
            var zx = this.zx;
            var β = this.b;
            var A = [
                [α, x, y, z, -xy, -yz, -zx, -β],
                [x, α, xy, -zx, -y, -β, z, -yz],
                [y, -xy, α, yz, x, -z, -β, -zx],
                [z, zx, -yz, α, -β, y, -x, -xy],
                [xy, -y, x, β, α, zx, -yz, z],
                [yz, β, -z, y, -zx, α, xy, x],
                [zx, z, β, -x, yz, -xy, α, y],
                [β, yz, zx, xy, z, x, y, α]
            ];
            var b = [1, 0, 0, 0, 0, 0, 0, 0];
            var X = gauss_1.gauss(A, b);
            this.a = X[0];
            this.x = X[1];
            this.y = X[2];
            this.z = X[3];
            this.xy = X[4];
            this.yz = X[5];
            this.zx = X[6];
            this.b = X[7];
            return this;
        }
    };
    /**
     * Determins whether this multivector is exactly zero.
     */
    Geometric3.prototype.isOne = function () {
        return this.a === 1 && this.x === 0 && this.y === 0 && this.z === 0 && this.yz === 0 && this.zx === 0 && this.xy === 0 && this.b === 0;
    };
    /**
     * Determins whether this multivector is exactly one.
     */
    Geometric3.prototype.isZero = function () {
        return this.a === 0 && this.x === 0 && this.y === 0 && this.z === 0 && this.yz === 0 && this.zx === 0 && this.xy === 0 && this.b === 0;
    };
    /**
     * @returns this + α * (target - this)
     */
    Geometric3.prototype.lerp = function (target, α) {
        if (this.isLocked()) {
            return Lockable_1.lock(this.clone().lerp(target, α));
        }
        else {
            this.a += (target.a - this.a) * α;
            this.x += (target.x - this.x) * α;
            this.y += (target.y - this.y) * α;
            this.z += (target.z - this.z) * α;
            this.yz += (target.yz - this.yz) * α;
            this.zx += (target.zx - this.zx) * α;
            this.xy += (target.xy - this.xy) * α;
            this.b += (target.b - this.b) * α;
            return this;
        }
    };
    /**
     * Linear interpolation.
     * Sets this multivector to a + α * (b - a)
     */
    Geometric3.prototype.lerp2 = function (a, b, α) {
        if (this.isLocked()) {
            throw new Lockable_1.TargetLockedError('lerp2');
        }
        this.copy(a).lerp(b, α);
        return this;
    };
    /**
     * this ⟼ log(this)
     *
     * @returns log(this)
     */
    Geometric3.prototype.log = function () {
        if (this.isLocked()) {
            return Lockable_1.lock(this.clone().log());
        }
        else {
            var α = this.a;
            var x = this.yz;
            var y = this.zx;
            var z = this.xy;
            var BB = x * x + y * y + z * z;
            var B = Math.sqrt(BB);
            var f = Math.atan2(B, α) / B;
            this.a = Math.log(Math.sqrt(α * α + BB));
            this.yz = x * f;
            this.zx = y * f;
            this.xy = z * f;
            return this;
        }
    };
    /**
     * magnitude(this) = sqrt(this | ~this)
     */
    Geometric3.prototype.magnitude = function () {
        return Math.sqrt(this.quaditude());
    };
    /**
     * this ⟼ this * m
     *
     * @returns this * m
     */
    Geometric3.prototype.mul = function (m) {
        if (this.isLocked()) {
            return Lockable_1.lock(this.clone().mul(m));
        }
        else {
            return this.mul2(this, m);
        }
    };
    Geometric3.prototype.mulByVector = function (vector) {
        var a0 = this.a;
        var a1 = this.x;
        var a2 = this.y;
        var a3 = this.z;
        var a4 = this.xy;
        var a5 = this.yz;
        var a6 = this.zx;
        var a7 = this.b;
        var b0 = 0;
        var b1 = vector.x;
        var b2 = vector.y;
        var b3 = vector.z;
        var b4 = 0;
        var b5 = 0;
        var b6 = 0;
        var b7 = 0;
        // TODO: substitute a cheaper multiplication function.
        this.a = mulE3_1.mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0);
        this.x = mulE3_1.mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 1);
        this.y = mulE3_1.mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 2);
        this.z = mulE3_1.mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 3);
        this.xy = mulE3_1.mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 4);
        this.yz = mulE3_1.mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 5);
        this.zx = mulE3_1.mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 6);
        this.b = mulE3_1.mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 7);
        return this;
    };
    /**
     * this ⟼ a * b
     */
    Geometric3.prototype.mul2 = function (a, b) {
        if (this.isLocked()) {
            throw new Lockable_1.TargetLockedError('mul2');
        }
        var a0 = a.a;
        var a1 = a.x;
        var a2 = a.y;
        var a3 = a.z;
        var a4 = a.xy;
        var a5 = a.yz;
        var a6 = a.zx;
        var a7 = a.b;
        var b0 = b.a;
        var b1 = b.x;
        var b2 = b.y;
        var b3 = b.z;
        var b4 = b.xy;
        var b5 = b.yz;
        var b6 = b.zx;
        var b7 = b.b;
        this.a = mulE3_1.mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0);
        this.x = mulE3_1.mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 1);
        this.y = mulE3_1.mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 2);
        this.z = mulE3_1.mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 3);
        this.xy = mulE3_1.mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 4);
        this.yz = mulE3_1.mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 5);
        this.zx = mulE3_1.mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 6);
        this.b = mulE3_1.mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 7);
        return this;
    };
    /**
     * this ⟼ -1 * this
     *
     * @returns -1 * this
     */
    Geometric3.prototype.neg = function () {
        if (this.isLocked()) {
            return Lockable_1.lock(this.clone().neg());
        }
        else {
            this.a = -this.a;
            this.x = -this.x;
            this.y = -this.y;
            this.z = -this.z;
            this.yz = -this.yz;
            this.zx = -this.zx;
            this.xy = -this.xy;
            this.b = -this.b;
            return this;
        }
    };
    /**
     * norm(A) = |A| = A | ~A, where | is the scalar product and ~ is reversion.
     *
     * this ⟼ magnitude(this) = sqrt(scp(this, rev(this))) = sqrt(this | ~this)
     *
     * @returns norm(this)
     */
    Geometric3.prototype.norm = function () {
        if (this.isLocked()) {
            return Lockable_1.lock(this.clone().norm());
        }
        else {
            this.a = this.magnitude();
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.yz = 0;
            this.zx = 0;
            this.xy = 0;
            this.b = 0;
            return this;
        }
    };
    /**
     * @returns this / magnitude(this)
     */
    Geometric3.prototype.direction = function () {
        return this.normalize();
    };
    /**
     * this ⟼ this / magnitude(this)
     *
     * If the magnitude is zero (a null multivector), this multivector is unchanged.
     * Since the metric is Euclidean, this will only happen if the multivector is also the
     * zero multivector.
     */
    Geometric3.prototype.normalize = function () {
        if (this.isLocked()) {
            return Lockable_1.lock(this.clone().normalize());
        }
        else {
            var norm = this.magnitude();
            if (norm !== 0) {
                this.a = this.a / norm;
                this.x = this.x / norm;
                this.y = this.y / norm;
                this.z = this.z / norm;
                this.yz = this.yz / norm;
                this.zx = this.zx / norm;
                this.xy = this.xy / norm;
                this.b = this.b / norm;
            }
            return this;
        }
    };
    /**
     * Sets this multivector to the identity element for multiplication, 1.
     */
    Geometric3.prototype.one = function () {
        if (this.isLocked()) {
            throw new Lockable_1.TargetLockedError('one');
        }
        this.a = 1;
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.yz = 0;
        this.zx = 0;
        this.xy = 0;
        this.b = 0;
        return this;
    };
    /**
     * squaredNorm(A) = |A||A| = A | ~A
     *
     * Returns the (squared) norm of this multivector.
     *
     * If this multivector is mutable (unlocked), then it is set to the squared norm of this multivector,
     * and the return value is this multivector.
     * If thus multivector is immutable (locked), then a new multivector is returned which is also immutable.
     *
     * this ⟼ squaredNorm(this) = scp(this, rev(this)) = this | ~this
     *
     * @returns squaredNorm(this)
     */
    Geometric3.prototype.squaredNorm = function () {
        if (this.isLocked()) {
            return Lockable_1.lock(this.clone().squaredNorm());
        }
        else {
            this.a = squaredNormG3_1.squaredNormG3(this);
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.yz = 0;
            this.zx = 0;
            this.xy = 0;
            this.b = 0;
            return this;
        }
    };
    /**
     * Computes the square of the magnitude.
     */
    Geometric3.prototype.quaditude = function () {
        return squaredNormG3_1.squaredNormG3(this);
    };
    /**
     * Sets this multivector to its reflection in the plane orthogonal to vector n.
     *
     * Mathematically,
     *
     * this ⟼ - n * this * n
     *
     * Geometrically,
     *
     * Reflects this multivector in the plane orthogonal to the unit vector, n.
     *
     * If n is not a unit vector then the result is scaled by n squared.
     *
     * @param n The unit vector that defines the reflection plane.
     */
    Geometric3.prototype.reflect = function (n) {
        if (this.isLocked()) {
            return Lockable_1.lock(this.clone().reflect(n));
        }
        else {
            var n1 = n.x;
            var n2 = n.y;
            var n3 = n.z;
            var n11 = n1 * n1;
            var n22 = n2 * n2;
            var n33 = n3 * n3;
            var nn = n11 + n22 + n33;
            var f1 = 2 * n2 * n3;
            var f2 = 2 * n3 * n1;
            var f3 = 2 * n1 * n2;
            var t1 = n22 + n33 - n11;
            var t2 = n33 + n11 - n22;
            var t3 = n11 + n22 - n33;
            var cs = this.coords_;
            var a = cs[COORD_SCALAR];
            var x1 = cs[COORD_X];
            var x2 = cs[COORD_Y];
            var x3 = cs[COORD_Z];
            var B3 = cs[COORD_XY];
            var B1 = cs[COORD_YZ];
            var B2 = cs[COORD_ZX];
            var b = cs[COORD_PSEUDO];
            this.setCoordinate(COORD_SCALAR, -nn * a, 'a');
            this.setCoordinate(COORD_X, x1 * t1 - x2 * f3 - x3 * f2, 'x');
            this.setCoordinate(COORD_Y, x2 * t2 - x3 * f1 - x1 * f3, 'y');
            this.setCoordinate(COORD_Z, x3 * t3 - x1 * f2 - x2 * f1, 'z');
            this.setCoordinate(COORD_XY, B3 * t3 - B1 * f2 - B2 * f1, 'xy');
            this.setCoordinate(COORD_YZ, B1 * t1 - B2 * f3 - B3 * f2, 'yz');
            this.setCoordinate(COORD_ZX, B2 * t2 - B3 * f1 - B1 * f3, 'zx');
            this.setCoordinate(COORD_PSEUDO, -nn * b, 'b');
            return this;
        }
    };
    /**
     * this ⟼ reverse(this)
     */
    Geometric3.prototype.rev = function () {
        if (this.isLocked()) {
            return Lockable_1.lock(this.clone().rev());
        }
        else {
            // reverse has a ++-- structure on the grades.
            this.a = +this.a;
            this.x = +this.x;
            this.y = +this.y;
            this.z = +this.z;
            this.yz = -this.yz;
            this.zx = -this.zx;
            this.xy = -this.xy;
            this.b = -this.b;
            return this;
        }
    };
    /**
     * Rotates this multivector using a rotor, R.
     *
     * @returns R * this * reverse(R) = R * this * ~R
     */
    Geometric3.prototype.rotate = function (R) {
        if (this.isLocked()) {
            return Lockable_1.lock(this.clone().rotate(R));
        }
        else {
            // TODO: This only rotates the vector components. The bivector components will change.
            var x = this.x;
            var y = this.y;
            var z = this.z;
            var a = R.xy;
            var b = R.yz;
            var c = R.zx;
            var α = R.a;
            var ix = α * x - c * z + a * y;
            var iy = α * y - a * x + b * z;
            var iz = α * z - b * y + c * x;
            var iα = b * x + c * y + a * z;
            this.x = ix * α + iα * b + iy * a - iz * c;
            this.y = iy * α + iα * c + iz * b - ix * a;
            this.z = iz * α + iα * a + ix * c - iy * b;
            return this;
        }
    };
    /**
     * Sets this multivector to a rotor that rotates through angle θ around the specified axis.
     *
     * @param axis The (unit) vector defining the rotation direction.
     * @param θ The rotation angle in radians when the rotor is applied on both sides as R * M * ~R
     */
    Geometric3.prototype.rotorFromAxisAngle = function (axis, θ) {
        if (this.isLocked()) {
            throw new Lockable_1.TargetLockedError('rotorFromAxisAngle');
        }
        // Compute the dual of the axis to obtain the corresponding bivector.
        var x = axis.x;
        var y = axis.y;
        var z = axis.z;
        var squaredNorm = x * x + y * y + z * z;
        if (squaredNorm === 1) {
            return this.rotorFromGeneratorAngle({ yz: x, zx: y, xy: z }, θ);
        }
        else {
            var norm = Math.sqrt(squaredNorm);
            var yz = x / norm;
            var zx = y / norm;
            var xy = z / norm;
            return this.rotorFromGeneratorAngle({ yz: yz, zx: zx, xy: xy }, θ);
        }
    };
    /**
     * Computes a rotor, R, from two unit vectors, where
     * R = (|b||a| + b * a) / sqrt(2 * |b||a|(|b||a| + b << a))
     *
     * The result is independent of the magnitudes of a and b.
     *
     * @param a The starting vector
     * @param b The ending vector
     * @returns The rotor representing a rotation from a to b.
     */
    Geometric3.prototype.rotorFromDirections = function (a, b) {
        if (this.isLocked()) {
            throw new Lockable_1.TargetLockedError('rotorFromDirections');
        }
        var B = void 0;
        return this.rotorFromVectorToVector(a, b, B);
    };
    /**
     * Helper function for rotorFromFrameToFrame.
     */
    Geometric3.prototype.rotorFromTwoVectors = function (e1, f1, e2, f2) {
        // FIXME: This creates a lot of temporary objects.
        // Compute the rotor that takes e1 to f1.
        // There is no concern that the two vectors are anti-parallel.
        var R1 = Geometric3.rotorFromDirections(e1, f1);
        // Compute the image of e2 under the first rotation in order to calculate R2.
        var f = Geometric3.fromVector(e2).rotate(R1);
        // In case of rotation for antipodal vectors, define the fallback rotation bivector.
        var B = Geometric3.dualOfVector(f1);
        // Compute R2
        var R2 = Geometric3.rotorFromVectorToVector(f, f2, B);
        // The total rotor, R, is the composition of R1 followed by R2.
        return this.mul2(R2, R1);
    };
    /**
     *
     */
    Geometric3.prototype.rotorFromFrameToFrame = function (es, fs) {
        if (this.isLocked()) {
            throw new Lockable_1.TargetLockedError('rotorFromFrameToFrame');
        }
        // There is instability when the rotation angle is near 180 degrees.
        // So we don't use the formula based upon reciprocal frames.
        // Our algorithm is to first pick the vector that stays most aligned with itself.
        // This allows for the possibility that the other two vectors may become anti-aligned.
        // Observe that all three vectors can't be anti-aligned because that would be a reflection!
        // We then compute the rotor R1 that maps this first vector to its image.
        // Allowing then for the possibility that the remaining vectors may have ambiguous rotors,
        // we compute the dual of this image vector as the default rotation plane for one of the
        // other vectors. We only need to calculate the rotor R2 for one more vector because our
        // frames are orthogonal and so R1 and R2 determine R.
        //
        var biggestValue = -1;
        var firstVector = void 0;
        for (var i = 0; i < 3; i++) {
            cosines[i] = cosVectorVector(es[i], fs[i]);
            if (cosines[i] > biggestValue) {
                firstVector = i;
                biggestValue = cosines[i];
            }
        }
        if (typeof firstVector === 'number') {
            var secondVector = (firstVector + 1) % 3;
            return this.rotorFromTwoVectors(es[firstVector], fs[firstVector], es[secondVector], fs[secondVector]);
        }
        else {
            throw new Error("Unable to compute rotor.");
        }
    };
    /**
     * Sets this multivector to a rotor that rotates through angle θ in the oriented plane defined by B.
     *
     * this ⟼ exp(- B * θ / 2) = cos(|B| * θ / 2) - B * sin(|B| * θ / 2) / |B|
     *
     * @param B The (unit) bivector generating the rotation.
     * @param θ The rotation angle in radians when the rotor is applied on both sides as R * M * ~R
     */
    Geometric3.prototype.rotorFromGeneratorAngle = function (B, θ) {
        if (this.isLocked()) {
            throw new Lockable_1.TargetLockedError('rotorFromGeneratorAngle');
        }
        var φ = θ / 2;
        var yz = B.yz;
        var zx = B.zx;
        var xy = B.xy;
        var absB = Math.sqrt(yz * yz + zx * zx + xy * xy);
        var mφ = absB * φ;
        var sinDivAbsB = Math.sin(mφ) / absB;
        this.a = Math.cos(mφ);
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.yz = -yz * sinDivAbsB;
        this.zx = -zx * sinDivAbsB;
        this.xy = -xy * sinDivAbsB;
        this.b = 0;
        return this;
    };
    /**
     * R = (|b||a| + b * a) / sqrt(2 * |b||a|(|b||a| + b << a))
     *
     * The result is independent of the magnitudes of a and b.
     */
    Geometric3.prototype.rotorFromVectorToVector = function (a, b, B) {
        if (this.isLocked()) {
            throw new Lockable_1.TargetLockedError('rotorFromVectorToVector');
        }
        rotorFromDirectionsE3_1.rotorFromDirectionsE3(a, b, B, this);
        return this;
    };
    /**
     * Scalar Product
     * @returns scp(this, rhs) = this | rhs
     */
    Geometric3.prototype.scp = function (rhs) {
        if (this.isLocked()) {
            return Lockable_1.lock(this.clone().scp(rhs));
        }
        else {
            return this.scp2(this, rhs);
        }
    };
    /**
     * this ⟼ scp(a, b) = a | b
     */
    Geometric3.prototype.scp2 = function (a, b) {
        if (this.isLocked()) {
            throw new Lockable_1.TargetLockedError('scp2');
        }
        return scpG3_1.scpG3(a, b, this);
    };
    /**
     * this ⟼ this * alpha
     */
    Geometric3.prototype.scale = function (alpha) {
        if (this.isLocked()) {
            return Lockable_1.lock(this.clone().scale(alpha));
        }
        else {
            this.a *= alpha;
            this.x *= alpha;
            this.y *= alpha;
            this.z *= alpha;
            this.yz *= alpha;
            this.zx *= alpha;
            this.xy *= alpha;
            this.b *= alpha;
            return this;
        }
    };
    /**
     * Applies the diagonal elements of a scaling matrix to this multivector.
     *
     * @param σ
     */
    Geometric3.prototype.stress = function (σ) {
        if (this.isLocked()) {
            return Lockable_1.lock(this.clone().stress(σ));
        }
        else {
            this.x *= σ.x;
            this.y *= σ.y;
            this.z *= σ.z;
            // TODO: Action on other components TBD.
            return this;
        }
    };
    /**
     * Sets this multivector to the geometric product of the arguments.
     * This multivector must be mutable (in the unlocked state).
     *
     * this ⟼ a * b
     *
     * @param a The vector on the left of the operator.
     * @param b The vector on the right of the operator.
     *
     * @returns the geometric product, a * b, of the vector arguments.
     */
    Geometric3.prototype.versor = function (a, b) {
        if (this.isLocked()) {
            throw new Lockable_1.TargetLockedError('versor');
        }
        var ax = a.x;
        var ay = a.y;
        var az = a.z;
        var bx = b.x;
        var by = b.y;
        var bz = b.z;
        this.zero();
        this.a = dotVectorE3_1.dotVectorE3(a, b);
        this.yz = wedgeYZ_1.wedgeYZ(ax, ay, az, bx, by, bz);
        this.zx = wedgeZX_1.wedgeZX(ax, ay, az, bx, by, bz);
        this.xy = wedgeXY_1.wedgeXY(ax, ay, az, bx, by, bz);
        return this;
    };
    /**
     * @returns this - M * α
     */
    Geometric3.prototype.sub = function (M, α) {
        if (α === void 0) { α = 1; }
        if (this.isLocked()) {
            return Lockable_1.lock(this.clone().sub(M, α));
        }
        else {
            this.a -= M.a * α;
            this.x -= M.x * α;
            this.y -= M.y * α;
            this.z -= M.z * α;
            this.yz -= M.yz * α;
            this.zx -= M.zx * α;
            this.xy -= M.xy * α;
            this.b -= M.b * α;
            return this;
        }
    };
    /**
     * <p>
     * <code>this ⟼ this - v * α</code>
     * </p>
     *
     * @param v
     * @param α
     * @returns this - v * α
     */
    Geometric3.prototype.subVector = function (v, α) {
        if (α === void 0) { α = 1; }
        if (this.isLocked()) {
            return Lockable_1.lock(this.clone().subVector(v, α));
        }
        else {
            this.x -= v.x * α;
            this.y -= v.y * α;
            this.z -= v.z * α;
            return this;
        }
    };
    /**
     * <p>
     * <code>this ⟼ a - b</code>
     * </p>
     *
     * @param a
     * @param b
     */
    Geometric3.prototype.sub2 = function (a, b) {
        if (this.isLocked()) {
            throw new Lockable_1.TargetLockedError('sub2');
        }
        this.a = a.a - b.a;
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;
        this.yz = a.yz - b.yz;
        this.zx = a.zx - b.zx;
        this.xy = a.xy - b.xy;
        this.b = a.b - b.b;
        return this;
    };
    /**
     *
     */
    Geometric3.prototype.toArray = function () {
        return coordinates(this);
    };
    /**
     * Returns a string representing the number in exponential notation.
     */
    Geometric3.prototype.toExponential = function (fractionDigits) {
        var coordToString = function (coord) { return coord.toExponential(fractionDigits); };
        return stringFromCoordinates_1.stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS);
    };
    /**
     * Returns a string representing the number in fixed-point notation.
     */
    Geometric3.prototype.toFixed = function (fractionDigits) {
        var coordToString = function (coord) { return coord.toFixed(fractionDigits); };
        return stringFromCoordinates_1.stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS);
    };
    /**
     *
     */
    Geometric3.prototype.toPrecision = function (precision) {
        var coordToString = function (coord) { return coord.toPrecision(precision); };
        return stringFromCoordinates_1.stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS);
    };
    /**
     * Returns a string representation of this multivector.
     */
    Geometric3.prototype.toString = function (radix) {
        var coordToString = function (coord) { return coord.toString(radix); };
        return stringFromCoordinates_1.stringFromCoordinates(coordinates(this), coordToString, BASIS_LABELS);
    };
    /**
     * Extraction of grade <em>i</em>.
     *
     * If this multivector is mutable (unlocked) then it is set to the result.
     *
     * @param i The index of the grade to be extracted.
     */
    Geometric3.prototype.grade = function (i) {
        if (this.isLocked()) {
            return Lockable_1.lock(this.clone().grade(i));
        }
        mustBeInteger_1.mustBeInteger('i', i);
        switch (i) {
            case 0: {
                this.x = 0;
                this.y = 0;
                this.z = 0;
                this.yz = 0;
                this.zx = 0;
                this.xy = 0;
                this.b = 0;
                break;
            }
            case 1: {
                this.a = 0;
                this.yz = 0;
                this.zx = 0;
                this.xy = 0;
                this.b = 0;
                break;
            }
            case 2: {
                this.a = 0;
                this.x = 0;
                this.y = 0;
                this.z = 0;
                this.b = 0;
                break;
            }
            case 3: {
                this.a = 0;
                this.x = 0;
                this.y = 0;
                this.z = 0;
                this.yz = 0;
                this.zx = 0;
                this.xy = 0;
                break;
            }
            default: {
                this.a = 0;
                this.x = 0;
                this.y = 0;
                this.z = 0;
                this.yz = 0;
                this.zx = 0;
                this.xy = 0;
                this.b = 0;
            }
        }
        return this;
    };
    /**
     * @returns this ^ m
     */
    Geometric3.prototype.ext = function (m) {
        if (this.isLocked()) {
            return Lockable_1.lock(this.clone().ext(m));
        }
        else {
            return this.ext2(this, m);
        }
    };
    /**
     * Sets this multivector to the outer product of `a` and `b`.
     * this ⟼ a ^ b
     */
    Geometric3.prototype.ext2 = function (a, b) {
        if (this.isLocked()) {
            throw new Lockable_1.TargetLockedError('ext2');
        }
        return extG3_1.extG3(a, b, this);
    };
    /**
     * Sets this multivector to the identity element for addition, 0.
     */
    Geometric3.prototype.zero = function () {
        if (this.isLocked()) {
            throw new Lockable_1.TargetLockedError('zero');
        }
        this.a = 0;
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.yz = 0;
        this.zx = 0;
        this.xy = 0;
        this.b = 0;
        return this;
    };
    /**
     * Implements `this + rhs` as addition.
     * The returned value is locked.
     */
    Geometric3.prototype.__add__ = function (rhs) {
        var duckR = maskG3_1.maskG3(rhs);
        if (duckR) {
            return Lockable_1.lock(this.clone().add(duckR));
        }
        else if (isVectorE3_1.isVectorE3(rhs)) {
            return Lockable_1.lock(this.clone().addVector(rhs));
        }
        else {
            return void 0;
        }
    };
    /**
     * Implements `lhs + this` as addition.
     * The returned value is locked.
     */
    Geometric3.prototype.__radd__ = function (lhs) {
        if (lhs instanceof Geometric3) {
            return Lockable_1.lock(Geometric3.copy(lhs).add(this));
        }
        else if (typeof lhs === 'number') {
            return Lockable_1.lock(Geometric3.scalar(lhs).add(this));
        }
        else if (isVectorE3_1.isVectorE3(lhs)) {
            return Lockable_1.lock(Geometric3.fromVector(lhs).add(this));
        }
        else {
            return void 0;
        }
    };
    /**
     * Implements `this / rhs` as division.
     * The returned value is locked.
     */
    Geometric3.prototype.__div__ = function (rhs) {
        var duckR = maskG3_1.maskG3(rhs);
        if (duckR) {
            return Lockable_1.lock(this.clone().div(duckR));
        }
        else {
            return void 0;
        }
    };
    /**
     * Implements `lhs / this` as division.
     * The returned value is locked.
     */
    Geometric3.prototype.__rdiv__ = function (lhs) {
        if (lhs instanceof Geometric3) {
            return Lockable_1.lock(Geometric3.copy(lhs).div(this));
        }
        else if (typeof lhs === 'number') {
            return Lockable_1.lock(Geometric3.scalar(lhs).div(this));
        }
        else {
            return void 0;
        }
    };
    /**
     * Implements `this * rhs` as the geometric product.
     * The returned value is locked.
     */
    Geometric3.prototype.__mul__ = function (rhs) {
        var duckR = maskG3_1.maskG3(rhs);
        if (duckR) {
            return Lockable_1.lock(this.clone().mul(duckR));
        }
        else {
            return void 0;
        }
    };
    /**
     * Implements `lhs * this` as the geometric product.
     * The returned value is locked.
     */
    Geometric3.prototype.__rmul__ = function (lhs) {
        if (lhs instanceof Geometric3) {
            return Lockable_1.lock(Geometric3.copy(lhs).mul(this));
        }
        else if (typeof lhs === 'number') {
            return Lockable_1.lock(Geometric3.copy(this).scale(lhs));
        }
        else {
            return void 0;
        }
    };
    /**
     * Implements `this - rhs` as subtraction.
     * The returned value is locked.
     */
    Geometric3.prototype.__sub__ = function (rhs) {
        var duckR = maskG3_1.maskG3(rhs);
        if (duckR) {
            return Lockable_1.lock(this.clone().sub(duckR));
        }
        else {
            return void 0;
        }
    };
    /**
     * Implements `lhs - this` as subtraction.
     * The returned value is locked.
     */
    Geometric3.prototype.__rsub__ = function (lhs) {
        if (lhs instanceof Geometric3) {
            return Lockable_1.lock(Geometric3.copy(lhs).sub(this));
        }
        else if (typeof lhs === 'number') {
            return Lockable_1.lock(Geometric3.scalar(lhs).sub(this));
        }
        else {
            return void 0;
        }
    };
    /**
     * Implements `this ^ rhs` as the extension.
     * The returned value is locked.
     */
    Geometric3.prototype.__wedge__ = function (rhs) {
        if (rhs instanceof Geometric3) {
            return Lockable_1.lock(Geometric3.copy(this).ext(rhs));
        }
        else if (typeof rhs === 'number') {
            // The outer product with a scalar is scalar multiplication.
            return Lockable_1.lock(Geometric3.copy(this).scale(rhs));
        }
        else {
            return void 0;
        }
    };
    /**
     * Implements `lhs ^ this` as the extension.
     * The returned value is locked.
     */
    Geometric3.prototype.__rwedge__ = function (lhs) {
        if (lhs instanceof Geometric3) {
            return Lockable_1.lock(Geometric3.copy(lhs).ext(this));
        }
        else if (typeof lhs === 'number') {
            // The outer product with a scalar is scalar multiplication, and commutes.
            return Lockable_1.lock(Geometric3.copy(this).scale(lhs));
        }
        else {
            return void 0;
        }
    };
    /**
     * Implements `this << rhs` as the left contraction.
     * The returned value is locked.
     */
    Geometric3.prototype.__lshift__ = function (rhs) {
        if (rhs instanceof Geometric3) {
            return Lockable_1.lock(Geometric3.copy(this).lco(rhs));
        }
        else if (typeof rhs === 'number') {
            return Lockable_1.lock(Geometric3.copy(this).lco(Geometric3.scalar(rhs)));
        }
        else {
            return void 0;
        }
    };
    /**
     * Implements `lhs << this` as the left contraction.
     * The returned value is locked.
     */
    Geometric3.prototype.__rlshift__ = function (lhs) {
        if (lhs instanceof Geometric3) {
            return Lockable_1.lock(Geometric3.copy(lhs).lco(this));
        }
        else if (typeof lhs === 'number') {
            return Lockable_1.lock(Geometric3.scalar(lhs).lco(this));
        }
        else {
            return void 0;
        }
    };
    /**
     * Implements `this >> rhs` as the right contraction.
     * The returned value is locked.
     */
    Geometric3.prototype.__rshift__ = function (rhs) {
        if (rhs instanceof Geometric3) {
            return Lockable_1.lock(Geometric3.copy(this).rco(rhs));
        }
        else if (typeof rhs === 'number') {
            return Lockable_1.lock(Geometric3.copy(this).rco(Geometric3.scalar(rhs)));
        }
        else {
            return void 0;
        }
    };
    /**
     * Implements `lhs >> this` as the right contraction.
     * The returned value is locked.
     */
    Geometric3.prototype.__rrshift__ = function (lhs) {
        if (lhs instanceof Geometric3) {
            return Lockable_1.lock(Geometric3.copy(lhs).rco(this));
        }
        else if (typeof lhs === 'number') {
            return Lockable_1.lock(Geometric3.scalar(lhs).rco(this));
        }
        else {
            return void 0;
        }
    };
    /**
     * Implements `this | rhs` as the scalar product.
     * The returned value is locked.
     */
    Geometric3.prototype.__vbar__ = function (rhs) {
        if (rhs instanceof Geometric3) {
            return Lockable_1.lock(Geometric3.copy(this).scp(rhs));
        }
        else if (typeof rhs === 'number') {
            return Lockable_1.lock(Geometric3.copy(this).scp(Geometric3.scalar(rhs)));
        }
        else {
            return void 0;
        }
    };
    /**
     * Implements `lhs | this` as the scalar product.
     * The returned value is locked.
     */
    Geometric3.prototype.__rvbar__ = function (lhs) {
        if (lhs instanceof Geometric3) {
            return Lockable_1.lock(Geometric3.copy(lhs).scp(this));
        }
        else if (typeof lhs === 'number') {
            return Lockable_1.lock(Geometric3.scalar(lhs).scp(this));
        }
        else {
            return void 0;
        }
    };
    /**
     * Implements `!this` as the inverse (if it exists) of `this`.
     * The returned value is locked.
     */
    Geometric3.prototype.__bang__ = function () {
        return Lockable_1.lock(Geometric3.copy(this).inv());
    };
    /**
     * Implements `+this` as `this`.
     * The returned value is locked.
     */
    Geometric3.prototype.__pos__ = function () {
        return Lockable_1.lock(Geometric3.copy(this));
    };
    /**
     * Implements `-this` as the negative of `this`.
     * The returned value is locked.
     */
    Geometric3.prototype.__neg__ = function () {
        return Lockable_1.lock(Geometric3.copy(this).neg());
    };
    /**
     * Implements `~this` as the reversion of `this`.
     * The returned value is locked.
     */
    Geometric3.prototype.__tilde__ = function () {
        return Lockable_1.lock(Geometric3.copy(this).rev());
    };
    /**
     *
     */
    Geometric3.one = function (lock) {
        if (lock === void 0) { lock = false; }
        return lock ? Geometric3.ONE : Geometric3.scalar(1);
    };
    /**
     * Constructs the basis vector e1.
     * Locking the vector prevents mutation.
     */
    Geometric3.e1 = function (lock) {
        if (lock === void 0) { lock = false; }
        return lock ? Geometric3.E1 : Geometric3.vector(1, 0, 0);
    };
    /**
     * Constructs the basis vector e2.
     * Locking the vector prevents mutation.
     */
    Geometric3.e2 = function (lock) {
        if (lock === void 0) { lock = false; }
        return lock ? Geometric3.E2 : Geometric3.vector(0, 1, 0);
    };
    /**
     * Constructs the basis vector e3.
     * Locking the vector prevents mutation.
     */
    Geometric3.e3 = function (lock) {
        if (lock === void 0) { lock = false; }
        return lock ? Geometric3.E3 : Geometric3.vector(0, 0, 1);
    };
    /**
     *
     */
    Geometric3.I = function (lock) {
        if (lock === void 0) { lock = false; }
        return lock ? Geometric3.PSEUDO : Geometric3.pseudo(1);
    };
    /**
     * Constructs a mutable bivector with the coordinates `yz`, `zx`, and `xy`.
     */
    Geometric3.bivector = function (yz, zx, xy) {
        return new Geometric3(bivector(yz, zx, xy));
    };
    /**
     * Constructs a mutable multivector by copying a multivector.
     */
    Geometric3.copy = function (M) {
        return new Geometric3(coordinates(M));
    };
    /**
     * Constructs a mutable multivector which is the dual of the bivector `B`.
     */
    Geometric3.dualOfBivector = function (B) {
        return new Geometric3(vector(-B.yz, -B.zx, -B.xy));
    };
    /**
     * Constructs a mutable multivector which is the dual of the vector `v`.
     */
    Geometric3.dualOfVector = function (v) {
        return new Geometric3(bivector(v.x, v.y, v.z));
    };
    /**
     * Constructs a mutable multivector by copying the bivector `B`.
     */
    Geometric3.fromBivector = function (B) {
        return Geometric3.bivector(B.yz, B.zx, B.xy);
    };
    /**
     * Constructs a mutable multivector by copying the scalar `α`.
     */
    Geometric3.fromScalar = function (α) {
        return Geometric3.scalar(α.a);
    };
    /**
     * Constructs a mutable multivector by copying the spinor `s`.
     */
    Geometric3.fromSpinor = function (s) {
        return Geometric3.spinor(s.yz, s.zx, s.xy, s.a);
    };
    /**
     * Constructs a mutable multivector by copying the vector `v`.
     */
    Geometric3.fromVector = function (v) {
        return Geometric3.vector(v.x, v.y, v.z);
    };
    /**
     * Constructs a mutable multivector that linearly interpolates `A` and `B`, A + α * (B - A)
     */
    Geometric3.lerp = function (A, B, α) {
        return Geometric3.copy(A).lerp(B, α);
    };
    /**
     * Constructs a mutable pseudoscalar with the magnitude `β`.
     */
    Geometric3.pseudo = function (β) {
        return new Geometric3(pseudo(β));
    };
    /**
     * Computes a multivector with random components in the range [lowerBound, upperBound].
     */
    Geometric3.random = function (lowerBound, upperBound) {
        if (lowerBound === void 0) { lowerBound = -1; }
        if (upperBound === void 0) { upperBound = +1; }
        var a = randomRange_1.randomRange(lowerBound, upperBound);
        var x = randomRange_1.randomRange(lowerBound, upperBound);
        var y = randomRange_1.randomRange(lowerBound, upperBound);
        var z = randomRange_1.randomRange(lowerBound, upperBound);
        var yz = randomRange_1.randomRange(lowerBound, upperBound);
        var zx = randomRange_1.randomRange(lowerBound, upperBound);
        var xy = randomRange_1.randomRange(lowerBound, upperBound);
        var b = randomRange_1.randomRange(lowerBound, upperBound);
        return new Geometric3(multivector(a, x, y, z, yz, zx, xy, b));
    };
    /**
     * Computes the rotor that rotates vector `a` to vector `b`.
     * The result is independent of the magnitudes of `a` and `b`.
     */
    Geometric3.rotorFromDirections = function (a, b) {
        return new Geometric3(zero()).rotorFromDirections(a, b);
    };
    Geometric3.rotorFromFrameToFrame = function (es, fs) {
        return new Geometric3(zero()).rotorFromFrameToFrame(es, fs);
    };
    /**
     * Computes the rotor that rotates vector `a` to vector `b`.
     * The bivector B provides the plane of rotation when `a` and `b` are anti-aligned.
     * The result is independent of the magnitudes of `a` and `b`.
     */
    Geometric3.rotorFromVectorToVector = function (a, b, B) {
        return new Geometric3(zero()).rotorFromVectorToVector(a, b, B);
    };
    /**
     * Constructs a mutable scalar with the magnitude `α`.
     */
    Geometric3.scalar = function (α) {
        return new Geometric3(scalar(α));
    };
    /**
     * Constructs a mutable scalar with the coordinates `yz`, `zx`, `xy`, and `α`.
     */
    Geometric3.spinor = function (yz, zx, xy, α) {
        return new Geometric3(spinor(α, yz, zx, xy));
    };
    /**
     * Constructs a mutable vector with the coordinates `x`, `y`, and `z`.
     */
    Geometric3.vector = function (x, y, z) {
        return new Geometric3(vector(x, y, z));
    };
    /**
     * Constructs a mutable bivector as the outer product of two vectors.
     */
    Geometric3.wedge = function (a, b) {
        var ax = a.x;
        var ay = a.y;
        var az = a.z;
        var bx = b.x;
        var by = b.y;
        var bz = b.z;
        var yz = wedgeYZ_1.wedgeYZ(ax, ay, az, bx, by, bz);
        var zx = wedgeZX_1.wedgeZX(ax, ay, az, bx, by, bz);
        var xy = wedgeXY_1.wedgeXY(ax, ay, az, bx, by, bz);
        return Geometric3.bivector(yz, zx, xy);
    };
    /**
     *
     */
    Geometric3.zero = function (lock) {
        if (lock === void 0) { lock = false; }
        return lock ? Geometric3.ZERO : new Geometric3(zero());
    };
    /**
     * The identity element for addition, `0`.
     * The multivector is locked.
     */
    Geometric3.ZERO = new Geometric3(scalar(0));
    /**
     * The identity element for multiplication, `1`.
     * The multivector is locked (immutable), but may be cloned.
     */
    Geometric3.ONE = new Geometric3(scalar(1));
    /**
     * The basis element corresponding to the vector `x` coordinate.
     * The multivector is locked (immutable), but may be cloned.
     */
    Geometric3.E1 = new Geometric3(vector(1, 0, 0));
    /**
     * The basis element corresponding to the vector `y` coordinate.
     * The multivector is locked (immutable), but may be cloned.
     */
    Geometric3.E2 = new Geometric3(vector(0, 1, 0));
    /**
     * The basis element corresponding to the vector `z` coordinate.
     * The multivector is locked (immutable), but may be cloned.
     */
    Geometric3.E3 = new Geometric3(vector(0, 0, 1));
    /**
     * The basis element corresponding to the pseudoscalar `b` coordinate.
     * The multivector is locked (immutable), but may be cloned.
     */
    Geometric3.PSEUDO = new Geometric3(pseudo(1));
    return Geometric3;
}());
exports.Geometric3 = Geometric3;
applyMixins_1.applyMixins(Geometric3, [Lockable_1.LockableMixin]);
Geometric3.E1.lock();
Geometric3.E2.lock();
Geometric3.E3.lock();
Geometric3.PSEUDO.lock();
Geometric3.ONE.lock();
Geometric3.ZERO.lock();
