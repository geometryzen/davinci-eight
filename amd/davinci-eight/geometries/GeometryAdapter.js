var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", '../core/Line3', '../core/Point3', '../core/Color', '../core/Symbolic', '../core/DefaultAttribProvider', '../core/DataUsage', '../core/DrawMode', '../core/ArrayBuffer', '../core/ElementBuffer'], function (require, exports, Line3, Point3, Color, Symbolic, DefaultAttribProvider, DataUsage, DrawMode, ArrayBuffer, ElementBuffer) {
    function defaultColorFunction(vertexIndex, face, vertexList) {
        return new Color([1.0, 1.0, 1.0]);
    }
    function computeAttribData(positionVarName, positionBuffer, normalVarName, normalBuffer, drawMode) {
        var attributes = {};
        attributes[positionVarName] = { buffer: positionBuffer, numComponents: 3 };
        if (drawMode === DrawMode.TRIANGLES) {
            attributes[normalVarName] = { buffer: normalBuffer, numComponents: 3 };
        }
        return attributes;
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
            this._refCount = 0;
            options = options || {};
            options.drawMode = typeof options.drawMode !== 'undefined' ? options.drawMode : DrawMode.TRIANGLES;
            options.elementsUsage = typeof options.elementsUsage !== 'undefined' ? options.elementsUsage : DataUsage.STREAM_DRAW;
            // TODO: Sharing of buffers.
            this.indexBuffer = new ElementBuffer();
            this.indexBuffer.addRef();
            this.positionVarName = options.positionVarName || Symbolic.ATTRIBUTE_POSITION;
            this.positionBuffer = new ArrayBuffer();
            this.positionBuffer.addRef();
            this.normalVarName = options.normalVarName || Symbolic.ATTRIBUTE_NORMAL;
            this.normalBuffer = new ArrayBuffer();
            this.normalBuffer.addRef();
            this.geometry = geometry;
            this.geometry.dynamic = false;
            this.$drawMode = options.drawMode;
            this.elementsUsage = options.elementsUsage;
            this.attributeDataInfos = computeAttribData(this.positionVarName, this.positionBuffer, this.normalVarName, this.normalBuffer, this.drawMode);
        }
        GeometryAdapter.prototype.addRef = function () {
            this._refCount++;
            // console.log("GeometryAdapter.addRef() => " + this._refCount);
        };
        GeometryAdapter.prototype.release = function () {
            this._refCount--;
            // console.log("GeometryAdapter.release() => " + this._refCount);
            if (this._refCount === 0) {
                this.indexBuffer.release();
                this.indexBuffer = void 0;
                this.positionBuffer.release();
                this.positionBuffer = void 0;
                this.normalBuffer.release();
                this.normalBuffer = void 0;
            }
        };
        GeometryAdapter.prototype.contextGain = function (context) {
            _super.prototype.contextGain.call(this, context);
            this.indexBuffer.contextGain(context);
            this.positionBuffer.contextGain(context);
            this.normalBuffer.contextGain(context);
            this.update();
        };
        GeometryAdapter.prototype.contextLoss = function () {
            this.indexBuffer.contextLoss();
            this.positionBuffer.contextLoss();
            this.normalBuffer.contextLoss();
            _super.prototype.contextLoss.call(this);
        };
        GeometryAdapter.prototype.hasContext = function () {
            return !!this._context;
        };
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
        GeometryAdapter.prototype.draw = function () {
            if (this._context) {
                switch (this.drawMode) {
                    case DrawMode.POINTS:
                        {
                            this._context.drawArrays(this._context.POINTS, 0, this.points.length * 1);
                        }
                        break;
                    case DrawMode.LINES:
                        {
                            this._context.drawArrays(this._context.LINES, 0, this.lines.length * 2);
                        }
                        break;
                    case DrawMode.TRIANGLES:
                        {
                            //context.drawElements(context.TRIANGLES, this.elementArray.length, context.UNSIGNED_SHORT,0);
                            this._context.drawArrays(this._context.TRIANGLES, 0, this.geometry.faces.length * 3);
                        }
                        break;
                    default: {
                    }
                }
            }
            else {
                console.warn("GeometryAdapter.draw() missing WebGLRenderingContext");
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
        GeometryAdapter.prototype.getAttribData = function () {
            return this.attributeDataInfos;
        };
        GeometryAdapter.prototype.getAttribMeta = function () {
            var attributes = {};
            attributes[Symbolic.ATTRIBUTE_POSITION] = {
                name: this.positionVarName,
                glslType: 'vec3',
                size: 3,
                normalized: false,
                stride: 0,
                offset: 0
            };
            if (this.drawMode === DrawMode.TRIANGLES) {
                attributes[Symbolic.ATTRIBUTE_NORMAL] = {
                    name: this.normalVarName,
                    glslType: 'vec3',
                    size: 3,
                    normalized: false,
                    stride: 0,
                    offset: 0
                };
            }
            return attributes;
        };
        GeometryAdapter.prototype.update = function () {
            var vertices = [];
            var normals = [];
            var elements = [];
            var vertexList = this.geometry.vertices;
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
                        });
                    }
                    break;
                default: {
                }
            }
            this.elementArray = new Uint16Array(elements);
            this.indexBuffer.bindBuffer();
            this.indexBuffer.bufferData(this.elementArray);
            this.aVertexPositionArray = new Float32Array(vertices);
            this.positionBuffer.bindBuffer();
            this.positionBuffer.bufferData(this.aVertexPositionArray);
            this.aVertexNormalArray = new Float32Array(normals);
            this.normalBuffer.bindBuffer();
            this.normalBuffer.bufferData(this.aVertexNormalArray);
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
    return GeometryAdapter;
});
