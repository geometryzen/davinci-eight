var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../programs/fragmentShader', '../materials/Material', '../programs/createMaterial', '../programs/vertexShader'], function (require, exports, fragmentShader, Material, createMaterial, vertexShader) {
    /**
     * Name used for reference count monitoring and logging.
     */
    var LOGGING_NAME = 'SmartMaterial';
    function contextBuilder() {
        return LOGGING_NAME;
    }
    /**
     * <p>
     * SmartMaterial constructs a vertex shader and a fragment shader.
     * The shader codes are configured by specifying attributes, uniforms and varyings.
     * The default configuration is produces minimal shaders.
     * <p>
     * @class SmartMaterial
     * @extends Material
     */
    var SmartMaterial = (function (_super) {
        __extends(SmartMaterial, _super);
        /**
         * @class SmartMaterial
         * @constructor
         * @param contexts {IContextMonitor[]}
         * @param geometry {GeometryMeta} This parameter determines the attributes used in the shaders.
         */
        function SmartMaterial(contexts, aParams, uParams, vColor, vLight) {
            // A super call must be the first statement in the constructor when a class
            // contains initialized propertied or has parameter properties (TS2376).
            _super.call(this, contexts, LOGGING_NAME);
            this.aParams = {};
            this.uParams = {};
            this.vColor = false;
            this.vLight = false;
            this.aParams = aParams;
            this.uParams = uParams;
            this.vColor = vColor;
            this.vLight = vLight;
            // We can start eagerly or omit this call entirely and wait till we are use(d).
            this.makeReady(false);
        }
        SmartMaterial.prototype.createProgram = function () {
            var bindings = [];
            return createMaterial(this.monitors, this.vertexShader, this.fragmentShader, bindings);
        };
        Object.defineProperty(SmartMaterial.prototype, "vertexShader", {
            get: function () {
                return vertexShader(this.aParams, this.uParams, this.vColor, this.vLight);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SmartMaterial.prototype, "fragmentShader", {
            get: function () {
                return fragmentShader(this.aParams, this.uParams, this.vColor, this.vLight);
            },
            enumerable: true,
            configurable: true
        });
        return SmartMaterial;
    })(Material);
    return SmartMaterial;
});
