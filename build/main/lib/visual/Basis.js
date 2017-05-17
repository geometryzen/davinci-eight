"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var BeginMode_1 = require("../core/BeginMode");
var Color_1 = require("../core/Color");
var ColorFacet_1 = require("../facets/ColorFacet");
var DataType_1 = require("../core/DataType");
var Defaults_1 = require("./Defaults");
var GeometryArrays_1 = require("../core/GeometryArrays");
var GraphicsProgramSymbols_1 = require("../core/GraphicsProgramSymbols");
var Mesh_1 = require("../core/Mesh");
var setColorOption_1 = require("./setColorOption");
var setDeprecatedOptions_1 = require("./setDeprecatedOptions");
var ShaderMaterial_1 = require("../materials/ShaderMaterial");
var Vector3_1 = require("../math/Vector3");
var Vector3Facet_1 = require("../facets/Vector3Facet");
var uPointA = 'uPointA';
var uPointB = 'uPointB';
var uPointC = 'uPointC';
var uColorA = 'uColorA';
var uColorB = 'uColorB';
var uColorC = 'uColorC';
var vertexShaderSrc = function () {
    var vs = [
        "attribute float aPointIndex;",
        "attribute float aColorIndex;",
        "uniform vec3 " + uPointA + ";",
        "uniform vec3 " + uPointB + ";",
        "uniform vec3 " + uPointC + ";",
        "uniform vec3 " + uColorA + ";",
        "uniform vec3 " + uColorB + ";",
        "uniform vec3 " + uColorC + ";",
        "uniform mat4 " + GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX + ";",
        "uniform mat4 " + GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX + ";",
        "uniform mat4 " + GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX + ";",
        "varying highp vec4 " + GraphicsProgramSymbols_1.GraphicsProgramSymbols.VARYING_COLOR + ";",
        "",
        "void main(void) {",
        "  vec3 " + GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_POSITION + ";",
        "  vec3 " + GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_COLOR + ";",
        "  if (aPointIndex == 0.0) {",
        "    " + GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_POSITION + " = vec3(0.0, 0.0, 0.0);",
        "  }",
        "  if (aPointIndex == 1.0) {",
        "    " + GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_POSITION + " = " + uPointA + ";",
        "  }",
        "  if (aPointIndex == 2.0) {",
        "    " + GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_POSITION + " = " + uPointB + ";",
        "  }",
        "  if (aPointIndex == 3.0) {",
        "    " + GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_POSITION + " = " + uPointC + ";",
        "  }",
        "  if (aColorIndex == 1.0) {",
        "    " + GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_COLOR + " = " + uColorA + ";",
        "  }",
        "  if (aColorIndex == 2.0) {",
        "    " + GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_COLOR + " = " + uColorB + ";",
        "  }",
        "  if (aColorIndex == 3.0) {",
        "    " + GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_COLOR + " = " + uColorC + ";",
        "  }",
        "  gl_Position = " + GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX + " * " + GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX + " * " + GraphicsProgramSymbols_1.GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX + " * vec4(" + GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_POSITION + ", 1.0);",
        "  " + GraphicsProgramSymbols_1.GraphicsProgramSymbols.VARYING_COLOR + " = vec4(" + GraphicsProgramSymbols_1.GraphicsProgramSymbols.ATTRIBUTE_COLOR + ", 1.0);",
        "}"
    ].join('\n');
    return vs;
};
var fragmentShaderSrc = function () {
    var fs = [
        "precision mediump float;",
        "varying highp vec4 " + GraphicsProgramSymbols_1.GraphicsProgramSymbols.VARYING_COLOR + ";",
        "",
        "void main(void) {",
        "  gl_FragColor = " + GraphicsProgramSymbols_1.GraphicsProgramSymbols.VARYING_COLOR + ";",
        "}"
    ].join('\n');
    return fs;
};
/**
 * A 3D visual representation of a reference frame or basis vectors.
 */
var Basis = (function (_super) {
    tslib_1.__extends(Basis, _super);
    /**
     *
     */
    function Basis(contextManager, options, levelUp) {
        if (options === void 0) { options = {}; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, void 0, void 0, contextManager, { axis: Defaults_1.ds.axis, meridian: Defaults_1.ds.meridian }, levelUp + 1) || this;
        _this.uPointA = new Vector3Facet_1.Vector3Facet(uPointA);
        _this.uPointB = new Vector3Facet_1.Vector3Facet(uPointB);
        _this.uPointC = new Vector3Facet_1.Vector3Facet(uPointC);
        _this.uColorA = new ColorFacet_1.ColorFacet(uColorA);
        _this.uColorB = new ColorFacet_1.ColorFacet(uColorB);
        _this.uColorC = new ColorFacet_1.ColorFacet(uColorC);
        _this.setLoggingName("Basis");
        _this.uPointA.vector = Vector3_1.Vector3.vector(1, 0, 0);
        _this.colorA.copy(Color_1.Color.red);
        _this.uPointB.vector = Vector3_1.Vector3.vector(0, 1, 0);
        _this.colorB.copy(Color_1.Color.green);
        _this.uPointC.vector = Vector3_1.Vector3.vector(0, 0, 1);
        _this.colorC.copy(Color_1.Color.blue);
        var primitive = {
            mode: BeginMode_1.BeginMode.LINES,
            attributes: {
                aPointIndex: { values: [0, 1, 0, 2, 0, 3], size: 1, type: DataType_1.DataType.FLOAT },
                aColorIndex: { values: [1, 1, 2, 2, 3, 3], size: 1, type: DataType_1.DataType.FLOAT }
            }
        };
        var geometry = new GeometryArrays_1.GeometryArrays(contextManager, primitive);
        _this.geometry = geometry;
        geometry.release();
        var material = new ShaderMaterial_1.ShaderMaterial(vertexShaderSrc(), fragmentShaderSrc(), [], contextManager);
        _this.material = material;
        material.release();
        _this.setFacet("Basis-" + uPointA, _this.uPointA);
        _this.setFacet("Basis-" + uPointB, _this.uPointB);
        _this.setFacet("Basis-" + uPointC, _this.uPointC);
        _this.setFacet("Basis-" + uColorA, _this.uColorA);
        _this.setFacet("Basis-" + uColorB, _this.uColorB);
        _this.setFacet("Basis-" + uColorC, _this.uColorC);
        setColorOption_1.setColorOption(_this, options, void 0);
        setDeprecatedOptions_1.setDeprecatedOptions(_this, options);
        if (levelUp === 0) {
            _this.synchUp();
        }
        return _this;
    }
    Basis.prototype.destructor = function (levelUp) {
        if (levelUp === 0) {
            this.cleanUp();
        }
        _super.prototype.destructor.call(this, levelUp + 1);
    };
    Object.defineProperty(Basis.prototype, "a", {
        get: function () {
            return this.uPointA.vector;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Basis.prototype, "b", {
        get: function () {
            return this.uPointB.vector;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Basis.prototype, "c", {
        get: function () {
            return this.uPointC.vector;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Basis.prototype, "colorA", {
        get: function () {
            return this.uColorA.color;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Basis.prototype, "colorB", {
        get: function () {
            return this.uColorB.color;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Basis.prototype, "colorC", {
        get: function () {
            return this.uColorC.color;
        },
        enumerable: true,
        configurable: true
    });
    return Basis;
}(Mesh_1.Mesh));
exports.Basis = Basis;
