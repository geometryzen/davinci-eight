var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../programs/createGraphicsProgram', '../programs/fragmentShader', '../materials/GraphicsProgram', '../i18n/readOnly', '../programs/vertexShader'], function (require, exports, createGraphicsProgram, fragmentShader, GraphicsProgram, readOnly, vertexShader) {
    /**
     * <p>
     * SmartGraphicsProgram constructs a vertex shader and a fragment shader.
     * The shader codes are configured by specifying attributes, uniforms and varyings.
     * The default configuration is produces minimal shaders.
     * <p>
     * @class SmartGraphicsProgram
     * @extends GraphicsProgram
     */
    var SmartGraphicsProgram = (function (_super) {
        __extends(SmartGraphicsProgram, _super);
        /**
         * @class SmartGraphicsProgram
         * @constructor
         * @param contexts {IContextMonitor[]}
         * @param aParams
         * @param uParams
         * @param vColor {boolean}
         * @param vLight {boolean}
         */
        function SmartGraphicsProgram(contexts, aParams, uParams, vColor, vLight) {
            _super.call(this, contexts, 'SmartGraphicsProgram');
            this.aParams = {};
            this.uParams = {};
            this.vColor = false;
            this.vLight = false;
            this.aParams = aParams;
            this.uParams = uParams;
            this.vColor = vColor;
            this.vLight = vLight;
            // We can start eagerly or omit this call entirely and wait till we are used.
            this.makeReady(false);
        }
        /**
         * @method createGraphicsProgram
         * @return {IGraphicsProgram}
         */
        SmartGraphicsProgram.prototype.createGraphicsProgram = function () {
            // FIXME: Make the bindings work.
            var bindings = [];
            var vs = this.vertexShader;
            var fs = this.fragmentShader;
            return createGraphicsProgram(this.monitors, vs, fs, bindings);
        };
        Object.defineProperty(SmartGraphicsProgram.prototype, "vertexShader", {
            /**
             * @property vertexShader
             * @type {string}
             * @readOnly
             */
            get: function () {
                return vertexShader(this.aParams, this.uParams, this.vColor, this.vLight);
            },
            set: function (unused) {
                throw new Error(readOnly('vertexShader').message);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SmartGraphicsProgram.prototype, "fragmentShader", {
            /**
             * @property fragmentShader
             * @type {string}
             * @readOnly
             */
            get: function () {
                return fragmentShader(this.aParams, this.uParams, this.vColor, this.vLight);
            },
            set: function (unused) {
                throw new Error(readOnly('fragmentShader').message);
            },
            enumerable: true,
            configurable: true
        });
        return SmartGraphicsProgram;
    })(GraphicsProgram);
    return SmartGraphicsProgram;
});
