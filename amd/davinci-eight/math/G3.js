define(["require", "exports", '../math/addE3', '../geometries/b2', '../geometries/b3', '../math/extG3', '../math/lcoG3', '../math/mulG3', './gauss', '../i18n/notImplemented', './quadSpinorE3', '../math/rcoG3', '../i18n/readOnly', '../math/scpG3', '../math/squaredNormG3', '../math/stringFromCoordinates', '../math/subE3', '../math/Unit', '../math/BASIS_LABELS_G3_GEOMETRIC', '../math/BASIS_LABELS_G3_HAMILTON', '../math/BASIS_LABELS_G3_STANDARD', '../math/BASIS_LABELS_G3_STANDARD_HTML'], function (require, exports, addE3_1, b2_1, b3_1, extG3_1, lcoG3_1, mulG3_1, gauss_1, notImplemented_1, quadSpinorE3_1, rcoG3_1, readOnly_1, scpG3_1, squaredNormG3_1, stringFromCoordinates_1, subE3_1, Unit_1, BASIS_LABELS_G3_GEOMETRIC_1, BASIS_LABELS_G3_HAMILTON_1, BASIS_LABELS_G3_STANDARD_1, BASIS_LABELS_G3_STANDARD_HTML_1) {
    var COORD_SCALAR = 0;
    var COORD_X = 1;
    var COORD_Y = 2;
    var COORD_Z = 3;
    var COORD_XY = 4;
    var COORD_YZ = 5;
    var COORD_ZX = 6;
    var COORD_PSEUDO = 7;
    function compute(f, a, b, coord, pack, uom) {
        var a0 = coord(a, 0);
        var a1 = coord(a, 1);
        var a2 = coord(a, 2);
        var a3 = coord(a, 3);
        var a4 = coord(a, 4);
        var a5 = coord(a, 5);
        var a6 = coord(a, 6);
        var a7 = coord(a, 7);
        var b0 = coord(b, 0);
        var b1 = coord(b, 1);
        var b2 = coord(b, 2);
        var b3 = coord(b, 3);
        var b4 = coord(b, 4);
        var b5 = coord(b, 5);
        var b6 = coord(b, 6);
        var b7 = coord(b, 7);
        var x0 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0);
        var x1 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 1);
        var x2 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 2);
        var x3 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 3);
        var x4 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 4);
        var x5 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 5);
        var x6 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 6);
        var x7 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 7);
        return pack(x0, x1, x2, x3, x4, x5, x6, x7, uom);
    }
    var G3 = (function () {
        function G3(α, x, y, z, xy, yz, zx, β, uom) {
            this._coords = [0, 0, 0, 0, 0, 0, 0, 0];
            this._coords[COORD_SCALAR] = α;
            this._coords[COORD_X] = x;
            this._coords[COORD_Y] = y;
            this._coords[COORD_Z] = z;
            this._coords[COORD_XY] = xy;
            this._coords[COORD_YZ] = yz;
            this._coords[COORD_ZX] = zx;
            this._coords[COORD_PSEUDO] = β;
            this.uom = uom;
            if (this.uom && this.uom.multiplier !== 1) {
                var multiplier = this.uom.multiplier;
                this._coords[COORD_SCALAR] *= multiplier;
                this._coords[COORD_X] *= multiplier;
                this._coords[COORD_Y] *= multiplier;
                this._coords[COORD_Z] *= multiplier;
                this._coords[COORD_XY] *= multiplier;
                this._coords[COORD_YZ] *= multiplier;
                this._coords[COORD_ZX] *= multiplier;
                this._coords[COORD_PSEUDO] *= multiplier;
                this.uom = new Unit_1.default(1, uom.dimensions, uom.labels);
            }
        }
        Object.defineProperty(G3, "BASIS_LABELS_GEOMETRIC", {
            get: function () { return BASIS_LABELS_G3_GEOMETRIC_1.default; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(G3, "BASIS_LABELS_HAMILTON", {
            get: function () { return BASIS_LABELS_G3_HAMILTON_1.default; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(G3, "BASIS_LABELS_STANDARD", {
            get: function () { return BASIS_LABELS_G3_STANDARD_1.default; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(G3, "BASIS_LABELS_STANDARD_HTML", {
            get: function () { return BASIS_LABELS_G3_STANDARD_HTML_1.default; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(G3.prototype, "α", {
            get: function () {
                return this._coords[COORD_SCALAR];
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('α').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G3.prototype, "alpha", {
            get: function () {
                return this._coords[COORD_SCALAR];
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('alpha').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G3.prototype, "x", {
            get: function () {
                return this._coords[COORD_X];
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('x').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G3.prototype, "y", {
            get: function () {
                return this._coords[COORD_Y];
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('y').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G3.prototype, "z", {
            get: function () {
                return this._coords[COORD_Z];
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('z').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G3.prototype, "xy", {
            get: function () {
                return this._coords[COORD_XY];
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('xy').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G3.prototype, "yz", {
            get: function () {
                return this._coords[COORD_YZ];
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('yz').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G3.prototype, "zx", {
            get: function () {
                return this._coords[COORD_ZX];
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('zx').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G3.prototype, "β", {
            get: function () {
                return this._coords[COORD_PSEUDO];
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('β').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(G3.prototype, "beta", {
            get: function () {
                return this._coords[COORD_PSEUDO];
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('beta').message);
            },
            enumerable: true,
            configurable: true
        });
        G3.fromCartesian = function (α, x, y, z, xy, yz, zx, β, uom) {
            return new G3(α, x, y, z, xy, yz, zx, β, uom);
        };
        Object.defineProperty(G3.prototype, "coords", {
            get: function () {
                return [this.α, this.x, this.y, this.z, this.xy, this.yz, this.zx, this.β];
            },
            enumerable: true,
            configurable: true
        });
        G3.prototype.coordinate = function (index) {
            switch (index) {
                case 0:
                    return this.α;
                case 1:
                    return this.x;
                case 2:
                    return this.y;
                case 3:
                    return this.z;
                case 4:
                    return this.xy;
                case 5:
                    return this.yz;
                case 6:
                    return this.zx;
                case 7:
                    return this.β;
                default:
                    throw new Error("index must be in the range [0..7]");
            }
        };
        G3.prototype.add = function (rhs) {
            var coord = function (x, n) {
                return x[n];
            };
            var pack = function (w, x, y, z, xy, yz, zx, xyz, uom) {
                return G3.fromCartesian(w, x, y, z, xy, yz, zx, xyz, uom);
            };
            return compute(addE3_1.default, this.coords, rhs.coords, coord, pack, Unit_1.default.compatible(this.uom, rhs.uom));
        };
        G3.prototype.addPseudo = function (β) {
            return new G3(this.α, this.x, this.y, this.z, this.xy, this.yz, this.zx, this.β + β, this.uom);
        };
        G3.prototype.addScalar = function (α) {
            return new G3(this.α + α, this.x, this.y, this.z, this.xy, this.yz, this.zx, this.β, this.uom);
        };
        G3.prototype.__add__ = function (rhs) {
            if (rhs instanceof G3) {
                return this.add(rhs);
            }
            else if (typeof rhs === 'number') {
                return this.addScalar(rhs);
            }
        };
        G3.prototype.__radd__ = function (lhs) {
            if (lhs instanceof G3) {
                return lhs.add(this);
            }
            else if (typeof lhs === 'number') {
                return this.addScalar(lhs);
            }
        };
        G3.prototype.adj = function () {
            throw new Error(notImplemented_1.default('adj').message);
        };
        G3.prototype.angle = function () {
            return this.log().grade(2);
        };
        G3.prototype.conj = function () {
            return new G3(this.α, -this.x, -this.y, -this.z, -this.xy, -this.yz, -this.zx, +this.β, this.uom);
        };
        G3.prototype.cubicBezier = function (t, controlBegin, controlEnd, endPoint) {
            var x = b3_1.default(t, this.x, controlBegin.x, controlEnd.x, endPoint.x);
            var y = b3_1.default(t, this.y, controlBegin.y, controlEnd.y, endPoint.y);
            var z = b3_1.default(t, this.z, controlBegin.z, controlEnd.z, endPoint.z);
            return new G3(0, x, y, z, 0, 0, 0, 0, this.uom);
        };
        G3.prototype.direction = function () {
            return this.div(this.norm());
        };
        G3.prototype.sub = function (rhs) {
            var coord = function (x, n) {
                return x[n];
            };
            var pack = function (w, x, y, z, xy, yz, zx, xyz, uom) {
                return G3.fromCartesian(w, x, y, z, xy, yz, zx, xyz, uom);
            };
            return compute(subE3_1.default, this.coords, rhs.coords, coord, pack, Unit_1.default.compatible(this.uom, rhs.uom));
        };
        G3.prototype.__sub__ = function (rhs) {
            if (rhs instanceof G3) {
                return this.sub(rhs);
            }
            else if (typeof rhs === 'number') {
                return this.addScalar(-rhs);
            }
        };
        G3.prototype.__rsub__ = function (lhs) {
            if (lhs instanceof G3) {
                return lhs.sub(this);
            }
            else if (typeof lhs === 'number') {
                return this.neg().addScalar(lhs);
            }
        };
        G3.prototype.mul = function (rhs) {
            var out = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.mul(this.uom, rhs.uom));
            mulG3_1.default(this, rhs, G3.mutator(out));
            return out;
        };
        G3.prototype.__mul__ = function (rhs) {
            if (rhs instanceof G3) {
                return this.mul(rhs);
            }
            else if (typeof rhs === 'number') {
                return this.scale(rhs);
            }
        };
        G3.prototype.__rmul__ = function (lhs) {
            if (lhs instanceof G3) {
                return lhs.mul(this);
            }
            else if (typeof lhs === 'number') {
                return this.scale(lhs);
            }
        };
        G3.prototype.scale = function (α) {
            return new G3(this.α * α, this.x * α, this.y * α, this.z * α, this.xy * α, this.yz * α, this.zx * α, this.β * α, this.uom);
        };
        G3.prototype.div = function (rhs) {
            return this.mul(rhs.inv());
        };
        G3.prototype.divByScalar = function (α) {
            return new G3(this.α / α, this.x / α, this.y / α, this.z / α, this.xy / α, this.yz / α, this.zx / α, this.β / α, this.uom);
        };
        G3.prototype.__div__ = function (rhs) {
            if (rhs instanceof G3) {
                return this.div(rhs);
            }
            else if (typeof rhs === 'number') {
                return this.divByScalar(rhs);
            }
        };
        G3.prototype.__rdiv__ = function (lhs) {
            if (lhs instanceof G3) {
                return lhs.div(this);
            }
            else if (typeof lhs === 'number') {
                return new G3(lhs, 0, 0, 0, 0, 0, 0, 0, void 0).div(this);
            }
        };
        G3.prototype.dual = function () {
            throw new Error(notImplemented_1.default('dual').message);
        };
        G3.prototype.scp = function (rhs) {
            var out = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.mul(this.uom, rhs.uom));
            scpG3_1.default(this, rhs, G3.mutator(out));
            return out;
        };
        G3.prototype.ext = function (rhs) {
            var out = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.mul(this.uom, rhs.uom));
            extG3_1.default(this, rhs, G3.mutator(out));
            return out;
        };
        G3.prototype.__vbar__ = function (rhs) {
            if (rhs instanceof G3) {
                return this.scp(rhs);
            }
            else if (typeof rhs === 'number') {
                return this.scp(new G3(rhs, 0, 0, 0, 0, 0, 0, 0, void 0));
            }
        };
        G3.prototype.__rvbar__ = function (lhs) {
            if (lhs instanceof G3) {
                return lhs.scp(this);
            }
            else if (typeof lhs === 'number') {
                return new G3(lhs, 0, 0, 0, 0, 0, 0, 0, void 0).scp(this);
            }
        };
        G3.prototype.__wedge__ = function (rhs) {
            if (rhs instanceof G3) {
                return this.ext(rhs);
            }
            else if (typeof rhs === 'number') {
                return this.scale(rhs);
            }
        };
        G3.prototype.__rwedge__ = function (lhs) {
            if (lhs instanceof G3) {
                return lhs.ext(this);
            }
            else if (typeof lhs === 'number') {
                return this.scale(lhs);
            }
        };
        G3.prototype.lco = function (rhs) {
            var out = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.mul(this.uom, rhs.uom));
            lcoG3_1.default(this, rhs, G3.mutator(out));
            return out;
        };
        G3.prototype.__lshift__ = function (rhs) {
            if (rhs instanceof G3) {
                return this.lco(rhs);
            }
            else if (typeof rhs === 'number') {
                return this.lco(new G3(rhs, 0, 0, 0, 0, 0, 0, 0, void 0));
            }
        };
        G3.prototype.__rlshift__ = function (lhs) {
            if (lhs instanceof G3) {
                return lhs.lco(this);
            }
            else if (typeof lhs === 'number') {
                return new G3(lhs, 0, 0, 0, 0, 0, 0, 0, void 0).lco(this);
            }
        };
        G3.prototype.rco = function (rhs) {
            var out = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.mul(this.uom, rhs.uom));
            rcoG3_1.default(this, rhs, G3.mutator(out));
            return out;
        };
        G3.prototype.__rshift__ = function (rhs) {
            if (rhs instanceof G3) {
                return this.rco(rhs);
            }
            else if (typeof rhs === 'number') {
                return this.rco(new G3(rhs, 0, 0, 0, 0, 0, 0, 0, void 0));
            }
        };
        G3.prototype.__rrshift__ = function (lhs) {
            if (lhs instanceof G3) {
                return lhs.rco(this);
            }
            else if (typeof lhs === 'number') {
                return new G3(lhs, 0, 0, 0, 0, 0, 0, 0, void 0).rco(this);
            }
        };
        G3.prototype.pow = function (exponent) {
            throw new Error('pow');
        };
        G3.prototype.__bang__ = function () {
            return this.inv();
        };
        G3.prototype.__pos__ = function () {
            return this;
        };
        G3.prototype.neg = function () {
            return new G3(-this.α, -this.x, -this.y, -this.z, -this.xy, -this.yz, -this.zx, -this.β, this.uom);
        };
        G3.prototype.__neg__ = function () {
            return this.neg();
        };
        G3.prototype.rev = function () {
            return new G3(this.α, this.x, this.y, this.z, -this.xy, -this.yz, -this.zx, -this.β, this.uom);
        };
        G3.prototype.__tilde__ = function () {
            return this.rev();
        };
        G3.prototype.grade = function (grade) {
            switch (grade) {
                case 0:
                    return G3.fromCartesian(this.α, 0, 0, 0, 0, 0, 0, 0, this.uom);
                case 1:
                    return G3.fromCartesian(0, this.x, this.y, this.z, 0, 0, 0, 0, this.uom);
                case 2:
                    return G3.fromCartesian(0, 0, 0, 0, this.xy, this.yz, this.zx, 0, this.uom);
                case 3:
                    return G3.fromCartesian(0, 0, 0, 0, 0, 0, 0, this.β, this.uom);
                default:
                    return G3.fromCartesian(0, 0, 0, 0, 0, 0, 0, 0, this.uom);
            }
        };
        G3.prototype.cross = function (vector) {
            var x;
            var x1;
            var x2;
            var y;
            var y1;
            var y2;
            var z;
            var z1;
            var z2;
            x1 = this.x;
            y1 = this.y;
            z1 = this.z;
            x2 = vector.x;
            y2 = vector.y;
            z2 = vector.z;
            x = y1 * z2 - z1 * y2;
            y = z1 * x2 - x1 * z2;
            z = x1 * y2 - y1 * x2;
            return new G3(0, x, y, z, 0, 0, 0, 0, Unit_1.default.mul(this.uom, vector.uom));
        };
        G3.prototype.isOne = function () {
            return (this.α === 1) && (this.x === 0) && (this.y === 0) && (this.z === 0) && (this.yz === 0) && (this.zx === 0) && (this.xy === 0) && (this.β === 0);
        };
        G3.prototype.isZero = function () {
            return (this.α === 0) && (this.x === 0) && (this.y === 0) && (this.z === 0) && (this.yz === 0) && (this.zx === 0) && (this.xy === 0) && (this.β === 0);
        };
        G3.prototype.lerp = function (target, α) {
            throw new Error(notImplemented_1.default('lerp').message);
        };
        G3.prototype.cos = function () {
            Unit_1.default.assertDimensionless(this.uom);
            var cosW = Math.cos(this.α);
            return new G3(cosW, 0, 0, 0, 0, 0, 0, 0);
        };
        G3.prototype.cosh = function () {
            throw new Error(notImplemented_1.default('cosh').message);
        };
        G3.prototype.distanceTo = function (point) {
            var dx = this.x - point.x;
            var dy = this.y - point.y;
            var dz = this.z - point.z;
            return Math.sqrt(dx * dx + dy * dy + dz * dz);
        };
        G3.prototype.equals = function (other) {
            if (this.α === other.α && this.x === other.x && this.y === other.y && this.z === other.z && this.xy === other.xy && this.yz === other.yz && this.zx === other.zx && this.β === other.β) {
                if (this.uom) {
                    if (other.uom) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    if (other.uom) {
                        return false;
                    }
                    else {
                        return true;
                    }
                }
            }
            else {
                return false;
            }
        };
        G3.prototype.exp = function () {
            Unit_1.default.assertDimensionless(this.uom);
            var bivector = this.grade(2);
            var a = bivector.norm();
            if (!a.isZero()) {
                var c = a.cos();
                var s = a.sin();
                var B = bivector.direction();
                return c.add(B.mul(s));
            }
            else {
                return new G3(1, 0, 0, 0, 0, 0, 0, 0, this.uom);
            }
        };
        G3.prototype.inv = function () {
            var α = this.α;
            var x = this.x;
            var y = this.y;
            var z = this.z;
            var xy = this.xy;
            var yz = this.yz;
            var zx = this.zx;
            var β = this.β;
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
            var X = gauss_1.default(A, b);
            var uom = this.uom ? this.uom.inv() : void 0;
            return new G3(X[0], X[1], X[2], X[3], X[4], X[5], X[6], X[7], uom);
        };
        G3.prototype.log = function () {
            throw new Error(notImplemented_1.default('log').message);
        };
        G3.prototype.magnitude = function () {
            return this.norm();
        };
        G3.prototype.magnitudeSansUnits = function () {
            return Math.sqrt(this.squaredNormSansUnits());
        };
        G3.prototype.norm = function () {
            return new G3(this.magnitudeSansUnits(), 0, 0, 0, 0, 0, 0, 0, this.uom);
        };
        G3.prototype.quad = function () {
            return this.squaredNorm();
        };
        G3.prototype.quadraticBezier = function (t, controlPoint, endPoint) {
            var x = b2_1.default(t, this.x, controlPoint.x, endPoint.x);
            var y = b2_1.default(t, this.y, controlPoint.y, endPoint.y);
            var z = b2_1.default(t, this.z, controlPoint.z, endPoint.z);
            return new G3(0, x, y, z, 0, 0, 0, 0, this.uom);
        };
        G3.prototype.squaredNorm = function () {
            return new G3(this.squaredNormSansUnits(), 0, 0, 0, 0, 0, 0, 0, Unit_1.default.mul(this.uom, this.uom));
        };
        G3.prototype.squaredNormSansUnits = function () {
            return squaredNormG3_1.default(this);
        };
        G3.prototype.reflect = function (n) {
            var m = G3.fromVectorE3(n);
            return m.mul(this).mul(m).scale(-1);
        };
        G3.prototype.rotate = function (R) {
            var x = this.x;
            var y = this.y;
            var z = this.z;
            var a = R.xy;
            var b = R.yz;
            var c = R.zx;
            var α = R.α;
            var quadR = quadSpinorE3_1.default(R);
            var ix = α * x - c * z + a * y;
            var iy = α * y - a * x + b * z;
            var iz = α * z - b * y + c * x;
            var iα = b * x + c * y + a * z;
            var αOut = quadR * this.α;
            var xOut = ix * α + iα * b + iy * a - iz * c;
            var yOut = iy * α + iα * c + iz * b - ix * a;
            var zOut = iz * α + iα * a + ix * c - iy * b;
            var βOut = quadR * this.β;
            return G3.fromCartesian(αOut, xOut, yOut, zOut, 0, 0, 0, βOut, this.uom);
        };
        G3.prototype.sin = function () {
            Unit_1.default.assertDimensionless(this.uom);
            var sinW = Math.sin(this.α);
            return new G3(sinW, 0, 0, 0, 0, 0, 0, 0, void 0);
        };
        G3.prototype.sinh = function () {
            throw new Error(notImplemented_1.default('sinh').message);
        };
        G3.prototype.slerp = function (target, α) {
            throw new Error(notImplemented_1.default('slerp').message);
        };
        G3.prototype.sqrt = function () {
            return new G3(Math.sqrt(this.α), 0, 0, 0, 0, 0, 0, 0, Unit_1.default.sqrt(this.uom));
        };
        G3.prototype.tan = function () {
            return this.sin().div(this.cos());
        };
        G3.prototype.toStringCustom = function (coordToString, labels) {
            var quantityString = stringFromCoordinates_1.default(this.coords, coordToString, labels);
            if (this.uom) {
                var unitString = this.uom.toString().trim();
                if (unitString) {
                    return quantityString + ' ' + unitString;
                }
                else {
                    return quantityString;
                }
            }
            else {
                return quantityString;
            }
        };
        G3.prototype.toExponential = function () {
            var coordToString = function (coord) { return coord.toExponential(); };
            return this.toStringCustom(coordToString, G3.BASIS_LABELS);
        };
        G3.prototype.toFixed = function (digits) {
            var coordToString = function (coord) { return coord.toFixed(digits); };
            return this.toStringCustom(coordToString, G3.BASIS_LABELS);
        };
        G3.prototype.toString = function () {
            var coordToString = function (coord) { return coord.toString(); };
            return this.toStringCustom(coordToString, G3.BASIS_LABELS);
        };
        G3.mutator = function (M) {
            var that = {
                set α(α) {
                    M._coords[COORD_SCALAR] = α;
                },
                set alpha(alpha) {
                    M._coords[COORD_SCALAR] = alpha;
                },
                set x(x) {
                    M._coords[COORD_X] = x;
                },
                set y(y) {
                    M._coords[COORD_Y] = y;
                },
                set z(z) {
                    M._coords[COORD_Z] = z;
                },
                set yz(yz) {
                    M._coords[COORD_YZ] = yz;
                },
                set zx(zx) {
                    M._coords[COORD_ZX] = zx;
                },
                set xy(xy) {
                    M._coords[COORD_XY] = xy;
                },
                set β(β) {
                    M._coords[COORD_PSEUDO] = β;
                },
                set beta(beta) {
                    M._coords[COORD_PSEUDO] = beta;
                },
                set uom(uom) {
                    M.uom = uom;
                }
            };
            return that;
        };
        G3.copy = function (m) {
            if (m instanceof G3) {
                return m;
            }
            else {
                return new G3(m.α, m.x, m.y, m.z, m.xy, m.yz, m.zx, m.β, m.uom);
            }
        };
        G3.fromSpinorE3 = function (spinor) {
            if (spinor) {
                return new G3(spinor.α, 0, 0, 0, spinor.xy, spinor.yz, spinor.zx, 0, void 0);
            }
            else {
                return void 0;
            }
        };
        G3.fromVectorE3 = function (vector) {
            if (vector) {
                return new G3(0, vector.x, vector.y, vector.z, 0, 0, 0, 0, vector.uom);
            }
            else {
                return void 0;
            }
        };
        G3.scalar = function (α, uom) {
            return new G3(α, 0, 0, 0, 0, 0, 0, 0, uom);
        };
        G3.vector = function (x, y, z, uom) {
            return new G3(0, x, y, z, 0, 0, 0, 0, uom);
        };
        G3.BASIS_LABELS = BASIS_LABELS_G3_STANDARD_1.default;
        G3.zero = new G3(0, 0, 0, 0, 0, 0, 0, 0);
        G3.one = new G3(1, 0, 0, 0, 0, 0, 0, 0);
        G3.e1 = new G3(0, 1, 0, 0, 0, 0, 0, 0);
        G3.e2 = new G3(0, 0, 1, 0, 0, 0, 0, 0);
        G3.e3 = new G3(0, 0, 0, 1, 0, 0, 0, 0);
        G3.kilogram = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.KILOGRAM);
        G3.meter = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.METER);
        G3.second = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.SECOND);
        G3.coulomb = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.COULOMB);
        G3.ampere = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.AMPERE);
        G3.kelvin = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.KELVIN);
        G3.mole = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.MOLE);
        G3.candela = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.CANDELA);
        return G3;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = G3;
});
