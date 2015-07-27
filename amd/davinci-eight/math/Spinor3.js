define(["require", "exports", '../checks/expectArg'], function (require, exports, expectArg) {
    /**
     * @class Spinor3
     */
    var Spinor3 = (function () {
        function Spinor3(data) {
            if (data === void 0) { data = [0, 0, 0, 1]; }
            this.data = data;
            this.modified = false;
        }
        Object.defineProperty(Spinor3.prototype, "data", {
            get: function () {
                if (this.$data) {
                    return this.$data;
                }
                else if (this.$callback) {
                    var data = this.$callback();
                    expectArg('callback()', data).toSatisfy(data.length === 4, "callback() length must be 4");
                    return this.$callback();
                }
                else {
                    throw new Error("Vector3 is undefined.");
                }
            },
            set: function (data) {
                expectArg('data', data).toSatisfy(data.length === 4, "data length must be 4");
                this.$data = data;
                this.$callback = void 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Spinor3.prototype, "callback", {
            get: function () {
                return this.$callback;
            },
            set: function (reactTo) {
                this.$callback = reactTo;
                this.$data = void 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Spinor3.prototype, "yz", {
            /**
             * @property yz
             * @type Number
             */
            get: function () {
                return this.data[0];
            },
            set: function (value) {
                this.modified = this.modified || this.yz !== value;
                this.data[0] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Spinor3.prototype, "zx", {
            /**
             * @property zx
             * @type Number
             */
            get: function () {
                return this.data[1];
            },
            set: function (value) {
                this.modified = this.modified || this.zx !== value;
                this.data[1] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Spinor3.prototype, "xy", {
            /**
             * @property xy
             * @type Number
             */
            get: function () {
                return this.data[2];
            },
            set: function (value) {
                this.modified = this.modified || this.xy !== value;
                this.data[2] = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Spinor3.prototype, "w", {
            /**
             * @property w
             * @type Number
             */
            get: function () {
                return this.data[3];
            },
            set: function (value) {
                this.modified = this.modified || this.w !== value;
                this.data[3] = value;
            },
            enumerable: true,
            configurable: true
        });
        Spinor3.prototype.clone = function () {
            return new Spinor3([this.yz, this.zx, this.xy, this.w]);
        };
        /**
         * @method toString
         * @return {string} A non-normative string representation of the target.
         */
        Spinor3.prototype.toString = function () {
            return "Spinor3({yz: " + this.yz + ", zx: " + this.zx + ", xy: " + this.xy + ", w: " + this.w + "})";
        };
        return Spinor3;
    })();
    return Spinor3;
});
