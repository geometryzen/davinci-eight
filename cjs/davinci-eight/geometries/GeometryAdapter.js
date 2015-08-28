var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Line3 = require('../core/Line3');
var Point3 = require('../core/Point3');
var Color = require('../core/Color');
var Symbolic = require('../core/Symbolic');
var DefaultAttribProvider = require('../core/DefaultAttribProvider');
var DataUsage = require('../core/DataUsage');
var DrawMode = require('../core/DrawMode');
function defaultColorFunction(vertexIndex, face, vertexList) {
    return new Color([1.0, 1.0, 1.0]);
}
/**
 * Adapter from a Geometry to a AttribProvider.
 * Enables the rapid construction of meshes starting from classes that extend Geometry.
 * Automatically uses elements (vertex indices).
 * @class GeometryAdapter
 * @extends VertexAttributeProivider
 */
var GeometryAdapter = (function (_super) {
    __extends(GeometryAdapter, _super);
    /**
     * @class GeometryAdapter
     * @constructor
     * @param geometry {Geometry} The geometry that must be adapted to a AttribProvider.
     */
    function GeometryAdapter(geometry, options) {
        _super.call(this);
        this.$drawMode = DrawMode.TRIANGLES;
        this.elementsUsage = DataUsage.STREAM_DRAW;
        this.grayScale = false;
        this.lines = [];
        this.points = [];
        options = options || {};
        options.drawMode = typeof options.drawMode !== 'undefined' ? options.drawMode : DrawMode.TRIANGLES;
        options.elementsUsage = typeof options.elementsUsage !== 'undefined' ? options.elementsUsage : DataUsage.STREAM_DRAW;
        this.positionVarName = options.positionVarName || Symbolic.ATTRIBUTE_POSITION;
        this.normalVarName = options.normalVarName || Symbolic.ATTRIBUTE_NORMAL;
        this.geometry = geometry;
        //  this.color = new Color([1.0, 1.0, 1.0]);
        this.geometry.dynamic = false;
        this.$drawMode = options.drawMode;
        this.elementsUsage = options.elementsUsage;
    }
    Object.defineProperty(GeometryAdapter.prototype, "drawMode", {
        get: function () {
            return this.$drawMode;
        },
        set: function (value) {
            // Changing the drawMode after accessing attribute meta data causes
            // a shader program to be created that does not agree with
            // what the mesh is able to provide.
            throw new Error("The drawMode property is readonly");
        },
        enumerable: true,
        configurable: true
    });
    GeometryAdapter.prototype.draw = function (context) {
        switch (this.drawMode) {
            case DrawMode.POINTS:
                {
                    context.drawArrays(context.POINTS, 0, this.points.length * 1);
                }
                break;
            case DrawMode.LINES:
                {
                    context.drawArrays(context.LINES, 0, this.lines.length * 2);
                }
                break;
            case DrawMode.TRIANGLES:
                {
                    //context.drawElements(context.TRIANGLES, this.elementArray.length, context.UNSIGNED_SHORT,0);
                    context.drawArrays(context.TRIANGLES, 0, this.geometry.faces.length * 3);
                }
                break;
            default: {
            }
        }
    };
    Object.defineProperty(GeometryAdapter.prototype, "dynamic", {
        get: function () {
            return this.geometry.dynamic;
        },
        enumerable: true,
        configurable: true
    });
    GeometryAdapter.prototype.hasElementArray = function () {
        return true;
    };
    GeometryAdapter.prototype.getElementArray = function () {
        return { usage: this.elementsUsage, data: this.elementArray };
    };
    GeometryAdapter.prototype.getAttribArray = function (name) {
        // FIXME: Need to inject usage for each array type.
        switch (name) {
            case this.positionVarName: {
                return { usage: DataUsage.DYNAMIC_DRAW, data: this.aVertexPositionArray };
            }
            //      case DEFAULT_VERTEX_ATTRIBUTE_COLOR_NAME: {
            //        return {usage: DataUsage.DYNAMIC_DRAW, data: this.aVertexColorArray };
            //      }
            case this.normalVarName: {
                if (this.$drawMode === DrawMode.TRIANGLES) {
                    return { usage: DataUsage.DYNAMIC_DRAW, data: this.aVertexNormalArray };
                }
                else {
                    return;
                }
            }
            default: {
                return;
            }
        }
    };
    GeometryAdapter.prototype.getAttribMeta = function () {
        var attribues = {};
        attribues[Symbolic.ATTRIBUTE_POSITION] = {
            name: this.positionVarName,
            glslType: 'vec3',
            size: 3,
            normalized: false,
            stride: 0,
            offset: 0
        };
        /*
            if (!this.grayScale) {
              attribues[Symbolic.ATTRIBUTE_COLOR] = {
                name: DEFAULT_VERTEX_ATTRIBUTE_COLOR_NAME,
                glslType: 'vec4',
                size: 4,
                normalized: false,
                stride: 0,
                offset: 0
              };
            }
        */
        if (this.drawMode === DrawMode.TRIANGLES) {
            attribues[Symbolic.ATTRIBUTE_NORMAL] = {
                name: this.normalVarName,
                glslType: 'vec3',
                size: 3,
                normalized: false,
                stride: 0,
                offset: 0
            };
        }
        return attribues;
    };
    GeometryAdapter.prototype.update = function () {
        var vertices = [];
        //  let colors: number[] = [];
        var normals = [];
        var elements = [];
        var vertexList = this.geometry.vertices;
        /*
        let color = this.color;
        let colorFunction = this.colorFunction;
        let colorMaker = function(vertexIndex: number, face: Face3, vertexList: Vector3[]): Color
        {
          if (color)
          {
            return color;
          }
          else if (colorFunction)
          {
            return colorFunction(vertexIndex, face, vertexList);
          }
          else
          {
            return defaultColorFunction(vertexIndex, face, vertexList);
          }
        }
        */
        switch (this.drawMode) {
            case DrawMode.POINTS:
                {
                    this.points = [];
                    this.computePoints();
                    this.points.forEach(function (point) {
                        elements.push(point.a);
                        var vA = vertexList[point.a];
                        vertices.push(vA.x);
                        vertices.push(vA.y);
                        vertices.push(vA.z);
                        /*
                        var colorA: Color = color;
                        colors.push(colorA.red);
                        colors.push(colorA.green);
                        colors.push(colorA.blue);
                        colors.push(1.0);
                        */
                    });
                }
                break;
            case DrawMode.LINES:
                {
                    this.lines = [];
                    this.computeLines();
                    this.lines.forEach(function (line) {
                        elements.push(line.a);
                        elements.push(line.b);
                        var vA = vertexList[line.a];
                        vertices.push(vA.x);
                        vertices.push(vA.y);
                        vertices.push(vA.z);
                        var vB = vertexList[line.b];
                        vertices.push(vB.x);
                        vertices.push(vB.y);
                        vertices.push(vB.z);
                        /*
                        var colorA: Color = color;
                        var colorB: Color = color;
                        colors.push(colorA.red);
                        colors.push(colorA.green);
                        colors.push(colorA.blue);
                        colors.push(1.0);
              
                        colors.push(colorB.red);
                        colors.push(colorB.green);
                        colors.push(colorB.blue);
                        colors.push(1.0);
                        */
                    });
                }
                break;
            case DrawMode.TRIANGLES:
                {
                    this.geometry.faces.forEach(function (face) {
                        elements.push(face.a);
                        elements.push(face.b);
                        elements.push(face.c);
                        var vA = vertexList[face.a];
                        vertices.push(vA.x);
                        vertices.push(vA.y);
                        vertices.push(vA.z);
                        var vB = vertexList[face.b];
                        vertices.push(vB.x);
                        vertices.push(vB.y);
                        vertices.push(vB.z);
                        var vC = vertexList[face.c];
                        vertices.push(vC.x);
                        vertices.push(vC.y);
                        vertices.push(vC.z);
                        // TODO: 3 means per-vertex, 1 means same per face, 0 means compute face normals?
                        if (face.normals.length === 3) {
                            var nA = face.normals[0];
                            var nB = face.normals[1];
                            var nC = face.normals[2];
                            normals.push(nA.x);
                            normals.push(nA.y);
                            normals.push(nA.z);
                            normals.push(nB.x);
                            normals.push(nB.y);
                            normals.push(nB.z);
                            normals.push(nC.x);
                            normals.push(nC.y);
                            normals.push(nC.z);
                        }
                        else if (face.normals.length === 1) {
                            var normal = face.normals[0];
                            normals.push(normal.x);
                            normals.push(normal.y);
                            normals.push(normal.z);
                            normals.push(normal.x);
                            normals.push(normal.y);
                            normals.push(normal.z);
                            normals.push(normal.x);
                            normals.push(normal.y);
                            normals.push(normal.z);
                        }
                        /*
                        var colorA: Color = colorMaker(face.a, face, vertexList);
                        var colorB: Color = colorMaker(face.b, face, vertexList);
                        var colorC: Color = colorMaker(face.c, face, vertexList);
              
                        colors.push(colorA.red);
                        colors.push(colorA.green);
                        colors.push(colorA.blue);
                        colors.push(1.0);
              
                        colors.push(colorB.red);
                        colors.push(colorB.green);
                        colors.push(colorB.blue);
                        colors.push(1.0);
              
                        colors.push(colorC.red);
                        colors.push(colorC.green);
                        colors.push(colorC.blue);
                        colors.push(1.0);
                        */
                    });
                }
                break;
            default: {
            }
        }
        this.elementArray = new Uint16Array(elements);
        this.aVertexPositionArray = new Float32Array(vertices);
        //  this.aVertexColorArray = new Float32Array(colors);
        this.aVertexNormalArray = new Float32Array(normals);
    };
    GeometryAdapter.prototype.computeLines = function () {
        var lines = this.lines;
        this.geometry.faces.forEach(function (face) {
            lines.push(new Line3(face.a, face.b));
            lines.push(new Line3(face.b, face.c));
            lines.push(new Line3(face.c, face.a));
        });
    };
    GeometryAdapter.prototype.computePoints = function () {
        var points = this.points;
        this.geometry.faces.forEach(function (face) {
            points.push(new Point3(face.a));
            points.push(new Point3(face.b));
            points.push(new Point3(face.c));
        });
    };
    return GeometryAdapter;
})(DefaultAttribProvider);
module.exports = GeometryAdapter;
