var Line3 = require('../core/Line3');
var Point3 = require('../core/Point3');
var Color = require('../core/Color');
var Symbolic = require('../core/Symbolic');
var DataUsage = require('../core/DataUsage');
var DrawMode = require('../core/DrawMode');
var DEFAULT_VERTEX_ATTRIBUTE_POSITION_NAME = 'aVertexPosition';
var DEFAULT_VERTEX_ATTRIBUTE_COLOR_NAME = 'aVertexColor';
var DEFAULT_VERTEX_ATTRIBUTE_NORMAL_NAME = 'aVertexNormal';
function defaultColorFunction(vertexIndex, face, vertexList) {
    return new Color([1.0, 1.0, 1.0]);
}
/**
 * Adapter from a Geometry to a AttributeProvider.
 * @class GeometryAdapter
 * @extends VertexAttributeProivider
 */
var GeometryAdapter = (function () {
    /**
     * @class GeometryAdapter
     * @constructor
     * @param geometry {Geometry} The geometry that must be adapted to a AttributeProvider.
     */
    function GeometryAdapter(geometry, options) {
        this.$drawMode = DrawMode.TRIANGLES;
        this.elementsUsage = DataUsage.STREAM_DRAW;
        this.grayScale = false;
        this.lines = [];
        this.points = [];
        options = options || {};
        options.drawMode = typeof options.drawMode !== 'undefined' ? options.drawMode : DrawMode.TRIANGLES;
        options.elementsUsage = typeof options.elementsUsage !== 'undefined' ? options.elementsUsage : DataUsage.STREAM_DRAW;
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
    GeometryAdapter.prototype.hasElements = function () {
        return true;
    };
    GeometryAdapter.prototype.getElements = function () {
        return { usage: this.elementsUsage, data: this.elementArray };
    };
    GeometryAdapter.prototype.getVertexAttributeData = function (name) {
        // FIXME: Need to inject usage for each array type.
        switch (name) {
            case DEFAULT_VERTEX_ATTRIBUTE_POSITION_NAME: {
                return { usage: DataUsage.DYNAMIC_DRAW, data: this.aVertexPositionArray };
            }
            //      case DEFAULT_VERTEX_ATTRIBUTE_COLOR_NAME: {
            //        return {usage: DataUsage.DYNAMIC_DRAW, data: this.aVertexColorArray };
            //      }
            case DEFAULT_VERTEX_ATTRIBUTE_NORMAL_NAME: {
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
    GeometryAdapter.prototype.getAttributeMetaInfos = function () {
        var attribues = {};
        attribues[Symbolic.ATTRIBUTE_POSITION] = {
            name: DEFAULT_VERTEX_ATTRIBUTE_POSITION_NAME,
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
                name: DEFAULT_VERTEX_ATTRIBUTE_NORMAL_NAME,
                glslType: 'vec3',
                size: 3,
                normalized: false,
                stride: 0,
                offset: 0
            };
        }
        return attribues;
    };
    GeometryAdapter.prototype.update = function (attributes) {
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
                        if (face.vertexNormals.length === 3) {
                            var vertexNormals = face.vertexNormals;
                            var nA = vertexNormals[0];
                            var nB = vertexNormals[1];
                            var nC = vertexNormals[2];
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
                        else {
                            // TODO: Why aren't we simply using the pre-calculated face normals?
                            // Make copies where needed to avoid mutating the geometry.
                            var a = vertexList[face.a];
                            var b = vertexList[face.b].clone();
                            var c = vertexList[face.c].clone();
                            var perp = b.sub(a).cross(c.sub(a));
                            // TODO: This is simply the normalize() function.
                            var normal = perp.divideScalar(perp.length());
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
})();
module.exports = GeometryAdapter;
