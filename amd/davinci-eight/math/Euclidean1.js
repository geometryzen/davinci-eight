define(["require", "exports", '../checks/mustBeInteger', '../i18n/readOnly', '../math/Unit'], function (require, exports, mustBeInteger_1, readOnly_1, Unit_1) {
    function assertArgNumber(name, x) {
        if (typeof x === 'number') {
            return x;
        }
        else {
            throw new Error("Argument '" + name + "' must be a number");
        }
    }
    function assertArgEuclidean1(name, arg) {
        if (arg instanceof Euclidean1) {
            return arg;
        }
        else {
            throw new Error("Argument '" + arg + "' must be a Euclidean1");
        }
    }
    function assertArgUnitOrUndefined(name, uom) {
        if (typeof uom === 'undefined' || uom instanceof Unit_1.default) {
            return uom;
        }
        else {
            throw new Error("Argument '" + uom + "' must be a Unit or undefined");
        }
    }
    var Euclidean1 = (function () {
        function Euclidean1(α, β, uom) {
            this.w = assertArgNumber('α', α);
            this.x = assertArgNumber('β', β);
            this.uom = assertArgUnitOrUndefined('uom', uom);
            if (this.uom && this.uom.multiplier !== 1) {
                var multiplier = this.uom.multiplier;
                this.w *= multiplier;
                this.x *= multiplier;
                this.uom = new Unit_1.default(1, uom.dimensions, uom.labels);
            }
        }
        Object.defineProperty(Euclidean1.prototype, "α", {
            get: function () {
                return this.w;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('α').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Euclidean1.prototype, "β", {
            get: function () {
                return this.x;
            },
            set: function (unused) {
                throw new Error(readOnly_1.default('β').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Euclidean1.prototype, "coords", {
            get: function () {
                return [this.w, this.x];
            },
            enumerable: true,
            configurable: true
        });
        Euclidean1.prototype.copy = function (source) {
            this.w = source.w;
            this.x = source.x;
            this.uom = source.uom;
            return this;
        };
        Euclidean1.prototype.difference = function (a, b) {
            this.w = a.w - b.w;
            this.x = a.x - b.x;
            this.uom = Unit_1.default.compatible(a.uom, b.uom);
            return this;
        };
        Euclidean1.prototype.add = function (rhs) {
            assertArgEuclidean1('rhs', rhs);
            return new Euclidean1(this.w + rhs.w, this.x + rhs.x, Unit_1.default.compatible(this.uom, rhs.uom));
        };
        Euclidean1.prototype.angle = function () {
            return this.log().grade(2);
        };
        Euclidean1.prototype.sub = function (rhs) {
            assertArgEuclidean1('rhs', rhs);
            return new Euclidean1(this.w - rhs.w, this.x - rhs.x, Unit_1.default.compatible(this.uom, rhs.uom));
        };
        Euclidean1.prototype.mul = function (rhs) {
            throw new Error('mul');
        };
        Euclidean1.prototype.div = function (rhs) {
            throw new Error('div');
        };
        Euclidean1.prototype.divByScalar = function (α) {
            return new Euclidean1(this.w / α, this.x / α, this.uom);
        };
        Euclidean1.prototype.scp = function (rhs) {
            throw new Error('wedge');
        };
        Euclidean1.prototype.ext = function (rhs) {
            throw new Error('wedge');
        };
        Euclidean1.prototype.lco = function (rhs) {
            throw new Error('lshift');
        };
        Euclidean1.prototype.lerp = function (target, α) {
            return this;
        };
        Euclidean1.prototype.log = function () {
            throw new Error('log');
        };
        Euclidean1.prototype.rco = function (rhs) {
            throw new Error('rshift');
        };
        Euclidean1.prototype.pow = function (exponent) {
            throw new Error('pow');
        };
        Euclidean1.prototype.cos = function () {
            throw new Error('cos');
        };
        Euclidean1.prototype.cosh = function () {
            throw new Error('cosh');
        };
        Euclidean1.prototype.exp = function () {
            throw new Error('exp');
        };
        Euclidean1.prototype.norm = function () {
            return new Euclidean1(Math.sqrt(this.w * this.w + this.x * this.x), 0, this.uom);
        };
        Euclidean1.prototype.quad = function () {
            return new Euclidean1(this.w * this.w + this.x * this.x, 0, Unit_1.default.mul(this.uom, this.uom));
        };
        Euclidean1.prototype.scale = function (α) {
            return new Euclidean1(α * this.w, α * this.x, this.uom);
        };
        Euclidean1.prototype.sin = function () {
            throw new Error('sin');
        };
        Euclidean1.prototype.sinh = function () {
            throw new Error('sinh');
        };
        Euclidean1.prototype.slerp = function (target, α) {
            return this;
        };
        Euclidean1.prototype.direction = function () {
            throw new Error('direction');
        };
        Euclidean1.prototype.grade = function (grade) {
            mustBeInteger_1.default('grade', grade);
            switch (grade) {
                case 0: return new Euclidean1(this.w, 0, this.uom);
                case 1: return new Euclidean1(0, this.x, this.uom);
                default: return new Euclidean1(0, 0, this.uom);
            }
        };
        Euclidean1.prototype.toExponential = function () {
            return "Euclidean1";
        };
        Euclidean1.prototype.toFixed = function (digits) {
            return "Euclidean1";
        };
        Euclidean1.prototype.toString = function () {
            return "Euclidean1";
        };
        return Euclidean1;
    })();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Euclidean1;
});
