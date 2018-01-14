import * as tslib_1 from "tslib";
import { BeginMode } from '../core/BeginMode';
import { Color } from '../core/Color';
import { ColorFacet } from '../facets/ColorFacet';
import { ds } from './Defaults';
import { GeometryArrays } from '../core/GeometryArrays';
import { GraphicsProgramSymbols as GPS } from '../core/GraphicsProgramSymbols';
import { Mesh } from '../core/Mesh';
import { setColorOption } from './setColorOption';
import { setDeprecatedOptions } from './setDeprecatedOptions';
import { ShaderMaterial } from '../materials/ShaderMaterial';
import { Vector3 } from '../math/Vector3';
import { Vector3Facet } from '../facets/Vector3Facet';
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
        "uniform mat4 " + GPS.UNIFORM_MODEL_MATRIX + ";",
        "uniform mat4 " + GPS.UNIFORM_PROJECTION_MATRIX + ";",
        "uniform mat4 " + GPS.UNIFORM_VIEW_MATRIX + ";",
        "varying highp vec4 " + GPS.VARYING_COLOR + ";",
        "",
        "void main(void) {",
        "  vec3 " + GPS.ATTRIBUTE_POSITION + ";",
        "  vec3 " + GPS.ATTRIBUTE_COLOR + ";",
        "  if (aPointIndex == 0.0) {",
        "    " + GPS.ATTRIBUTE_POSITION + " = vec3(0.0, 0.0, 0.0);",
        "  }",
        "  if (aPointIndex == 1.0) {",
        "    " + GPS.ATTRIBUTE_POSITION + " = " + uPointA + ";",
        "  }",
        "  if (aPointIndex == 2.0) {",
        "    " + GPS.ATTRIBUTE_POSITION + " = " + uPointB + ";",
        "  }",
        "  if (aPointIndex == 3.0) {",
        "    " + GPS.ATTRIBUTE_POSITION + " = " + uPointC + ";",
        "  }",
        "  if (aColorIndex == 1.0) {",
        "    " + GPS.ATTRIBUTE_COLOR + " = " + uColorA + ";",
        "  }",
        "  if (aColorIndex == 2.0) {",
        "    " + GPS.ATTRIBUTE_COLOR + " = " + uColorB + ";",
        "  }",
        "  if (aColorIndex == 3.0) {",
        "    " + GPS.ATTRIBUTE_COLOR + " = " + uColorC + ";",
        "  }",
        "  gl_Position = " + GPS.UNIFORM_PROJECTION_MATRIX + " * " + GPS.UNIFORM_VIEW_MATRIX + " * " + GPS.UNIFORM_MODEL_MATRIX + " * vec4(" + GPS.ATTRIBUTE_POSITION + ", 1.0);",
        "  " + GPS.VARYING_COLOR + " = vec4(" + GPS.ATTRIBUTE_COLOR + ", 1.0);",
        "}"
    ].join('\n');
    return vs;
};
var fragmentShaderSrc = function () {
    var fs = [
        "precision mediump float;",
        "varying highp vec4 " + GPS.VARYING_COLOR + ";",
        "",
        "void main(void) {",
        "  gl_FragColor = " + GPS.VARYING_COLOR + ";",
        "}"
    ].join('\n');
    return fs;
};
/**
 * A 3D visual representation of a reference frame or basis vectors.
 */
var Basis = /** @class */ (function (_super) {
    tslib_1.__extends(Basis, _super);
    /**
     *
     */
    function Basis(contextManager, options, levelUp) {
        if (options === void 0) { options = {}; }
        if (levelUp === void 0) { levelUp = 0; }
        var _this = _super.call(this, void 0, void 0, contextManager, { axis: ds.axis, meridian: ds.meridian }, levelUp + 1) || this;
        _this.uPointA = new Vector3Facet(uPointA);
        _this.uPointB = new Vector3Facet(uPointB);
        _this.uPointC = new Vector3Facet(uPointC);
        _this.uColorA = new ColorFacet(uColorA);
        _this.uColorB = new ColorFacet(uColorB);
        _this.uColorC = new ColorFacet(uColorC);
        _this.setLoggingName("Basis");
        _this.uPointA.vector = Vector3.vector(1, 0, 0);
        _this.colorA.copy(Color.red);
        _this.uPointB.vector = Vector3.vector(0, 1, 0);
        _this.colorB.copy(Color.green);
        _this.uPointC.vector = Vector3.vector(0, 0, 1);
        _this.colorC.copy(Color.blue);
        var primitive = {
            mode: BeginMode.LINES,
            attributes: {
                aPointIndex: { values: [0, 1, 0, 2, 0, 3], size: 1 },
                aColorIndex: { values: [1, 1, 2, 2, 3, 3], size: 1 }
            }
        };
        var geometry = new GeometryArrays(contextManager, primitive);
        _this.geometry = geometry;
        geometry.release();
        var material = new ShaderMaterial(vertexShaderSrc(), fragmentShaderSrc(), [], contextManager);
        _this.material = material;
        material.release();
        _this.setFacet("Basis-" + uPointA, _this.uPointA);
        _this.setFacet("Basis-" + uPointB, _this.uPointB);
        _this.setFacet("Basis-" + uPointC, _this.uPointC);
        _this.setFacet("Basis-" + uColorA, _this.uColorA);
        _this.setFacet("Basis-" + uColorB, _this.uColorB);
        _this.setFacet("Basis-" + uColorC, _this.uColorC);
        setColorOption(_this, options, void 0);
        setDeprecatedOptions(_this, options);
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
}(Mesh));
export { Basis };
