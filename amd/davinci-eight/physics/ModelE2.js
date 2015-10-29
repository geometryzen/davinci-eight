var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../checks/mustBeString', '../math/G2', '../math/R2', '../math/SpinG2', '../i18n/readOnly', '../utils/Shareable'], function (require, exports, mustBeString, G2, R2, SpinG2, readOnly, Shareable) {
    /**
     * @class ModelE2
     */
    var ModelE2 = (function (_super) {
        __extends(ModelE2, _super);
        /**
         * <p>
         * A collection of properties for Rigid Body Modeling.
         * </p>
         * <p>
         * ModelE2 implements IFacet required for manipulating a drawable object.
         * </p>
         * <p>
         * Constructs a ModelE2 at the origin and with unity attitude.
         * </p>
         * @class ModelE2
         * @constructor
         * @param type [string = 'ModelE2'] The name used for reference counting.
         */
        function ModelE2(type) {
            if (type === void 0) { type = 'ModelE2'; }
            _super.call(this, mustBeString('type', type));
            this._position = new G2().zero();
            this._attitude = new G2().zero().addScalar(1);
            /**
             * Used for exchanging number[] data to achieve integrity and avoid lots of temporaries.
             * @property _posCache
             * @type {R2}
             * @private
             */
            this._posCache = new R2([0, 0]);
            /**
             * Used for exchanging number[] data to achieve integrity and avoid lots of temporaries.
             * @property _attCache
             * @type {SpinG2}
             * @private
             */
            this._attCache = new SpinG2([0, 0]);
            this._position.modified = true;
            this._attitude.modified = true;
        }
        /**
         * @method destructor
         * @return {void}
         * @protected
         */
        ModelE2.prototype.destructor = function () {
            this._position = void 0;
            this._attitude = void 0;
        };
        Object.defineProperty(ModelE2.prototype, "R", {
            /**
             * <p>
             * The <em>attitude</em>, a unitary spinor.
             * </p>
             * @property R
             * @type G2
             * @readOnly
             */
            get: function () {
                return this._attitude;
            },
            set: function (unused) {
                throw new Error(readOnly(ModelE2.PROP_ATTITUDE).message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ModelE2.prototype, "X", {
            /**
             * <p>
             * The <em>position</em>, a vector.
             * The vector <b>X</b> designates the center of mass of the body (Physics).
             * The vector <b>X</b> designates the displacement from the local origin (Computer Graphics).
             * </p>
             *
             * @property X
             * @type G2
             * @readOnly
             */
            get: function () {
                return this._position;
            },
            set: function (unused) {
                throw new Error(readOnly(ModelE2.PROP_POSITION).message);
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @method getProperty
         * @param name {string}
         * @return {number[]}
         */
        ModelE2.prototype.getProperty = function (name) {
            switch (name) {
                case ModelE2.PROP_ATTITUDE: {
                    return this._attCache.copy(this._attitude).data;
                }
                case ModelE2.PROP_POSITION: {
                    return this._posCache.copy(this._position).data;
                }
                default: {
                    console.warn("ModelE2.getProperty " + name);
                    return void 0;
                }
            }
        };
        /**
         * @method setProperty
         * @param name {string}
         * @param data {number[]}
         * @return {void}
         */
        ModelE2.prototype.setProperty = function (name, data) {
            switch (name) {
                case ModelE2.PROP_ATTITUDE:
                    {
                        this._attCache.data = data;
                        this._attitude.copySpinor(this._attCache);
                    }
                    break;
                case ModelE2.PROP_POSITION:
                    {
                        this._posCache.data = data;
                        this._position.copyVector(this._posCache);
                    }
                    break;
                default: {
                    console.warn("ModelE2.setProperty " + name);
                }
            }
        };
        /**
         * The name of the property that designates the attitude.
         * @property PROP_ATTITUDE
         * @type {string}
         * @default 'R'
         * @static
         * @readOnly
         */
        ModelE2.PROP_ATTITUDE = 'R';
        /**
         * The name of the property that designates the position.
         * @property PROP_POSITION
         * @type {string}
         * @default 'X'
         * @static
         * @readOnly
         */
        ModelE2.PROP_POSITION = 'X';
        return ModelE2;
    })(Shareable);
    return ModelE2;
});
