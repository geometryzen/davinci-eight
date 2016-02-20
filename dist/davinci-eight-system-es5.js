System.register("davinci-eight/commands/BlendFactor.js", [], function(exports_1) {
  var BlendFactor;
  return {
    setters: [],
    execute: function() {
      (function(BlendFactor) {
        BlendFactor[BlendFactor["DST_ALPHA"] = 0] = "DST_ALPHA";
        BlendFactor[BlendFactor["DST_COLOR"] = 1] = "DST_COLOR";
        BlendFactor[BlendFactor["ONE"] = 2] = "ONE";
        BlendFactor[BlendFactor["ONE_MINUS_DST_ALPHA"] = 3] = "ONE_MINUS_DST_ALPHA";
        BlendFactor[BlendFactor["ONE_MINUS_DST_COLOR"] = 4] = "ONE_MINUS_DST_COLOR";
        BlendFactor[BlendFactor["ONE_MINUS_SRC_ALPHA"] = 5] = "ONE_MINUS_SRC_ALPHA";
        BlendFactor[BlendFactor["ONE_MINUS_SRC_COLOR"] = 6] = "ONE_MINUS_SRC_COLOR";
        BlendFactor[BlendFactor["SRC_ALPHA"] = 7] = "SRC_ALPHA";
        BlendFactor[BlendFactor["SRC_ALPHA_SATURATE"] = 8] = "SRC_ALPHA_SATURATE";
        BlendFactor[BlendFactor["SRC_COLOR"] = 9] = "SRC_COLOR";
        BlendFactor[BlendFactor["ZERO"] = 10] = "ZERO";
      })(BlendFactor || (BlendFactor = {}));
      exports_1("default", BlendFactor);
    }
  };
});

System.register("davinci-eight/commands/WebGLBlendFunc.js", ["../commands/BlendFactor", "../core/Shareable"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var BlendFactor_1,
      Shareable_1;
  var factors,
      WebGLBlendFunc;
  function mustBeFactor(name, factor) {
    if (factors.indexOf(factor) >= 0) {
      return factor;
    } else {
      throw new Error(factor + " is not a valid factor.");
    }
  }
  function factor(factor, gl) {
    switch (factor) {
      case BlendFactor_1.default.ONE:
        return gl.ONE;
      case BlendFactor_1.default.SRC_ALPHA:
        return gl.SRC_ALPHA;
      default:
        {
          throw new Error(factor + " is not a valid factor.");
        }
    }
  }
  return {
    setters: [function(BlendFactor_1_1) {
      BlendFactor_1 = BlendFactor_1_1;
    }, function(Shareable_1_1) {
      Shareable_1 = Shareable_1_1;
    }],
    execute: function() {
      factors = [BlendFactor_1.default.DST_ALPHA, BlendFactor_1.default.DST_COLOR, BlendFactor_1.default.ONE, BlendFactor_1.default.ONE_MINUS_DST_ALPHA, BlendFactor_1.default.ONE_MINUS_DST_COLOR, BlendFactor_1.default.ONE_MINUS_SRC_ALPHA, BlendFactor_1.default.ONE_MINUS_SRC_COLOR, BlendFactor_1.default.SRC_ALPHA, BlendFactor_1.default.SRC_ALPHA_SATURATE, BlendFactor_1.default.SRC_COLOR, BlendFactor_1.default.ZERO];
      WebGLBlendFunc = (function(_super) {
        __extends(WebGLBlendFunc, _super);
        function WebGLBlendFunc(sfactor, dfactor) {
          _super.call(this, 'WebGLBlendFunc');
          this.sfactor = mustBeFactor('sfactor', sfactor);
          this.dfactor = mustBeFactor('dfactor', dfactor);
        }
        WebGLBlendFunc.prototype.contextFree = function(manager) {};
        WebGLBlendFunc.prototype.contextGain = function(manager) {
          this.execute(manager.gl);
        };
        WebGLBlendFunc.prototype.contextLost = function() {};
        WebGLBlendFunc.prototype.execute = function(gl) {
          gl.blendFunc(factor(this.sfactor, gl), factor(this.dfactor, gl));
        };
        WebGLBlendFunc.prototype.destructor = function() {
          this.sfactor = void 0;
          this.dfactor = void 0;
          _super.prototype.destructor.call(this);
        };
        return WebGLBlendFunc;
      })(Shareable_1.default);
      exports_1("default", WebGLBlendFunc);
    }
  };
});

System.register("davinci-eight/core/Scene.js", ["../collections/ShareableArray", "../checks/mustBeObject", "../core/Shareable", "../core/ShareableContextListener"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var ShareableArray_1,
      mustBeObject_1,
      Shareable_1,
      ShareableContextListener_1;
  var ScenePart,
      Scene;
  function partsFromMesh(mesh) {
    mustBeObject_1.default('mesh', mesh);
    var parts = new ShareableArray_1.default();
    var geometry = mesh.geometry;
    if (geometry.isLeaf()) {
      var scenePart = new ScenePart(geometry, mesh);
      parts.pushWeakRef(scenePart);
    } else {
      var iLen = geometry.partsLength;
      for (var i = 0; i < iLen; i++) {
        var geometryPart = geometry.getPart(i);
        var scenePart = new ScenePart(geometryPart, mesh);
        geometryPart.release();
        parts.pushWeakRef(scenePart);
      }
    }
    geometry.release();
    return parts;
  }
  return {
    setters: [function(ShareableArray_1_1) {
      ShareableArray_1 = ShareableArray_1_1;
    }, function(mustBeObject_1_1) {
      mustBeObject_1 = mustBeObject_1_1;
    }, function(Shareable_1_1) {
      Shareable_1 = Shareable_1_1;
    }, function(ShareableContextListener_1_1) {
      ShareableContextListener_1 = ShareableContextListener_1_1;
    }],
    execute: function() {
      ScenePart = (function(_super) {
        __extends(ScenePart, _super);
        function ScenePart(geometry, mesh) {
          _super.call(this, 'ScenePart');
          this._geometry = geometry;
          this._geometry.addRef();
          this._mesh = mesh;
          this._mesh.addRef();
        }
        ScenePart.prototype.destructor = function() {
          this._geometry.release();
          this._mesh.release();
          this._geometry = void 0;
          this._mesh = void 0;
          _super.prototype.destructor.call(this);
        };
        ScenePart.prototype.draw = function(ambients) {
          if (this._mesh.visible) {
            var material = this._mesh.material;
            material.use();
            if (ambients) {
              var aLength = ambients.length;
              for (var a = 0; a < aLength; a++) {
                var ambient = ambients[a];
                ambient.setUniforms(material);
              }
            }
            this._mesh.setUniforms();
            this._geometry.draw(material);
            material.release();
          }
        };
        return ScenePart;
      })(Shareable_1.default);
      Scene = (function(_super) {
        __extends(Scene, _super);
        function Scene() {
          _super.call(this, 'Scene');
          this._meshes = new ShareableArray_1.default();
          this._parts = new ShareableArray_1.default();
        }
        Scene.prototype.destructor = function() {
          this.unsubscribe();
          this._meshes.release();
          this._parts.release();
          _super.prototype.destructor.call(this);
        };
        Scene.prototype.add = function(mesh) {
          mustBeObject_1.default('mesh', mesh);
          this._meshes.push(mesh);
          var drawParts = partsFromMesh(mesh);
          var iLen = drawParts.length;
          for (var i = 0; i < iLen; i++) {
            var part = drawParts.get(i);
            this._parts.push(part);
            part.release();
          }
          drawParts.release();
        };
        Scene.prototype.contains = function(mesh) {
          mustBeObject_1.default('mesh', mesh);
          return this._meshes.indexOf(mesh) >= 0;
        };
        Scene.prototype.draw = function(ambients) {
          var parts = this._parts;
          var iLen = parts.length;
          for (var i = 0; i < iLen; i++) {
            parts.getWeakRef(i).draw(ambients);
          }
        };
        Scene.prototype.find = function(match) {
          return this._meshes.find(match);
        };
        Scene.prototype.findOne = function(match) {
          return this._meshes.findOne(match);
        };
        Scene.prototype.findOneByName = function(name) {
          return this.findOne(function(mesh) {
            return mesh.name === name;
          });
        };
        Scene.prototype.findByName = function(name) {
          return this.find(function(mesh) {
            return mesh.name === name;
          });
        };
        Scene.prototype.remove = function(mesh) {
          mustBeObject_1.default('mesh', mesh);
          var index = this._meshes.indexOf(mesh);
          if (index >= 0) {
            this._meshes.splice(index, 1).release();
          }
        };
        Scene.prototype.contextFree = function(context) {
          for (var i = 0; i < this._meshes.length; i++) {
            var mesh = this._meshes.getWeakRef(i);
            mesh.contextFree(context);
          }
          _super.prototype.contextFree.call(this, context);
        };
        Scene.prototype.contextGain = function(context) {
          for (var i = 0; i < this._meshes.length; i++) {
            var mesh = this._meshes.getWeakRef(i);
            mesh.contextGain(context);
          }
          _super.prototype.contextGain.call(this, context);
        };
        Scene.prototype.contextLost = function() {
          for (var i = 0; i < this._meshes.length; i++) {
            var mesh = this._meshes.getWeakRef(i);
            mesh.contextLost();
          }
          _super.prototype.contextLost.call(this);
        };
        return Scene;
      })(ShareableContextListener_1.default);
      exports_1("default", Scene);
    }
  };
});

System.register("davinci-eight/curves/Curve.js", [], function(exports_1) {
  var Curve;
  return {
    setters: [],
    execute: function() {
      Curve = (function() {
        function Curve() {}
        Curve.prototype.getPoint = function(t) {
          throw new Error("Curve.getPoint() not implemented!");
        };
        Curve.prototype.getPointAt = function(u) {
          var t = this.getUtoTmapping(u);
          return this.getPoint(t);
        };
        Curve.prototype.getPoints = function(divisions) {
          if (!divisions) {
            divisions = 5;
          }
          var d;
          var pts = [];
          for (d = 0; d <= divisions; d++) {
            pts.push(this.getPoint(d / divisions));
          }
          return pts;
        };
        Curve.prototype.getSpacedPoints = function(divisions) {
          if (!divisions) {
            divisions = 5;
          }
          var d;
          var pts = [];
          for (d = 0; d <= divisions; d++) {
            pts.push(this.getPointAt(d / divisions));
          }
          return pts;
        };
        Curve.prototype.getLength = function() {
          var lengths = this.getLengths();
          return lengths[lengths.length - 1];
        };
        Curve.prototype.getLengths = function(divisions) {
          if (!divisions)
            divisions = (this.__arcLengthDivisions) ? (this.__arcLengthDivisions) : 200;
          if (this.cacheArcLengths && (this.cacheArcLengths.length == divisions + 1) && !this.needsUpdate) {
            return this.cacheArcLengths;
          }
          this.needsUpdate = false;
          var cache = [];
          var current;
          var last = this.getPoint(0);
          var p;
          var sum = 0;
          cache.push(0);
          for (p = 1; p <= divisions; p++) {
            current = this.getPoint(p / divisions);
            sum += current.distanceTo(last);
            cache.push(sum);
            last = current;
          }
          this.cacheArcLengths = cache;
          return cache;
        };
        Curve.prototype.updateArcLengths = function() {
          this.needsUpdate = true;
          this.getLengths();
        };
        Curve.prototype.getUtoTmapping = function(u, distance) {
          var arcLengths = this.getLengths();
          var i = 0,
              il = arcLengths.length;
          var targetArcLength;
          if (distance) {
            targetArcLength = distance;
          } else {
            targetArcLength = u * arcLengths[il - 1];
          }
          var low = 0;
          var high = il - 1;
          var comparison;
          while (low <= high) {
            i = Math.floor(low + (high - low) / 2);
            comparison = arcLengths[i] - targetArcLength;
            if (comparison < 0) {
              low = i + 1;
            } else if (comparison > 0) {
              high = i - 1;
            } else {
              high = i;
              break;
            }
          }
          i = high;
          if (arcLengths[i] == targetArcLength) {
            var t = i / (il - 1);
            return t;
          }
          var lengthBefore = arcLengths[i];
          var lengthAfter = arcLengths[i + 1];
          var segmentLength = lengthAfter - lengthBefore;
          var segmentFraction = (targetArcLength - lengthBefore) / segmentLength;
          var t = (i + segmentFraction) / (il - 1);
          return t;
        };
        Curve.prototype.getTangent = function(t) {
          var delta = 0.0001;
          var t1 = t - delta;
          var t2 = t + delta;
          if (t1 < 0)
            t1 = 0;
          if (t2 > 1)
            t2 = 1;
          var pt1 = this.getPoint(t1);
          var pt2 = this.getPoint(t2);
          var tangent = pt2.sub(pt1);
          return tangent.direction();
        };
        Curve.prototype.getTangentAt = function(u) {
          var t = this.getUtoTmapping(u);
          return this.getTangent(t);
        };
        return Curve;
      })();
      exports_1("default", Curve);
    }
  };
});

System.register("davinci-eight/facets/PointSizeFacet.js", ["../checks/mustBeArray", "../checks/mustBeInteger", "../checks/mustBeString", "../core/GraphicsProgramSymbols"], function(exports_1) {
  var mustBeArray_1,
      mustBeInteger_1,
      mustBeString_1,
      GraphicsProgramSymbols_1;
  var LOGGING_NAME,
      PointSizeFacet;
  function contextBuilder() {
    return LOGGING_NAME;
  }
  return {
    setters: [function(mustBeArray_1_1) {
      mustBeArray_1 = mustBeArray_1_1;
    }, function(mustBeInteger_1_1) {
      mustBeInteger_1 = mustBeInteger_1_1;
    }, function(mustBeString_1_1) {
      mustBeString_1 = mustBeString_1_1;
    }, function(GraphicsProgramSymbols_1_1) {
      GraphicsProgramSymbols_1 = GraphicsProgramSymbols_1_1;
    }],
    execute: function() {
      LOGGING_NAME = 'PointSizeFacet';
      PointSizeFacet = (function() {
        function PointSizeFacet(pointSize) {
          if (pointSize === void 0) {
            pointSize = 2;
          }
          this.pointSize = mustBeInteger_1.default('pointSize', pointSize);
        }
        PointSizeFacet.prototype.getProperty = function(name) {
          return void 0;
        };
        PointSizeFacet.prototype.setProperty = function(name, value) {
          mustBeString_1.default('name', name, contextBuilder);
          mustBeArray_1.default('value', value, contextBuilder);
          return this;
        };
        PointSizeFacet.prototype.setUniforms = function(visitor) {
          visitor.uniform1f(GraphicsProgramSymbols_1.default.UNIFORM_POINT_SIZE, this.pointSize);
        };
        return PointSizeFacet;
      })();
      exports_1("default", PointSizeFacet);
    }
  };
});

System.register("davinci-eight/facets/ReflectionFacetE2.js", ["../checks/mustBeArray", "../checks/mustBeString", "../math/Vector2", "../math/Matrix2", "../i18n/readOnly"], function(exports_1) {
  var mustBeArray_1,
      mustBeString_1,
      Vector2_1,
      Matrix2_1,
      readOnly_1;
  var ReflectionFacetE2;
  return {
    setters: [function(mustBeArray_1_1) {
      mustBeArray_1 = mustBeArray_1_1;
    }, function(mustBeString_1_1) {
      mustBeString_1 = mustBeString_1_1;
    }, function(Vector2_1_1) {
      Vector2_1 = Vector2_1_1;
    }, function(Matrix2_1_1) {
      Matrix2_1 = Matrix2_1_1;
    }, function(readOnly_1_1) {
      readOnly_1 = readOnly_1_1;
    }],
    execute: function() {
      ReflectionFacetE2 = (function() {
        function ReflectionFacetE2(name) {
          this.matrix = Matrix2_1.default.one();
          this.name = mustBeString_1.default('name', name);
          this._normal = new Vector2_1.default().zero();
          this._normal.modified = true;
        }
        Object.defineProperty(ReflectionFacetE2.prototype, "normal", {
          get: function() {
            return this._normal;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('normal').message);
          },
          enumerable: true,
          configurable: true
        });
        ReflectionFacetE2.prototype.getProperty = function(name) {
          mustBeString_1.default('name', name);
          return void 0;
        };
        ReflectionFacetE2.prototype.setProperty = function(name, value) {
          mustBeString_1.default('name', name);
          mustBeArray_1.default('value', value);
          return this;
        };
        ReflectionFacetE2.prototype.setUniforms = function(visitor) {
          if (this._normal.modified) {
            this.matrix.reflection(this._normal);
            this._normal.modified = false;
          }
          visitor.mat2(this.name, this.matrix, false);
        };
        return ReflectionFacetE2;
      })();
      exports_1("default", ReflectionFacetE2);
    }
  };
});

System.register("davinci-eight/facets/ReflectionFacetE3.js", ["../checks/mustBeArray", "../checks/mustBeString", "../math/G3m", "../math/Matrix4", "../i18n/readOnly"], function(exports_1) {
  var mustBeArray_1,
      mustBeString_1,
      G3m_1,
      Matrix4_1,
      readOnly_1;
  var ReflectionFacetE3;
  return {
    setters: [function(mustBeArray_1_1) {
      mustBeArray_1 = mustBeArray_1_1;
    }, function(mustBeString_1_1) {
      mustBeString_1 = mustBeString_1_1;
    }, function(G3m_1_1) {
      G3m_1 = G3m_1_1;
    }, function(Matrix4_1_1) {
      Matrix4_1 = Matrix4_1_1;
    }, function(readOnly_1_1) {
      readOnly_1 = readOnly_1_1;
    }],
    execute: function() {
      ReflectionFacetE3 = (function() {
        function ReflectionFacetE3(name) {
          this.matrix = Matrix4_1.default.one();
          this.name = mustBeString_1.default('name', name);
          this._normal = G3m_1.default.zero();
          this._normal.modified = true;
        }
        Object.defineProperty(ReflectionFacetE3.prototype, "normal", {
          get: function() {
            return this._normal;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('normal').message);
          },
          enumerable: true,
          configurable: true
        });
        ReflectionFacetE3.prototype.getProperty = function(name) {
          mustBeString_1.default('name', name);
          return void 0;
        };
        ReflectionFacetE3.prototype.setProperty = function(name, value) {
          mustBeString_1.default('name', name);
          mustBeArray_1.default('value', value);
          return this;
        };
        ReflectionFacetE3.prototype.setUniforms = function(visitor) {
          if (this._normal.modified) {
            this.matrix.reflection(this._normal);
            this._normal.modified = false;
          }
          visitor.mat4(this.name, this.matrix, false);
        };
        return ReflectionFacetE3;
      })();
      exports_1("default", ReflectionFacetE3);
    }
  };
});

System.register("davinci-eight/facets/Vector3Facet.js", ["../checks/mustBeObject", "../checks/mustBeString"], function(exports_1) {
  var mustBeObject_1,
      mustBeString_1;
  var LOGGING_NAME,
      Vector3Facet;
  function contextBuilder() {
    return LOGGING_NAME;
  }
  return {
    setters: [function(mustBeObject_1_1) {
      mustBeObject_1 = mustBeObject_1_1;
    }, function(mustBeString_1_1) {
      mustBeString_1 = mustBeString_1_1;
    }],
    execute: function() {
      LOGGING_NAME = 'Vector3Facet';
      Vector3Facet = (function() {
        function Vector3Facet(name, vector) {
          this._name = mustBeString_1.default('name', name, contextBuilder);
          this._vector = mustBeObject_1.default('vector', vector, contextBuilder);
        }
        Vector3Facet.prototype.getProperty = function(name) {
          return void 0;
        };
        Vector3Facet.prototype.setProperty = function(name, value) {
          return this;
        };
        Vector3Facet.prototype.setUniforms = function(visitor) {
          visitor.vec3(this._name, this._vector);
        };
        return Vector3Facet;
      })();
      exports_1("default", Vector3Facet);
    }
  };
});

System.register("davinci-eight/facets/ModelE2.js", ["../math/G2m", "../math/Vector2", "../math/Spinor2", "../i18n/readOnly"], function(exports_1) {
  var G2m_1,
      Vector2_1,
      Spinor2_1,
      readOnly_1;
  var ModelE2;
  return {
    setters: [function(G2m_1_1) {
      G2m_1 = G2m_1_1;
    }, function(Vector2_1_1) {
      Vector2_1 = Vector2_1_1;
    }, function(Spinor2_1_1) {
      Spinor2_1 = Spinor2_1_1;
    }, function(readOnly_1_1) {
      readOnly_1 = readOnly_1_1;
    }],
    execute: function() {
      ModelE2 = (function() {
        function ModelE2() {
          this._position = new G2m_1.default().zero();
          this._attitude = new G2m_1.default().zero().addScalar(1);
          this._posCache = new Vector2_1.default();
          this._attCache = new Spinor2_1.default();
          this._position.modified = true;
          this._attitude.modified = true;
        }
        Object.defineProperty(ModelE2.prototype, "R", {
          get: function() {
            return this._attitude;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default(ModelE2.PROP_ATTITUDE).message);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(ModelE2.prototype, "X", {
          get: function() {
            return this._position;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default(ModelE2.PROP_POSITION).message);
          },
          enumerable: true,
          configurable: true
        });
        ModelE2.prototype.getProperty = function(name) {
          switch (name) {
            case ModelE2.PROP_ATTITUDE:
              {
                return this._attCache.copy(this._attitude).coords;
              }
              break;
            case ModelE2.PROP_POSITION:
              {
                return this._posCache.copy(this._position).coords;
              }
              break;
            default:
              {
                console.warn("ModelE2.getProperty " + name);
                return void 0;
              }
          }
        };
        ModelE2.prototype.setProperty = function(name, data) {
          switch (name) {
            case ModelE2.PROP_ATTITUDE:
              {
                this._attCache.coords = data;
                this._attitude.copySpinor(this._attCache);
              }
              break;
            case ModelE2.PROP_POSITION:
              {
                this._posCache.coords = data;
                this._position.copyVector(this._posCache);
              }
              break;
            default:
              {
                console.warn("ModelE2.setProperty " + name);
              }
          }
          return this;
        };
        ModelE2.PROP_ATTITUDE = 'R';
        ModelE2.PROP_POSITION = 'X';
        return ModelE2;
      })();
      exports_1("default", ModelE2);
    }
  };
});

System.register("davinci-eight/materials/HTMLScriptsMaterial.js", ["../checks/mustBeObject", "../checks/mustBeString", "../core/Material"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var mustBeObject_1,
      mustBeString_1,
      Material_1;
  var HTMLScriptsMaterial;
  function $(id, dom) {
    var element = dom.getElementById(mustBeString_1.default('id', id));
    if (element) {
      return element;
    } else {
      throw new Error(id + " is not a valid DOM element identifier.");
    }
  }
  function vertexShader(scriptIds, dom) {
    var vsId = scriptIds[0];
    mustBeString_1.default('vsId', vsId);
    mustBeObject_1.default('dom', dom);
    return $(vsId, dom).textContent;
  }
  function fragmentShader(scriptIds, dom) {
    var fsId = scriptIds[1];
    mustBeString_1.default('fsId', fsId);
    mustBeObject_1.default('dom', dom);
    return $(fsId, dom).textContent;
  }
  return {
    setters: [function(mustBeObject_1_1) {
      mustBeObject_1 = mustBeObject_1_1;
    }, function(mustBeString_1_1) {
      mustBeString_1 = mustBeString_1_1;
    }, function(Material_1_1) {
      Material_1 = Material_1_1;
    }],
    execute: function() {
      HTMLScriptsMaterial = (function(_super) {
        __extends(HTMLScriptsMaterial, _super);
        function HTMLScriptsMaterial(scriptIds, dom) {
          if (scriptIds === void 0) {
            scriptIds = [];
          }
          if (dom === void 0) {
            dom = document;
          }
          _super.call(this, vertexShader(scriptIds, dom), fragmentShader(scriptIds, dom));
        }
        return HTMLScriptsMaterial;
      })(Material_1.default);
      exports_1("default", HTMLScriptsMaterial);
    }
  };
});

System.register("davinci-eight/materials/MeshNormalMaterial.js", ["../materials/GraphicsProgramBuilder", "../core/GraphicsProgramSymbols", "../core/Material"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var GraphicsProgramBuilder_1,
      GraphicsProgramSymbols_1,
      Material_1;
  var MeshNormalMaterial;
  function builder() {
    var gpb = new GraphicsProgramBuilder_1.default();
    gpb.attribute(GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION, 3);
    gpb.attribute(GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL, 3);
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_COLOR, 'vec3');
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_MODEL_MATRIX, 'mat4');
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_NORMAL_MATRIX, 'mat3');
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_PROJECTION_MATRIX, 'mat4');
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_VIEW_MATRIX, 'mat4');
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_AMBIENT_LIGHT, 'vec3');
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_COLOR, 'vec3');
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION, 'vec3');
    return gpb;
  }
  function vertexShader() {
    return builder().vertexShader();
  }
  function fragmentShader() {
    return builder().fragmentShader();
  }
  return {
    setters: [function(GraphicsProgramBuilder_1_1) {
      GraphicsProgramBuilder_1 = GraphicsProgramBuilder_1_1;
    }, function(GraphicsProgramSymbols_1_1) {
      GraphicsProgramSymbols_1 = GraphicsProgramSymbols_1_1;
    }, function(Material_1_1) {
      Material_1 = Material_1_1;
    }],
    execute: function() {
      MeshNormalMaterial = (function(_super) {
        __extends(MeshNormalMaterial, _super);
        function MeshNormalMaterial() {
          _super.call(this, vertexShader(), fragmentShader());
        }
        return MeshNormalMaterial;
      })(Material_1.default);
      exports_1("default", MeshNormalMaterial);
    }
  };
});

System.register("davinci-eight/materials/PointMaterial.js", ["../materials/GraphicsProgramBuilder", "../core/GraphicsProgramSymbols", "../core/Material"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var GraphicsProgramBuilder_1,
      GraphicsProgramSymbols_1,
      Material_1;
  var PointMaterial;
  function builder() {
    var gpb = new GraphicsProgramBuilder_1.default();
    gpb.attribute(GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION, 3);
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_COLOR, 'vec3');
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_MODEL_MATRIX, 'mat4');
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_PROJECTION_MATRIX, 'mat4');
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_VIEW_MATRIX, 'mat4');
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_POINT_SIZE, 'float');
    return gpb;
  }
  function vertexShader() {
    return builder().vertexShader();
  }
  function fragmentShader() {
    return builder().fragmentShader();
  }
  return {
    setters: [function(GraphicsProgramBuilder_1_1) {
      GraphicsProgramBuilder_1 = GraphicsProgramBuilder_1_1;
    }, function(GraphicsProgramSymbols_1_1) {
      GraphicsProgramSymbols_1 = GraphicsProgramSymbols_1_1;
    }, function(Material_1_1) {
      Material_1 = Material_1_1;
    }],
    execute: function() {
      PointMaterial = (function(_super) {
        __extends(PointMaterial, _super);
        function PointMaterial() {
          _super.call(this, vertexShader(), fragmentShader());
        }
        return PointMaterial;
      })(Material_1.default);
      exports_1("default", PointMaterial);
    }
  };
});

System.register("davinci-eight/utils/mergeStringMapList.js", [], function(exports_1) {
  function mergeStringMapList(ms) {
    var result = {};
    ms.forEach(function(m) {
      var keys = Object.keys(m);
      var keysLength = keys.length;
      for (var i = 0; i < keysLength; i++) {
        var key = keys[i];
        var value = m[key];
        result[key] = value;
      }
    });
    return result;
  }
  exports_1("default", mergeStringMapList);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/materials/smartProgram.js", ["./fragmentShader", "../utils/mergeStringMapList", "../checks/mustBeDefined", "../core/Material", "./vColorRequired", "./vertexShader", "./vLightRequired"], function(exports_1) {
  var fragmentShader_1,
      mergeStringMapList_1,
      mustBeDefined_1,
      Material_1,
      vColorRequired_1,
      vertexShader_1,
      vLightRequired_1;
  function smartProgram(attributes, uniformsList, bindings) {
    mustBeDefined_1.default('attributes', attributes);
    mustBeDefined_1.default('uniformsList', uniformsList);
    var uniforms = mergeStringMapList_1.default(uniformsList);
    var vColor = vColorRequired_1.default(attributes, uniforms);
    var vLight = vLightRequired_1.default(attributes, uniforms);
    return new Material_1.default(vertexShader_1.default(attributes, uniforms, vColor, vLight), fragmentShader_1.default(attributes, uniforms, vColor, vLight), bindings);
  }
  exports_1("default", smartProgram);
  return {
    setters: [function(fragmentShader_1_1) {
      fragmentShader_1 = fragmentShader_1_1;
    }, function(mergeStringMapList_1_1) {
      mergeStringMapList_1 = mergeStringMapList_1_1;
    }, function(mustBeDefined_1_1) {
      mustBeDefined_1 = mustBeDefined_1_1;
    }, function(Material_1_1) {
      Material_1 = Material_1_1;
    }, function(vColorRequired_1_1) {
      vColorRequired_1 = vColorRequired_1_1;
    }, function(vertexShader_1_1) {
      vertexShader_1 = vertexShader_1_1;
    }, function(vLightRequired_1_1) {
      vLightRequired_1 = vLightRequired_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/materials/programFromScripts.js", ["../checks/mustBeObject", "../checks/mustBeString", "../core/Material"], function(exports_1) {
  var mustBeObject_1,
      mustBeString_1,
      Material_1;
  function programFromScripts(vsId, fsId, dom, attribs) {
    if (attribs === void 0) {
      attribs = [];
    }
    mustBeString_1.default('vsId', vsId);
    mustBeString_1.default('fsId', fsId);
    mustBeObject_1.default('dom', dom);
    function $(id) {
      var element = dom.getElementById(mustBeString_1.default('id', id));
      if (element) {
        return element;
      } else {
        throw new Error(id + " is not a valid DOM element identifier.");
      }
    }
    var vertexShader = $(vsId).textContent;
    var fragmentShader = $(fsId).textContent;
    return new Material_1.default(vertexShader, fragmentShader, attribs);
  }
  exports_1("default", programFromScripts);
  return {
    setters: [function(mustBeObject_1_1) {
      mustBeObject_1 = mustBeObject_1_1;
    }, function(mustBeString_1_1) {
      mustBeString_1 = mustBeString_1_1;
    }, function(Material_1_1) {
      Material_1 = Material_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/math/mathcore.js", [], function(exports_1) {
  var abs,
      acos,
      asin,
      atan,
      cos,
      exp,
      log,
      sin,
      sqrt,
      tan,
      mathcore;
  function isCallableMethod(x, name) {
    return (x !== null) && (typeof x === 'object') && (typeof x[name] === 'function');
  }
  function makeUnaryUniversalFunction(methodName, primitiveFunction) {
    return function(x) {
      var something = x;
      if (isCallableMethod(x, methodName)) {
        return something[methodName]();
      } else if (typeof x === 'number') {
        var n = something;
        var thing = primitiveFunction(n);
        return thing;
      } else {
        throw new TypeError("x must support " + methodName + "(x)");
      }
    };
  }
  function cosh(x) {
    return (exp(x) + exp(-x)) / 2;
  }
  function sinh(x) {
    return (exp(x) - exp(-x)) / 2;
  }
  function tanh(x) {
    return sinh(x) / cosh(x);
  }
  function quad(x) {
    return x * x;
  }
  return {
    setters: [],
    execute: function() {
      abs = Math.abs;
      acos = Math.acos;
      asin = Math.asin;
      atan = Math.atan;
      cos = Math.cos;
      exp = Math.exp;
      log = Math.log;
      sin = Math.sin;
      sqrt = Math.sqrt;
      tan = Math.tan;
      mathcore = {
        acos: makeUnaryUniversalFunction('acos', acos),
        asin: makeUnaryUniversalFunction('asin', asin),
        atan: makeUnaryUniversalFunction('atan', atan),
        cos: makeUnaryUniversalFunction('cos', cos),
        cosh: makeUnaryUniversalFunction('cosh', cosh),
        exp: makeUnaryUniversalFunction('exp', exp),
        log: makeUnaryUniversalFunction('log', log),
        norm: makeUnaryUniversalFunction('norm', abs),
        quad: makeUnaryUniversalFunction('quad', quad),
        sin: makeUnaryUniversalFunction('sin', sin),
        sinh: makeUnaryUniversalFunction('sinh', sinh),
        sqrt: makeUnaryUniversalFunction('sqrt', sqrt),
        tan: makeUnaryUniversalFunction('tan', tan),
        tanh: makeUnaryUniversalFunction('tanh', tanh),
        Math: {
          cosh: cosh,
          sinh: sinh
        }
      };
      exports_1("default", mathcore);
    }
  };
});

System.register("davinci-eight/math/add2x2.js", [], function(exports_1) {
  function default_1(a, b, c) {
    var a11 = a[0x0],
        a12 = a[0x2];
    var a21 = a[0x1],
        a22 = a[0x3];
    var b11 = b[0x0],
        b12 = b[0x2];
    var b21 = b[0x1],
        b22 = b[0x3];
    c[0x0] = a11 + b11;
    c[0x2] = a12 + b12;
    c[0x1] = a21 + b21;
    c[0x3] = a22 + b22;
    return c;
  }
  exports_1("default", default_1);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/math/det2x2.js", [], function(exports_1) {
  function default_1(m) {
    var n11 = m[0x0];
    var n12 = m[0x2];
    var n21 = m[0x1];
    var n22 = m[0x3];
    return n11 * n22 - n12 * n21;
  }
  exports_1("default", default_1);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/math/Matrix2.js", ["../math/AbstractMatrix", "../math/add2x2", "../math/det2x2", "../checks/isDefined", "../checks/mustBeInteger", "../checks/mustBeNumber"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var AbstractMatrix_1,
      add2x2_1,
      det2x2_1,
      isDefined_1,
      mustBeInteger_1,
      mustBeNumber_1;
  var Matrix2;
  return {
    setters: [function(AbstractMatrix_1_1) {
      AbstractMatrix_1 = AbstractMatrix_1_1;
    }, function(add2x2_1_1) {
      add2x2_1 = add2x2_1_1;
    }, function(det2x2_1_1) {
      det2x2_1 = det2x2_1_1;
    }, function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }, function(mustBeInteger_1_1) {
      mustBeInteger_1 = mustBeInteger_1_1;
    }, function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }],
    execute: function() {
      Matrix2 = (function(_super) {
        __extends(Matrix2, _super);
        function Matrix2(elements) {
          _super.call(this, elements, 2);
        }
        Matrix2.prototype.add = function(rhs) {
          return this.add2(this, rhs);
        };
        Matrix2.prototype.add2 = function(a, b) {
          add2x2_1.default(a.elements, b.elements, this.elements);
          return this;
        };
        Matrix2.prototype.clone = function() {
          var te = this.elements;
          var m11 = te[0];
          var m21 = te[1];
          var m12 = te[2];
          var m22 = te[3];
          return Matrix2.zero().set(m11, m12, m21, m22);
        };
        Matrix2.prototype.det = function() {
          return det2x2_1.default(this.elements);
        };
        Matrix2.prototype.inv = function() {
          var te = this.elements;
          var a = te[0];
          var c = te[1];
          var b = te[2];
          var d = te[3];
          var det = this.det();
          return this.set(d, -b, -c, a).scale(1 / det);
        };
        Matrix2.prototype.isOne = function() {
          var te = this.elements;
          var a = te[0];
          var c = te[1];
          var b = te[2];
          var d = te[3];
          return (a === 1 && b === 0 && c === 0 && d === 1);
        };
        Matrix2.prototype.isZero = function() {
          var te = this.elements;
          var a = te[0];
          var c = te[1];
          var b = te[2];
          var d = te[3];
          return (a === 0 && b === 0 && c === 0 && d === 0);
        };
        Matrix2.prototype.mul = function(rhs) {
          return this.mul2(this, rhs);
        };
        Matrix2.prototype.mul2 = function(a, b) {
          var ae = a.elements;
          var a11 = ae[0];
          var a21 = ae[1];
          var a12 = ae[2];
          var a22 = ae[3];
          var be = b.elements;
          var b11 = be[0];
          var b21 = be[1];
          var b12 = be[2];
          var b22 = be[3];
          var m11 = a11 * b11 + a12 * b21;
          var m12 = a11 * b12 + a12 * b22;
          var m21 = a21 * b11 + a22 * b21;
          var m22 = a21 * b12 + a22 * b22;
          return this.set(m11, m12, m21, m22);
        };
        Matrix2.prototype.neg = function() {
          return this.scale(-1);
        };
        Matrix2.prototype.one = function() {
          return this.set(1, 0, 0, 1);
        };
        Matrix2.prototype.reflection = function(n) {
          var nx = mustBeNumber_1.default('n.x', n.x);
          var xx = 1 - 2 * nx * nx;
          return this.set(xx, 0, 0, 1);
        };
        Matrix2.prototype.row = function(i) {
          var te = this.elements;
          return [te[0 + i], te[2 + i]];
        };
        Matrix2.prototype.scale = function(α) {
          var te = this.elements;
          var m11 = te[0] * α;
          var m21 = te[1] * α;
          var m12 = te[2] * α;
          var m22 = te[3] * α;
          return this.set(m11, m12, m21, m22);
        };
        Matrix2.prototype.set = function(m11, m12, m21, m22) {
          var te = this.elements;
          te[0x0] = m11;
          te[0x2] = m12;
          te[0x1] = m21;
          te[0x3] = m22;
          return this;
        };
        Matrix2.prototype.sub = function(rhs) {
          var te = this.elements;
          var t11 = te[0];
          var t21 = te[1];
          var t12 = te[2];
          var t22 = te[3];
          var re = rhs.elements;
          var r11 = re[0];
          var r21 = re[1];
          var r12 = re[2];
          var r22 = re[3];
          var m11 = t11 - r11;
          var m21 = t21 - r21;
          var m12 = t12 - r12;
          var m22 = t22 - r22;
          return this.set(m11, m12, m21, m22);
        };
        Matrix2.prototype.toExponential = function() {
          var text = [];
          for (var i = 0; i < this.dimensions; i++) {
            text.push(this.row(i).map(function(element, index) {
              return element.toExponential();
            }).join(' '));
          }
          return text.join('\n');
        };
        Matrix2.prototype.toFixed = function(digits) {
          if (isDefined_1.default(digits)) {
            mustBeInteger_1.default('digits', digits);
          }
          var text = [];
          for (var i = 0; i < this.dimensions; i++) {
            text.push(this.row(i).map(function(element, index) {
              return element.toFixed(digits);
            }).join(' '));
          }
          return text.join('\n');
        };
        Matrix2.prototype.toString = function() {
          var text = [];
          for (var i = 0,
              iLength = this.dimensions; i < iLength; i++) {
            text.push(this.row(i).map(function(element, index) {
              return element.toString();
            }).join(' '));
          }
          return text.join('\n');
        };
        Matrix2.prototype.translation = function(d) {
          var x = d.x;
          return this.set(1, x, 0, 1);
        };
        Matrix2.prototype.zero = function() {
          return this.set(0, 0, 0, 0);
        };
        Matrix2.prototype.__add__ = function(rhs) {
          if (rhs instanceof Matrix2) {
            return this.clone().add(rhs);
          } else {
            return void 0;
          }
        };
        Matrix2.prototype.__radd__ = function(lhs) {
          if (lhs instanceof Matrix2) {
            return lhs.clone().add(this);
          } else {
            return void 0;
          }
        };
        Matrix2.prototype.__mul__ = function(rhs) {
          if (rhs instanceof Matrix2) {
            return this.clone().mul(rhs);
          } else if (typeof rhs === 'number') {
            return this.clone().scale(rhs);
          } else {
            return void 0;
          }
        };
        Matrix2.prototype.__rmul__ = function(lhs) {
          if (lhs instanceof Matrix2) {
            return lhs.clone().mul(this);
          } else if (typeof lhs === 'number') {
            return this.clone().scale(lhs);
          } else {
            return void 0;
          }
        };
        Matrix2.prototype.__pos__ = function() {
          return this.clone();
        };
        Matrix2.prototype.__neg__ = function() {
          return this.clone().scale(-1);
        };
        Matrix2.prototype.__sub__ = function(rhs) {
          if (rhs instanceof Matrix2) {
            return this.clone().sub(rhs);
          } else {
            return void 0;
          }
        };
        Matrix2.prototype.__rsub__ = function(lhs) {
          if (lhs instanceof Matrix2) {
            return lhs.clone().sub(this);
          } else {
            return void 0;
          }
        };
        Matrix2.one = function() {
          return new Matrix2(new Float32Array([1, 0, 0, 1]));
        };
        Matrix2.reflection = function(n) {
          return Matrix2.zero().reflection(n);
        };
        Matrix2.zero = function() {
          return new Matrix2(new Float32Array([0, 0, 0, 0]));
        };
        return Matrix2;
      })(AbstractMatrix_1.default);
      exports_1("default", Matrix2);
    }
  };
});

System.register("davinci-eight/math/quadSpinorE2.js", ["../checks/isDefined", "../checks/isNumber"], function(exports_1) {
  var isDefined_1,
      isNumber_1;
  function quadSpinorE2(s) {
    if (isDefined_1.default(s)) {
      var α = s.α;
      var β = s.β;
      if (isNumber_1.default(α) && isNumber_1.default(β)) {
        return α * α + β * β;
      } else {
        return void 0;
      }
    } else {
      return void 0;
    }
  }
  exports_1("default", quadSpinorE2);
  return {
    setters: [function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }, function(isNumber_1_1) {
      isNumber_1 = isNumber_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/math/Spinor2.js", ["../math/dotVectorCartesianE2", "../math/dotVectorE2", "../checks/isDefined", "../checks/mustBeInteger", "../checks/mustBeNumber", "../checks/mustBeObject", "../math/quadSpinorE2", "../math/quadVectorE2", "../math/rotorFromDirections", "../math/VectorN", "../math/wedgeXY"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var dotVectorCartesianE2_1,
      dotVectorE2_1,
      isDefined_1,
      mustBeInteger_1,
      mustBeNumber_1,
      mustBeObject_1,
      quadSpinorE2_1,
      quadVectorE2_1,
      rotorFromDirections_1,
      VectorN_1,
      wedgeXY_1;
  var COORD_SCALAR,
      COORD_PSEUDO,
      abs,
      atan2,
      exp,
      log,
      cos,
      sin,
      sqrt,
      Spinor2;
  function one() {
    var coords = [0, 0];
    coords[COORD_SCALAR] = 1;
    coords[COORD_PSEUDO] = 0;
    return coords;
  }
  return {
    setters: [function(dotVectorCartesianE2_1_1) {
      dotVectorCartesianE2_1 = dotVectorCartesianE2_1_1;
    }, function(dotVectorE2_1_1) {
      dotVectorE2_1 = dotVectorE2_1_1;
    }, function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }, function(mustBeInteger_1_1) {
      mustBeInteger_1 = mustBeInteger_1_1;
    }, function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }, function(mustBeObject_1_1) {
      mustBeObject_1 = mustBeObject_1_1;
    }, function(quadSpinorE2_1_1) {
      quadSpinorE2_1 = quadSpinorE2_1_1;
    }, function(quadVectorE2_1_1) {
      quadVectorE2_1 = quadVectorE2_1_1;
    }, function(rotorFromDirections_1_1) {
      rotorFromDirections_1 = rotorFromDirections_1_1;
    }, function(VectorN_1_1) {
      VectorN_1 = VectorN_1_1;
    }, function(wedgeXY_1_1) {
      wedgeXY_1 = wedgeXY_1_1;
    }],
    execute: function() {
      COORD_SCALAR = 1;
      COORD_PSEUDO = 0;
      abs = Math.abs;
      atan2 = Math.atan2;
      exp = Math.exp;
      log = Math.log;
      cos = Math.cos;
      sin = Math.sin;
      sqrt = Math.sqrt;
      Spinor2 = (function(_super) {
        __extends(Spinor2, _super);
        function Spinor2(coordinates, modified) {
          if (coordinates === void 0) {
            coordinates = one();
          }
          if (modified === void 0) {
            modified = false;
          }
          _super.call(this, coordinates, modified, 2);
        }
        Object.defineProperty(Spinor2.prototype, "xy", {
          get: function() {
            return this.coords[COORD_PSEUDO];
          },
          set: function(xy) {
            mustBeNumber_1.default('xy', xy);
            this.modified = this.modified || this.xy !== xy;
            this.coords[COORD_PSEUDO] = xy;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Spinor2.prototype, "alpha", {
          get: function() {
            return this.coords[COORD_SCALAR];
          },
          set: function(alpha) {
            mustBeNumber_1.default('alpha', alpha);
            this.modified = this.modified || this.alpha !== alpha;
            this.coords[COORD_SCALAR] = alpha;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Spinor2.prototype, "α", {
          get: function() {
            return this.coords[COORD_SCALAR];
          },
          set: function(α) {
            mustBeNumber_1.default('α', α);
            this.modified = this.modified || this.α !== α;
            this.coords[COORD_SCALAR] = α;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Spinor2.prototype, "β", {
          get: function() {
            return this.coords[COORD_PSEUDO];
          },
          set: function(β) {
            mustBeNumber_1.default('β', β);
            this.modified = this.modified || this.β !== β;
            this.coords[COORD_PSEUDO] = β;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Spinor2.prototype, "beta", {
          get: function() {
            return this.coords[COORD_PSEUDO];
          },
          set: function(beta) {
            mustBeNumber_1.default('beta', beta);
            this.modified = this.modified || this.beta !== beta;
            this.coords[COORD_PSEUDO] = beta;
          },
          enumerable: true,
          configurable: true
        });
        Spinor2.prototype.add = function(spinor, α) {
          if (α === void 0) {
            α = 1;
          }
          mustBeObject_1.default('spinor', spinor);
          mustBeNumber_1.default('α', α);
          this.xy += spinor.β * α;
          this.α += spinor.α * α;
          return this;
        };
        Spinor2.prototype.add2 = function(a, b) {
          this.α = a.α + b.α;
          this.xy = a.β + b.β;
          return this;
        };
        Spinor2.prototype.addPseudo = function(β) {
          mustBeNumber_1.default('β', β);
          return this;
        };
        Spinor2.prototype.addScalar = function(α) {
          mustBeNumber_1.default('α', α);
          this.α += α;
          return this;
        };
        Spinor2.prototype.adj = function() {
          throw new Error('TODO: Spinor2.adj');
        };
        Spinor2.prototype.angle = function() {
          return this.log().grade(2);
        };
        Spinor2.prototype.clone = function() {
          return Spinor2.copy(this);
        };
        Spinor2.prototype.conj = function() {
          this.xy = -this.xy;
          return this;
        };
        Spinor2.prototype.copy = function(spinor) {
          mustBeObject_1.default('spinor', spinor);
          this.xy = mustBeNumber_1.default('spinor.β', spinor.β);
          this.α = mustBeNumber_1.default('spinor.α', spinor.α);
          return this;
        };
        Spinor2.prototype.copyScalar = function(α) {
          return this.zero().addScalar(α);
        };
        Spinor2.prototype.copySpinor = function(spinor) {
          return this.copy(spinor);
        };
        Spinor2.prototype.copyVector = function(vector) {
          return this.zero();
        };
        Spinor2.prototype.cos = function() {
          throw new Error("Spinor2.cos");
        };
        Spinor2.prototype.cosh = function() {
          throw new Error("Spinor2.cosh");
        };
        Spinor2.prototype.div = function(s) {
          return this.div2(this, s);
        };
        Spinor2.prototype.div2 = function(a, b) {
          var a0 = a.α;
          var a1 = a.β;
          var b0 = b.α;
          var b1 = b.β;
          var quadB = quadSpinorE2_1.default(b);
          this.α = (a0 * b0 + a1 * b1) / quadB;
          this.xy = (a1 * b0 - a0 * b1) / quadB;
          return this;
        };
        Spinor2.prototype.divByScalar = function(α) {
          this.xy /= α;
          this.α /= α;
          return this;
        };
        Spinor2.prototype.exp = function() {
          var w = this.α;
          var z = this.xy;
          var expW = exp(w);
          var φ = sqrt(z * z);
          var s = expW * (φ !== 0 ? sin(φ) / φ : 1);
          this.α = expW * cos(φ);
          this.xy = z * s;
          return this;
        };
        Spinor2.prototype.inv = function() {
          this.conj();
          this.divByScalar(this.squaredNormSansUnits());
          return this;
        };
        Spinor2.prototype.lco = function(rhs) {
          return this.lco2(this, rhs);
        };
        Spinor2.prototype.lco2 = function(a, b) {
          return this;
        };
        Spinor2.prototype.lerp = function(target, α) {
          var Vector2 = Spinor2.copy(target);
          var Vector1 = this.clone();
          var R = Vector2.mul(Vector1.inv());
          R.log();
          R.scale(α);
          R.exp();
          this.copy(R);
          return this;
        };
        Spinor2.prototype.lerp2 = function(a, b, α) {
          this.sub2(b, a).scale(α).add(a);
          return this;
        };
        Spinor2.prototype.log = function() {
          var w = this.α;
          var z = this.xy;
          var bb = z * z;
          var Vector2 = sqrt(bb);
          var R0 = abs(w);
          var R = sqrt(w * w + bb);
          this.α = log(R);
          var f = atan2(Vector2, R0) / Vector2;
          this.xy = z * f;
          return this;
        };
        Spinor2.prototype.magnitude = function() {
          return this.norm();
        };
        Spinor2.prototype.magnitudeSansUnits = function() {
          return sqrt(this.squaredNormSansUnits());
        };
        Spinor2.prototype.mul = function(s) {
          return this.mul2(this, s);
        };
        Spinor2.prototype.mul2 = function(a, b) {
          var a0 = a.α;
          var a1 = a.β;
          var b0 = b.α;
          var b1 = b.β;
          this.α = a0 * b0 - a1 * b1;
          this.xy = a0 * b1 + a1 * b0;
          return this;
        };
        Spinor2.prototype.neg = function() {
          this.α = -this.α;
          this.xy = -this.xy;
          return this;
        };
        Spinor2.prototype.norm = function() {
          var norm = this.magnitudeSansUnits();
          return this.zero().addScalar(norm);
        };
        Spinor2.prototype.direction = function() {
          var modulus = this.magnitudeSansUnits();
          this.xy = this.xy / modulus;
          this.α = this.α / modulus;
          return this;
        };
        Spinor2.prototype.one = function() {
          this.α = 1;
          this.xy = 0;
          return this;
        };
        Spinor2.prototype.pow = function() {
          throw new Error("Spinor2.pow");
        };
        Spinor2.prototype.quad = function() {
          return this.squaredNorm();
        };
        Spinor2.prototype.sin = function() {
          throw new Error("Spinor2.sin");
        };
        Spinor2.prototype.sinh = function() {
          throw new Error("Spinor2.sinh");
        };
        Spinor2.prototype.squaredNorm = function() {
          var squaredNorm = this.squaredNormSansUnits();
          return this.zero().addScalar(squaredNorm);
        };
        Spinor2.prototype.squaredNormSansUnits = function() {
          return quadSpinorE2_1.default(this);
        };
        Spinor2.prototype.rco = function(rhs) {
          return this.rco2(this, rhs);
        };
        Spinor2.prototype.rco2 = function(a, b) {
          return this;
        };
        Spinor2.prototype.rev = function() {
          this.xy *= -1;
          return this;
        };
        Spinor2.prototype.reflect = function(n) {
          var w = this.α;
          var β = this.xy;
          var nx = n.x;
          var ny = n.y;
          var nn = nx * nx + ny * ny;
          this.α = nn * w;
          this.xy = -nn * β;
          return this;
        };
        Spinor2.prototype.rotate = function(rotor) {
          console.warn("Spinor2.rotate is not implemented");
          return this;
        };
        Spinor2.prototype.rotorFromDirections = function(a, b) {
          if (isDefined_1.default(rotorFromDirections_1.default(a, b, quadVectorE2_1.default, dotVectorE2_1.default, this))) {
            return this;
          } else {}
        };
        Spinor2.prototype.rotorFromGeneratorAngle = function(B, θ) {
          var φ = θ / 2;
          var s = sin(φ);
          this.xy = -B.β * s;
          this.α = cos(φ);
          return this;
        };
        Spinor2.prototype.scp = function(rhs) {
          return this.scp2(this, rhs);
        };
        Spinor2.prototype.scp2 = function(a, b) {
          return this;
        };
        Spinor2.prototype.scale = function(α) {
          mustBeNumber_1.default('α', α);
          this.xy *= α;
          this.α *= α;
          return this;
        };
        Spinor2.prototype.slerp = function(target, α) {
          var Vector2 = Spinor2.copy(target);
          var Vector1 = this.clone();
          var R = Vector2.mul(Vector1.inv());
          R.log();
          R.scale(α);
          R.exp();
          this.copy(R);
          return this;
        };
        Spinor2.prototype.sub = function(s, α) {
          if (α === void 0) {
            α = 1;
          }
          mustBeObject_1.default('s', s);
          mustBeNumber_1.default('α', α);
          this.xy -= s.β * α;
          this.α -= s.α * α;
          return this;
        };
        Spinor2.prototype.sub2 = function(a, b) {
          this.xy = a.β - b.β;
          this.α = a.α - b.α;
          return this;
        };
        Spinor2.prototype.versor = function(a, b) {
          var ax = a.x;
          var ay = a.y;
          var bx = b.x;
          var by = b.y;
          this.α = dotVectorCartesianE2_1.default(ax, ay, bx, by);
          this.xy = wedgeXY_1.default(ax, ay, 0, bx, by, 0);
          return this;
        };
        Spinor2.prototype.grade = function(grade) {
          mustBeInteger_1.default('grade', grade);
          switch (grade) {
            case 0:
              {
                this.xy = 0;
              }
              break;
            case 2:
              {
                this.α = 0;
              }
              break;
            default:
              {
                this.α = 0;
                this.xy = 0;
              }
          }
          return this;
        };
        Spinor2.prototype.toExponential = function() {
          return this.toString();
        };
        Spinor2.prototype.toFixed = function(digits) {
          return this.toString();
        };
        Spinor2.prototype.toString = function() {
          return "Spinor2({β: " + this.xy + ", w: " + this.α + "})";
        };
        Spinor2.prototype.ext = function(rhs) {
          return this.ext2(this, rhs);
        };
        Spinor2.prototype.ext2 = function(a, b) {
          return this;
        };
        Spinor2.prototype.zero = function() {
          this.α = 0;
          this.xy = 0;
          return this;
        };
        Spinor2.copy = function(spinor) {
          return new Spinor2().copy(spinor);
        };
        Spinor2.lerp = function(a, b, α) {
          return Spinor2.copy(a).lerp(b, α);
        };
        Spinor2.rotorFromDirections = function(a, b) {
          return new Spinor2().rotorFromDirections(a, b);
        };
        return Spinor2;
      })(VectorN_1.default);
      exports_1("default", Spinor2);
    }
  };
});

System.register("davinci-eight/math/Vector4.js", ["../math/VectorN"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var VectorN_1;
  var Vector4;
  return {
    setters: [function(VectorN_1_1) {
      VectorN_1 = VectorN_1_1;
    }],
    execute: function() {
      Vector4 = (function(_super) {
        __extends(Vector4, _super);
        function Vector4(data, modified) {
          if (data === void 0) {
            data = [0, 0, 0, 0];
          }
          if (modified === void 0) {
            modified = false;
          }
          _super.call(this, data, modified, 4);
        }
        Object.defineProperty(Vector4.prototype, "x", {
          get: function() {
            return this.coords[0];
          },
          set: function(value) {
            this.modified = this.modified || this.x !== value;
            this.coords[0] = value;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Vector4.prototype, "y", {
          get: function() {
            return this.coords[1];
          },
          set: function(value) {
            this.modified = this.modified || this.y !== value;
            this.coords[1] = value;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Vector4.prototype, "z", {
          get: function() {
            return this.coords[2];
          },
          set: function(value) {
            this.modified = this.modified || this.z !== value;
            this.coords[2] = value;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Vector4.prototype, "w", {
          get: function() {
            return this.coords[3];
          },
          set: function(value) {
            this.modified = this.modified || this.w !== value;
            this.coords[3] = value;
          },
          enumerable: true,
          configurable: true
        });
        Vector4.prototype.setW = function(w) {
          this.w = w;
          return this;
        };
        Vector4.prototype.add = function(vector, α) {
          if (α === void 0) {
            α = 1;
          }
          this.x += vector.x * α;
          this.y += vector.y * α;
          this.z += vector.z * α;
          this.w += vector.w * α;
          return this;
        };
        Vector4.prototype.add2 = function(a, b) {
          this.x = a.x + b.x;
          this.y = a.y + b.y;
          this.z = a.z + b.z;
          this.w = a.w + b.w;
          return this;
        };
        Vector4.prototype.applyMatrix = function(m) {
          var x = this.x;
          var y = this.y;
          var z = this.z;
          var w = this.w;
          var e = m.elements;
          this.x = e[0x0] * x + e[0x4] * y + e[0x8] * z + e[0xC] * w;
          this.y = e[0x1] * x + e[0x5] * y + e[0x9] * z + e[0xD] * w;
          this.z = e[0x2] * x + e[0x6] * y + e[0xA] * z + e[0xE] * w;
          this.w = e[0x3] * x + e[0x7] * y + e[0xB] * z + e[0xF] * w;
          return this;
        };
        Vector4.prototype.clone = function() {
          return new Vector4([this.x, this.y, this.z, this.w], this.modified);
        };
        Vector4.prototype.copy = function(v) {
          this.x = v.x;
          this.y = v.y;
          this.z = v.z;
          this.w = v.w;
          return this;
        };
        Vector4.prototype.divByScalar = function(α) {
          this.x /= α;
          this.y /= α;
          this.z /= α;
          this.w /= α;
          return this;
        };
        Vector4.prototype.lerp = function(target, α) {
          this.x += (target.x - this.x) * α;
          this.y += (target.y - this.y) * α;
          this.z += (target.z - this.z) * α;
          this.w += (target.w - this.w) * α;
          return this;
        };
        Vector4.prototype.lerp2 = function(a, b, α) {
          this.sub2(b, a).scale(α).add(a);
          return this;
        };
        Vector4.prototype.neg = function() {
          this.x = -this.x;
          this.y = -this.y;
          this.z = -this.z;
          this.w = -this.w;
          return this;
        };
        Vector4.prototype.scale = function(α) {
          this.x *= α;
          this.y *= α;
          this.z *= α;
          this.w *= α;
          return this;
        };
        Vector4.prototype.reflect = function(n) {
          return this;
        };
        Vector4.prototype.rotate = function(rotor) {
          return this;
        };
        Vector4.prototype.slerp = function(target, α) {
          return this;
        };
        Vector4.prototype.sub = function(v, α) {
          this.x -= v.x * α;
          this.y -= v.y * α;
          this.z -= v.z * α;
          this.w -= v.w * α;
          return this;
        };
        Vector4.prototype.sub2 = function(a, b) {
          this.x = a.x - b.x;
          this.y = a.y - b.y;
          this.z = a.z - b.z;
          this.w = a.w - b.w;
          return this;
        };
        Vector4.prototype.magnitude = function() {
          throw new Error("TODO: Vector4.magnitude()");
        };
        Vector4.prototype.squaredNorm = function() {
          throw new Error("TODO: Vector4.squaredNorm()");
        };
        Vector4.prototype.toExponential = function() {
          return "TODO Vector4.toExponential";
        };
        Vector4.prototype.toFixed = function(digits) {
          return "TODO Vector4.toFixed";
        };
        Vector4.prototype.zero = function() {
          this.x = 0;
          this.y = 0;
          this.z = 0;
          this.w = 0;
          return this;
        };
        return Vector4;
      })(VectorN_1.default);
      exports_1("default", Vector4);
    }
  };
});

System.register("davinci-eight/overlay/base/Board.js", ["../../core/Shareable"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Shareable_1;
  var Board;
  return {
    setters: [function(Shareable_1_1) {
      Shareable_1 = Shareable_1_1;
    }],
    execute: function() {
      Board = (function(_super) {
        __extends(Board, _super);
        function Board(container, renderer) {
          _super.call(this, 'Board');
          this.container = container;
          this.renderer = renderer;
        }
        Board.prototype.destructor = function() {
          _super.prototype.destructor.call(this);
        };
        return Board;
      })(Shareable_1.default);
      exports_1("default", Board);
    }
  };
});

System.register("davinci-eight/overlay/renderers/CanvasRenderer.js", ["./AbstractRenderer"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var AbstractRenderer_1;
  var CanvasRenderer;
  return {
    setters: [function(AbstractRenderer_1_1) {
      AbstractRenderer_1 = AbstractRenderer_1_1;
    }],
    execute: function() {
      CanvasRenderer = (function(_super) {
        __extends(CanvasRenderer, _super);
        function CanvasRenderer(domElement, dimensions) {
          _super.call(this);
        }
        return CanvasRenderer;
      })(AbstractRenderer_1.default);
      exports_1("default", CanvasRenderer);
    }
  };
});

System.register("davinci-eight/utils/exists.js", [], function(exports_1) {
  function exists(v) {
    return !(v === void 0 || v === null);
  }
  exports_1("default", exists);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/utils/isBrowser.js", [], function(exports_1) {
  function isBrowser() {
    return typeof window === 'object' && typeof document === 'object';
  }
  exports_1("default", isBrowser);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/utils/getDimensions.js", ["./exists", "./isBrowser"], function(exports_1) {
  var exists_1,
      isBrowser_1;
  function getDimensions(elementId, doc) {
    var pixelDimRegExp = /\d+(\.\d*)?px/;
    if (!isBrowser_1.default() || elementId === null) {
      return {
        width: 500,
        height: 500
      };
    }
    var element = doc.getElementById(elementId);
    if (!exists_1.default(element)) {
      throw new Error("\nHTML container element '" + elementId + "' not found.");
    }
    var display = element.style.display;
    if (display !== 'none' && display !== null) {
      if (element.clientWidth > 0 && element.clientHeight > 0) {
        return {
          width: element.clientWidth,
          height: element.clientHeight
        };
      }
      var style = window.getComputedStyle ? window.getComputedStyle(element) : element.style;
      return {
        width: pixelDimRegExp.test(style.width) ? parseFloat(style.width) : 0,
        height: pixelDimRegExp.test(style.height) ? parseFloat(style.height) : 0
      };
    }
    var els = element.style;
    var originalVisibility = els.visibility;
    var originalPosition = els.position;
    var originalDisplay = els.display;
    els.visibility = 'hidden';
    els.position = 'absolute';
    els.display = 'block';
    var originalWidth = element.clientWidth;
    var originalHeight = element.clientHeight;
    els.display = originalDisplay;
    els.position = originalPosition;
    els.visibility = originalVisibility;
    return {
      width: originalWidth,
      height: originalHeight
    };
  }
  exports_1("default", getDimensions);
  return {
    setters: [function(exists_1_1) {
      exists_1 = exists_1_1;
    }, function(isBrowser_1_1) {
      isBrowser_1 = isBrowser_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/overlay/renderers/NoRenderer.js", ["./AbstractRenderer"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var AbstractRenderer_1;
  var NoRenderer;
  return {
    setters: [function(AbstractRenderer_1_1) {
      AbstractRenderer_1 = AbstractRenderer_1_1;
    }],
    execute: function() {
      NoRenderer = (function(_super) {
        __extends(NoRenderer, _super);
        function NoRenderer() {
          _super.apply(this, arguments);
        }
        return NoRenderer;
      })(AbstractRenderer_1.default);
      exports_1("default", NoRenderer);
    }
  };
});

System.register("davinci-eight/overlay/renderers/SVGRenderer.js", ["./AbstractRenderer"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var AbstractRenderer_1;
  var SVGRenderer;
  return {
    setters: [function(AbstractRenderer_1_1) {
      AbstractRenderer_1 = AbstractRenderer_1_1;
    }],
    execute: function() {
      SVGRenderer = (function(_super) {
        __extends(SVGRenderer, _super);
        function SVGRenderer(domElement, dimensions) {
          _super.call(this);
        }
        return SVGRenderer;
      })(AbstractRenderer_1.default);
      exports_1("default", SVGRenderer);
    }
  };
});

System.register("davinci-eight/overlay/base/GeometryElement.js", ["../../core/Shareable"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Shareable_1;
  var GeometryElement;
  return {
    setters: [function(Shareable_1_1) {
      Shareable_1 = Shareable_1_1;
    }],
    execute: function() {
      GeometryElement = (function(_super) {
        __extends(GeometryElement, _super);
        function GeometryElement(type) {
          _super.call(this, type);
        }
        GeometryElement.prototype.destructor = function() {
          _super.prototype.destructor.call(this);
        };
        return GeometryElement;
      })(Shareable_1.default);
      exports_1("default", GeometryElement);
    }
  };
});

System.register("davinci-eight/overlay/base/Text.js", ["./GeometryElement"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var GeometryElement_1;
  var Text;
  return {
    setters: [function(GeometryElement_1_1) {
      GeometryElement_1 = GeometryElement_1_1;
    }],
    execute: function() {
      Text = (function(_super) {
        __extends(Text, _super);
        function Text() {
          _super.call(this, 'Text');
        }
        Text.prototype.destructor = function() {
          _super.prototype.destructor.call(this);
        };
        return Text;
      })(GeometryElement_1.default);
      exports_1("default", Text);
    }
  };
});

System.register("davinci-eight/overlay/renderers/AbstractRenderer.js", [], function(exports_1) {
  var AbstractRenderer;
  return {
    setters: [],
    execute: function() {
      AbstractRenderer = (function() {
        function AbstractRenderer() {}
        return AbstractRenderer;
      })();
      exports_1("default", AbstractRenderer);
    }
  };
});

System.register("davinci-eight/overlay/renderers/VMLRenderer.js", ["./AbstractRenderer"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var AbstractRenderer_1;
  var VMLRenderer;
  return {
    setters: [function(AbstractRenderer_1_1) {
      AbstractRenderer_1 = AbstractRenderer_1_1;
    }],
    execute: function() {
      VMLRenderer = (function(_super) {
        __extends(VMLRenderer, _super);
        function VMLRenderer(domElement) {
          _super.call(this);
        }
        return VMLRenderer;
      })(AbstractRenderer_1.default);
      exports_1("default", VMLRenderer);
    }
  };
});

System.register("davinci-eight/overlay/Overlay.js", ["./base/Board", "./renderers/CanvasRenderer", "../utils/getDimensions", "../checks/mustBeString", "../checks/mustBeObject", "./renderers/NoRenderer", "../core/Shareable", "./renderers/SVGRenderer", "./base/Text", "./renderers/VMLRenderer"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Board_1,
      CanvasRenderer_1,
      getDimensions_1,
      mustBeString_1,
      mustBeObject_1,
      NoRenderer_1,
      Shareable_1,
      SVGRenderer_1,
      Text_1,
      VMLRenderer_1;
  var Overlay;
  function initRenderer(elementId, dimensions, doc, rendererKind) {
    mustBeString_1.default('elementId', elementId);
    mustBeObject_1.default('dimensions', dimensions);
    mustBeObject_1.default('doc', doc);
    mustBeString_1.default('rendererKin', rendererKind);
    var domElement = doc.getElementById(elementId);
    while (domElement.firstChild) {
      domElement.removeChild(domElement.firstChild);
    }
    if (rendererKind === 'svg') {
      return new SVGRenderer_1.default(domElement, dimensions);
    } else if (rendererKind === 'vml') {
      return new VMLRenderer_1.default(domElement);
    } else if (rendererKind === 'canvas') {
      return new CanvasRenderer_1.default(domElement, dimensions);
    } else {
      return new NoRenderer_1.default();
    }
  }
  return {
    setters: [function(Board_1_1) {
      Board_1 = Board_1_1;
    }, function(CanvasRenderer_1_1) {
      CanvasRenderer_1 = CanvasRenderer_1_1;
    }, function(getDimensions_1_1) {
      getDimensions_1 = getDimensions_1_1;
    }, function(mustBeString_1_1) {
      mustBeString_1 = mustBeString_1_1;
    }, function(mustBeObject_1_1) {
      mustBeObject_1 = mustBeObject_1_1;
    }, function(NoRenderer_1_1) {
      NoRenderer_1 = NoRenderer_1_1;
    }, function(Shareable_1_1) {
      Shareable_1 = Shareable_1_1;
    }, function(SVGRenderer_1_1) {
      SVGRenderer_1 = SVGRenderer_1_1;
    }, function(Text_1_1) {
      Text_1 = Text_1_1;
    }, function(VMLRenderer_1_1) {
      VMLRenderer_1 = VMLRenderer_1_1;
    }],
    execute: function() {
      Overlay = (function(_super) {
        __extends(Overlay, _super);
        function Overlay(elementId, options) {
          if (options === void 0) {
            options = {};
          }
          _super.call(this, 'Overlay');
          var dimensions = getDimensions_1.default(elementId, document);
          this.renderer = initRenderer(elementId, dimensions, document, 'svg');
          this.board = new Board_1.default(elementId, this.renderer);
        }
        Overlay.prototype.destructor = function() {
          this.board.release();
          _super.prototype.destructor.call(this);
        };
        Overlay.prototype.createText = function() {
          var text = new Text_1.default();
          return text;
        };
        return Overlay;
      })(Shareable_1.default);
      exports_1("default", Overlay);
    }
  };
});

System.register("davinci-eight/utils/getCanvasElementById.js", ["../checks/mustBeString", "../checks/mustBeObject"], function(exports_1) {
  var mustBeString_1,
      mustBeObject_1;
  function getCanvasElementById(elementId, dom) {
    if (dom === void 0) {
      dom = window.document;
    }
    mustBeString_1.default('elementId', elementId);
    mustBeObject_1.default('document', dom);
    var element = dom.getElementById(elementId);
    if (element instanceof HTMLCanvasElement) {
      return element;
    } else {
      throw new Error(elementId + " is not an HTMLCanvasElement.");
    }
  }
  exports_1("default", getCanvasElementById);
  return {
    setters: [function(mustBeString_1_1) {
      mustBeString_1 = mustBeString_1_1;
    }, function(mustBeObject_1_1) {
      mustBeObject_1 = mustBeObject_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/collections/NumberIUnknownMap.js", ["../core/Shareable"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Shareable_1;
  var NumberIUnknownMap;
  return {
    setters: [function(Shareable_1_1) {
      Shareable_1 = Shareable_1_1;
    }],
    execute: function() {
      NumberIUnknownMap = (function(_super) {
        __extends(NumberIUnknownMap, _super);
        function NumberIUnknownMap() {
          _super.call(this, 'NumberIUnknownMap');
          this._elements = {};
        }
        NumberIUnknownMap.prototype.destructor = function() {
          this.forEach(function(key, value) {
            if (value) {
              value.release();
            }
          });
          this._elements = void 0;
        };
        NumberIUnknownMap.prototype.exists = function(key) {
          var element = this._elements[key];
          return element ? true : false;
        };
        NumberIUnknownMap.prototype.get = function(key) {
          var element = this.getWeakRef(key);
          if (element) {
            element.addRef();
          }
          return element;
        };
        NumberIUnknownMap.prototype.getWeakRef = function(index) {
          return this._elements[index];
        };
        NumberIUnknownMap.prototype.put = function(key, value) {
          if (value) {
            value.addRef();
          }
          this.putWeakRef(key, value);
        };
        NumberIUnknownMap.prototype.putWeakRef = function(key, value) {
          var elements = this._elements;
          var existing = elements[key];
          if (existing) {
            existing.release();
          }
          elements[key] = value;
        };
        NumberIUnknownMap.prototype.forEach = function(callback) {
          var keys = this.keys;
          for (var i = 0,
              iLength = keys.length; i < iLength; i++) {
            var key = keys[i];
            var value = this._elements[key];
            callback(key, value);
          }
        };
        Object.defineProperty(NumberIUnknownMap.prototype, "keys", {
          get: function() {
            return Object.keys(this._elements).map(function(keyString) {
              return parseFloat(keyString);
            });
          },
          enumerable: true,
          configurable: true
        });
        NumberIUnknownMap.prototype.remove = function(key) {
          this.put(key, void 0);
          delete this._elements[key];
        };
        return NumberIUnknownMap;
      })(Shareable_1.default);
      exports_1("default", NumberIUnknownMap);
    }
  };
});

System.register("davinci-eight/collections/StringIUnknownMap.js", ["../core/Shareable"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Shareable_1;
  var StringIUnknownMap;
  return {
    setters: [function(Shareable_1_1) {
      Shareable_1 = Shareable_1_1;
    }],
    execute: function() {
      StringIUnknownMap = (function(_super) {
        __extends(StringIUnknownMap, _super);
        function StringIUnknownMap() {
          _super.call(this, 'StringIUnknownMap');
          this.elements = {};
        }
        StringIUnknownMap.prototype.destructor = function() {
          var _this = this;
          this.forEach(function(key) {
            _this.putWeakRef(key, void 0);
          });
          _super.prototype.destructor.call(this);
        };
        StringIUnknownMap.prototype.exists = function(key) {
          var element = this.elements[key];
          return element ? true : false;
        };
        StringIUnknownMap.prototype.get = function(key) {
          var element = this.elements[key];
          if (element) {
            element.addRef();
            return element;
          } else {
            return void 0;
          }
        };
        StringIUnknownMap.prototype.getWeakRef = function(key) {
          return this.elements[key];
        };
        StringIUnknownMap.prototype.put = function(key, value) {
          if (value) {
            value.addRef();
          }
          this.putWeakRef(key, value);
        };
        StringIUnknownMap.prototype.putWeakRef = function(key, value) {
          var elements = this.elements;
          var existing = elements[key];
          if (existing) {
            existing.release();
          }
          elements[key] = value;
        };
        StringIUnknownMap.prototype.forEach = function(callback) {
          var keys = this.keys;
          for (var i = 0,
              iLength = keys.length; i < iLength; i++) {
            var key = keys[i];
            callback(key, this.elements[key]);
          }
        };
        Object.defineProperty(StringIUnknownMap.prototype, "keys", {
          get: function() {
            return Object.keys(this.elements);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(StringIUnknownMap.prototype, "values", {
          get: function() {
            var values = [];
            var keys = this.keys;
            for (var i = 0,
                iLength = keys.length; i < iLength; i++) {
              var key = keys[i];
              values.push(this.elements[key]);
            }
            return values;
          },
          enumerable: true,
          configurable: true
        });
        StringIUnknownMap.prototype.remove = function(key) {
          var value = this.elements[key];
          delete this.elements[key];
          return value;
        };
        return StringIUnknownMap;
      })(Shareable_1.default);
      exports_1("default", StringIUnknownMap);
    }
  };
});

System.register("davinci-eight/utils/animation.js", ["../checks/expectArg"], function(exports_1) {
  var expectArg_1;
  function defaultSetUp() {}
  function defaultTearDown(animateException) {
    if (animateException) {
      var message = "Exception raised during animate function: " + animateException;
      console.warn(message);
    }
  }
  function defaultTerminate(time) {
    return false;
  }
  function animation(animate, options) {
    var STATE_INITIAL = 1;
    var STATE_RUNNING = 2;
    var STATE_PAUSED = 3;
    options = options || {};
    var $window = expectArg_1.default('options.window', options.window || window).toNotBeNull().value;
    var setUp = expectArg_1.default('options.setUp', options.setUp || defaultSetUp).value;
    var tearDown = expectArg_1.default('options.tearDown', options.tearDown || defaultTearDown).value;
    var terminate = expectArg_1.default('options.terminate', options.terminate || defaultTerminate).toNotBeNull().value;
    var stopSignal = false;
    var startTime;
    var elapsed = 0;
    var MILLIS_PER_SECOND = 1000;
    var requestID = null;
    var animateException;
    var state = STATE_INITIAL;
    var frameRequestCallback = function(timestamp) {
      if (startTime) {
        elapsed = elapsed + timestamp - startTime;
      }
      startTime = timestamp;
      if (stopSignal || terminate(elapsed / MILLIS_PER_SECOND)) {
        stopSignal = false;
        $window.cancelAnimationFrame(requestID);
        if (publicAPI.isRunning) {
          state = STATE_PAUSED;
          startTime = void 0;
        } else {
          console.error("stopSignal received while not running.");
        }
        $window.document.removeEventListener('keydown', onDocumentKeyDown, false);
        try {
          tearDown(animateException);
        } catch (e) {
          console.warn("Exception raised during tearDown function: " + e);
        }
      } else {
        requestID = $window.requestAnimationFrame(frameRequestCallback);
        try {
          animate(elapsed / MILLIS_PER_SECOND);
        } catch (e) {
          animateException = e;
          stopSignal = true;
        }
      }
    };
    var onDocumentKeyDown = function(event) {
      if (event.keyCode === 27) {
        stopSignal = true;
        event.preventDefault();
      }
    };
    var publicAPI = {
      start: function() {
        if (!publicAPI.isRunning) {
          setUp();
          $window.document.addEventListener('keydown', onDocumentKeyDown, false);
          state = STATE_RUNNING;
          requestID = $window.requestAnimationFrame(frameRequestCallback);
        } else {
          throw new Error("The `start` method may only be called when not running.");
        }
      },
      stop: function() {
        if (publicAPI.isRunning) {
          stopSignal = true;
        } else {
          throw new Error("The `stop` method may only be called when running.");
        }
      },
      reset: function() {
        if (publicAPI.isPaused) {
          startTime = void 0;
          elapsed = 0;
          state = STATE_INITIAL;
        } else {
          throw new Error("The `reset` method may only be called when paused.");
        }
      },
      get time() {
        return elapsed / MILLIS_PER_SECOND;
      },
      lap: function() {
        if (publicAPI.isRunning) {} else {
          throw new Error("The `lap` method may only be called when running.");
        }
      },
      get isRunning() {
        return state === STATE_RUNNING;
      },
      get isPaused() {
        return state === STATE_PAUSED;
      }
    };
    return publicAPI;
  }
  exports_1("default", animation);
  return {
    setters: [function(expectArg_1_1) {
      expectArg_1 = expectArg_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/visual/Tetrahedron.js", ["../checks/mustBeNumber", "./visualCache", "./RigidBody"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var mustBeNumber_1,
      visualCache_1,
      RigidBody_1;
  var Tetrahedron;
  return {
    setters: [function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }, function(visualCache_1_1) {
      visualCache_1 = visualCache_1_1;
    }, function(RigidBody_1_1) {
      RigidBody_1 = RigidBody_1_1;
    }],
    execute: function() {
      Tetrahedron = (function(_super) {
        __extends(Tetrahedron, _super);
        function Tetrahedron(options) {
          if (options === void 0) {
            options = {};
          }
          _super.call(this, visualCache_1.default.tetrahedron(options), visualCache_1.default.material(options), 'Tetrahedron');
          this._geometry.release();
          this._material.release();
        }
        Tetrahedron.prototype.destructor = function() {
          _super.prototype.destructor.call(this);
        };
        Object.defineProperty(Tetrahedron.prototype, "radius", {
          get: function() {
            return this.getScaleX();
          },
          set: function(radius) {
            mustBeNumber_1.default('radius', radius);
            this.setScaleX(radius);
            this.setScaleY(radius);
            this.setScaleZ(radius);
          },
          enumerable: true,
          configurable: true
        });
        return Tetrahedron;
      })(RigidBody_1.default);
      exports_1("default", Tetrahedron);
    }
  };
});

System.register("davinci-eight/facets/DirectionalLight.js", ["../core/Color", "../checks/mustBeObject", "../checks/mustBeString", "../core/GraphicsProgramSymbols", "../math/Vector3"], function(exports_1) {
  var Color_1,
      mustBeObject_1,
      mustBeString_1,
      GraphicsProgramSymbols_1,
      Vector3_1;
  var LOGGING_NAME,
      DirectionalLight;
  function contextBuilder() {
    return LOGGING_NAME;
  }
  return {
    setters: [function(Color_1_1) {
      Color_1 = Color_1_1;
    }, function(mustBeObject_1_1) {
      mustBeObject_1 = mustBeObject_1_1;
    }, function(mustBeString_1_1) {
      mustBeString_1 = mustBeString_1_1;
    }, function(GraphicsProgramSymbols_1_1) {
      GraphicsProgramSymbols_1 = GraphicsProgramSymbols_1_1;
    }, function(Vector3_1_1) {
      Vector3_1 = Vector3_1_1;
    }],
    execute: function() {
      LOGGING_NAME = 'DirectionalLight';
      DirectionalLight = (function() {
        function DirectionalLight(direction, color) {
          mustBeObject_1.default('direction', direction);
          mustBeObject_1.default('color', color);
          this.direction = Vector3_1.default.copy(direction).direction();
          this.color = Color_1.default.fromColor(color);
        }
        DirectionalLight.prototype.getProperty = function(name) {
          mustBeString_1.default('name', name, contextBuilder);
          switch (name) {
            case DirectionalLight.PROP_COLOR:
              {
                return this.color.coords;
              }
              break;
            case DirectionalLight.PROP_DIRECTION:
              {
                return this.direction.coords;
              }
              break;
            default:
              {
                console.warn("unknown property: " + name);
              }
          }
        };
        DirectionalLight.prototype.setProperty = function(name, value) {
          mustBeString_1.default('name', name, contextBuilder);
          mustBeObject_1.default('value', value, contextBuilder);
          switch (name) {
            case DirectionalLight.PROP_COLOR:
              {
                this.color.coords = value;
              }
              break;
            case DirectionalLight.PROP_DIRECTION:
              {
                this.direction.coords = value;
              }
              break;
            default:
              {
                console.warn("unknown property: " + name);
              }
          }
          return this;
        };
        DirectionalLight.prototype.setColor = function(color) {
          mustBeObject_1.default('color', color);
          this.color.copy(color);
          return this;
        };
        DirectionalLight.prototype.setDirection = function(direction) {
          mustBeObject_1.default('direction', direction);
          this.direction.copy(direction).direction();
          return this;
        };
        DirectionalLight.prototype.setUniforms = function(visitor) {
          visitor.vector3(GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION, this.direction.coords);
          var coords = [this.color.r, this.color.g, this.color.b];
          visitor.vector3(GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_COLOR, coords);
        };
        DirectionalLight.PROP_COLOR = 'color';
        DirectionalLight.PROP_DIRECTION = 'direction';
        return DirectionalLight;
      })();
      exports_1("default", DirectionalLight);
    }
  };
});

System.register("davinci-eight/checks/isFunction.js", [], function(exports_1) {
  function isFunction(x) {
    return (typeof x === 'function');
  }
  exports_1("default", isFunction);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/checks/mustBeFunction.js", ["../checks/mustSatisfy", "../checks/isFunction"], function(exports_1) {
  var mustSatisfy_1,
      isFunction_1;
  function beFunction() {
    return "be a function";
  }
  function mustBeFunction(name, value, contextBuilder) {
    mustSatisfy_1.default(name, isFunction_1.default(value), beFunction, contextBuilder);
    return value;
  }
  exports_1("default", mustBeFunction);
  return {
    setters: [function(mustSatisfy_1_1) {
      mustSatisfy_1 = mustSatisfy_1_1;
    }, function(isFunction_1_1) {
      isFunction_1 = isFunction_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/visual/DrawList.js", ["../collections/ShareableArray", "../core/ShareableContextListener"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var ShareableArray_1,
      ShareableContextListener_1;
  var DrawList;
  return {
    setters: [function(ShareableArray_1_1) {
      ShareableArray_1 = ShareableArray_1_1;
    }, function(ShareableContextListener_1_1) {
      ShareableContextListener_1 = ShareableContextListener_1_1;
    }],
    execute: function() {
      DrawList = (function(_super) {
        __extends(DrawList, _super);
        function DrawList() {
          _super.call(this, 'DrawList');
          this._meshes = new ShareableArray_1.default();
        }
        DrawList.prototype.destructor = function() {
          this._meshes.release();
          _super.prototype.destructor.call(this);
        };
        DrawList.prototype.add = function(mesh) {
          this._meshes.push(mesh);
        };
        DrawList.prototype.draw = function(ambients) {
          var iLen = this._meshes.length;
          for (var i = 0; i < iLen; i++) {
            var mesh = this._meshes.getWeakRef(i);
            mesh.draw(ambients);
          }
        };
        DrawList.prototype.contextFree = function(context) {
          var iLen = this._meshes.length;
          for (var i = 0; i < iLen; i++) {
            var mesh = this._meshes.getWeakRef(i);
            mesh.contextFree(context);
          }
          _super.prototype.contextFree.call(this, context);
        };
        DrawList.prototype.contextGain = function(context) {
          var iLen = this._meshes.length;
          for (var i = 0; i < iLen; i++) {
            var mesh = this._meshes.getWeakRef(i);
            mesh.contextGain(context);
          }
          _super.prototype.contextGain.call(this, context);
        };
        DrawList.prototype.contextLost = function() {
          var iLen = this._meshes.length;
          for (var i = 0; i < iLen; i++) {
            var mesh = this._meshes.getWeakRef(i);
            mesh.contextLost();
          }
          _super.prototype.contextLost.call(this);
        };
        return DrawList;
      })(ShareableContextListener_1.default);
      exports_1("default", DrawList);
    }
  };
});

System.register("davinci-eight/facets/viewArray.js", ["../math/Vector3", "../checks/mustSatisfy", "../checks/isDefined"], function(exports_1) {
  var Vector3_1,
      mustSatisfy_1,
      isDefined_1;
  var n,
      u,
      v;
  function viewArray(eye, look, up, matrix) {
    var m = isDefined_1.default(matrix) ? matrix : new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    mustSatisfy_1.default('matrix', m.length === 16, function() {
      return 'matrix must have length 16';
    });
    n.copy(eye).sub(look);
    if (n.x === 0 && n.y === 0 && n.z === 0) {
      n.z = 1;
    } else {
      n.direction();
    }
    u.copy(up).cross(n);
    v.copy(n).cross(u);
    m[0x0] = u.x;
    m[0x4] = u.y;
    m[0x8] = u.z;
    m[0xC] = -Vector3_1.default.dot(eye, u);
    m[0x1] = v.x;
    m[0x5] = v.y;
    m[0x9] = v.z;
    m[0xD] = -Vector3_1.default.dot(eye, v);
    m[0x2] = n.x;
    m[0x6] = n.y;
    m[0xA] = n.z;
    m[0xE] = -Vector3_1.default.dot(eye, n);
    m[0x3] = 0;
    m[0x7] = 0;
    m[0xB] = 0;
    m[0xF] = 1;
    return m;
  }
  exports_1("default", viewArray);
  return {
    setters: [function(Vector3_1_1) {
      Vector3_1 = Vector3_1_1;
    }, function(mustSatisfy_1_1) {
      mustSatisfy_1 = mustSatisfy_1_1;
    }, function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }],
    execute: function() {
      n = new Vector3_1.default();
      u = new Vector3_1.default();
      v = new Vector3_1.default();
    }
  };
});

System.register("davinci-eight/facets/viewMatrix.js", ["../checks/isDefined", "../math/Matrix4", "./viewArray"], function(exports_1) {
  var isDefined_1,
      Matrix4_1,
      viewArray_1;
  function viewMatrix(eye, look, up, matrix) {
    var m = isDefined_1.default(matrix) ? matrix : Matrix4_1.default.one();
    viewArray_1.default(eye, look, up, m.elements);
    return m;
  }
  exports_1("default", viewMatrix);
  return {
    setters: [function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }, function(Matrix4_1_1) {
      Matrix4_1 = Matrix4_1_1;
    }, function(viewArray_1_1) {
      viewArray_1 = viewArray_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/facets/createView.js", ["../math/G3", "../math/Vector3", "../math/Matrix4", "../checks/mustBeNumber", "../checks/mustBeObject", "../core/GraphicsProgramSymbols", "../checks/isUndefined", "./viewMatrix", "../i18n/readOnly"], function(exports_1) {
  var G3_1,
      Vector3_1,
      Matrix4_1,
      mustBeNumber_1,
      mustBeObject_1,
      GraphicsProgramSymbols_1,
      isUndefined_1,
      viewMatrix_1,
      readOnly_1;
  function createView(options) {
    var eye = new Vector3_1.default();
    var look = new Vector3_1.default();
    var up = Vector3_1.default.copy(G3_1.default.e2);
    var viewMatrix = Matrix4_1.default.one();
    var viewMatrixName = isUndefined_1.default(options.viewMatrixName) ? GraphicsProgramSymbols_1.default.UNIFORM_VIEW_MATRIX : options.viewMatrixName;
    eye.modified = true;
    look.modified = true;
    up.modified = true;
    var self = {
      setProperty: function(name, value) {
        return self;
      },
      get eye() {
        return eye;
      },
      set eye(value) {
        self.setEye(value);
      },
      setEye: function(eye_) {
        mustBeObject_1.default('eye', eye_);
        eye.x = mustBeNumber_1.default('eye.x', eye_.x);
        eye.y = mustBeNumber_1.default('eye.y', eye_.y);
        eye.z = mustBeNumber_1.default('eye.z', eye_.z);
        return self;
      },
      get look() {
        return look;
      },
      set look(value) {
        self.setLook(value);
      },
      setLook: function(value) {
        mustBeObject_1.default('look', value);
        look.x = value.x;
        look.y = value.y;
        look.z = value.z;
        return self;
      },
      get up() {
        return up;
      },
      set up(value) {
        self.setUp(value);
      },
      setUp: function(value) {
        mustBeObject_1.default('up', value);
        up.x = value.x;
        up.y = value.y;
        up.z = value.z;
        up.direction();
        return self;
      },
      get viewMatrix() {
        return viewMatrix;
      },
      set viewMatrix(unused) {
        throw new Error(readOnly_1.default('viewMatrix').message);
      },
      setUniforms: function(visitor) {
        if (eye.modified || look.modified || up.modified) {
          viewMatrix_1.default(eye, look, up, viewMatrix);
          eye.modified = false;
          look.modified = false;
          up.modified = false;
        }
        visitor.mat4(viewMatrixName, viewMatrix, false);
      }
    };
    return self;
  }
  exports_1("default", createView);
  return {
    setters: [function(G3_1_1) {
      G3_1 = G3_1_1;
    }, function(Vector3_1_1) {
      Vector3_1 = Vector3_1_1;
    }, function(Matrix4_1_1) {
      Matrix4_1 = Matrix4_1_1;
    }, function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }, function(mustBeObject_1_1) {
      mustBeObject_1 = mustBeObject_1_1;
    }, function(GraphicsProgramSymbols_1_1) {
      GraphicsProgramSymbols_1 = GraphicsProgramSymbols_1_1;
    }, function(isUndefined_1_1) {
      isUndefined_1 = isUndefined_1_1;
    }, function(viewMatrix_1_1) {
      viewMatrix_1 = viewMatrix_1_1;
    }, function(readOnly_1_1) {
      readOnly_1 = readOnly_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/facets/frustumMatrix.js", ["../checks/expectArg", "../checks/isDefined"], function(exports_1) {
  var expectArg_1,
      isDefined_1;
  function frustumMatrix(left, right, bottom, top, near, far, matrix) {
    expectArg_1.default('left', left).toBeNumber();
    expectArg_1.default('right', right).toBeNumber();
    expectArg_1.default('bottom', bottom).toBeNumber();
    expectArg_1.default('top', top).toBeNumber();
    expectArg_1.default('near', near).toBeNumber();
    expectArg_1.default('far', far).toBeNumber();
    var m = isDefined_1.default(matrix) ? matrix : new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
    expectArg_1.default('m', m).toSatisfy(m.length === 16, 'elements must have length 16');
    var x = 2 * near / (right - left);
    var y = 2 * near / (top - bottom);
    var a = (right + left) / (right - left);
    var b = (top + bottom) / (top - bottom);
    var c = -(far + near) / (far - near);
    var d = -2 * far * near / (far - near);
    m[0x0] = x;
    m[0x4] = 0;
    m[0x8] = a;
    m[0xC] = 0;
    m[0x1] = 0;
    m[0x5] = y;
    m[0x9] = b;
    m[0xD] = 0;
    m[0x2] = 0;
    m[0x6] = 0;
    m[0xA] = c;
    m[0xE] = d;
    m[0x3] = 0;
    m[0x7] = 0;
    m[0xB] = -1;
    m[0xF] = 0;
    return m;
  }
  exports_1("default", frustumMatrix);
  return {
    setters: [function(expectArg_1_1) {
      expectArg_1 = expectArg_1_1;
    }, function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/facets/perspectiveArray.js", ["./frustumMatrix", "../checks/expectArg"], function(exports_1) {
  var frustumMatrix_1,
      expectArg_1;
  function perspectiveArray(fov, aspect, near, far, matrix) {
    expectArg_1.default('fov', fov).toBeNumber();
    expectArg_1.default('aspect', aspect).toBeNumber();
    expectArg_1.default('near', near).toBeNumber();
    expectArg_1.default('far', far).toBeNumber();
    var ymax = near * Math.tan(fov * 0.5);
    var ymin = -ymax;
    var xmin = ymin * aspect;
    var xmax = ymax * aspect;
    return frustumMatrix_1.default(xmin, xmax, ymin, ymax, near, far, matrix);
  }
  exports_1("default", perspectiveArray);
  return {
    setters: [function(frustumMatrix_1_1) {
      frustumMatrix_1 = frustumMatrix_1_1;
    }, function(expectArg_1_1) {
      expectArg_1 = expectArg_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/facets/perspectiveMatrix.js", ["../checks/isDefined", "../math/Matrix4", "./perspectiveArray"], function(exports_1) {
  var isDefined_1,
      Matrix4_1,
      perspectiveArray_1;
  function perspectiveMatrix(fov, aspect, near, far, matrix) {
    var m = isDefined_1.default(matrix) ? matrix : Matrix4_1.default.one();
    perspectiveArray_1.default(fov, aspect, near, far, m.elements);
    return m;
  }
  exports_1("default", perspectiveMatrix);
  return {
    setters: [function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }, function(Matrix4_1_1) {
      Matrix4_1 = Matrix4_1_1;
    }, function(perspectiveArray_1_1) {
      perspectiveArray_1 = perspectiveArray_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/facets/createPerspective.js", ["./createView", "../math/Matrix4", "../core/GraphicsProgramSymbols", "../i18n/readOnly", "../math/Vector1", "../checks/isUndefined", "../checks/mustBeNumber", "./perspectiveMatrix"], function(exports_1) {
  var createView_1,
      Matrix4_1,
      GraphicsProgramSymbols_1,
      readOnly_1,
      Vector1_1,
      isUndefined_1,
      mustBeNumber_1,
      perspectiveMatrix_1;
  function createPerspective(options) {
    options = options || {};
    var fov = new Vector1_1.default([isUndefined_1.default(options.fov) ? 75 * Math.PI / 180 : options.fov]);
    var aspect = new Vector1_1.default([isUndefined_1.default(options.aspect) ? 1 : options.aspect]);
    var near = new Vector1_1.default([isUndefined_1.default(options.near) ? 0.1 : options.near]);
    var far = new Vector1_1.default([mustBeNumber_1.default('options.far', isUndefined_1.default(options.far) ? 2000 : options.far)]);
    var projectionMatrixName = isUndefined_1.default(options.projectionMatrixName) ? GraphicsProgramSymbols_1.default.UNIFORM_PROJECTION_MATRIX : options.projectionMatrixName;
    var base = createView_1.default(options);
    var projectionMatrix = Matrix4_1.default.one();
    var matrixNeedsUpdate = true;
    var self = {
      setProperty: function(name, value) {
        return self;
      },
      get eye() {
        return base.eye;
      },
      set eye(eye) {
        base.eye = eye;
      },
      setEye: function(eye) {
        base.setEye(eye);
        return self;
      },
      get look() {
        return base.look;
      },
      set look(value) {
        base.look = value;
      },
      setLook: function(look) {
        base.setLook(look);
        return self;
      },
      get up() {
        return base.up;
      },
      set up(value) {
        base.up = value;
      },
      setUp: function(up) {
        base.setUp(up);
        return self;
      },
      get fov() {
        return fov.x;
      },
      set fov(value) {
        self.setFov(value);
      },
      setFov: function(value) {
        mustBeNumber_1.default('fov', value);
        matrixNeedsUpdate = matrixNeedsUpdate || fov.x !== value;
        fov.x = value;
        return self;
      },
      get aspect() {
        return aspect.x;
      },
      set aspect(value) {
        self.setAspect(value);
      },
      setAspect: function(value) {
        mustBeNumber_1.default('aspect', value);
        matrixNeedsUpdate = matrixNeedsUpdate || aspect.x !== value;
        aspect.x = value;
        return self;
      },
      get near() {
        return near.x;
      },
      set near(value) {
        self.setNear(value);
      },
      setNear: function(value) {
        if (value !== near.x) {
          near.x = value;
          matrixNeedsUpdate = true;
        }
        return self;
      },
      get far() {
        return far.x;
      },
      set far(value) {
        self.setFar(value);
      },
      setFar: function(value) {
        if (value !== far.x) {
          far.x = value;
          matrixNeedsUpdate = true;
        }
        return self;
      },
      get projectionMatrix() {
        if (matrixNeedsUpdate) {
          perspectiveMatrix_1.default(fov.x, aspect.x, near.x, far.x, projectionMatrix);
          matrixNeedsUpdate = false;
        }
        return projectionMatrix;
      },
      set projectionMatrix(projectionMatrix) {
        throw new Error(readOnly_1.default('projectionMatrix').message);
      },
      get viewMatrix() {
        return base.viewMatrix;
      },
      set viewMatrix(viewMatrix) {
        base.viewMatrix = viewMatrix;
      },
      setUniforms: function(visitor) {
        if (matrixNeedsUpdate) {
          perspectiveMatrix_1.default(fov.x, aspect.x, near.x, far.x, projectionMatrix);
          matrixNeedsUpdate = false;
        }
        visitor.mat4(projectionMatrixName, projectionMatrix, false);
        base.setUniforms(visitor);
      }
    };
    return self;
  }
  exports_1("default", createPerspective);
  return {
    setters: [function(createView_1_1) {
      createView_1 = createView_1_1;
    }, function(Matrix4_1_1) {
      Matrix4_1 = Matrix4_1_1;
    }, function(GraphicsProgramSymbols_1_1) {
      GraphicsProgramSymbols_1 = GraphicsProgramSymbols_1_1;
    }, function(readOnly_1_1) {
      readOnly_1 = readOnly_1_1;
    }, function(Vector1_1_1) {
      Vector1_1 = Vector1_1_1;
    }, function(isUndefined_1_1) {
      isUndefined_1 = isUndefined_1_1;
    }, function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }, function(perspectiveMatrix_1_1) {
      perspectiveMatrix_1 = perspectiveMatrix_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/facets/PerspectiveCamera.js", ["./createPerspective", "../i18n/readOnly", "../checks/mustBeObject", "../checks/mustBeGE", "../checks/mustBeLE", "../checks/mustBeNumber", "../checks/mustBeString"], function(exports_1) {
  var createPerspective_1,
      readOnly_1,
      mustBeObject_1,
      mustBeGE_1,
      mustBeLE_1,
      mustBeNumber_1,
      mustBeString_1;
  var PerspectiveCamera;
  return {
    setters: [function(createPerspective_1_1) {
      createPerspective_1 = createPerspective_1_1;
    }, function(readOnly_1_1) {
      readOnly_1 = readOnly_1_1;
    }, function(mustBeObject_1_1) {
      mustBeObject_1 = mustBeObject_1_1;
    }, function(mustBeGE_1_1) {
      mustBeGE_1 = mustBeGE_1_1;
    }, function(mustBeLE_1_1) {
      mustBeLE_1 = mustBeLE_1_1;
    }, function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }, function(mustBeString_1_1) {
      mustBeString_1 = mustBeString_1_1;
    }],
    execute: function() {
      PerspectiveCamera = (function() {
        function PerspectiveCamera(fov, aspect, near, far) {
          if (fov === void 0) {
            fov = 45 * Math.PI / 180;
          }
          if (aspect === void 0) {
            aspect = 1;
          }
          if (near === void 0) {
            near = 0.1;
          }
          if (far === void 0) {
            far = 2000;
          }
          mustBeNumber_1.default('fov', fov);
          mustBeGE_1.default('fov', fov, 0);
          mustBeLE_1.default('fov', fov, Math.PI);
          mustBeNumber_1.default('aspect', aspect);
          mustBeGE_1.default('aspect', aspect, 0);
          mustBeNumber_1.default('near', near);
          mustBeGE_1.default('near', near, 0);
          mustBeNumber_1.default('far', far);
          mustBeGE_1.default('far', far, 0);
          this.inner = createPerspective_1.default({
            fov: fov,
            aspect: aspect,
            near: near,
            far: far
          });
        }
        PerspectiveCamera.prototype.setUniforms = function(visitor) {
          this.inner.setNear(this.near);
          this.inner.setFar(this.far);
          this.inner.setUniforms(visitor);
        };
        PerspectiveCamera.prototype.getProperty = function(name) {
          mustBeString_1.default('name', name);
          switch (name) {
            case PerspectiveCamera.PROP_EYE:
            case PerspectiveCamera.PROP_POSITION:
              {
                return this.eye.coords;
              }
              break;
            default:
              {}
          }
        };
        PerspectiveCamera.prototype.setProperty = function(name, value) {
          mustBeString_1.default('name', name);
          mustBeObject_1.default('value', value);
          switch (name) {
            case PerspectiveCamera.PROP_EYE:
            case PerspectiveCamera.PROP_POSITION:
              {
                this.eye.copyCoordinates(value);
              }
              break;
            default:
              {}
          }
          return this;
        };
        Object.defineProperty(PerspectiveCamera.prototype, "aspect", {
          get: function() {
            return this.inner.aspect;
          },
          enumerable: true,
          configurable: true
        });
        PerspectiveCamera.prototype.setAspect = function(aspect) {
          this.inner.aspect = aspect;
          return this;
        };
        Object.defineProperty(PerspectiveCamera.prototype, "eye", {
          get: function() {
            return this.inner.eye;
          },
          set: function(eye) {
            this.inner.eye.copy(eye);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(PerspectiveCamera.prototype, "position", {
          get: function() {
            return this.inner.eye;
          },
          set: function(position) {
            this.inner.eye.copy(position);
          },
          enumerable: true,
          configurable: true
        });
        PerspectiveCamera.prototype.setEye = function(eye) {
          this.inner.setEye(eye);
          return this;
        };
        Object.defineProperty(PerspectiveCamera.prototype, "fov", {
          get: function() {
            return this.inner.fov;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('fov').message);
          },
          enumerable: true,
          configurable: true
        });
        PerspectiveCamera.prototype.setFov = function(fov) {
          mustBeNumber_1.default('fov', fov);
          this.inner.fov = fov;
          return this;
        };
        Object.defineProperty(PerspectiveCamera.prototype, "look", {
          get: function() {
            return this.inner.look;
          },
          enumerable: true,
          configurable: true
        });
        PerspectiveCamera.prototype.setLook = function(look) {
          this.inner.setLook(look);
          return this;
        };
        Object.defineProperty(PerspectiveCamera.prototype, "near", {
          get: function() {
            return this.inner.near;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('near').message);
          },
          enumerable: true,
          configurable: true
        });
        PerspectiveCamera.prototype.setNear = function(near) {
          this.inner.setNear(near);
          return this;
        };
        Object.defineProperty(PerspectiveCamera.prototype, "far", {
          get: function() {
            return this.inner.far;
          },
          set: function(far) {
            this.inner.far = far;
          },
          enumerable: true,
          configurable: true
        });
        PerspectiveCamera.prototype.setFar = function(far) {
          this.inner.setFar(far);
          return this;
        };
        Object.defineProperty(PerspectiveCamera.prototype, "up", {
          get: function() {
            return this.inner.up;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('up').message);
          },
          enumerable: true,
          configurable: true
        });
        PerspectiveCamera.prototype.setUp = function(up) {
          this.inner.setUp(up);
          return this;
        };
        Object.defineProperty(PerspectiveCamera.prototype, "projectionMatrix", {
          get: function() {
            return this.inner.projectionMatrix;
          },
          set: function(projectionMatrix) {
            throw new Error(readOnly_1.default('projectionMatrix').message);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(PerspectiveCamera.prototype, "viewMatrix", {
          get: function() {
            return this.inner.viewMatrix;
          },
          set: function(viewMatrix) {
            this.inner.viewMatrix = viewMatrix;
          },
          enumerable: true,
          configurable: true
        });
        PerspectiveCamera.PROP_POSITION = 'X';
        PerspectiveCamera.PROP_EYE = 'eye';
        return PerspectiveCamera;
      })();
      exports_1("default", PerspectiveCamera);
    }
  };
});

System.register("davinci-eight/controls/MouseControls.js", ["../math/G2m", "../core/Shareable"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var G2m_1,
      Shareable_1;
  var MODE,
      keys,
      MouseControls;
  return {
    setters: [function(G2m_1_1) {
      G2m_1 = G2m_1_1;
    }, function(Shareable_1_1) {
      Shareable_1 = Shareable_1_1;
    }],
    execute: function() {
      MODE = {
        NONE: -1,
        ROTATE: 0,
        ZOOM: 1,
        PAN: 2,
        TOUCH_ROTATE: 3,
        TOUCH_ZOOM_PAN: 4
      };
      keys = [65, 83, 68];
      MouseControls = (function(_super) {
        __extends(MouseControls, _super);
        function MouseControls(type) {
          var _this = this;
          _super.call(this, type);
          this.enabled = true;
          this.noRotate = false;
          this.noZoom = false;
          this.noPan = false;
          this.minDistance = 0;
          this.maxDistance = Infinity;
          this.mode = MODE.NONE;
          this.prevMode = MODE.NONE;
          this.moveCurr = new G2m_1.default();
          this.movePrev = new G2m_1.default();
          this.zoomStart = new G2m_1.default();
          this.zoomEnd = new G2m_1.default();
          this.panStart = new G2m_1.default();
          this.panEnd = new G2m_1.default();
          this.screenLoc = new G2m_1.default();
          this.circleExt = new G2m_1.default();
          this.screenExt = new G2m_1.default();
          this.mouseOnCircle = new G2m_1.default();
          this.mouseOnScreen = new G2m_1.default();
          this.mousedown = function(event) {
            if (!_this.enabled) {
              return;
            }
            event.preventDefault();
            event.stopPropagation();
            if (_this.mode === MODE.NONE) {
              _this.mode = event.button;
            }
            if (_this.mode === MODE.ROTATE && !_this.noRotate) {
              _this.updateMouseOnCircle(event);
              _this.moveCurr.copy(_this.mouseOnCircle);
              _this.movePrev.copy(_this.mouseOnCircle);
            } else if (_this.mode === MODE.ZOOM && !_this.noZoom) {
              _this.updateMouseOnScreen(event);
              _this.zoomStart.copy(_this.mouseOnScreen);
              _this.zoomEnd.copy(_this.mouseOnScreen);
            } else if (_this.mode === MODE.PAN && !_this.noPan) {
              _this.updateMouseOnScreen(event);
              _this.panStart.copy(_this.mouseOnScreen);
              _this.panEnd.copy(_this.mouseOnScreen);
            }
            document.addEventListener('mousemove', _this.mousemove, false);
            document.addEventListener('mouseup', _this.mouseup, false);
          };
          this.mousemove = function(event) {
            if (!_this.enabled) {
              return;
            }
            event.preventDefault();
            event.stopPropagation();
            if (_this.mode === MODE.ROTATE && !_this.noRotate) {
              _this.movePrev.copy(_this.moveCurr);
              _this.updateMouseOnCircle(event);
              _this.moveCurr.copy(_this.mouseOnCircle);
            } else if (_this.mode === MODE.ZOOM && !_this.noZoom) {
              _this.updateMouseOnScreen(event);
              _this.zoomEnd.copy(_this.mouseOnScreen);
            } else if (_this.mode === MODE.PAN && !_this.noPan) {
              _this.updateMouseOnScreen(event);
              _this.panEnd.copy(_this.mouseOnScreen);
            }
          };
          this.mouseup = function(event) {
            if (!_this.enabled) {
              return;
            }
            event.preventDefault();
            event.stopPropagation();
            _this.mode = MODE.NONE;
            document.removeEventListener('mousemove', _this.mousemove);
            document.removeEventListener('mouseup', _this.mouseup);
          };
          this.mousewheel = function(event) {
            if (!_this.enabled) {
              return;
            }
            event.preventDefault();
            event.stopPropagation();
            var delta = 0;
            if (event.wheelDelta) {
              delta = event.wheelDelta / 40;
            } else if (event.detail) {
              delta = event.detail / 3;
            }
            _this.zoomStart.y += delta * 0.01;
          };
          this.keydown = function(event) {
            if (!_this.enabled) {
              return;
            }
            window.removeEventListener('keydown', _this.keydown, false);
            _this.prevMode = _this.mode;
            if (_this.mode !== MODE.NONE) {
              return;
            } else if (event.keyCode === keys[MODE.ROTATE] && !_this.noRotate) {
              _this.mode = MODE.ROTATE;
            } else if (event.keyCode === keys[MODE.ZOOM] && !_this.noRotate) {
              _this.mode = MODE.ZOOM;
            } else if (event.keyCode === keys[MODE.PAN] && !_this.noRotate) {
              _this.mode = MODE.PAN;
            }
          };
          this.keyup = function(event) {
            if (!_this.enabled) {
              return;
            }
            _this.mode = _this.prevMode;
            window.addEventListener('keydown', _this.keydown, false);
          };
          this.contextmenu = function(event) {
            event.preventDefault();
          };
        }
        MouseControls.prototype.subscribe = function(domElement) {
          if (this.domElement) {
            this.unsubscribe();
          }
          this.domElement = domElement;
          this.domElement.addEventListener('contextmenu', this.contextmenu, false);
          this.domElement.addEventListener('mousedown', this.mousedown, false);
          this.domElement.addEventListener('mousewheel', this.mousewheel, false);
          this.domElement.addEventListener('DOMMouseScroll', this.mousewheel, false);
          window.addEventListener('keydown', this.keydown, false);
          window.addEventListener('keyup', this.keydown, false);
          this.handleResize();
        };
        MouseControls.prototype.unsubscribe = function() {
          if (this.domElement) {
            this.domElement.removeEventListener('contextmenu', this.contextmenu, false);
            this.domElement.removeEventListener('mousedown', this.mousedown, false);
            this.domElement.removeEventListener('mousewheel', this.mousewheel, false);
            this.domElement.removeEventListener('DOMMouseScroll', this.mousewheel, false);
            this.domElement = void 0;
            window.removeEventListener('keydown', this.keydown, false);
            window.removeEventListener('keyup', this.keydown, false);
          }
        };
        MouseControls.prototype.destructor = function() {
          this.domElement.removeEventListener('contextmenu', this.contextmenu, false);
          this.domElement.removeEventListener('mousedown', this.mousedown, false);
          this.domElement.removeEventListener('mousewheel', this.mousewheel, false);
          this.domElement.removeEventListener('DOMMouseScroll', this.mousewheel, false);
          window.removeEventListener('keydown', this.keydown, false);
          window.removeEventListener('keyup', this.keydown, false);
          _super.prototype.destructor.call(this);
        };
        MouseControls.prototype.reset = function() {
          this.mode = MODE.NONE;
        };
        MouseControls.prototype.updateMouseOnCircle = function(mouse) {
          this.mouseOnCircle.x = mouse.pageX;
          this.mouseOnCircle.y = -mouse.pageY;
          this.mouseOnCircle.sub(this.screenLoc).scale(2).sub(this.circleExt).divByScalar(this.circleExt.x);
        };
        MouseControls.prototype.updateMouseOnScreen = function(mouse) {
          this.mouseOnScreen.x = mouse.pageX;
          this.mouseOnScreen.y = -mouse.pageY;
          this.mouseOnScreen.sub(this.screenLoc);
          this.mouseOnScreen.x /= this.circleExt.x;
          this.mouseOnScreen.y /= this.circleExt.y;
        };
        MouseControls.prototype.handleResize = function() {
          if (false) {} else {
            var box = this.domElement.getBoundingClientRect();
            var domElement = this.domElement.ownerDocument.documentElement;
            this.screenLoc.x = box.left + window.pageXOffset - domElement.clientLeft;
            this.screenLoc.y = -(box.top + window.pageYOffset - domElement.clientTop);
            this.circleExt.x = box.width;
            this.circleExt.y = -box.height;
            this.screenExt.x = box.width;
            this.screenExt.y = box.height;
          }
        };
        return MouseControls;
      })(Shareable_1.default);
      exports_1("default", MouseControls);
    }
  };
});

System.register("davinci-eight/controls/CameraControls.js", ["../math/G3m", "./MouseControls", "../math/Vector2", "../math/Vector3"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var G3m_1,
      MouseControls_1,
      Vector2_1,
      Vector3_1;
  var CameraControls;
  return {
    setters: [function(G3m_1_1) {
      G3m_1 = G3m_1_1;
    }, function(MouseControls_1_1) {
      MouseControls_1 = MouseControls_1_1;
    }, function(Vector2_1_1) {
      Vector2_1 = Vector2_1_1;
    }, function(Vector3_1_1) {
      Vector3_1 = Vector3_1_1;
    }],
    execute: function() {
      CameraControls = (function(_super) {
        __extends(CameraControls, _super);
        function CameraControls(camera) {
          _super.call(this, 'CameraControls');
          this.rotateSpeed = 1;
          this.zoomSpeed = 1;
          this.panSpeed = 1;
          this.eye = new Vector3_1.default();
          this.target = new G3m_1.default();
          this.moveDirection = new Vector3_1.default();
          this.eyeDirection = new Vector3_1.default();
          this.objectUpDirection = new Vector3_1.default();
          this.objectSidewaysDirection = new Vector3_1.default();
          this.axis = new Vector3_1.default();
          this.rotor = new G3m_1.default();
          this.mouseChange = new Vector2_1.default();
          this.pan = new Vector3_1.default();
          this.objectUp = new Vector3_1.default();
          this.camera = camera;
          this.target0 = this.target.clone();
          this.position0 = this.camera.position.clone();
          this.up0 = this.camera.up.clone();
          this.update();
        }
        CameraControls.prototype.destructor = function() {
          _super.prototype.destructor.call(this);
        };
        CameraControls.prototype.reset = function() {
          this.target.copy(this.target0);
          this.camera.position.copy(this.position0);
          this.camera.up.copy(this.up0);
          this.eye.copy(this.camera.position).sub(this.target);
          this.camera.look.copy(this.target);
          _super.prototype.reset.call(this);
        };
        CameraControls.prototype.update = function() {
          this.eye.copy(this.camera.position).sub(this.target);
          if (!this.noRotate) {
            this.rotateCamera();
          }
          if (!this.noZoom) {
            this.zoomCamera();
          }
          if (!this.noPan) {
            this.panCamera();
          }
          this.camera.position.copy(this.target).add(this.eye);
          this.checkDistances();
          this.camera.look.copy(this.target);
        };
        CameraControls.prototype.rotateCamera = function() {
          this.moveDirection.setXYZ(this.moveCurr.x - this.movePrev.x, this.moveCurr.y - this.movePrev.y, 0);
          var angle = this.moveDirection.magnitude();
          if (angle) {
            this.eye.copy(this.camera.position).sub(this.target);
            this.eyeDirection.copy(this.eye).direction();
            this.objectUpDirection.copy(this.camera.up).direction();
            this.objectSidewaysDirection.copy(this.objectUpDirection).cross(this.eyeDirection);
            this.objectUpDirection.scale(this.moveCurr.y - this.movePrev.y);
            this.objectSidewaysDirection.scale(this.moveCurr.x - this.movePrev.x);
            this.moveDirection.copy(this.objectUpDirection).add(this.objectSidewaysDirection).direction();
            this.axis.copy(this.moveDirection).cross(this.eyeDirection);
            angle *= this.rotateSpeed;
            this.rotor.rotorFromAxisAngle(this.axis, angle);
            this.eye.rotate(this.rotor);
            this.camera.up.rotate(this.rotor);
          }
          this.movePrev.copy(this.moveCurr);
        };
        CameraControls.prototype.zoomCamera = function() {
          var factor = 1 + (this.zoomEnd.y - this.zoomStart.y) * this.zoomSpeed;
          if (factor !== 1 && factor > 0) {
            this.eye.scale(factor);
            this.zoomStart.copy(this.zoomEnd);
          }
        };
        CameraControls.prototype.panCamera = function() {
          this.mouseChange.copy(this.panEnd).sub(this.panStart);
          if (this.mouseChange.squaredNorm()) {
            this.mouseChange.scale(this.eye.magnitude() * this.panSpeed);
            this.pan.copy(this.eye).cross(this.camera.up).direction().scale(this.mouseChange.x);
            this.objectUp.copy(this.camera.up).direction().scale(this.mouseChange.y);
            this.pan.add(this.objectUp);
            this.camera.position.add(this.pan);
            this.target.addVector(this.pan);
            this.panStart.copy(this.panEnd);
          }
        };
        CameraControls.prototype.checkDistances = function() {};
        return CameraControls;
      })(MouseControls_1.default);
      exports_1("default", CameraControls);
    }
  };
});

System.register("davinci-eight/visual/Arrow.js", ["../math/G3", "../checks/mustBeNumber", "../checks/mustBeObject", "../checks/mustBeGE", "./visualCache", "./VisualBody"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var G3_1,
      mustBeNumber_1,
      mustBeObject_1,
      mustBeGE_1,
      visualCache_1,
      VisualBody_1;
  var Arrow;
  return {
    setters: [function(G3_1_1) {
      G3_1 = G3_1_1;
    }, function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }, function(mustBeObject_1_1) {
      mustBeObject_1 = mustBeObject_1_1;
    }, function(mustBeGE_1_1) {
      mustBeGE_1 = mustBeGE_1_1;
    }, function(visualCache_1_1) {
      visualCache_1 = visualCache_1_1;
    }, function(VisualBody_1_1) {
      VisualBody_1 = VisualBody_1_1;
    }],
    execute: function() {
      Arrow = (function(_super) {
        __extends(Arrow, _super);
        function Arrow(options) {
          if (options === void 0) {
            options = {};
          }
          _super.call(this, visualCache_1.default.arrow(options), visualCache_1.default.material(options), 'Arrow');
          this._geometry.release();
          this._material.release();
        }
        Arrow.prototype.destructor = function() {
          _super.prototype.destructor.call(this);
        };
        Object.defineProperty(Arrow.prototype, "axis", {
          get: function() {
            var direction = G3_1.default.e2.rotate(this.attitude);
            return direction.scale(this.length);
          },
          set: function(axis) {
            mustBeObject_1.default('axis', axis);
            this.attitude.rotorFromDirections(G3_1.default.e2, axis.direction());
            this.length = axis.magnitude().α;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Arrow.prototype, "length", {
          get: function() {
            return this.getScaleY();
          },
          set: function(length) {
            mustBeNumber_1.default('length', length);
            mustBeGE_1.default('length', length, 0);
            this.setScaleX(length);
            this.setScaleY(length);
            this.setScaleZ(length);
          },
          enumerable: true,
          configurable: true
        });
        return Arrow;
      })(VisualBody_1.default);
      exports_1("default", Arrow);
    }
  };
});

System.register("davinci-eight/visual/Box.js", ["../checks/isDefined", "../checks/mustBeNumber", "./visualCache", "./VisualBody"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var isDefined_1,
      mustBeNumber_1,
      visualCache_1,
      VisualBody_1;
  var Box;
  return {
    setters: [function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }, function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }, function(visualCache_1_1) {
      visualCache_1 = visualCache_1_1;
    }, function(VisualBody_1_1) {
      VisualBody_1 = VisualBody_1_1;
    }],
    execute: function() {
      Box = (function(_super) {
        __extends(Box, _super);
        function Box(options) {
          if (options === void 0) {
            options = {};
          }
          _super.call(this, visualCache_1.default.box(options), visualCache_1.default.material(options), 'Box');
          this._geometry.release();
          this._material.release();
          this.width = isDefined_1.default(options.width) ? mustBeNumber_1.default('width', options.width) : 1;
          this.height = isDefined_1.default(options.height) ? mustBeNumber_1.default('height', options.height) : 1;
          this.depth = isDefined_1.default(options.depth) ? mustBeNumber_1.default('depth', options.depth) : 1;
        }
        Box.prototype.destructor = function() {
          _super.prototype.destructor.call(this);
        };
        Object.defineProperty(Box.prototype, "width", {
          get: function() {
            return this.getScaleX();
          },
          set: function(width) {
            mustBeNumber_1.default('width', width);
            this.setScaleX(width);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Box.prototype, "height", {
          get: function() {
            return this.getScaleY();
          },
          set: function(height) {
            mustBeNumber_1.default('height', height);
            this.setScaleY(height);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Box.prototype, "depth", {
          get: function() {
            return this.getScaleZ();
          },
          set: function(depth) {
            mustBeNumber_1.default('depth', depth);
            this.setScaleZ(depth);
          },
          enumerable: true,
          configurable: true
        });
        return Box;
      })(VisualBody_1.default);
      exports_1("default", Box);
    }
  };
});

System.register("davinci-eight/visual/Cylinder.js", ["../core", "../math/G3", "../checks/mustBeNumber", "../checks/mustBeObject", "./visualCache", "./VisualBody"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var core_1,
      G3_1,
      mustBeNumber_1,
      mustBeObject_1,
      visualCache_1,
      VisualBody_1;
  var Cylinder;
  return {
    setters: [function(core_1_1) {
      core_1 = core_1_1;
    }, function(G3_1_1) {
      G3_1 = G3_1_1;
    }, function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }, function(mustBeObject_1_1) {
      mustBeObject_1 = mustBeObject_1_1;
    }, function(visualCache_1_1) {
      visualCache_1 = visualCache_1_1;
    }, function(VisualBody_1_1) {
      VisualBody_1 = VisualBody_1_1;
    }],
    execute: function() {
      Cylinder = (function(_super) {
        __extends(Cylinder, _super);
        function Cylinder(options) {
          if (options === void 0) {
            options = {};
          }
          _super.call(this, visualCache_1.default.cylinder(options), visualCache_1.default.material(options), 'Cylinder');
          this._geometry.release();
          this._material.release();
        }
        Cylinder.prototype.destructor = function() {
          _super.prototype.destructor.call(this);
        };
        Object.defineProperty(Cylinder.prototype, "axis", {
          get: function() {
            var direction = G3_1.default.e2.rotate(this.attitude);
            return direction.scale(this.length);
          },
          set: function(axis) {
            if (core_1.default.safemode) {
              mustBeObject_1.default('axis', axis);
            }
            this.attitude.rotorFromDirections(G3_1.default.e2, axis.direction());
            this.length = axis.magnitude().α;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Cylinder.prototype, "radius", {
          get: function() {
            return this.getScaleX();
          },
          set: function(radius) {
            if (core_1.default.safemode) {
              mustBeNumber_1.default('radius', radius);
            }
            this.setScaleX(radius);
            this.setScaleZ(radius);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Cylinder.prototype, "length", {
          get: function() {
            return this.getScaleY();
          },
          set: function(length) {
            if (core_1.default.safemode) {
              mustBeNumber_1.default('length', length);
            }
            this.setScaleY(length);
          },
          enumerable: true,
          configurable: true
        });
        return Cylinder;
      })(VisualBody_1.default);
      exports_1("default", Cylinder);
    }
  };
});

System.register("davinci-eight/facets/AmbientLight.js", ["../core/Color", "../checks/mustBeArray", "../checks/mustBeNumber", "../checks/mustBeObject", "../checks/mustBeString", "../core/GraphicsProgramSymbols"], function(exports_1) {
  var Color_1,
      mustBeArray_1,
      mustBeNumber_1,
      mustBeObject_1,
      mustBeString_1,
      GraphicsProgramSymbols_1;
  var LOGGING_NAME,
      AmbientLight;
  function contextBuilder() {
    return LOGGING_NAME;
  }
  return {
    setters: [function(Color_1_1) {
      Color_1 = Color_1_1;
    }, function(mustBeArray_1_1) {
      mustBeArray_1 = mustBeArray_1_1;
    }, function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }, function(mustBeObject_1_1) {
      mustBeObject_1 = mustBeObject_1_1;
    }, function(mustBeString_1_1) {
      mustBeString_1 = mustBeString_1_1;
    }, function(GraphicsProgramSymbols_1_1) {
      GraphicsProgramSymbols_1 = GraphicsProgramSymbols_1_1;
    }],
    execute: function() {
      LOGGING_NAME = 'AmbientLight';
      AmbientLight = (function() {
        function AmbientLight(color) {
          mustBeObject_1.default('color', color);
          this.color = Color_1.default.white.clone();
          this.color.r = mustBeNumber_1.default('color.r', color.r);
          this.color.g = mustBeNumber_1.default('color.g', color.g);
          this.color.b = mustBeNumber_1.default('color.b', color.b);
        }
        AmbientLight.prototype.getProperty = function(name) {
          return void 0;
        };
        AmbientLight.prototype.setProperty = function(name, value) {
          mustBeString_1.default('name', name, contextBuilder);
          mustBeArray_1.default('value', value, contextBuilder);
          return this;
        };
        AmbientLight.prototype.setUniforms = function(visitor) {
          var coords = [this.color.r, this.color.g, this.color.b];
          visitor.vector3(GraphicsProgramSymbols_1.default.UNIFORM_AMBIENT_LIGHT, coords);
        };
        return AmbientLight;
      })();
      exports_1("default", AmbientLight);
    }
  };
});

System.register("davinci-eight/geometries/ConeGeometry.js", ["./AxialPrimitivesBuilder", "../core/GraphicsProgramSymbols", "./GridTopology", "../math/Vector2", "../math/Vector3"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var AxialPrimitivesBuilder_1,
      GraphicsProgramSymbols_1,
      GridTopology_1,
      Vector2_1,
      Vector3_1;
  var ConeGeometry;
  return {
    setters: [function(AxialPrimitivesBuilder_1_1) {
      AxialPrimitivesBuilder_1 = AxialPrimitivesBuilder_1_1;
    }, function(GraphicsProgramSymbols_1_1) {
      GraphicsProgramSymbols_1 = GraphicsProgramSymbols_1_1;
    }, function(GridTopology_1_1) {
      GridTopology_1 = GridTopology_1_1;
    }, function(Vector2_1_1) {
      Vector2_1 = Vector2_1_1;
    }, function(Vector3_1_1) {
      Vector3_1 = Vector3_1_1;
    }],
    execute: function() {
      ConeGeometry = (function(_super) {
        __extends(ConeGeometry, _super);
        function ConeGeometry(axis, sliceStart) {
          _super.call(this, axis, sliceStart);
          this.radius = 1;
          this.height = 1;
          this.thetaSegments = 16;
        }
        ConeGeometry.prototype.setAxis = function(axis) {
          _super.prototype.setAxis.call(this, axis);
          return this;
        };
        ConeGeometry.prototype.setPosition = function(position) {
          _super.prototype.setPosition.call(this, position);
          return this;
        };
        ConeGeometry.prototype.toPrimitives = function() {
          var topo = new GridTopology_1.default(this.thetaSegments, 1);
          var uLength = topo.uLength;
          var uSegments = uLength - 1;
          var vLength = topo.vLength;
          var vSegments = vLength - 1;
          var a = Vector3_1.default.copy(this.sliceStart).direction().scale(this.radius);
          var b = new Vector3_1.default().cross2(a, this.axis).direction().scale(this.radius);
          var h = Vector3_1.default.copy(this.axis).scale(this.height);
          for (var uIndex = 0; uIndex < uLength; uIndex++) {
            var u = uIndex / uSegments;
            var theta = this.sliceAngle * u;
            var cosTheta = Math.cos(theta);
            var sinTheta = Math.sin(theta);
            for (var vIndex = 0; vIndex < vLength; vIndex++) {
              var v = vIndex / vSegments;
              var position = new Vector3_1.default().add(a, cosTheta * (1 - v)).add(b, sinTheta * (1 - v)).add(h, v);
              var peak = Vector3_1.default.copy(h).sub(position);
              var normal = new Vector3_1.default().cross2(peak, position).cross(peak).direction();
              var vertex = topo.vertex(uIndex, vIndex);
              vertex.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = position.add(this.position);
              vertex.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = normal;
              if (this.useTextureCoords) {
                vertex.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_TEXTURE_COORDS] = new Vector2_1.default([u, v]);
              }
            }
          }
          return [topo.toDrawPrimitive()];
        };
        ConeGeometry.prototype.enableTextureCoords = function(enable) {
          _super.prototype.enableTextureCoords.call(this, enable);
          return this;
        };
        return ConeGeometry;
      })(AxialPrimitivesBuilder_1.default);
      exports_1("default", ConeGeometry);
    }
  };
});

System.register("davinci-eight/geometries/CylinderPrimitivesBuilder.js", ["./AxialPrimitivesBuilder", "../core/GraphicsProgramSymbols", "./GridTopology", "../math/Spinor3", "../math/Vector2", "../math/Vector3"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var AxialPrimitivesBuilder_1,
      GraphicsProgramSymbols_1,
      GridTopology_1,
      Spinor3_1,
      Vector2_1,
      Vector3_1;
  var CylinderPrimitivesBuilder;
  return {
    setters: [function(AxialPrimitivesBuilder_1_1) {
      AxialPrimitivesBuilder_1 = AxialPrimitivesBuilder_1_1;
    }, function(GraphicsProgramSymbols_1_1) {
      GraphicsProgramSymbols_1 = GraphicsProgramSymbols_1_1;
    }, function(GridTopology_1_1) {
      GridTopology_1 = GridTopology_1_1;
    }, function(Spinor3_1_1) {
      Spinor3_1 = Spinor3_1_1;
    }, function(Vector2_1_1) {
      Vector2_1 = Vector2_1_1;
    }, function(Vector3_1_1) {
      Vector3_1 = Vector3_1_1;
    }],
    execute: function() {
      CylinderPrimitivesBuilder = (function(_super) {
        __extends(CylinderPrimitivesBuilder, _super);
        function CylinderPrimitivesBuilder(axis, sliceStart) {
          _super.call(this, axis, sliceStart);
          this.radius = 1;
          this.height = 1;
          this.thetaSegments = 16;
        }
        CylinderPrimitivesBuilder.prototype.setAxis = function(axis) {
          _super.prototype.setAxis.call(this, axis);
          return this;
        };
        CylinderPrimitivesBuilder.prototype.setPosition = function(position) {
          _super.prototype.setPosition.call(this, position);
          return this;
        };
        CylinderPrimitivesBuilder.prototype.toPrimitives = function() {
          var uSegments = this.thetaSegments;
          var vSegments = 1;
          var topo = new GridTopology_1.default(uSegments, vSegments);
          var axis = this.axis;
          var generator = Spinor3_1.default.dual(axis);
          for (var uIndex = 0; uIndex < topo.uLength; uIndex++) {
            var u = uIndex / uSegments;
            var rotor = generator.clone().scale(this.sliceAngle * u / 2).exp();
            for (var vIndex = 0; vIndex < topo.vLength; vIndex++) {
              var v = vIndex / vSegments;
              var normal = Vector3_1.default.copy(this.sliceStart).rotate(rotor);
              var position = normal.clone().scale(this.radius).add(this.axis, v * this.height);
              var vertex = topo.vertex(uIndex, vIndex);
              vertex.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = position.add(this.position);
              vertex.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = normal;
              if (this.useTextureCoords) {
                vertex.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_TEXTURE_COORDS] = new Vector2_1.default([u, v]);
              }
            }
          }
          return [topo.toDrawPrimitive()];
        };
        CylinderPrimitivesBuilder.prototype.enableTextureCoords = function(enable) {
          _super.prototype.enableTextureCoords.call(this, enable);
          return this;
        };
        return CylinderPrimitivesBuilder;
      })(AxialPrimitivesBuilder_1.default);
      exports_1("default", CylinderPrimitivesBuilder);
    }
  };
});

System.register("davinci-eight/geometries/AxialPrimitivesBuilder.js", ["../math/R3", "../geometries/PrimitivesBuilder", "../checks/mustBeNumber", "../checks/mustBeObject", "../math/Vector3"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var R3_1,
      PrimitivesBuilder_1,
      mustBeNumber_1,
      mustBeObject_1,
      Vector3_1;
  var AxialPrimitivesBuilder;
  return {
    setters: [function(R3_1_1) {
      R3_1 = R3_1_1;
    }, function(PrimitivesBuilder_1_1) {
      PrimitivesBuilder_1 = PrimitivesBuilder_1_1;
    }, function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }, function(mustBeObject_1_1) {
      mustBeObject_1 = mustBeObject_1_1;
    }, function(Vector3_1_1) {
      Vector3_1 = Vector3_1_1;
    }],
    execute: function() {
      AxialPrimitivesBuilder = (function(_super) {
        __extends(AxialPrimitivesBuilder, _super);
        function AxialPrimitivesBuilder(axis, sliceStart) {
          _super.call(this);
          this._sliceAngle = 2 * Math.PI;
          this.setAxis(axis);
          if (sliceStart) {
            this.setSliceStart(sliceStart);
          } else {
            this.setSliceStart(Vector3_1.default.random().cross(axis));
          }
        }
        Object.defineProperty(AxialPrimitivesBuilder.prototype, "axis", {
          get: function() {
            return this._axis;
          },
          set: function(axis) {
            this.setAxis(axis);
          },
          enumerable: true,
          configurable: true
        });
        AxialPrimitivesBuilder.prototype.setAxis = function(axis) {
          mustBeObject_1.default('axis', axis);
          this._axis = R3_1.default.direction(axis);
          this.setSliceStart(Vector3_1.default.random().cross(this._axis));
          return this;
        };
        Object.defineProperty(AxialPrimitivesBuilder.prototype, "sliceAngle", {
          get: function() {
            return this._sliceAngle;
          },
          set: function(sliceAngle) {
            mustBeNumber_1.default('sliceAngle', sliceAngle);
            this._sliceAngle = sliceAngle;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(AxialPrimitivesBuilder.prototype, "sliceStart", {
          get: function() {
            return this._sliceStart;
          },
          set: function(sliceStart) {
            this.setSliceStart(sliceStart);
          },
          enumerable: true,
          configurable: true
        });
        AxialPrimitivesBuilder.prototype.setPosition = function(position) {
          _super.prototype.setPosition.call(this, position);
          return this;
        };
        AxialPrimitivesBuilder.prototype.setSliceStart = function(sliceStart) {
          mustBeObject_1.default('sliceStart', sliceStart);
          this._sliceStart = R3_1.default.direction(sliceStart);
        };
        AxialPrimitivesBuilder.prototype.enableTextureCoords = function(enable) {
          _super.prototype.enableTextureCoords.call(this, enable);
          return this;
        };
        return AxialPrimitivesBuilder;
      })(PrimitivesBuilder_1.default);
      exports_1("default", AxialPrimitivesBuilder);
    }
  };
});

System.register("davinci-eight/geometries/RingBuilder.js", ["../core/GraphicsProgramSymbols", "./GridTopology", "./AxialPrimitivesBuilder", "../math/Vector2", "../math/G3m"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var GraphicsProgramSymbols_1,
      GridTopology_1,
      AxialPrimitivesBuilder_1,
      Vector2_1,
      G3m_1;
  var RingBuilder;
  return {
    setters: [function(GraphicsProgramSymbols_1_1) {
      GraphicsProgramSymbols_1 = GraphicsProgramSymbols_1_1;
    }, function(GridTopology_1_1) {
      GridTopology_1 = GridTopology_1_1;
    }, function(AxialPrimitivesBuilder_1_1) {
      AxialPrimitivesBuilder_1 = AxialPrimitivesBuilder_1_1;
    }, function(Vector2_1_1) {
      Vector2_1 = Vector2_1_1;
    }, function(G3m_1_1) {
      G3m_1 = G3m_1_1;
    }],
    execute: function() {
      RingBuilder = (function(_super) {
        __extends(RingBuilder, _super);
        function RingBuilder(axis, sliceStart) {
          _super.call(this, axis, sliceStart);
          this.innerRadius = 0;
          this.outerRadius = 1;
          this.thetaSegments = 16;
        }
        RingBuilder.prototype.setAxis = function(axis) {
          _super.prototype.setAxis.call(this, axis);
          return this;
        };
        RingBuilder.prototype.setPosition = function(position) {
          _super.prototype.setPosition.call(this, position);
          return this;
        };
        RingBuilder.prototype.toPrimitives = function() {
          var uSegments = this.thetaSegments;
          var vSegments = 1;
          var topo = new GridTopology_1.default(uSegments, vSegments);
          var a = this.outerRadius;
          var b = this.innerRadius;
          var axis = G3m_1.default.fromVector(this.axis);
          var start = G3m_1.default.fromVector(this.sliceStart);
          var generator = new G3m_1.default().dual(axis);
          for (var uIndex = 0; uIndex < topo.uLength; uIndex++) {
            var u = uIndex / uSegments;
            var rotor = generator.clone().scale(this.sliceAngle * u / 2).exp();
            for (var vIndex = 0; vIndex < topo.vLength; vIndex++) {
              var v = vIndex / vSegments;
              var position = start.clone().rotate(rotor).scale(b + (a - b) * v);
              var vertex = topo.vertex(uIndex, vIndex);
              vertex.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = position.addVector(this.position);
              vertex.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = axis;
              if (this.useTextureCoords) {
                vertex.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_TEXTURE_COORDS] = new Vector2_1.default([u, v]);
              }
            }
          }
          return [topo.toDrawPrimitive()];
        };
        RingBuilder.prototype.enableTextureCoords = function(enable) {
          _super.prototype.enableTextureCoords.call(this, enable);
          return this;
        };
        return RingBuilder;
      })(AxialPrimitivesBuilder_1.default);
      exports_1("default", RingBuilder);
    }
  };
});

System.register("davinci-eight/geometries/ArrowBuilder.js", ["../geometries/ConeGeometry", "../geometries/CylinderPrimitivesBuilder", "../geometries/AxialPrimitivesBuilder", "../geometries/RingBuilder", "../math/Vector3"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var ConeGeometry_1,
      CylinderPrimitivesBuilder_1,
      AxialPrimitivesBuilder_1,
      RingBuilder_1,
      Vector3_1;
  var ArrowBuilder;
  return {
    setters: [function(ConeGeometry_1_1) {
      ConeGeometry_1 = ConeGeometry_1_1;
    }, function(CylinderPrimitivesBuilder_1_1) {
      CylinderPrimitivesBuilder_1 = CylinderPrimitivesBuilder_1_1;
    }, function(AxialPrimitivesBuilder_1_1) {
      AxialPrimitivesBuilder_1 = AxialPrimitivesBuilder_1_1;
    }, function(RingBuilder_1_1) {
      RingBuilder_1 = RingBuilder_1_1;
    }, function(Vector3_1_1) {
      Vector3_1 = Vector3_1_1;
    }],
    execute: function() {
      ArrowBuilder = (function(_super) {
        __extends(ArrowBuilder, _super);
        function ArrowBuilder(axis, sliceStart) {
          _super.call(this, axis, sliceStart);
          this.heightCone = 0.20;
          this.radiusCone = 0.08;
          this.radiusShaft = 0.01;
          this.thetaSegments = 16;
        }
        ArrowBuilder.prototype.setPosition = function(position) {
          _super.prototype.setPosition.call(this, position);
          return this;
        };
        ArrowBuilder.prototype.setAxis = function(axis) {
          _super.prototype.setAxis.call(this, axis);
          return this;
        };
        ArrowBuilder.prototype.toPrimitives = function() {
          var heightShaft = 1 - this.heightCone;
          var back = Vector3_1.default.copy(this.axis).scale(-1);
          var neck = Vector3_1.default.copy(this.axis).scale(heightShaft).add(this.position);
          var tail = Vector3_1.default.copy(this.position);
          var cone = new ConeGeometry_1.default(this.axis, this.sliceStart);
          cone.radius = this.radiusCone;
          cone.height = this.heightCone;
          cone.setPosition(neck);
          cone.axis = this.axis;
          cone.sliceAngle = this.sliceAngle;
          cone.thetaSegments = this.thetaSegments;
          cone.useTextureCoords = this.useTextureCoords;
          var disc = new RingBuilder_1.default(back, this.sliceStart);
          disc.innerRadius = this.radiusShaft;
          disc.outerRadius = this.radiusCone;
          disc.setPosition(neck);
          disc.sliceAngle = -this.sliceAngle;
          disc.thetaSegments = this.thetaSegments;
          disc.useTextureCoords = this.useTextureCoords;
          var shaft = new CylinderPrimitivesBuilder_1.default(this.axis, this.sliceStart);
          shaft.radius = this.radiusShaft;
          shaft.height = heightShaft;
          shaft.setPosition(tail);
          shaft.sliceAngle = this.sliceAngle;
          shaft.thetaSegments = this.thetaSegments;
          shaft.useTextureCoords = this.useTextureCoords;
          var plug = new RingBuilder_1.default(back, this.sliceStart);
          plug.innerRadius = 0;
          plug.outerRadius = this.radiusShaft;
          plug.setPosition(tail);
          plug.sliceAngle = -this.sliceAngle;
          plug.thetaSegments = this.thetaSegments;
          plug.useTextureCoords = this.useTextureCoords;
          return [cone.toPrimitives(), disc.toPrimitives(), shaft.toPrimitives(), plug.toPrimitives()].reduce(function(a, b) {
            return a.concat(b);
          }, []);
        };
        ArrowBuilder.prototype.enableTextureCoords = function(enable) {
          _super.prototype.enableTextureCoords.call(this, enable);
          return this;
        };
        return ArrowBuilder;
      })(AxialPrimitivesBuilder_1.default);
      exports_1("default", ArrowBuilder);
    }
  };
});

System.register("davinci-eight/geometries/ArrowGeometry.js", ["../core/GeometryContainer", "../core/GeometryPrimitive", "./ArrowBuilder", "../math/R3"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var GeometryContainer_1,
      GeometryPrimitive_1,
      ArrowBuilder_1,
      R3_1;
  var ArrowGeometry;
  function primitives() {
    var builder = new ArrowBuilder_1.default(R3_1.default.e2);
    return builder.toPrimitives();
  }
  return {
    setters: [function(GeometryContainer_1_1) {
      GeometryContainer_1 = GeometryContainer_1_1;
    }, function(GeometryPrimitive_1_1) {
      GeometryPrimitive_1 = GeometryPrimitive_1_1;
    }, function(ArrowBuilder_1_1) {
      ArrowBuilder_1 = ArrowBuilder_1_1;
    }, function(R3_1_1) {
      R3_1 = R3_1_1;
    }],
    execute: function() {
      ArrowGeometry = (function(_super) {
        __extends(ArrowGeometry, _super);
        function ArrowGeometry() {
          _super.call(this);
          var ps = primitives();
          var iLen = ps.length;
          for (var i = 0; i < iLen; i++) {
            var dataSource = ps[i];
            var geometry = new GeometryPrimitive_1.default(dataSource);
            this.addPart(geometry);
            geometry.release();
          }
        }
        return ArrowGeometry;
      })(GeometryContainer_1.default);
      exports_1("default", ArrowGeometry);
    }
  };
});

System.register("davinci-eight/geometries/Topology.js", ["../geometries/DrawAttribute", "../geometries/DrawPrimitive", "../checks/mustBeInteger", "../geometries/Vertex", "../geometries/dataFromVectorN"], function(exports_1) {
  var DrawAttribute_1,
      DrawPrimitive_1,
      mustBeInteger_1,
      Vertex_1,
      dataFromVectorN_1;
  var Topology;
  function attributes(elements, vertices) {
    var attribs = {};
    var iLen = vertices.length;
    for (var i = 0; i < iLen; i++) {
      var vertex = vertices[i];
      var names = Object.keys(vertex.attributes);
      var jLen = names.length;
      for (var j = 0; j < jLen; j++) {
        var name_1 = names[j];
        var data = dataFromVectorN_1.default(vertex.attributes[name_1]);
        var size = data.length;
        var attrib = attribs[name_1];
        if (!attrib) {
          attrib = attribs[name_1] = new DrawAttribute_1.default([], size);
        }
        for (var k = 0; k < size; k++) {
          attrib.values.push(data[k]);
        }
      }
    }
    return attribs;
  }
  return {
    setters: [function(DrawAttribute_1_1) {
      DrawAttribute_1 = DrawAttribute_1_1;
    }, function(DrawPrimitive_1_1) {
      DrawPrimitive_1 = DrawPrimitive_1_1;
    }, function(mustBeInteger_1_1) {
      mustBeInteger_1 = mustBeInteger_1_1;
    }, function(Vertex_1_1) {
      Vertex_1 = Vertex_1_1;
    }, function(dataFromVectorN_1_1) {
      dataFromVectorN_1 = dataFromVectorN_1_1;
    }],
    execute: function() {
      Topology = (function() {
        function Topology(mode, numVertices) {
          this.mode = mustBeInteger_1.default('mode', mode);
          mustBeInteger_1.default('numVertices', numVertices);
          this.vertices = [];
          for (var i = 0; i < numVertices; i++) {
            this.vertices.push(new Vertex_1.default());
          }
        }
        Topology.prototype.toDrawPrimitive = function() {
          return new DrawPrimitive_1.default(this.mode, this.elements, attributes(this.elements, this.vertices));
        };
        return Topology;
      })();
      exports_1("default", Topology);
    }
  };
});

System.register("davinci-eight/geometries/MeshTopology.js", ["./Topology"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Topology_1;
  var MeshTopology;
  return {
    setters: [function(Topology_1_1) {
      Topology_1 = Topology_1_1;
    }],
    execute: function() {
      MeshTopology = (function(_super) {
        __extends(MeshTopology, _super);
        function MeshTopology(mode, numVertices) {
          _super.call(this, mode, numVertices);
        }
        return MeshTopology;
      })(Topology_1.default);
      exports_1("default", MeshTopology);
    }
  };
});

System.register("davinci-eight/geometries/GridTopology.js", ["../core/DrawMode", "../checks/isDefined", "./MeshTopology", "../checks/mustBeArray", "../checks/mustBeInteger", "../i18n/readOnly"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var DrawMode_1,
      isDefined_1,
      MeshTopology_1,
      mustBeArray_1,
      mustBeInteger_1,
      readOnly_1;
  var GridTopology;
  function numPostsForFence(segmentCount) {
    mustBeInteger_1.default('segmentCount', segmentCount);
    return segmentCount + 1;
  }
  function dimensionsForGrid(segmentCounts) {
    mustBeArray_1.default('segmentCounts', segmentCounts);
    return segmentCounts.map(numPostsForFence);
  }
  function numVerticesForGrid(uSegments, vSegments) {
    mustBeInteger_1.default('uSegments', uSegments);
    mustBeInteger_1.default('vSegments', vSegments);
    return dimensionsForGrid([uSegments, vSegments]).reduce(function(a, b) {
      return a * b;
    }, 1);
  }
  function triangleStripForGrid(uSegments, vSegments, elements) {
    elements = isDefined_1.default(elements) ? mustBeArray_1.default('elements', elements) : [];
    var uLength = numPostsForFence(uSegments);
    var lastVertex = uSegments + uLength * vSegments;
    var eSimple = 2 * uLength * vSegments;
    var j = 0;
    for (var i = 1; i <= eSimple; i += 2) {
      elements[j] = (i - 1) / 2;
      elements[j + 1] = elements[j] + uLength;
      if (elements[j + 1] % uLength === uSegments) {
        if (elements[j + 1] !== uSegments && elements[j + 1] !== lastVertex) {
          elements[j + 2] = elements[j + 1];
          elements[j + 3] = (1 + i) / 2;
          j += 2;
        }
      }
      j += 2;
    }
    return elements;
  }
  return {
    setters: [function(DrawMode_1_1) {
      DrawMode_1 = DrawMode_1_1;
    }, function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }, function(MeshTopology_1_1) {
      MeshTopology_1 = MeshTopology_1_1;
    }, function(mustBeArray_1_1) {
      mustBeArray_1 = mustBeArray_1_1;
    }, function(mustBeInteger_1_1) {
      mustBeInteger_1 = mustBeInteger_1_1;
    }, function(readOnly_1_1) {
      readOnly_1 = readOnly_1_1;
    }],
    execute: function() {
      GridTopology = (function(_super) {
        __extends(GridTopology, _super);
        function GridTopology(uSegments, vSegments) {
          _super.call(this, DrawMode_1.default.TRIANGLE_STRIP, numVerticesForGrid(uSegments, vSegments));
          this.elements = triangleStripForGrid(uSegments, vSegments);
          this._uSegments = uSegments;
          this._vSegments = vSegments;
        }
        Object.defineProperty(GridTopology.prototype, "uSegments", {
          get: function() {
            return this._uSegments;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('uSegments').message);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(GridTopology.prototype, "uLength", {
          get: function() {
            return numPostsForFence(this._uSegments);
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('uLength').message);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(GridTopology.prototype, "vSegments", {
          get: function() {
            return this._vSegments;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('vSegments').message);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(GridTopology.prototype, "vLength", {
          get: function() {
            return numPostsForFence(this._vSegments);
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('vLength').message);
          },
          enumerable: true,
          configurable: true
        });
        GridTopology.prototype.vertex = function(uIndex, vIndex) {
          mustBeInteger_1.default('uIndex', uIndex);
          mustBeInteger_1.default('vIndex', vIndex);
          return this.vertices[(this._vSegments - vIndex) * this.uLength + uIndex];
        };
        return GridTopology;
      })(MeshTopology_1.default);
      exports_1("default", GridTopology);
    }
  };
});

System.register("davinci-eight/geometries/CuboidPrimitivesBuilder.js", ["../math/G3", "./GridTopology", "./PrimitivesBuilder", "../core/GraphicsProgramSymbols", "../checks/mustBeNumber", "../math/Vector3", "../math/Vector2"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var G3_1,
      GridTopology_1,
      PrimitivesBuilder_1,
      GraphicsProgramSymbols_1,
      mustBeNumber_1,
      Vector3_1,
      Vector2_1;
  var CuboidPrimitivesBuilder;
  function side(basis, uSegments, vSegments) {
    var normal = Vector3_1.default.copy(basis[0]).cross(basis[1]).direction();
    var aNeg = Vector3_1.default.copy(basis[0]).scale(-0.5);
    var aPos = Vector3_1.default.copy(basis[0]).scale(+0.5);
    var bNeg = Vector3_1.default.copy(basis[1]).scale(-0.5);
    var bPos = Vector3_1.default.copy(basis[1]).scale(+0.5);
    var cPos = Vector3_1.default.copy(basis[2]).scale(+0.5);
    var side = new GridTopology_1.default(uSegments, vSegments);
    for (var uIndex = 0; uIndex < side.uLength; uIndex++) {
      for (var vIndex = 0; vIndex < side.vLength; vIndex++) {
        var u = uIndex / uSegments;
        var v = vIndex / vSegments;
        var a = Vector3_1.default.copy(aNeg).lerp(aPos, u);
        var b = Vector3_1.default.copy(bNeg).lerp(bPos, v);
        var vertex = side.vertex(uIndex, vIndex);
        vertex.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = Vector3_1.default.copy(a).add(b).add(cPos);
        vertex.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = normal;
        vertex.attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_TEXTURE_COORDS] = new Vector2_1.default([u, v]);
      }
    }
    return side;
  }
  return {
    setters: [function(G3_1_1) {
      G3_1 = G3_1_1;
    }, function(GridTopology_1_1) {
      GridTopology_1 = GridTopology_1_1;
    }, function(PrimitivesBuilder_1_1) {
      PrimitivesBuilder_1 = PrimitivesBuilder_1_1;
    }, function(GraphicsProgramSymbols_1_1) {
      GraphicsProgramSymbols_1 = GraphicsProgramSymbols_1_1;
    }, function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }, function(Vector3_1_1) {
      Vector3_1 = Vector3_1_1;
    }, function(Vector2_1_1) {
      Vector2_1 = Vector2_1_1;
    }],
    execute: function() {
      CuboidPrimitivesBuilder = (function(_super) {
        __extends(CuboidPrimitivesBuilder, _super);
        function CuboidPrimitivesBuilder() {
          _super.call(this);
          this.iSegments = 1;
          this.jSegments = 1;
          this.kSegments = 1;
          this._a = Vector3_1.default.copy(G3_1.default.e1);
          this._b = Vector3_1.default.copy(G3_1.default.e2);
          this._c = Vector3_1.default.copy(G3_1.default.e3);
          this.sides = [];
        }
        Object.defineProperty(CuboidPrimitivesBuilder.prototype, "width", {
          get: function() {
            return this._a.magnitude();
          },
          set: function(width) {
            mustBeNumber_1.default('width', width);
            this._a.direction().scale(width);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(CuboidPrimitivesBuilder.prototype, "height", {
          get: function() {
            return this._b.magnitude();
          },
          set: function(height) {
            mustBeNumber_1.default('height', height);
            this._b.direction().scale(height);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(CuboidPrimitivesBuilder.prototype, "depth", {
          get: function() {
            return this._c.magnitude();
          },
          set: function(depth) {
            mustBeNumber_1.default('depth', depth);
            this._c.direction().scale(depth);
          },
          enumerable: true,
          configurable: true
        });
        CuboidPrimitivesBuilder.prototype.regenerate = function() {
          this.sides = [];
          this.sides.push(side([this._a, this._b, this._c], this.iSegments, this.jSegments));
          this.sides.push(side([Vector3_1.default.copy(this._c).scale(-1), this._b, this._a], this.kSegments, this.jSegments));
          this.sides.push(side([this._c, this._b, Vector3_1.default.copy(this._a).scale(-1)], this.kSegments, this.jSegments));
          this.sides.push(side([Vector3_1.default.copy(this._a).scale(-1), this._b, Vector3_1.default.copy(this._c).scale(-1)], this.iSegments, this.jSegments));
          this.sides.push(side([this._a, Vector3_1.default.copy(this._c).scale(-1), this._b], this.iSegments, this.kSegments));
          this.sides.push(side([this._a, this._c, Vector3_1.default.copy(this._b).scale(-1)], this.iSegments, this.kSegments));
        };
        CuboidPrimitivesBuilder.prototype.setPosition = function(position) {
          _super.prototype.setPosition.call(this, position);
          return this;
        };
        CuboidPrimitivesBuilder.prototype.toPrimitives = function() {
          this.regenerate();
          return this.sides.map(function(side) {
            return side.toDrawPrimitive();
          });
        };
        CuboidPrimitivesBuilder.prototype.enableTextureCoords = function(enable) {
          _super.prototype.enableTextureCoords.call(this, enable);
          return this;
        };
        return CuboidPrimitivesBuilder;
      })(PrimitivesBuilder_1.default);
      exports_1("default", CuboidPrimitivesBuilder);
    }
  };
});

System.register("davinci-eight/geometries/computeFaceNormals.js", ["../core/GraphicsProgramSymbols", "../math/Vector3", "../math/wedgeXY", "../math/wedgeYZ", "../math/wedgeZX"], function(exports_1) {
  var GraphicsProgramSymbols_1,
      Vector3_1,
      wedgeXY_1,
      wedgeYZ_1,
      wedgeZX_1;
  function computeFaceNormals(simplex, positionName, normalName) {
    if (positionName === void 0) {
      positionName = GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION;
    }
    if (normalName === void 0) {
      normalName = GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL;
    }
    var vertex0 = simplex.vertices[0].attributes;
    var vertex1 = simplex.vertices[1].attributes;
    var vertex2 = simplex.vertices[2].attributes;
    var pos0 = vertex0[positionName];
    var pos1 = vertex1[positionName];
    var pos2 = vertex2[positionName];
    var x0 = pos0.getComponent(0);
    var y0 = pos0.getComponent(1);
    var z0 = pos0.getComponent(2);
    var x1 = pos1.getComponent(0);
    var y1 = pos1.getComponent(1);
    var z1 = pos1.getComponent(2);
    var x2 = pos2.getComponent(0);
    var y2 = pos2.getComponent(1);
    var z2 = pos2.getComponent(2);
    var ax = x2 - x1;
    var ay = y2 - y1;
    var az = z2 - z1;
    var bx = x0 - x1;
    var by = y0 - y1;
    var bz = z0 - z1;
    var x = wedgeYZ_1.default(ax, ay, az, bx, by, bz);
    var y = wedgeZX_1.default(ax, ay, az, bx, by, bz);
    var z = wedgeXY_1.default(ax, ay, az, bx, by, bz);
    var normal = new Vector3_1.default([x, y, z]).direction();
    vertex0[normalName] = normal;
    vertex1[normalName] = normal;
    vertex2[normalName] = normal;
  }
  exports_1("default", computeFaceNormals);
  return {
    setters: [function(GraphicsProgramSymbols_1_1) {
      GraphicsProgramSymbols_1 = GraphicsProgramSymbols_1_1;
    }, function(Vector3_1_1) {
      Vector3_1 = Vector3_1_1;
    }, function(wedgeXY_1_1) {
      wedgeXY_1 = wedgeXY_1_1;
    }, function(wedgeYZ_1_1) {
      wedgeYZ_1 = wedgeYZ_1_1;
    }, function(wedgeZX_1_1) {
      wedgeZX_1 = wedgeZX_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/geometries/triangle.js", ["../geometries/computeFaceNormals", "../checks/expectArg", "../geometries/Simplex", "../core/GraphicsProgramSymbols", "../math/VectorN"], function(exports_1) {
  var computeFaceNormals_1,
      expectArg_1,
      Simplex_1,
      GraphicsProgramSymbols_1,
      VectorN_1;
  function triangle(a, b, c, attributes, triangles) {
    if (attributes === void 0) {
      attributes = {};
    }
    if (triangles === void 0) {
      triangles = [];
    }
    expectArg_1.default('a', a).toSatisfy(a instanceof VectorN_1.default, "a must be a VectorN");
    expectArg_1.default('b', b).toSatisfy(a instanceof VectorN_1.default, "a must be a VectorN");
    expectArg_1.default('b', c).toSatisfy(a instanceof VectorN_1.default, "a must be a VectorN");
    var simplex = new Simplex_1.default(Simplex_1.default.TRIANGLE);
    simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = a;
    simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = b;
    simplex.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = c;
    computeFaceNormals_1.default(simplex, GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION, GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL);
    Simplex_1.default.setAttributeValues(attributes, simplex);
    triangles.push(simplex);
    return triangles;
  }
  exports_1("default", triangle);
  return {
    setters: [function(computeFaceNormals_1_1) {
      computeFaceNormals_1 = computeFaceNormals_1_1;
    }, function(expectArg_1_1) {
      expectArg_1 = expectArg_1_1;
    }, function(Simplex_1_1) {
      Simplex_1 = Simplex_1_1;
    }, function(GraphicsProgramSymbols_1_1) {
      GraphicsProgramSymbols_1 = GraphicsProgramSymbols_1_1;
    }, function(VectorN_1_1) {
      VectorN_1 = VectorN_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/geometries/quadrilateral.js", ["../checks/expectArg", "../geometries/triangle", "../math/VectorN"], function(exports_1) {
  var expectArg_1,
      triangle_1,
      VectorN_1;
  function setAttributes(which, source, target) {
    var names = Object.keys(source);
    var namesLength = names.length;
    var i;
    var name;
    var values;
    for (i = 0; i < namesLength; i++) {
      name = names[i];
      values = source[name];
      target[name] = which.map(function(index) {
        return values[index];
      });
    }
  }
  function quadrilateral(a, b, c, d, attributes, triangles) {
    if (attributes === void 0) {
      attributes = {};
    }
    if (triangles === void 0) {
      triangles = [];
    }
    expectArg_1.default('a', a).toSatisfy(a instanceof VectorN_1.default, "a must be a VectorN");
    expectArg_1.default('b', b).toSatisfy(b instanceof VectorN_1.default, "b must be a VectorN");
    expectArg_1.default('c', c).toSatisfy(c instanceof VectorN_1.default, "c must be a VectorN");
    expectArg_1.default('d', d).toSatisfy(d instanceof VectorN_1.default, "d must be a VectorN");
    var triatts = {};
    setAttributes([1, 2, 0], attributes, triatts);
    triangle_1.default(b, c, a, triatts, triangles);
    setAttributes([3, 0, 2], attributes, triatts);
    triangle_1.default(d, a, c, triatts, triangles);
    return triangles;
  }
  exports_1("default", quadrilateral);
  return {
    setters: [function(expectArg_1_1) {
      expectArg_1 = expectArg_1_1;
    }, function(triangle_1_1) {
      triangle_1 = triangle_1_1;
    }, function(VectorN_1_1) {
      VectorN_1 = VectorN_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/geometries/CuboidSimplexPrimitivesBuilder.js", ["../math/R3", "../geometries/computeFaceNormals", "../geometries/SimplexPrimitivesBuilder", "../geometries/quadrilateral", "../geometries/Simplex", "../core/GraphicsProgramSymbols", "../math/Vector1", "../math/Vector3"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var R3_1,
      computeFaceNormals_1,
      SimplexPrimitivesBuilder_1,
      quadrilateral_1,
      Simplex_1,
      GraphicsProgramSymbols_1,
      Vector1_1,
      Vector3_1;
  var CuboidSimplexPrimitivesBuilder;
  return {
    setters: [function(R3_1_1) {
      R3_1 = R3_1_1;
    }, function(computeFaceNormals_1_1) {
      computeFaceNormals_1 = computeFaceNormals_1_1;
    }, function(SimplexPrimitivesBuilder_1_1) {
      SimplexPrimitivesBuilder_1 = SimplexPrimitivesBuilder_1_1;
    }, function(quadrilateral_1_1) {
      quadrilateral_1 = quadrilateral_1_1;
    }, function(Simplex_1_1) {
      Simplex_1 = Simplex_1_1;
    }, function(GraphicsProgramSymbols_1_1) {
      GraphicsProgramSymbols_1 = GraphicsProgramSymbols_1_1;
    }, function(Vector1_1_1) {
      Vector1_1 = Vector1_1_1;
    }, function(Vector3_1_1) {
      Vector3_1 = Vector3_1_1;
    }],
    execute: function() {
      CuboidSimplexPrimitivesBuilder = (function(_super) {
        __extends(CuboidSimplexPrimitivesBuilder, _super);
        function CuboidSimplexPrimitivesBuilder(a, b, c, k, subdivide, boundary) {
          if (k === void 0) {
            k = Simplex_1.default.TRIANGLE;
          }
          if (subdivide === void 0) {
            subdivide = 0;
          }
          if (boundary === void 0) {
            boundary = 0;
          }
          _super.call(this);
          this._isModified = true;
          this._a = R3_1.default.fromVector(a);
          this._b = R3_1.default.fromVector(b);
          this._c = R3_1.default.fromVector(c);
          this.k = k;
          this.subdivide(subdivide);
          this.boundary(boundary);
          this.regenerate();
        }
        Object.defineProperty(CuboidSimplexPrimitivesBuilder.prototype, "a", {
          get: function() {
            return this._a;
          },
          set: function(a) {
            this._a = a;
            this._isModified = true;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(CuboidSimplexPrimitivesBuilder.prototype, "b", {
          get: function() {
            return this._b;
          },
          set: function(b) {
            this._b = b;
            this._isModified = true;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(CuboidSimplexPrimitivesBuilder.prototype, "c", {
          get: function() {
            return this._c;
          },
          set: function(c) {
            this._c = c;
            this._isModified = true;
          },
          enumerable: true,
          configurable: true
        });
        CuboidSimplexPrimitivesBuilder.prototype.isModified = function() {
          return this._isModified || _super.prototype.isModified.call(this);
        };
        CuboidSimplexPrimitivesBuilder.prototype.setModified = function(modified) {
          this._isModified = modified;
          _super.prototype.setModified.call(this, modified);
          return this;
        };
        CuboidSimplexPrimitivesBuilder.prototype.regenerate = function() {
          this.setModified(false);
          var pos = [0, 1, 2, 3, 4, 5, 6, 7].map(function(index) {
            return void 0;
          });
          pos[0] = new Vector3_1.default().sub(this._a).sub(this._b).add(this._c).divByScalar(2);
          pos[1] = new Vector3_1.default().add(this._a).sub(this._b).add(this._c).divByScalar(2);
          pos[2] = new Vector3_1.default().add(this._a).add(this._b).add(this._c).divByScalar(2);
          pos[3] = new Vector3_1.default().sub(this._a).add(this._b).add(this._c).divByScalar(2);
          pos[4] = new Vector3_1.default().copy(pos[3]).sub(this._c);
          pos[5] = new Vector3_1.default().copy(pos[2]).sub(this._c);
          pos[6] = new Vector3_1.default().copy(pos[1]).sub(this._c);
          pos[7] = new Vector3_1.default().copy(pos[0]).sub(this._c);
          var position = this.position;
          pos.forEach(function(point) {
            point.add(position);
          });
          function simplex(indices) {
            var simplex = new Simplex_1.default(indices.length - 1);
            for (var i = 0; i < indices.length; i++) {
              simplex.vertices[i].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = pos[indices[i]];
              simplex.vertices[i].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_GEOMETRY_INDEX] = new Vector1_1.default([i]);
            }
            return simplex;
          }
          switch (this.k) {
            case 0:
              {
                var points = [[0], [1], [2], [3], [4], [5], [6], [7]];
                this.data = points.map(function(point) {
                  return simplex(point);
                });
              }
              break;
            case 1:
              {
                var lines = [[0, 1], [1, 2], [2, 3], [3, 0], [0, 7], [1, 6], [2, 5], [3, 4], [4, 5], [5, 6], [6, 7], [7, 4]];
                this.data = lines.map(function(line) {
                  return simplex(line);
                });
              }
              break;
            case 2:
              {
                var faces = [0, 1, 2, 3, 4, 5].map(function(index) {
                  return void 0;
                });
                faces[0] = quadrilateral_1.default(pos[0], pos[1], pos[2], pos[3]);
                faces[1] = quadrilateral_1.default(pos[1], pos[6], pos[5], pos[2]);
                faces[2] = quadrilateral_1.default(pos[7], pos[0], pos[3], pos[4]);
                faces[3] = quadrilateral_1.default(pos[6], pos[7], pos[4], pos[5]);
                faces[4] = quadrilateral_1.default(pos[3], pos[2], pos[5], pos[4]);
                faces[5] = quadrilateral_1.default(pos[7], pos[6], pos[1], pos[0]);
                this.data = faces.reduce(function(a, b) {
                  return a.concat(b);
                }, []);
                this.data.forEach(function(simplex) {
                  computeFaceNormals_1.default(simplex);
                });
              }
              break;
            default:
              {}
          }
          this.check();
        };
        return CuboidSimplexPrimitivesBuilder;
      })(SimplexPrimitivesBuilder_1.default);
      exports_1("default", CuboidSimplexPrimitivesBuilder);
    }
  };
});

System.register("davinci-eight/geometries/BoxGeometry.js", ["../core/GeometryContainer", "../core/GeometryPrimitive", "../checks/isDefined", "../checks/mustBeBoolean", "../checks/mustBeNumber", "./CuboidPrimitivesBuilder", "./CuboidSimplexPrimitivesBuilder", "../math/R3", "./Simplex"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var GeometryContainer_1,
      GeometryPrimitive_1,
      isDefined_1,
      mustBeBoolean_1,
      mustBeNumber_1,
      CuboidPrimitivesBuilder_1,
      CuboidSimplexPrimitivesBuilder_1,
      R3_1,
      Simplex_1;
  var BoxGeometry;
  function primitives(width, height, depth, wireFrame) {
    mustBeNumber_1.default('width', width);
    mustBeNumber_1.default('height', height);
    mustBeNumber_1.default('depth', depth);
    mustBeBoolean_1.default('wireFrame', wireFrame);
    if (wireFrame) {
      var builder = new CuboidSimplexPrimitivesBuilder_1.default(R3_1.default.e1, R3_1.default.e2, R3_1.default.e3, Simplex_1.default.LINE, 0, 1);
      return builder.toPrimitives();
    } else {
      var builder = new CuboidPrimitivesBuilder_1.default();
      builder.width = width;
      builder.height = height;
      builder.depth = depth;
      return builder.toPrimitives();
    }
  }
  return {
    setters: [function(GeometryContainer_1_1) {
      GeometryContainer_1 = GeometryContainer_1_1;
    }, function(GeometryPrimitive_1_1) {
      GeometryPrimitive_1 = GeometryPrimitive_1_1;
    }, function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }, function(mustBeBoolean_1_1) {
      mustBeBoolean_1 = mustBeBoolean_1_1;
    }, function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }, function(CuboidPrimitivesBuilder_1_1) {
      CuboidPrimitivesBuilder_1 = CuboidPrimitivesBuilder_1_1;
    }, function(CuboidSimplexPrimitivesBuilder_1_1) {
      CuboidSimplexPrimitivesBuilder_1 = CuboidSimplexPrimitivesBuilder_1_1;
    }, function(R3_1_1) {
      R3_1 = R3_1_1;
    }, function(Simplex_1_1) {
      Simplex_1 = Simplex_1_1;
    }],
    execute: function() {
      BoxGeometry = (function(_super) {
        __extends(BoxGeometry, _super);
        function BoxGeometry(options) {
          if (options === void 0) {
            options = {};
          }
          _super.call(this);
          var width = isDefined_1.default(options.width) ? mustBeNumber_1.default('width', options.width) : 1;
          var height = isDefined_1.default(options.height) ? mustBeNumber_1.default('height', options.height) : 1;
          var depth = isDefined_1.default(options.depth) ? mustBeNumber_1.default('depth', options.depth) : 1;
          var wireFrame = isDefined_1.default(options.wireFrame) ? mustBeBoolean_1.default('wireFrame', options.wireFrame) : false;
          var ps = primitives(width, height, depth, wireFrame);
          var iLen = ps.length;
          for (var i = 0; i < iLen; i++) {
            var dataSource = ps[i];
            var geometry = new GeometryPrimitive_1.default(dataSource);
            this.addPart(geometry);
            geometry.release();
          }
        }
        return BoxGeometry;
      })(GeometryContainer_1.default);
      exports_1("default", BoxGeometry);
    }
  };
});

System.register("davinci-eight/geometries/CylinderBuilder.js", ["../geometries/arc3", "../geometries/SliceSimplexPrimitivesBuilder", "../math/Spinor3", "../math/Vector2", "../math/Vector3"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var arc3_1,
      SliceSimplexPrimitivesBuilder_1,
      Spinor3_1,
      Vector2_1,
      Vector3_1;
  var CylinderBuilder;
  function computeVertices(radius, height, axis, pos, start, angle, generator, heightSegments, thetaSegments, points, vertices, uvs) {
    var begin = Vector3_1.default.copy(start).scale(radius);
    var halfHeight = Vector3_1.default.copy(axis).scale(0.5 * height);
    var stepH = Vector3_1.default.copy(axis).direction().scale(height / heightSegments);
    for (var i = 0; i <= heightSegments; i++) {
      var dispH = Vector3_1.default.copy(stepH).scale(i).sub(halfHeight);
      var verticesRow = [];
      var uvsRow = [];
      var v = (heightSegments - i) / heightSegments;
      var arcPoints = arc3_1.default(begin, angle, generator, thetaSegments);
      for (var j = 0,
          jLength = arcPoints.length; j < jLength; j++) {
        var point = arcPoints[j].add(dispH).add(pos);
        var u = j / thetaSegments;
        points.push(point);
        verticesRow.push(points.length - 1);
        uvsRow.push(new Vector2_1.default([u, v]));
      }
      vertices.push(verticesRow);
      uvs.push(uvsRow);
    }
  }
  return {
    setters: [function(arc3_1_1) {
      arc3_1 = arc3_1_1;
    }, function(SliceSimplexPrimitivesBuilder_1_1) {
      SliceSimplexPrimitivesBuilder_1 = SliceSimplexPrimitivesBuilder_1_1;
    }, function(Spinor3_1_1) {
      Spinor3_1 = Spinor3_1_1;
    }, function(Vector2_1_1) {
      Vector2_1 = Vector2_1_1;
    }, function(Vector3_1_1) {
      Vector3_1 = Vector3_1_1;
    }],
    execute: function() {
      CylinderBuilder = (function(_super) {
        __extends(CylinderBuilder, _super);
        function CylinderBuilder(axis) {
          _super.call(this, axis, void 0, void 0);
          this.radius = 1;
          this.height = 1;
          this.openTop = false;
          this.openBottom = false;
          this.setModified(true);
        }
        CylinderBuilder.prototype.regenerate = function() {
          this.data = [];
          var radius = this.radius;
          var height = this.height;
          var heightSegments = this.flatSegments;
          var thetaSegments = this.curvedSegments;
          var generator = Spinor3_1.default.dual(this.axis);
          var heightHalf = height / 2;
          var points = [];
          var vertices = [];
          var uvs = [];
          computeVertices(radius, this.height, this.axis, this.position, this.sliceStart, this.sliceAngle, generator, heightSegments, thetaSegments, points, vertices, uvs);
          var na;
          var nb;
          for (var j = 0; j < thetaSegments; j++) {
            if (radius !== 0) {
              na = Vector3_1.default.copy(points[vertices[0][j]]);
              nb = Vector3_1.default.copy(points[vertices[0][j + 1]]);
            } else {
              na = Vector3_1.default.copy(points[vertices[1][j]]);
              nb = Vector3_1.default.copy(points[vertices[1][j + 1]]);
            }
            na.setY(0).direction();
            nb.setY(0).direction();
            for (var i = 0; i < heightSegments; i++) {
              var v1 = vertices[i][j];
              var v2 = vertices[i + 1][j];
              var v3 = vertices[i + 1][j + 1];
              var v4 = vertices[i][j + 1];
              var n1 = na.clone();
              var n2 = na.clone();
              var n3 = nb.clone();
              var n4 = nb.clone();
              var uv1 = uvs[i][j].clone();
              var uv2 = uvs[i + 1][j].clone();
              var uv3 = uvs[i + 1][j + 1].clone();
              var uv4 = uvs[i][j + 1].clone();
              this.triangle([points[v2], points[v1], points[v3]], [n2, n1, n3], [uv2, uv1, uv3]);
              this.triangle([points[v4], points[v3], points[v1]], [n4, n3.clone(), n1.clone()], [uv4, uv3.clone(), uv1.clone()]);
            }
          }
          if (!this.openTop && radius > 0) {
            points.push(Vector3_1.default.copy(this.axis).scale(heightHalf).add(this.position));
            for (var j = 0; j < thetaSegments; j++) {
              var v1 = vertices[heightSegments][j + 1];
              var v2 = points.length - 1;
              var v3 = vertices[heightSegments][j];
              var n1 = Vector3_1.default.copy(this.axis);
              var n2 = Vector3_1.default.copy(this.axis);
              var n3 = Vector3_1.default.copy(this.axis);
              var uv1 = uvs[heightSegments][j + 1].clone();
              var uv2 = new Vector2_1.default([uv1.x, 1]);
              var uv3 = uvs[heightSegments][j].clone();
              this.triangle([points[v1], points[v2], points[v3]], [n1, n2, n3], [uv1, uv2, uv3]);
            }
          }
          if (!this.openBottom && radius > 0) {
            points.push(Vector3_1.default.copy(this.axis).scale(-heightHalf).add(this.position));
            for (var j = 0; j < thetaSegments; j++) {
              var v1 = vertices[0][j];
              var v2 = points.length - 1;
              var v3 = vertices[0][j + 1];
              var n1 = Vector3_1.default.copy(this.axis).scale(-1);
              var n2 = Vector3_1.default.copy(this.axis).scale(-1);
              var n3 = Vector3_1.default.copy(this.axis).scale(-1);
              var uv1 = uvs[0][j].clone();
              var uv2 = new Vector2_1.default([uv1.x, 1]);
              var uv3 = uvs[0][j + 1].clone();
              this.triangle([points[v1], points[v2], points[v3]], [n1, n2, n3], [uv1, uv2, uv3]);
            }
          }
          this.setModified(false);
        };
        return CylinderBuilder;
      })(SliceSimplexPrimitivesBuilder_1.default);
      exports_1("default", CylinderBuilder);
    }
  };
});

System.register("davinci-eight/geometries/CylinderGeometry.js", ["../math/R3", "../core/GeometryContainer", "../core/GeometryPrimitive", "./CylinderBuilder"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var R3_1,
      GeometryContainer_1,
      GeometryPrimitive_1,
      CylinderBuilder_1;
  var CylinderGeometry;
  function primitives() {
    var builder = new CylinderBuilder_1.default(R3_1.default.e2);
    builder.setPosition(R3_1.default.e2.scale(0.5));
    return builder.toPrimitives();
  }
  return {
    setters: [function(R3_1_1) {
      R3_1 = R3_1_1;
    }, function(GeometryContainer_1_1) {
      GeometryContainer_1 = GeometryContainer_1_1;
    }, function(GeometryPrimitive_1_1) {
      GeometryPrimitive_1 = GeometryPrimitive_1_1;
    }, function(CylinderBuilder_1_1) {
      CylinderBuilder_1 = CylinderBuilder_1_1;
    }],
    execute: function() {
      CylinderGeometry = (function(_super) {
        __extends(CylinderGeometry, _super);
        function CylinderGeometry() {
          _super.call(this);
          var ps = primitives();
          var iLen = ps.length;
          for (var i = 0; i < iLen; i++) {
            var dataSource = ps[i];
            var geometry = new GeometryPrimitive_1.default(dataSource);
            this.addPart(geometry);
            geometry.release();
          }
        }
        return CylinderGeometry;
      })(GeometryContainer_1.default);
      exports_1("default", CylinderGeometry);
    }
  };
});

System.register("davinci-eight/materials/LineMaterial.js", ["../materials/GraphicsProgramBuilder", "../core/GraphicsProgramSymbols", "../core/Material"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var GraphicsProgramBuilder_1,
      GraphicsProgramSymbols_1,
      Material_1;
  var LineMaterial;
  function builder() {
    var gpb = new GraphicsProgramBuilder_1.default();
    gpb.attribute(GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION, 3);
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_COLOR, 'vec3');
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_MODEL_MATRIX, 'mat4');
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_PROJECTION_MATRIX, 'mat4');
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_VIEW_MATRIX, 'mat4');
    return gpb;
  }
  function vertexShader() {
    return builder().vertexShader();
  }
  function fragmentShader() {
    return builder().fragmentShader();
  }
  return {
    setters: [function(GraphicsProgramBuilder_1_1) {
      GraphicsProgramBuilder_1 = GraphicsProgramBuilder_1_1;
    }, function(GraphicsProgramSymbols_1_1) {
      GraphicsProgramSymbols_1 = GraphicsProgramSymbols_1_1;
    }, function(Material_1_1) {
      Material_1 = Material_1_1;
    }],
    execute: function() {
      LineMaterial = (function(_super) {
        __extends(LineMaterial, _super);
        function LineMaterial() {
          _super.call(this, vertexShader(), fragmentShader());
        }
        return LineMaterial;
      })(Material_1.default);
      exports_1("default", LineMaterial);
    }
  };
});

System.register("davinci-eight/materials/glslAttribType.js", ["../core/GraphicsProgramSymbols", "../checks/mustBeInteger", "../checks/mustBeString"], function(exports_1) {
  var GraphicsProgramSymbols_1,
      mustBeInteger_1,
      mustBeString_1;
  function sizeType(size) {
    mustBeInteger_1.default('size', size);
    switch (size) {
      case 1:
        {
          return 'float';
        }
        break;
      case 2:
        {
          return 'vec2';
        }
        break;
      case 3:
        {
          return 'vec3';
        }
        break;
      case 4:
        {
          return 'vec4';
        }
        break;
      default:
        {
          throw new Error("Can't compute the GLSL attribute type from size " + size);
        }
    }
  }
  function glslAttribType(key, size) {
    mustBeString_1.default('key', key);
    mustBeInteger_1.default('size', size);
    switch (key) {
      case GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR:
        {
          return 'vec3';
        }
        break;
      default:
        {
          return sizeType(size);
        }
    }
  }
  exports_1("default", glslAttribType);
  return {
    setters: [function(GraphicsProgramSymbols_1_1) {
      GraphicsProgramSymbols_1 = GraphicsProgramSymbols_1_1;
    }, function(mustBeInteger_1_1) {
      mustBeInteger_1 = mustBeInteger_1_1;
    }, function(mustBeString_1_1) {
      mustBeString_1 = mustBeString_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/materials/SmartGraphicsProgram.js", ["./fragmentShader", "../core/Material", "./vertexShader"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var fragmentShader_1,
      Material_1,
      vertexShader_1;
  var SmartGraphicsProgram;
  return {
    setters: [function(fragmentShader_1_1) {
      fragmentShader_1 = fragmentShader_1_1;
    }, function(Material_1_1) {
      Material_1 = Material_1_1;
    }, function(vertexShader_1_1) {
      vertexShader_1 = vertexShader_1_1;
    }],
    execute: function() {
      SmartGraphicsProgram = (function(_super) {
        __extends(SmartGraphicsProgram, _super);
        function SmartGraphicsProgram(aParams, uParams, vColor, vLight) {
          _super.call(this, vertexShader_1.default(aParams, uParams, vColor, vLight), fragmentShader_1.default(aParams, uParams, vColor, vLight));
        }
        return SmartGraphicsProgram;
      })(Material_1.default);
      exports_1("default", SmartGraphicsProgram);
    }
  };
});

System.register("davinci-eight/materials/vColorRequired.js", ["../core/GraphicsProgramSymbols"], function(exports_1) {
  var GraphicsProgramSymbols_1;
  function vColorRequired(attributes, uniforms) {
    return !!attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR] || !!uniforms[GraphicsProgramSymbols_1.default.UNIFORM_COLOR];
  }
  exports_1("default", vColorRequired);
  return {
    setters: [function(GraphicsProgramSymbols_1_1) {
      GraphicsProgramSymbols_1 = GraphicsProgramSymbols_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/materials/vLightRequired.js", ["../checks/mustBeDefined", "../core/GraphicsProgramSymbols"], function(exports_1) {
  var mustBeDefined_1,
      GraphicsProgramSymbols_1;
  function vLightRequired(attributes, uniforms) {
    mustBeDefined_1.default('attributes', attributes);
    mustBeDefined_1.default('uniforms', uniforms);
    return !!uniforms[GraphicsProgramSymbols_1.default.UNIFORM_AMBIENT_LIGHT] || (!!uniforms[GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_COLOR] && !!uniforms[GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_COLOR]);
  }
  exports_1("default", vLightRequired);
  return {
    setters: [function(mustBeDefined_1_1) {
      mustBeDefined_1 = mustBeDefined_1_1;
    }, function(GraphicsProgramSymbols_1_1) {
      GraphicsProgramSymbols_1 = GraphicsProgramSymbols_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/materials/fragmentShader.js", ["../checks/mustBeBoolean", "../checks/mustBeDefined"], function(exports_1) {
  var mustBeBoolean_1,
      mustBeDefined_1;
  function fragmentShader(attributes, uniforms, vColor, vLight) {
    mustBeDefined_1.default('attributes', attributes);
    mustBeDefined_1.default('uniforms', uniforms);
    mustBeBoolean_1.default('vColor', vColor);
    mustBeBoolean_1.default('vLight', vLight);
    var lines = [];
    lines.push("// fragment shader generated by EIGHT");
    if (false) {
      lines.push("#ifdef GL_ES");
      lines.push("#  ifdef GL_FRAGMENT_PRECISION_HIGH");
      lines.push("precision highp float;");
      lines.push("#  else");
      lines.push("precision mediump float;");
      lines.push("#  endif");
      lines.push("#endif");
    }
    if (vColor) {
      lines.push("varying highp vec4 vColor;");
    }
    if (vLight) {
      lines.push("varying highp vec3 vLight;");
    }
    lines.push("void main(void) {");
    if (vLight) {
      if (vColor) {
        lines.push("  gl_FragColor = vec4(vColor.xyz * vLight, vColor.a);");
      } else {
        lines.push("  gl_FragColor = vec4(vLight, 1.0);");
      }
    } else {
      if (vColor) {
        lines.push("  gl_FragColor = vColor;");
      } else {
        lines.push("  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);");
      }
    }
    lines.push("}");
    var code = lines.join("\n");
    return code;
  }
  exports_1("default", fragmentShader);
  return {
    setters: [function(mustBeBoolean_1_1) {
      mustBeBoolean_1 = mustBeBoolean_1_1;
    }, function(mustBeDefined_1_1) {
      mustBeDefined_1 = mustBeDefined_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/core/getAttribVarName.js", ["../checks/isDefined", "../checks/mustBeObject", "../checks/mustBeString"], function(exports_1) {
  var isDefined_1,
      mustBeObject_1,
      mustBeString_1;
  function getAttribVarName(attribute, varName) {
    mustBeObject_1.default('attribute', attribute);
    mustBeString_1.default('varName', varName);
    return isDefined_1.default(attribute.name) ? mustBeString_1.default('attribute.name', attribute.name) : varName;
  }
  exports_1("default", getAttribVarName);
  return {
    setters: [function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }, function(mustBeObject_1_1) {
      mustBeObject_1 = mustBeObject_1_1;
    }, function(mustBeString_1_1) {
      mustBeString_1 = mustBeString_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/core/getUniformVarName.js", ["../checks/isDefined", "../checks/expectArg"], function(exports_1) {
  var isDefined_1,
      expectArg_1;
  function getUniformVarName(uniform, varName) {
    expectArg_1.default('uniform', uniform).toBeObject();
    expectArg_1.default('varName', varName).toBeString();
    return isDefined_1.default(uniform.name) ? expectArg_1.default('uniform.name', uniform.name).toBeString().value : varName;
  }
  exports_1("default", getUniformVarName);
  return {
    setters: [function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }, function(expectArg_1_1) {
      expectArg_1 = expectArg_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/materials/vertexShader.js", ["../core/getAttribVarName", "../core/getUniformVarName", "../checks/mustBeBoolean", "../checks/mustBeDefined", "../core/GraphicsProgramSymbols"], function(exports_1) {
  var getAttribVarName_1,
      getUniformVarName_1,
      mustBeBoolean_1,
      mustBeDefined_1,
      GraphicsProgramSymbols_1;
  var SPACE,
      ATTRIBUTE,
      UNIFORM,
      COMMA,
      SEMICOLON,
      LPAREN,
      RPAREN,
      TIMES,
      ASSIGN,
      DIRECTIONAL_LIGHT_COSINE_FACTOR_VARNAME;
  function getUniformCodeName(uniforms, name) {
    return getUniformVarName_1.default(uniforms[name], name);
  }
  function vertexShader(attributes, uniforms, vColor, vLight) {
    mustBeDefined_1.default('attributes', attributes);
    mustBeDefined_1.default('uniforms', uniforms);
    mustBeBoolean_1.default('vColor', vColor);
    mustBeBoolean_1.default('vLight', vLight);
    var lines = [];
    lines.push("// vertex shader generated by EIGHT");
    for (var aName in attributes) {
      if (attributes.hasOwnProperty(aName)) {
        lines.push(ATTRIBUTE + attributes[aName].glslType + SPACE + getAttribVarName_1.default(attributes[aName], aName) + SEMICOLON);
      }
    }
    for (var uName in uniforms) {
      if (uniforms.hasOwnProperty(uName)) {
        lines.push(UNIFORM + uniforms[uName].glslType + SPACE + getUniformCodeName(uniforms, uName) + SEMICOLON);
      }
    }
    if (vColor) {
      lines.push("varying highp vec4 vColor;");
    }
    if (vLight) {
      lines.push("varying highp vec3 vLight;");
    }
    lines.push("void main(void) {");
    var glPosition = [];
    glPosition.unshift(SEMICOLON);
    if (attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION]) {
      switch (attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION].glslType) {
        case 'float':
          {
            glPosition.unshift(RPAREN);
            glPosition.unshift('1.0');
            glPosition.unshift(COMMA);
            glPosition.unshift('0.0');
            glPosition.unshift(COMMA);
            glPosition.unshift('0.0');
            glPosition.unshift(COMMA);
            glPosition.unshift(getAttribVarName_1.default(attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION], GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION));
            glPosition.unshift(LPAREN);
            glPosition.unshift('vec4');
          }
          break;
        case 'vec2':
          {
            glPosition.unshift(RPAREN);
            glPosition.unshift('1.0');
            glPosition.unshift(COMMA);
            glPosition.unshift('0.0');
            glPosition.unshift(COMMA);
            glPosition.unshift(getAttribVarName_1.default(attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION], GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION));
            glPosition.unshift(LPAREN);
            glPosition.unshift('vec4');
          }
          break;
        case 'vec3':
          {
            glPosition.unshift(RPAREN);
            glPosition.unshift('1.0');
            glPosition.unshift(COMMA);
            glPosition.unshift(getAttribVarName_1.default(attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION], GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION));
            glPosition.unshift(LPAREN);
            glPosition.unshift('vec4');
          }
          break;
        case 'vec4':
          {
            glPosition.unshift(getAttribVarName_1.default(attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION], GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION));
          }
          break;
      }
    } else {
      glPosition.unshift("vec4(0.0, 0.0, 0.0, 1.0)");
    }
    if (uniforms[GraphicsProgramSymbols_1.default.UNIFORM_REFLECTION_ONE_MATRIX]) {
      glPosition.unshift(TIMES);
      glPosition.unshift(getUniformCodeName(uniforms, GraphicsProgramSymbols_1.default.UNIFORM_REFLECTION_ONE_MATRIX));
    }
    if (uniforms[GraphicsProgramSymbols_1.default.UNIFORM_REFLECTION_TWO_MATRIX]) {
      glPosition.unshift(TIMES);
      glPosition.unshift(getUniformCodeName(uniforms, GraphicsProgramSymbols_1.default.UNIFORM_REFLECTION_TWO_MATRIX));
    }
    if (uniforms[GraphicsProgramSymbols_1.default.UNIFORM_MODEL_MATRIX]) {
      glPosition.unshift(TIMES);
      glPosition.unshift(getUniformCodeName(uniforms, GraphicsProgramSymbols_1.default.UNIFORM_MODEL_MATRIX));
    }
    if (uniforms[GraphicsProgramSymbols_1.default.UNIFORM_VIEW_MATRIX]) {
      glPosition.unshift(TIMES);
      glPosition.unshift(getUniformCodeName(uniforms, GraphicsProgramSymbols_1.default.UNIFORM_VIEW_MATRIX));
    }
    if (uniforms[GraphicsProgramSymbols_1.default.UNIFORM_PROJECTION_MATRIX]) {
      glPosition.unshift(TIMES);
      glPosition.unshift(getUniformCodeName(uniforms, GraphicsProgramSymbols_1.default.UNIFORM_PROJECTION_MATRIX));
    }
    glPosition.unshift(ASSIGN);
    glPosition.unshift("gl_Position");
    glPosition.unshift('  ');
    lines.push(glPosition.join(''));
    if (uniforms[GraphicsProgramSymbols_1.default.UNIFORM_POINT_SIZE]) {
      lines.push("  gl_PointSize = " + getUniformCodeName(uniforms, GraphicsProgramSymbols_1.default.UNIFORM_POINT_SIZE) + ";");
    }
    if (vColor) {
      if (attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR]) {
        var colorAttribVarName = getAttribVarName_1.default(attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR], GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR);
        switch (attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR].glslType) {
          case 'vec4':
            {
              lines.push("  vColor = " + colorAttribVarName + SEMICOLON);
            }
            break;
          case 'vec3':
            {
              lines.push("  vColor = vec4(" + colorAttribVarName + ", 1.0);");
            }
            break;
          default:
            {
              throw new Error("Unexpected type for color attribute: " + attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR].glslType);
            }
        }
      } else if (uniforms[GraphicsProgramSymbols_1.default.UNIFORM_COLOR]) {
        var colorUniformVarName = getUniformCodeName(uniforms, GraphicsProgramSymbols_1.default.UNIFORM_COLOR);
        switch (uniforms[GraphicsProgramSymbols_1.default.UNIFORM_COLOR].glslType) {
          case 'vec4':
            {
              lines.push("  vColor = " + colorUniformVarName + SEMICOLON);
            }
            break;
          case 'vec3':
            {
              lines.push("  vColor = vec4(" + colorUniformVarName + ", 1.0);");
            }
            break;
          default:
            {
              throw new Error("Unexpected type for color uniform: " + uniforms[GraphicsProgramSymbols_1.default.UNIFORM_COLOR].glslType);
            }
        }
      } else {
        lines.push("  vColor = vec4(1.0, 1.0, 1.0, 1.0);");
      }
    }
    if (vLight) {
      if (uniforms[GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_COLOR] && uniforms[GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION] && uniforms[GraphicsProgramSymbols_1.default.UNIFORM_NORMAL_MATRIX] && attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL]) {
        lines.push("  vec3 L = normalize(" + getUniformCodeName(uniforms, GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION) + ");");
        lines.push("  vec3 N = normalize(" + getUniformCodeName(uniforms, GraphicsProgramSymbols_1.default.UNIFORM_NORMAL_MATRIX) + " * " + getAttribVarName_1.default(attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL], GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL) + ");");
        lines.push("  // The minus sign arises because L is the light direction, so we need dot(N, -L) = -dot(N, L)");
        lines.push("  float " + DIRECTIONAL_LIGHT_COSINE_FACTOR_VARNAME + " = max(-dot(N, L), 0.0);");
        if (uniforms[GraphicsProgramSymbols_1.default.UNIFORM_AMBIENT_LIGHT]) {
          lines.push("  vLight = " + getUniformCodeName(uniforms, GraphicsProgramSymbols_1.default.UNIFORM_AMBIENT_LIGHT) + " + " + DIRECTIONAL_LIGHT_COSINE_FACTOR_VARNAME + " * " + getUniformCodeName(uniforms, GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_COLOR) + ";");
        } else {
          lines.push("  vLight = " + DIRECTIONAL_LIGHT_COSINE_FACTOR_VARNAME + " * " + getUniformCodeName(uniforms, GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_COLOR) + ";");
        }
      } else {
        if (uniforms[GraphicsProgramSymbols_1.default.UNIFORM_AMBIENT_LIGHT]) {
          lines.push("  vLight = " + getUniformCodeName(uniforms, GraphicsProgramSymbols_1.default.UNIFORM_AMBIENT_LIGHT) + ";");
        } else {
          lines.push("  vLight = vec3(1.0, 1.0, 1.0);");
        }
      }
    }
    lines.push("}");
    var code = lines.join("\n");
    return code;
  }
  exports_1("default", vertexShader);
  return {
    setters: [function(getAttribVarName_1_1) {
      getAttribVarName_1 = getAttribVarName_1_1;
    }, function(getUniformVarName_1_1) {
      getUniformVarName_1 = getUniformVarName_1_1;
    }, function(mustBeBoolean_1_1) {
      mustBeBoolean_1 = mustBeBoolean_1_1;
    }, function(mustBeDefined_1_1) {
      mustBeDefined_1 = mustBeDefined_1_1;
    }, function(GraphicsProgramSymbols_1_1) {
      GraphicsProgramSymbols_1 = GraphicsProgramSymbols_1_1;
    }],
    execute: function() {
      SPACE = ' ';
      ATTRIBUTE = 'attribute' + SPACE;
      UNIFORM = 'uniform' + SPACE;
      COMMA = ',' + SPACE;
      SEMICOLON = ';';
      LPAREN = '(';
      RPAREN = ')';
      TIMES = SPACE + '*' + SPACE;
      ASSIGN = SPACE + '=' + SPACE;
      DIRECTIONAL_LIGHT_COSINE_FACTOR_VARNAME = "directionalLightCosineFactor";
    }
  };
});

System.register("davinci-eight/materials/GraphicsProgramBuilder.js", ["../core/getAttribVarName", "./glslAttribType", "../checks/mustBeInteger", "../checks/mustBeString", "../materials/SmartGraphicsProgram", "./vColorRequired", "./vLightRequired", "./fragmentShader", "./vertexShader"], function(exports_1) {
  var getAttribVarName_1,
      glslAttribType_1,
      mustBeInteger_1,
      mustBeString_1,
      SmartGraphicsProgram_1,
      vColorRequired_1,
      vLightRequired_1,
      fragmentShader_1,
      vertexShader_1;
  var GraphicsProgramBuilder;
  function computeAttribParams(values) {
    var result = {};
    var keys = Object.keys(values);
    var keysLength = keys.length;
    for (var i = 0; i < keysLength; i++) {
      var key = keys[i];
      var attribute = values[key];
      var size = mustBeInteger_1.default('size', attribute.size);
      var varName = getAttribVarName_1.default(attribute, key);
      result[varName] = {glslType: glslAttribType_1.default(key, size)};
    }
    return result;
  }
  return {
    setters: [function(getAttribVarName_1_1) {
      getAttribVarName_1 = getAttribVarName_1_1;
    }, function(glslAttribType_1_1) {
      glslAttribType_1 = glslAttribType_1_1;
    }, function(mustBeInteger_1_1) {
      mustBeInteger_1 = mustBeInteger_1_1;
    }, function(mustBeString_1_1) {
      mustBeString_1 = mustBeString_1_1;
    }, function(SmartGraphicsProgram_1_1) {
      SmartGraphicsProgram_1 = SmartGraphicsProgram_1_1;
    }, function(vColorRequired_1_1) {
      vColorRequired_1 = vColorRequired_1_1;
    }, function(vLightRequired_1_1) {
      vLightRequired_1 = vLightRequired_1_1;
    }, function(fragmentShader_1_1) {
      fragmentShader_1 = fragmentShader_1_1;
    }, function(vertexShader_1_1) {
      vertexShader_1 = vertexShader_1_1;
    }],
    execute: function() {
      GraphicsProgramBuilder = (function() {
        function GraphicsProgramBuilder(primitive) {
          this.aMeta = {};
          this.uParams = {};
          if (primitive) {
            var attributes = primitive.attributes;
            var keys = Object.keys(attributes);
            for (var i = 0,
                iLength = keys.length; i < iLength; i++) {
              var key = keys[i];
              var attribute = attributes[key];
              this.attribute(key, attribute.size);
            }
          }
        }
        GraphicsProgramBuilder.prototype.attribute = function(name, size) {
          mustBeString_1.default('name', name);
          mustBeInteger_1.default('size', size);
          this.aMeta[name] = {size: size};
          return this;
        };
        GraphicsProgramBuilder.prototype.uniform = function(name, type) {
          mustBeString_1.default('name', name);
          mustBeString_1.default('type', type);
          this.uParams[name] = {glslType: type};
          return this;
        };
        GraphicsProgramBuilder.prototype.build = function() {
          var aParams = computeAttribParams(this.aMeta);
          var vColor = vColorRequired_1.default(aParams, this.uParams);
          var vLight = vLightRequired_1.default(aParams, this.uParams);
          return new SmartGraphicsProgram_1.default(aParams, this.uParams, vColor, vLight);
        };
        GraphicsProgramBuilder.prototype.vertexShader = function() {
          var aParams = computeAttribParams(this.aMeta);
          var vColor = vColorRequired_1.default(aParams, this.uParams);
          var vLight = vLightRequired_1.default(aParams, this.uParams);
          return vertexShader_1.default(aParams, this.uParams, vColor, vLight);
        };
        GraphicsProgramBuilder.prototype.fragmentShader = function() {
          var aParams = computeAttribParams(this.aMeta);
          var vColor = vColorRequired_1.default(aParams, this.uParams);
          var vLight = vLightRequired_1.default(aParams, this.uParams);
          return fragmentShader_1.default(aParams, this.uParams, vColor, vLight);
        };
        return GraphicsProgramBuilder;
      })();
      exports_1("default", GraphicsProgramBuilder);
    }
  };
});

System.register("davinci-eight/core/AttribLocation.js", ["../i18n/readOnly"], function(exports_1) {
  var readOnly_1;
  var AttribLocation;
  return {
    setters: [function(readOnly_1_1) {
      readOnly_1 = readOnly_1_1;
    }],
    execute: function() {
      AttribLocation = (function() {
        function AttribLocation(info) {
          this._name = info.name;
        }
        Object.defineProperty(AttribLocation.prototype, "index", {
          get: function() {
            return this._index;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('index').message);
          },
          enumerable: true,
          configurable: true
        });
        AttribLocation.prototype.contextFree = function() {
          this._index = void 0;
          this._gl = void 0;
        };
        AttribLocation.prototype.contextGain = function(context, program) {
          this._index = context.getAttribLocation(program, this._name);
          this._gl = context;
        };
        AttribLocation.prototype.contextLost = function() {
          this._index = void 0;
          this._gl = void 0;
        };
        AttribLocation.prototype.vertexPointer = function(size, normalized, stride, offset) {
          if (normalized === void 0) {
            normalized = false;
          }
          if (stride === void 0) {
            stride = 0;
          }
          if (offset === void 0) {
            offset = 0;
          }
          this._gl.vertexAttribPointer(this._index, size, this._gl.FLOAT, normalized, stride, offset);
        };
        AttribLocation.prototype.enable = function() {
          this._gl.enableVertexAttribArray(this._index);
        };
        AttribLocation.prototype.disable = function() {
          this._gl.disableVertexAttribArray(this._index);
        };
        AttribLocation.prototype.toString = function() {
          return ['attribute', this._name].join(' ');
        };
        return AttribLocation;
      })();
      exports_1("default", AttribLocation);
    }
  };
});

System.register("davinci-eight/core/makeWebGLShader.js", [], function(exports_1) {
  function makeWebGLShader(gl, source, type) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (compiled) {
      return shader;
    } else {
      if (!gl.isContextLost()) {
        var message = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw new Error("Error compiling shader: " + message);
      } else {
        throw new Error("Context lost while compiling shader");
      }
    }
  }
  exports_1("default", makeWebGLShader);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/core/makeWebGLProgram.js", ["./makeWebGLShader"], function(exports_1) {
  var makeWebGLShader_1;
  function makeWebGLProgram(ctx, vertexShader, fragmentShader, attribs) {
    var vs = makeWebGLShader_1.default(ctx, vertexShader, ctx.VERTEX_SHADER);
    var fs = makeWebGLShader_1.default(ctx, fragmentShader, ctx.FRAGMENT_SHADER);
    var program = ctx.createProgram();
    ctx.attachShader(program, vs);
    ctx.attachShader(program, fs);
    for (var index = 0; index < attribs.length; ++index) {
      ctx.bindAttribLocation(program, index, attribs[index]);
    }
    ctx.linkProgram(program);
    var linked = ctx.getProgramParameter(program, ctx.LINK_STATUS);
    if (linked || ctx.isContextLost()) {
      return program;
    } else {
      var message = ctx.getProgramInfoLog(program);
      ctx.detachShader(program, vs);
      ctx.deleteShader(vs);
      ctx.detachShader(program, fs);
      ctx.deleteShader(fs);
      ctx.deleteProgram(program);
      throw new Error("Error linking program: " + message);
    }
  }
  exports_1("default", makeWebGLProgram);
  return {
    setters: [function(makeWebGLShader_1_1) {
      makeWebGLShader_1 = makeWebGLShader_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/checks/mustBeUndefined.js", ["../checks/mustSatisfy", "../checks/isUndefined"], function(exports_1) {
  var mustSatisfy_1,
      isUndefined_1;
  function beUndefined() {
    return "be 'undefined'";
  }
  function default_1(name, value, contextBuilder) {
    mustSatisfy_1.default(name, isUndefined_1.default(value), beUndefined, contextBuilder);
    return value;
  }
  exports_1("default", default_1);
  return {
    setters: [function(mustSatisfy_1_1) {
      mustSatisfy_1 = mustSatisfy_1_1;
    }, function(isUndefined_1_1) {
      isUndefined_1 = isUndefined_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/core/UniformLocation.js", [], function(exports_1) {
  var UniformLocation;
  return {
    setters: [],
    execute: function() {
      UniformLocation = (function() {
        function UniformLocation(info) {
          this._name = info.name;
        }
        UniformLocation.prototype.contextFree = function() {
          this.contextLost();
        };
        UniformLocation.prototype.contextGain = function(context, program) {
          this.contextLost();
          this._context = context;
          this._location = context.getUniformLocation(program, this._name);
          this._program = program;
        };
        UniformLocation.prototype.contextLost = function() {
          this._context = void 0;
          this._location = void 0;
          this._program = void 0;
        };
        UniformLocation.prototype.vec1 = function(coords) {
          this._context.uniform1f(this._location, coords.x);
          return this;
        };
        UniformLocation.prototype.vec2 = function(coords) {
          this._context.uniform2f(this._location, coords.x, coords.y);
          return this;
        };
        UniformLocation.prototype.vec3 = function(coords) {
          this._context.uniform3f(this._location, coords.x, coords.y, coords.z);
          return this;
        };
        UniformLocation.prototype.vec4 = function(coords) {
          this._context.uniform4f(this._location, coords.x, coords.y, coords.z, coords.w);
          return this;
        };
        UniformLocation.prototype.uniform1f = function(x) {
          this._context.uniform1f(this._location, x);
        };
        UniformLocation.prototype.uniform2f = function(x, y) {
          this._context.uniform2f(this._location, x, y);
        };
        UniformLocation.prototype.uniform3f = function(x, y, z) {
          this._context.uniform3f(this._location, x, y, z);
        };
        UniformLocation.prototype.uniform4f = function(x, y, z, w) {
          this._context.uniform4f(this._location, x, y, z, w);
        };
        UniformLocation.prototype.mat2 = function(matrix, transpose) {
          if (transpose === void 0) {
            transpose = false;
          }
          this._context.uniformMatrix2fv(this._location, transpose, matrix.elements);
          return this;
        };
        UniformLocation.prototype.mat3 = function(matrix, transpose) {
          if (transpose === void 0) {
            transpose = false;
          }
          this._context.uniformMatrix3fv(this._location, transpose, matrix.elements);
          return this;
        };
        UniformLocation.prototype.mat4 = function(matrix, transpose) {
          if (transpose === void 0) {
            transpose = false;
          }
          this._context.uniformMatrix4fv(this._location, transpose, matrix.elements);
          return this;
        };
        UniformLocation.prototype.vector2 = function(data) {
          this._context.uniform2fv(this._location, data);
        };
        UniformLocation.prototype.vector3 = function(data) {
          this._context.uniform3fv(this._location, data);
        };
        UniformLocation.prototype.vector4 = function(data) {
          this._context.uniform4fv(this._location, data);
        };
        UniformLocation.prototype.toString = function() {
          return ['uniform', this._name].join(' ');
        };
        return UniformLocation;
      })();
      exports_1("default", UniformLocation);
    }
  };
});

System.register("davinci-eight/core/Material.js", ["./AttribLocation", "./makeWebGLProgram", "../checks/mustBeArray", "../checks/mustBeString", "../checks/mustBeUndefined", "../i18n/readOnly", "./ShareableContextListener", "./UniformLocation"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var AttribLocation_1,
      makeWebGLProgram_1,
      mustBeArray_1,
      mustBeString_1,
      mustBeUndefined_1,
      readOnly_1,
      ShareableContextListener_1,
      UniformLocation_1;
  var Material;
  return {
    setters: [function(AttribLocation_1_1) {
      AttribLocation_1 = AttribLocation_1_1;
    }, function(makeWebGLProgram_1_1) {
      makeWebGLProgram_1 = makeWebGLProgram_1_1;
    }, function(mustBeArray_1_1) {
      mustBeArray_1 = mustBeArray_1_1;
    }, function(mustBeString_1_1) {
      mustBeString_1 = mustBeString_1_1;
    }, function(mustBeUndefined_1_1) {
      mustBeUndefined_1 = mustBeUndefined_1_1;
    }, function(readOnly_1_1) {
      readOnly_1 = readOnly_1_1;
    }, function(ShareableContextListener_1_1) {
      ShareableContextListener_1 = ShareableContextListener_1_1;
    }, function(UniformLocation_1_1) {
      UniformLocation_1 = UniformLocation_1_1;
    }],
    execute: function() {
      Material = (function(_super) {
        __extends(Material, _super);
        function Material(vertexShader, fragmentShader, attribs) {
          if (attribs === void 0) {
            attribs = [];
          }
          _super.call(this, 'Material');
          this._attributes = {};
          this._uniforms = {};
          this._vertexShader = mustBeString_1.default('vertexShader', vertexShader);
          this._fragmentShader = mustBeString_1.default('fragmentShader', fragmentShader);
          this._attribs = mustBeArray_1.default('attribs', attribs);
        }
        Material.prototype.destructor = function() {
          _super.prototype.destructor.call(this);
          mustBeUndefined_1.default(this._type, this._program);
        };
        Material.prototype.contextGain = function(context) {
          var gl = context.gl;
          if (!this._program) {
            this._program = makeWebGLProgram_1.default(gl, this._vertexShader, this._fragmentShader, this._attribs);
            this._attributes = {};
            this._uniforms = {};
            var aLen = gl.getProgramParameter(this._program, gl.ACTIVE_ATTRIBUTES);
            for (var a = 0; a < aLen; a++) {
              var attribInfo = gl.getActiveAttrib(this._program, a);
              this._attributes[attribInfo.name] = new AttribLocation_1.default(attribInfo);
            }
            var uLen = gl.getProgramParameter(this._program, gl.ACTIVE_UNIFORMS);
            for (var u = 0; u < uLen; u++) {
              var uniformInfo = gl.getActiveUniform(this._program, u);
              this._uniforms[uniformInfo.name] = new UniformLocation_1.default(uniformInfo);
            }
            for (var aName in this._attributes) {
              if (this._attributes.hasOwnProperty(aName)) {
                this._attributes[aName].contextGain(gl, this._program);
              }
            }
            for (var uName in this._uniforms) {
              if (this._uniforms.hasOwnProperty(uName)) {
                this._uniforms[uName].contextGain(gl, this._program);
              }
            }
          }
          _super.prototype.contextGain.call(this, context);
        };
        Material.prototype.contextLost = function() {
          this._program = void 0;
          for (var aName in this._attributes) {
            if (this._attributes.hasOwnProperty(aName)) {
              this._attributes[aName].contextLost();
            }
          }
          for (var uName in this._uniforms) {
            if (this._uniforms.hasOwnProperty(uName)) {
              this._uniforms[uName].contextLost();
            }
          }
          _super.prototype.contextLost.call(this);
        };
        Material.prototype.contextFree = function(context) {
          if (this._program) {
            var gl = context.gl;
            if (gl) {
              if (!gl.isContextLost()) {
                gl.deleteProgram(this._program);
              } else {}
            } else {
              console.warn("memory leak: WebGLProgram has not been deleted because WebGLRenderingContext is not available anymore.");
            }
            this._program = void 0;
          }
          for (var aName in this._attributes) {
            if (this._attributes.hasOwnProperty(aName)) {
              this._attributes[aName].contextFree();
            }
          }
          for (var uName in this._uniforms) {
            if (this._uniforms.hasOwnProperty(uName)) {
              this._uniforms[uName].contextFree();
            }
          }
          _super.prototype.contextFree.call(this, context);
        };
        Material.prototype.use = function() {
          var gl = this.gl;
          if (gl) {
            gl.useProgram(this._program);
          } else {
            console.warn(this._type + ".use() missing WebGL rendering context.");
          }
        };
        Object.defineProperty(Material.prototype, "vertexShader", {
          get: function() {
            return this._vertexShader;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('vertexShader').message);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Material.prototype, "fragmentShader", {
          get: function() {
            return this._fragmentShader;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('fragmentShader').message);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Material.prototype, "attributeNames", {
          get: function() {
            var attributes = this._attributes;
            if (attributes) {
              return Object.keys(attributes);
            } else {
              return void 0;
            }
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('attributeNames').message);
          },
          enumerable: true,
          configurable: true
        });
        Material.prototype.enableAttrib = function(name) {
          var attribLoc = this._attributes[name];
          if (attribLoc) {
            attribLoc.enable();
          }
        };
        Material.prototype.enableAttribs = function() {
          var attribLocations = this._attributes;
          if (attribLocations) {
            var aNames = Object.keys(attribLocations);
            for (var i = 0,
                iLength = aNames.length; i < iLength; i++) {
              attribLocations[aNames[i]].enable();
            }
          }
        };
        Material.prototype.disableAttrib = function(name) {
          var attribLoc = this._attributes[name];
          if (attribLoc) {
            attribLoc.disable();
          }
        };
        Material.prototype.disableAttribs = function() {
          var attribLocations = this._attributes;
          if (attribLocations) {
            var aNames = Object.keys(attribLocations);
            for (var i = 0,
                iLength = aNames.length; i < iLength; i++) {
              attribLocations[aNames[i]].disable();
            }
          }
        };
        Material.prototype.getAttribLocation = function(name) {
          var attribLoc = this._attributes[name];
          if (attribLoc) {
            return attribLoc.index;
          } else {
            return -1;
          }
        };
        Material.prototype.vertexPointer = function(name, size, normalized, stride, offset) {
          var attributeLocation = this._attributes[name];
          attributeLocation.vertexPointer(size, normalized, stride, offset);
        };
        Material.prototype.uniform1f = function(name, x) {
          var uniformLoc = this._uniforms[name];
          if (uniformLoc) {
            uniformLoc.uniform1f(x);
          }
        };
        Material.prototype.uniform2f = function(name, x, y) {
          var uniformLoc = this._uniforms[name];
          if (uniformLoc) {
            uniformLoc.uniform2f(x, y);
          }
        };
        Material.prototype.uniform3f = function(name, x, y, z) {
          var uniformLoc = this._uniforms[name];
          if (uniformLoc) {
            uniformLoc.uniform3f(x, y, z);
          }
        };
        Material.prototype.uniform4f = function(name, x, y, z, w) {
          var uniformLoc = this._uniforms[name];
          if (uniformLoc) {
            uniformLoc.uniform4f(x, y, z, w);
          }
        };
        Material.prototype.mat2 = function(name, matrix, transpose) {
          var uniformLoc = this._uniforms[name];
          if (uniformLoc) {
            uniformLoc.mat2(matrix, transpose);
          }
        };
        Material.prototype.mat3 = function(name, matrix, transpose) {
          var uniformLoc = this._uniforms[name];
          if (uniformLoc) {
            uniformLoc.mat3(matrix, transpose);
          }
        };
        Material.prototype.mat4 = function(name, matrix, transpose) {
          var uniformLoc = this._uniforms[name];
          if (uniformLoc) {
            uniformLoc.mat4(matrix, transpose);
          }
        };
        Material.prototype.vec2 = function(name, vector) {
          var uniformLoc = this._uniforms[name];
          if (uniformLoc) {
            uniformLoc.vec2(vector);
          }
        };
        Material.prototype.vec3 = function(name, vector) {
          var uniformLoc = this._uniforms[name];
          if (uniformLoc) {
            uniformLoc.vec3(vector);
          }
        };
        Material.prototype.vec4 = function(name, vector) {
          var uniformLoc = this._uniforms[name];
          if (uniformLoc) {
            uniformLoc.vec4(vector);
          }
        };
        Material.prototype.vector2 = function(name, data) {
          var uniformLoc = this._uniforms[name];
          if (uniformLoc) {
            uniformLoc.vector2(data);
          }
        };
        Material.prototype.vector3 = function(name, data) {
          var uniformLoc = this._uniforms[name];
          if (uniformLoc) {
            uniformLoc.vector3(data);
          }
        };
        Material.prototype.vector4 = function(name, data) {
          var uniformLoc = this._uniforms[name];
          if (uniformLoc) {
            uniformLoc.vector4(data);
          }
        };
        return Material;
      })(ShareableContextListener_1.default);
      exports_1("default", Material);
    }
  };
});

System.register("davinci-eight/materials/MeshMaterial.js", ["../materials/GraphicsProgramBuilder", "../core/GraphicsProgramSymbols", "../core/Material"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var GraphicsProgramBuilder_1,
      GraphicsProgramSymbols_1,
      Material_1;
  var MeshMaterial;
  function builder() {
    var gpb = new GraphicsProgramBuilder_1.default();
    gpb.attribute(GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION, 3);
    gpb.attribute(GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL, 3);
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_COLOR, 'vec3');
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_MODEL_MATRIX, 'mat4');
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_NORMAL_MATRIX, 'mat3');
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_PROJECTION_MATRIX, 'mat4');
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_VIEW_MATRIX, 'mat4');
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_AMBIENT_LIGHT, 'vec3');
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_COLOR, 'vec3');
    gpb.uniform(GraphicsProgramSymbols_1.default.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION, 'vec3');
    return gpb;
  }
  function vertexShader() {
    return builder().vertexShader();
  }
  function fragmentShader() {
    return builder().fragmentShader();
  }
  return {
    setters: [function(GraphicsProgramBuilder_1_1) {
      GraphicsProgramBuilder_1 = GraphicsProgramBuilder_1_1;
    }, function(GraphicsProgramSymbols_1_1) {
      GraphicsProgramSymbols_1 = GraphicsProgramSymbols_1_1;
    }, function(Material_1_1) {
      Material_1 = Material_1_1;
    }],
    execute: function() {
      MeshMaterial = (function(_super) {
        __extends(MeshMaterial, _super);
        function MeshMaterial() {
          _super.call(this, vertexShader(), fragmentShader());
        }
        return MeshMaterial;
      })(Material_1.default);
      exports_1("default", MeshMaterial);
    }
  };
});

System.register("davinci-eight/geometries/arc3.js", ["../checks/mustBeDefined", "../checks/mustBeInteger", "../checks/mustBeNumber", "../math/Spinor3", "../math/Vector3"], function(exports_1) {
  var mustBeDefined_1,
      mustBeInteger_1,
      mustBeNumber_1,
      Spinor3_1,
      Vector3_1;
  function arc3(begin, angle, generator, segments) {
    mustBeDefined_1.default('begin', begin);
    mustBeNumber_1.default('angle', angle);
    mustBeDefined_1.default('generator', generator);
    mustBeInteger_1.default('segments', segments);
    var points = [];
    var point = Vector3_1.default.copy(begin);
    var rotor = Spinor3_1.default.copy(generator).scale((-angle / 2) / segments).exp();
    points.push(point.clone());
    for (var i = 0; i < segments; i++) {
      point.rotate(rotor);
      points.push(point.clone());
    }
    return points;
  }
  exports_1("default", arc3);
  return {
    setters: [function(mustBeDefined_1_1) {
      mustBeDefined_1 = mustBeDefined_1_1;
    }, function(mustBeInteger_1_1) {
      mustBeInteger_1 = mustBeInteger_1_1;
    }, function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }, function(Spinor3_1_1) {
      Spinor3_1 = Spinor3_1_1;
    }, function(Vector3_1_1) {
      Vector3_1 = Vector3_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/geometries/AxialSimplexPrimitivesBuilder.js", ["../math/R3", "../checks/mustBeObject", "../geometries/SimplexPrimitivesBuilder"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var R3_1,
      mustBeObject_1,
      SimplexPrimitivesBuilder_1;
  var AxialSimplexPrimitivesBuilder;
  return {
    setters: [function(R3_1_1) {
      R3_1 = R3_1_1;
    }, function(mustBeObject_1_1) {
      mustBeObject_1 = mustBeObject_1_1;
    }, function(SimplexPrimitivesBuilder_1_1) {
      SimplexPrimitivesBuilder_1 = SimplexPrimitivesBuilder_1_1;
    }],
    execute: function() {
      AxialSimplexPrimitivesBuilder = (function(_super) {
        __extends(AxialSimplexPrimitivesBuilder, _super);
        function AxialSimplexPrimitivesBuilder(axis) {
          _super.call(this);
          this.setAxis(axis);
        }
        AxialSimplexPrimitivesBuilder.prototype.setAxis = function(axis) {
          mustBeObject_1.default('axis', axis);
          this.axis = R3_1.default.direction(axis);
          return this;
        };
        AxialSimplexPrimitivesBuilder.prototype.setPosition = function(position) {
          _super.prototype.setPosition.call(this, position);
          return this;
        };
        AxialSimplexPrimitivesBuilder.prototype.enableTextureCoords = function(enable) {
          _super.prototype.enableTextureCoords.call(this, enable);
          return this;
        };
        return AxialSimplexPrimitivesBuilder;
      })(SimplexPrimitivesBuilder_1.default);
      exports_1("default", AxialSimplexPrimitivesBuilder);
    }
  };
});

System.register("davinci-eight/geometries/SliceSimplexPrimitivesBuilder.js", ["../geometries/AxialSimplexPrimitivesBuilder", "../checks/isDefined", "../checks/mustBeNumber", "../math/Vector3"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var AxialSimplexPrimitivesBuilder_1,
      isDefined_1,
      mustBeNumber_1,
      Vector3_1;
  var SliceSimplexPrimitivesBuilder;
  function perpendicular(axis) {
    return Vector3_1.default.random().cross(axis).direction();
  }
  return {
    setters: [function(AxialSimplexPrimitivesBuilder_1_1) {
      AxialSimplexPrimitivesBuilder_1 = AxialSimplexPrimitivesBuilder_1_1;
    }, function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }, function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }, function(Vector3_1_1) {
      Vector3_1 = Vector3_1_1;
    }],
    execute: function() {
      SliceSimplexPrimitivesBuilder = (function(_super) {
        __extends(SliceSimplexPrimitivesBuilder, _super);
        function SliceSimplexPrimitivesBuilder(axis, sliceStart, sliceAngle) {
          if (sliceAngle === void 0) {
            sliceAngle = 2 * Math.PI;
          }
          _super.call(this, axis);
          this.sliceAngle = 2 * Math.PI;
          if (isDefined_1.default(sliceStart)) {
            this.sliceStart = Vector3_1.default.copy(sliceStart).direction();
          } else {
            this.sliceStart = perpendicular(this.axis);
          }
          this.sliceAngle = mustBeNumber_1.default('sliceAngle', sliceAngle);
        }
        return SliceSimplexPrimitivesBuilder;
      })(AxialSimplexPrimitivesBuilder_1.default);
      exports_1("default", SliceSimplexPrimitivesBuilder);
    }
  };
});

System.register("davinci-eight/geometries/SphereBuilder.js", ["../geometries/arc3", "../checks/mustBeNumber", "../math/Vector1", "../geometries/Simplex", "../geometries/SliceSimplexPrimitivesBuilder", "../math/Spinor3", "../math/Vector2", "../math/Vector3"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var arc3_1,
      mustBeNumber_1,
      Vector1_1,
      Simplex_1,
      SliceSimplexPrimitivesBuilder_1,
      Spinor3_1,
      Vector2_1,
      Vector3_1;
  var SphereBuilder;
  function computeVertices(radius, axis, phiStart, phiLength, thetaStart, thetaLength, heightSegments, widthSegments, points, uvs) {
    var generator = Spinor3_1.default.dual(axis);
    var iLength = heightSegments + 1;
    var jLength = widthSegments + 1;
    for (var i = 0; i < iLength; i++) {
      var v = i / heightSegments;
      var θ = thetaStart + v * thetaLength;
      var arcRadius = radius * Math.sin(θ);
      var begin = Vector3_1.default.copy(phiStart).scale(arcRadius);
      var arcPoints = arc3_1.default(begin, phiLength, generator, widthSegments);
      var cosθ = Math.cos(θ);
      var displacement = radius * cosθ;
      for (var j = 0; j < jLength; j++) {
        var point = arcPoints[j].add(axis, displacement);
        points.push(point);
        var u = j / widthSegments;
        uvs.push(new Vector2_1.default([u, 1 - v]));
      }
    }
  }
  function quadIndex(i, j, innerSegments) {
    return i * (innerSegments + 1) + j;
  }
  function vertexIndex(qIndex, n, innerSegments) {
    switch (n) {
      case 0:
        return qIndex + 1;
      case 1:
        return qIndex;
      case 2:
        return qIndex + innerSegments + 1;
      case 3:
        return qIndex + innerSegments + 2;
    }
  }
  function makeTriangles(points, uvs, radius, heightSegments, widthSegments, geometry) {
    for (var i = 0; i < heightSegments; i++) {
      for (var j = 0; j < widthSegments; j++) {
        var qIndex = quadIndex(i, j, widthSegments);
        var v0 = vertexIndex(qIndex, 0, widthSegments);
        var v1 = vertexIndex(qIndex, 1, widthSegments);
        var v2 = vertexIndex(qIndex, 2, widthSegments);
        var v3 = vertexIndex(qIndex, 3, widthSegments);
        var n0 = Vector3_1.default.copy(points[v0]).direction();
        var n1 = Vector3_1.default.copy(points[v1]).direction();
        var n2 = Vector3_1.default.copy(points[v2]).direction();
        var n3 = Vector3_1.default.copy(points[v3]).direction();
        var uv0 = uvs[v0].clone();
        var uv1 = uvs[v1].clone();
        var uv2 = uvs[v2].clone();
        var uv3 = uvs[v3].clone();
        if (false) {
          uv0.x = (uv0.x + uv1.x) / 2;
          geometry.triangle([points[v0], points[v2], points[v3]], [n0, n2, n3], [uv0, uv2, uv3]);
        } else if (false) {
          uv2.x = (uv2.x + uv3.x) / 2;
          geometry.triangle([points[v0], points[v1], points[v2]], [n0, n1, n2], [uv0, uv1, uv2]);
        } else {
          geometry.triangle([points[v0], points[v1], points[v3]], [n0, n1, n3], [uv0, uv1, uv3]);
          geometry.triangle([points[v2], points[v3], points[v1]], [n2, n3, n1], [uv2, uv3, uv1]);
        }
      }
    }
  }
  function makeLineSegments(points, uvs, radius, heightSegments, widthSegments, geometry) {
    for (var i = 0; i < heightSegments; i++) {
      for (var j = 0; j < widthSegments; j++) {
        var qIndex = quadIndex(i, j, widthSegments);
        var v0 = vertexIndex(qIndex, 0, widthSegments);
        var v1 = vertexIndex(qIndex, 1, widthSegments);
        var v2 = vertexIndex(qIndex, 2, widthSegments);
        var v3 = vertexIndex(qIndex, 3, widthSegments);
        var n0 = Vector3_1.default.copy(points[v0]).direction();
        var n1 = Vector3_1.default.copy(points[v1]).direction();
        var n2 = Vector3_1.default.copy(points[v2]).direction();
        var n3 = Vector3_1.default.copy(points[v3]).direction();
        var uv0 = uvs[v0].clone();
        var uv1 = uvs[v1].clone();
        var uv2 = uvs[v2].clone();
        var uv3 = uvs[v3].clone();
        if (false) {
          uv0.x = (uv0.x + uv1.x) / 2;
          geometry.triangle([points[v0], points[v2], points[v3]], [n0, n2, n3], [uv0, uv2, uv3]);
        } else if (false) {
          uv2.x = (uv2.x + uv3.x) / 2;
          geometry.triangle([points[v0], points[v1], points[v2]], [n0, n1, n2], [uv0, uv1, uv2]);
        } else {
          geometry.lineSegment([points[v0], points[v1]], [n0, n1], [uv0, uv1]);
          geometry.lineSegment([points[v1], points[v2]], [n1, n2], [uv1, uv2]);
          geometry.lineSegment([points[v2], points[v3]], [n2, n3], [uv2, uv3]);
          geometry.lineSegment([points[v3], points[v0]], [n3, n0], [uv3, uv0]);
        }
      }
    }
  }
  function makePoints(points, uvs, radius, heightSegments, widthSegments, geometry) {
    for (var i = 0; i < heightSegments; i++) {
      for (var j = 0; j < widthSegments; j++) {
        var qIndex = quadIndex(i, j, widthSegments);
        var v0 = vertexIndex(qIndex, 0, widthSegments);
        var v1 = vertexIndex(qIndex, 1, widthSegments);
        var v2 = vertexIndex(qIndex, 2, widthSegments);
        var v3 = vertexIndex(qIndex, 3, widthSegments);
        var n0 = Vector3_1.default.copy(points[v0]).direction();
        var n1 = Vector3_1.default.copy(points[v1]).direction();
        var n2 = Vector3_1.default.copy(points[v2]).direction();
        var n3 = Vector3_1.default.copy(points[v3]).direction();
        var uv0 = uvs[v0].clone();
        var uv1 = uvs[v1].clone();
        var uv2 = uvs[v2].clone();
        var uv3 = uvs[v3].clone();
        if (false) {
          uv0.x = (uv0.x + uv1.x) / 2;
          geometry.triangle([points[v0], points[v2], points[v3]], [n0, n2, n3], [uv0, uv2, uv3]);
        } else if (false) {
          uv2.x = (uv2.x + uv3.x) / 2;
          geometry.triangle([points[v0], points[v1], points[v2]], [n0, n1, n2], [uv0, uv1, uv2]);
        } else {
          geometry.point([points[v0]], [n0], [uv0]);
          geometry.point([points[v1]], [n1], [uv1]);
          geometry.point([points[v2]], [n2], [uv2]);
          geometry.point([points[v3]], [n3], [uv3]);
        }
      }
    }
  }
  return {
    setters: [function(arc3_1_1) {
      arc3_1 = arc3_1_1;
    }, function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }, function(Vector1_1_1) {
      Vector1_1 = Vector1_1_1;
    }, function(Simplex_1_1) {
      Simplex_1 = Simplex_1_1;
    }, function(SliceSimplexPrimitivesBuilder_1_1) {
      SliceSimplexPrimitivesBuilder_1 = SliceSimplexPrimitivesBuilder_1_1;
    }, function(Spinor3_1_1) {
      Spinor3_1 = Spinor3_1_1;
    }, function(Vector2_1_1) {
      Vector2_1 = Vector2_1_1;
    }, function(Vector3_1_1) {
      Vector3_1 = Vector3_1_1;
    }],
    execute: function() {
      SphereBuilder = (function(_super) {
        __extends(SphereBuilder, _super);
        function SphereBuilder(radius, axis, phiStart, phiLength, thetaStart, thetaLength) {
          if (phiLength === void 0) {
            phiLength = 2 * Math.PI;
          }
          if (thetaStart === void 0) {
            thetaStart = 0;
          }
          if (thetaLength === void 0) {
            thetaLength = Math.PI;
          }
          _super.call(this, axis, phiStart, phiLength);
          this._radius = new Vector1_1.default([radius]);
          this.thetaLength = thetaLength;
          this.thetaStart = thetaStart;
          this.setModified(true);
          this.regenerate();
        }
        Object.defineProperty(SphereBuilder.prototype, "radius", {
          get: function() {
            return this._radius.x;
          },
          set: function(radius) {
            this._radius.x = mustBeNumber_1.default('radius', radius);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(SphereBuilder.prototype, "phiLength", {
          get: function() {
            return this.sliceAngle;
          },
          set: function(phiLength) {
            this.sliceAngle = phiLength;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(SphereBuilder.prototype, "phiStart", {
          get: function() {
            return this.sliceStart;
          },
          set: function(phiStart) {
            this.sliceStart.copy(phiStart);
          },
          enumerable: true,
          configurable: true
        });
        SphereBuilder.prototype.setAxis = function(axis) {
          _super.prototype.setAxis.call(this, axis);
          return this;
        };
        SphereBuilder.prototype.setPosition = function(position) {
          _super.prototype.setPosition.call(this, position);
          return this;
        };
        SphereBuilder.prototype.enableTextureCoords = function(enable) {
          _super.prototype.enableTextureCoords.call(this, enable);
          return this;
        };
        SphereBuilder.prototype.isModified = function() {
          return this._radius.modified || _super.prototype.isModified.call(this);
        };
        SphereBuilder.prototype.setModified = function(modified) {
          _super.prototype.setModified.call(this, modified);
          this._radius.modified = modified;
          return this;
        };
        SphereBuilder.prototype.regenerate = function() {
          this.data = [];
          var heightSegments = this.curvedSegments;
          var widthSegments = this.curvedSegments;
          var points = [];
          var uvs = [];
          computeVertices(this.radius, this.axis, this.phiStart, this.phiLength, this.thetaStart, this.thetaLength, heightSegments, widthSegments, points, uvs);
          switch (this.k) {
            case Simplex_1.default.EMPTY:
              {
                makeTriangles(points, uvs, this.radius, heightSegments, widthSegments, this);
              }
              break;
            case Simplex_1.default.POINT:
              {
                makePoints(points, uvs, this.radius, heightSegments, widthSegments, this);
              }
              break;
            case Simplex_1.default.LINE:
              {
                makeLineSegments(points, uvs, this.radius, heightSegments, widthSegments, this);
              }
              break;
            case Simplex_1.default.TRIANGLE:
              {
                makeTriangles(points, uvs, this.radius, heightSegments, widthSegments, this);
              }
              break;
            default:
              {
                console.warn(this.k + "-simplex is not supported for geometry generation.");
              }
          }
          this.setModified(false);
        };
        return SphereBuilder;
      })(SliceSimplexPrimitivesBuilder_1.default);
      exports_1("default", SphereBuilder);
    }
  };
});

System.register("davinci-eight/geometries/SphereGeometry.js", ["../core/GeometryContainer", "../core/GeometryPrimitive", "./SphereBuilder", "../math/R3", "./Simplex", "../checks/isDefined", "../checks/mustBeInteger"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var GeometryContainer_1,
      GeometryPrimitive_1,
      SphereBuilder_1,
      R3_1,
      Simplex_1,
      isDefined_1,
      mustBeInteger_1;
  var SphereGeometry;
  function k(options) {
    if (isDefined_1.default(options.k)) {
      return mustBeInteger_1.default('k', options.k);
    } else {
      return Simplex_1.default.TRIANGLE;
    }
  }
  function primitives(options) {
    var builder = new SphereBuilder_1.default(1, R3_1.default.e2);
    builder.k = k(options);
    return builder.toPrimitives();
  }
  return {
    setters: [function(GeometryContainer_1_1) {
      GeometryContainer_1 = GeometryContainer_1_1;
    }, function(GeometryPrimitive_1_1) {
      GeometryPrimitive_1 = GeometryPrimitive_1_1;
    }, function(SphereBuilder_1_1) {
      SphereBuilder_1 = SphereBuilder_1_1;
    }, function(R3_1_1) {
      R3_1 = R3_1_1;
    }, function(Simplex_1_1) {
      Simplex_1 = Simplex_1_1;
    }, function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }, function(mustBeInteger_1_1) {
      mustBeInteger_1 = mustBeInteger_1_1;
    }],
    execute: function() {
      SphereGeometry = (function(_super) {
        __extends(SphereGeometry, _super);
        function SphereGeometry(options) {
          if (options === void 0) {
            options = {};
          }
          _super.call(this);
          var ps = primitives(options);
          var iLen = ps.length;
          for (var i = 0; i < iLen; i++) {
            var p = ps[i];
            var geometry = new GeometryPrimitive_1.default(p);
            this.addPart(geometry);
            geometry.release();
          }
        }
        return SphereGeometry;
      })(GeometryContainer_1.default);
      exports_1("default", SphereGeometry);
    }
  };
});

System.register("davinci-eight/core/GeometryContainer.js", ["../collections/ShareableArray", "../i18n/readOnly", "../core/Shareable"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var ShareableArray_1,
      readOnly_1,
      Shareable_1;
  var GeometryContainer;
  return {
    setters: [function(ShareableArray_1_1) {
      ShareableArray_1 = ShareableArray_1_1;
    }, function(readOnly_1_1) {
      readOnly_1 = readOnly_1_1;
    }, function(Shareable_1_1) {
      Shareable_1 = Shareable_1_1;
    }],
    execute: function() {
      GeometryContainer = (function(_super) {
        __extends(GeometryContainer, _super);
        function GeometryContainer() {
          _super.call(this, 'GeometryContainer');
          this._parts = new ShareableArray_1.default();
        }
        GeometryContainer.prototype.destructor = function() {
          this._parts.release();
          this._parts = void 0;
          _super.prototype.destructor.call(this);
        };
        GeometryContainer.prototype.isLeaf = function() {
          return false;
        };
        Object.defineProperty(GeometryContainer.prototype, "partsLength", {
          get: function() {
            return this._parts.length;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('partsLength').message);
          },
          enumerable: true,
          configurable: true
        });
        GeometryContainer.prototype.addPart = function(geometry) {
          this._parts.push(geometry);
        };
        GeometryContainer.prototype.removePart = function(index) {
          var removals = this._parts.splice(index, 1);
          removals.release();
        };
        GeometryContainer.prototype.getPart = function(index) {
          return this._parts.get(index);
        };
        GeometryContainer.prototype.draw = function(material) {
          this._parts.forEach(function(buffer) {
            buffer.draw(material);
          });
        };
        GeometryContainer.prototype.contextFree = function(manager) {
          this._parts.forEach(function(buffer) {
            buffer.contextFree(manager);
          });
        };
        GeometryContainer.prototype.contextGain = function(manager) {
          this._parts.forEach(function(buffer) {
            buffer.contextGain(manager);
          });
        };
        GeometryContainer.prototype.contextLost = function() {
          this._parts.forEach(function(buffer) {
            buffer.contextLost();
          });
        };
        return GeometryContainer;
      })(Shareable_1.default);
      exports_1("default", GeometryContainer);
    }
  };
});

System.register("davinci-eight/core/computeAttributes.js", [], function(exports_1) {
  function computeAttributes(primitive, attributeNames) {
    var attribs = primitive.attributes;
    var kLen = attributeNames.length;
    var values = [];
    var iLen = primitive.indices.length;
    for (var i = 0; i < iLen; i++) {
      for (var k = 0; k < kLen; k++) {
        var key = attributeNames[k];
        var attrib = attribs[key];
        var size = attrib.size;
        for (var s = 0; s < size; s++) {
          values.push(attrib.values[i * size + s]);
        }
      }
    }
    return values;
  }
  exports_1("default", computeAttributes);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/core/computePointers.js", [], function(exports_1) {
  function computePointers(primitive, attributeNames) {
    var attribs = primitive.attributes;
    var kLen = attributeNames.length;
    var pointers = [];
    var offset = 0;
    for (var k = 0; k < kLen; k++) {
      var aName = attributeNames[k];
      var attrib = attribs[aName];
      pointers.push({
        name: aName,
        size: attrib.size,
        normalized: true,
        offset: offset
      });
      offset += attrib.size * 4;
    }
    return pointers;
  }
  exports_1("default", computePointers);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/core/computeStride.js", [], function(exports_1) {
  function computePointers(primitive, attributeNames) {
    var attribs = primitive.attributes;
    var kLen = attributeNames.length;
    var stride = 0;
    for (var k = 0; k < kLen; k++) {
      var aName = attributeNames[k];
      var attrib = attribs[aName];
      stride += attrib.size * 4;
    }
    return stride;
  }
  exports_1("default", computePointers);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/core/vertexArraysFromPrimitive.js", ["./computeAttributes", "./computePointers", "./computeStride"], function(exports_1) {
  var computeAttributes_1,
      computePointers_1,
      computeStride_1;
  function default_1(primitive, order) {
    var keys = order ? order : Object.keys(primitive.attributes);
    var that = {
      drawMode: primitive.mode,
      indices: primitive.indices,
      attributes: computeAttributes_1.default(primitive, keys),
      stride: computeStride_1.default(primitive, keys),
      pointers: computePointers_1.default(primitive, keys)
    };
    return that;
  }
  exports_1("default", default_1);
  return {
    setters: [function(computeAttributes_1_1) {
      computeAttributes_1 = computeAttributes_1_1;
    }, function(computePointers_1_1) {
      computePointers_1 = computePointers_1_1;
    }, function(computeStride_1_1) {
      computeStride_1 = computeStride_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/core/drawModeToGL.js", ["./DrawMode"], function(exports_1) {
  var DrawMode_1;
  function default_1(mode, gl) {
    switch (mode) {
      case DrawMode_1.default.TRIANGLE_STRIP:
        return gl.TRIANGLE_STRIP;
      case DrawMode_1.default.TRIANGLE_FAN:
        return gl.TRIANGLE_FAN;
      case DrawMode_1.default.TRIANGLES:
        return gl.TRIANGLES;
      case DrawMode_1.default.LINE_STRIP:
        return gl.LINE_STRIP;
      case DrawMode_1.default.LINE_LOOP:
        return gl.LINE_LOOP;
      case DrawMode_1.default.LINES:
        return gl.LINES;
      case DrawMode_1.default.POINTS:
        return gl.POINTS;
      default:
        throw new Error("Undexpected mode: " + mode);
    }
  }
  exports_1("default", default_1);
  return {
    setters: [function(DrawMode_1_1) {
      DrawMode_1 = DrawMode_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/i18n/notSupported.js", ["../checks/mustBeString"], function(exports_1) {
  var mustBeString_1;
  function default_1(name) {
    mustBeString_1.default('name', name);
    var message = {get message() {
        return "Method `" + name + "` is not supported.";
      }};
    return message;
  }
  exports_1("default", default_1);
  return {
    setters: [function(mustBeString_1_1) {
      mustBeString_1 = mustBeString_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/core/GeometryElements.js", ["./drawModeToGL", "../i18n/notSupported", "../i18n/readOnly", "./ShareableContextListener"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var drawModeToGL_1,
      notSupported_1,
      readOnly_1,
      ShareableContextListener_1;
  var GeometryElements;
  return {
    setters: [function(drawModeToGL_1_1) {
      drawModeToGL_1 = drawModeToGL_1_1;
    }, function(notSupported_1_1) {
      notSupported_1 = notSupported_1_1;
    }, function(readOnly_1_1) {
      readOnly_1 = readOnly_1_1;
    }, function(ShareableContextListener_1_1) {
      ShareableContextListener_1 = ShareableContextListener_1_1;
    }],
    execute: function() {
      GeometryElements = (function(_super) {
        __extends(GeometryElements, _super);
        function GeometryElements(dataSource) {
          _super.call(this, 'GeometryElements');
          this.offset = 0;
          this.drawMode = dataSource.drawMode;
          this.count = dataSource.indices.length;
          this.ia = new Uint16Array(dataSource.indices);
          this.va = new Float32Array(dataSource.attributes);
          this.stride = dataSource.stride;
          this.pointers = dataSource.pointers;
        }
        GeometryElements.prototype.destructor = function() {
          _super.prototype.destructor.call(this);
        };
        GeometryElements.prototype.isLeaf = function() {
          return true;
        };
        Object.defineProperty(GeometryElements.prototype, "partsLength", {
          get: function() {
            return 0;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('partsLength').message);
          },
          enumerable: true,
          configurable: true
        });
        GeometryElements.prototype.addPart = function(geometry) {
          throw new Error(notSupported_1.default('addPart').message);
        };
        GeometryElements.prototype.removePart = function(index) {
          throw new Error(notSupported_1.default('removePart').message);
        };
        GeometryElements.prototype.getPart = function(index) {
          throw new Error(notSupported_1.default('getPart').message);
        };
        GeometryElements.prototype.contextFree = function(context) {
          var gl = context.gl;
          if (this.ibo) {
            gl.deleteBuffer(this.ibo);
            this.ibo = void 0;
          }
          if (this.vbo) {
            gl.deleteBuffer(this.vbo);
            this.vbo = void 0;
          }
          _super.prototype.contextFree.call(this, context);
        };
        GeometryElements.prototype.contextGain = function(context) {
          var gl = context.gl;
          this.mode = drawModeToGL_1.default(this.drawMode, gl);
          if (!this.ibo) {
            this.ibo = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.ia, gl.STATIC_DRAW);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, void 0);
          }
          if (!this.vbo) {
            this.vbo = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
            gl.bufferData(gl.ARRAY_BUFFER, this.va, gl.STATIC_DRAW);
            gl.bindBuffer(gl.ARRAY_BUFFER, void 0);
          }
          _super.prototype.contextGain.call(this, context);
        };
        GeometryElements.prototype.contextLost = function() {
          this.ibo = void 0;
          this.vbo = void 0;
          _super.prototype.contextLost.call(this);
        };
        GeometryElements.prototype.draw = function(material) {
          var gl = this.mirror.gl;
          gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
          for (var i = 0; i < this.pointers.length; i++) {
            var pointer = this.pointers[i];
            var attribLoc = material.getAttribLocation(pointer.name);
            if (attribLoc >= 0) {
              gl.vertexAttribPointer(attribLoc, pointer.size, gl.FLOAT, pointer.normalized, this.stride, pointer.offset);
              gl.enableVertexAttribArray(attribLoc);
            }
          }
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
          gl.drawElements(this.mode, this.count, gl.UNSIGNED_SHORT, this.offset);
          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, void 0);
          gl.bindBuffer(gl.ARRAY_BUFFER, void 0);
        };
        return GeometryElements;
      })(ShareableContextListener_1.default);
      exports_1("default", GeometryElements);
    }
  };
});

System.register("davinci-eight/core/GeometryPrimitive.js", ["./vertexArraysFromPrimitive", "./GeometryElements"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var vertexArraysFromPrimitive_1,
      GeometryElements_1;
  var GeometryPrimitive;
  return {
    setters: [function(vertexArraysFromPrimitive_1_1) {
      vertexArraysFromPrimitive_1 = vertexArraysFromPrimitive_1_1;
    }, function(GeometryElements_1_1) {
      GeometryElements_1 = GeometryElements_1_1;
    }],
    execute: function() {
      GeometryPrimitive = (function(_super) {
        __extends(GeometryPrimitive, _super);
        function GeometryPrimitive(dataSource) {
          _super.call(this, vertexArraysFromPrimitive_1.default(dataSource));
        }
        return GeometryPrimitive;
      })(GeometryElements_1.default);
      exports_1("default", GeometryPrimitive);
    }
  };
});

System.register("davinci-eight/math/R3.js", ["../core", "../checks/mustBeNumber", "../i18n/readOnly"], function(exports_1) {
  var core_1,
      mustBeNumber_1,
      readOnly_1;
  var R3;
  return {
    setters: [function(core_1_1) {
      core_1 = core_1_1;
    }, function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }, function(readOnly_1_1) {
      readOnly_1 = readOnly_1_1;
    }],
    execute: function() {
      R3 = (function() {
        function R3(x, y, z, uom) {
          if (core_1.default.safemode) {
            mustBeNumber_1.default('x', x);
            mustBeNumber_1.default('y', y);
            mustBeNumber_1.default('z', z);
          }
          this._coords = [x, y, z];
          this._uom = uom;
        }
        Object.defineProperty(R3.prototype, "x", {
          get: function() {
            return this._coords[0];
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('x').message);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(R3.prototype, "y", {
          get: function() {
            return this._coords[1];
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('y').message);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(R3.prototype, "z", {
          get: function() {
            return this._coords[2];
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('z').message);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(R3.prototype, "uom", {
          get: function() {
            return this._uom;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('uom').message);
          },
          enumerable: true,
          configurable: true
        });
        R3.prototype.magnitude = function() {
          return Math.sqrt(this.squaredNorm());
        };
        R3.prototype.neg = function() {
          return this.scale(-1);
        };
        R3.prototype.scale = function(α) {
          return new R3(α * this.x, α * this.y, α * this.z, this.uom);
        };
        R3.prototype.squaredNorm = function() {
          var x = this.x;
          var y = this.y;
          var z = this.z;
          return x * x + y * y + z * z;
        };
        R3.fromVector = function(vector) {
          return new R3(vector.x, vector.y, vector.z, vector.uom);
        };
        R3.direction = function(vector) {
          var x = vector.x;
          var y = vector.y;
          var z = vector.z;
          var m = Math.sqrt(x * x + y * y + z * z);
          return new R3(x / m, y / m, z / m, void 0);
        };
        R3.zero = new R3(0, 0, 0, void 0);
        R3.e1 = new R3(1, 0, 0, void 0);
        R3.e2 = new R3(0, 1, 0, void 0);
        R3.e3 = new R3(0, 0, 1, void 0);
        return R3;
      })();
      exports_1("default", R3);
    }
  };
});

System.register("davinci-eight/geometries/PrimitivesBuilder.js", ["../math/R3", "../checks/mustBeBoolean", "../checks/mustBeObject"], function(exports_1) {
  var R3_1,
      mustBeBoolean_1,
      mustBeObject_1;
  var PrimitivesBuilder;
  return {
    setters: [function(R3_1_1) {
      R3_1 = R3_1_1;
    }, function(mustBeBoolean_1_1) {
      mustBeBoolean_1 = mustBeBoolean_1_1;
    }, function(mustBeObject_1_1) {
      mustBeObject_1 = mustBeObject_1_1;
    }],
    execute: function() {
      PrimitivesBuilder = (function() {
        function PrimitivesBuilder() {
          this._position = R3_1.default.zero;
          this.useTextureCoords = false;
        }
        Object.defineProperty(PrimitivesBuilder.prototype, "position", {
          get: function() {
            return this._position;
          },
          set: function(position) {
            this.setPosition(position);
          },
          enumerable: true,
          configurable: true
        });
        PrimitivesBuilder.prototype.enableTextureCoords = function(enable) {
          mustBeBoolean_1.default('enable', enable);
          this.useTextureCoords = enable;
          return this;
        };
        PrimitivesBuilder.prototype.setPosition = function(position) {
          mustBeObject_1.default('position', position);
          this._position = R3_1.default.fromVector(position);
          return this;
        };
        PrimitivesBuilder.prototype.toPrimitives = function() {
          console.warn("toPrimitives() must be implemented by derived classes.");
          return [];
        };
        return PrimitivesBuilder;
      })();
      exports_1("default", PrimitivesBuilder);
    }
  };
});

System.register("davinci-eight/collections/copyToArray.js", [], function(exports_1) {
  function copyToArray(source, destination, offset) {
    if (destination === void 0) {
      destination = [];
    }
    if (offset === void 0) {
      offset = 0;
    }
    var length = source.length;
    for (var i = 0; i < length; i++) {
      destination[offset + i] = source[i];
    }
    return destination;
  }
  exports_1("default", copyToArray);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/geometries/dataFromVectorN.js", ["../math/G2m", "../math/G3m", "../math/Vector2", "../math/Vector3"], function(exports_1) {
  var G2m_1,
      G3m_1,
      Vector2_1,
      Vector3_1;
  function dataFromVectorN(source) {
    if (source instanceof G3m_1.default) {
      var g3 = source;
      return [g3.x, g3.y, g3.z];
    } else if (source instanceof G2m_1.default) {
      var g2 = source;
      return [g2.x, g2.y];
    } else if (source instanceof Vector3_1.default) {
      var v3 = source;
      return [v3.x, v3.y, v3.z];
    } else if (source instanceof Vector2_1.default) {
      var v2 = source;
      return [v2.x, v2.y];
    } else {
      return source.coords;
    }
  }
  exports_1("default", dataFromVectorN);
  return {
    setters: [function(G2m_1_1) {
      G2m_1 = G2m_1_1;
    }, function(G3m_1_1) {
      G3m_1 = G3m_1_1;
    }, function(Vector2_1_1) {
      Vector2_1 = Vector2_1_1;
    }, function(Vector3_1_1) {
      Vector3_1 = Vector3_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/geometries/DrawAttribute.js", [], function(exports_1) {
  var DrawAttribute;
  function isVectorN(values) {
    return true;
  }
  function checkValues(values) {
    if (!isVectorN(values)) {
      throw new Error("values must be a number[]");
    }
    return values;
  }
  function isExactMultipleOf(numer, denom) {
    return numer % denom === 0;
  }
  function checkSize(size, values) {
    if (typeof size === 'number') {
      if (!isExactMultipleOf(values.length, size)) {
        throw new Error("values.length must be an exact multiple of size");
      }
    } else {
      throw new Error("size must be a number");
    }
    return size;
  }
  return {
    setters: [],
    execute: function() {
      DrawAttribute = (function() {
        function DrawAttribute(values, size) {
          this.values = checkValues(values);
          this.size = checkSize(size, values);
        }
        return DrawAttribute;
      })();
      exports_1("default", DrawAttribute);
    }
  };
});

System.register("davinci-eight/core/DrawMode.js", [], function(exports_1) {
  var DrawMode;
  return {
    setters: [],
    execute: function() {
      (function(DrawMode) {
        DrawMode[DrawMode["POINTS"] = 0] = "POINTS";
        DrawMode[DrawMode["LINES"] = 1] = "LINES";
        DrawMode[DrawMode["LINE_STRIP"] = 2] = "LINE_STRIP";
        DrawMode[DrawMode["LINE_LOOP"] = 3] = "LINE_LOOP";
        DrawMode[DrawMode["TRIANGLES"] = 4] = "TRIANGLES";
        DrawMode[DrawMode["TRIANGLE_STRIP"] = 5] = "TRIANGLE_STRIP";
        DrawMode[DrawMode["TRIANGLE_FAN"] = 6] = "TRIANGLE_FAN";
      })(DrawMode || (DrawMode = {}));
      exports_1("default", DrawMode);
    }
  };
});

System.register("davinci-eight/geometries/DrawPrimitive.js", ["../checks/mustBeArray", "../checks/mustBeInteger", "../checks/mustBeObject"], function(exports_1) {
  var mustBeArray_1,
      mustBeInteger_1,
      mustBeObject_1;
  var DrawPrimitive;
  return {
    setters: [function(mustBeArray_1_1) {
      mustBeArray_1 = mustBeArray_1_1;
    }, function(mustBeInteger_1_1) {
      mustBeInteger_1 = mustBeInteger_1_1;
    }, function(mustBeObject_1_1) {
      mustBeObject_1 = mustBeObject_1_1;
    }],
    execute: function() {
      DrawPrimitive = (function() {
        function DrawPrimitive(mode, indices, attributes) {
          this.attributes = {};
          this.mode = mustBeInteger_1.default('mode', mode);
          this.indices = mustBeArray_1.default('indices', indices);
          this.attributes = mustBeObject_1.default('attributes', attributes);
        }
        return DrawPrimitive;
      })();
      exports_1("default", DrawPrimitive);
    }
  };
});

System.register("davinci-eight/geometries/computeUniqueVertices.js", [], function(exports_1) {
  function computeUniqueVertices(geometry) {
    var map = {};
    var vertices = [];
    function munge(vertex) {
      var key = vertex.toString();
      if (map[key]) {
        var existing = map[key];
        vertex.index = existing.index;
      } else {
        vertex.index = vertices.length;
        vertices.push(vertex);
        map[key] = vertex;
      }
    }
    geometry.forEach(function(simplex) {
      simplex.vertices.forEach(function(vertex) {
        munge(vertex);
      });
    });
    return vertices;
  }
  exports_1("default", computeUniqueVertices);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/geometries/simplicesToDrawPrimitive.js", ["../collections/copyToArray", "../geometries/dataFromVectorN", "../geometries/DrawAttribute", "../core/DrawMode", "../geometries/DrawPrimitive", "../geometries/simplicesToGeometryMeta", "../geometries/computeUniqueVertices", "../checks/expectArg", "../geometries/Simplex", "../math/VectorN"], function(exports_1) {
  var copyToArray_1,
      dataFromVectorN_1,
      DrawAttribute_1,
      DrawMode_1,
      DrawPrimitive_1,
      simplicesToGeometryMeta_1,
      computeUniqueVertices_1,
      expectArg_1,
      Simplex_1,
      VectorN_1;
  function numberList(size, value) {
    var data = [];
    for (var i = 0; i < size; i++) {
      data.push(value);
    }
    return data;
  }
  function attribName(name, attribMap) {
    expectArg_1.default('name', name).toBeString();
    expectArg_1.default('attribMap', attribMap).toBeObject();
    var meta = attribMap[name];
    if (meta) {
      var alias = meta.name;
      return alias ? alias : name;
    } else {
      throw new Error("Unable to compute name; missing attribute specification for " + name);
    }
  }
  function attribSize(key, attribMap) {
    expectArg_1.default('key', key).toBeString();
    expectArg_1.default('attribMap', attribMap).toBeObject();
    var meta = attribMap[key];
    if (meta) {
      var size = meta.size;
      expectArg_1.default('size', size).toBeNumber();
      return meta.size;
    } else {
      throw new Error("Unable to compute size; missing attribute specification for " + key);
    }
  }
  function concat(a, b) {
    return a.concat(b);
  }
  function simplicesToDrawPrimitive(simplices, geometryMeta) {
    expectArg_1.default('simplices', simplices).toBeObject();
    var actuals = simplicesToGeometryMeta_1.default(simplices);
    if (geometryMeta) {
      expectArg_1.default('geometryMeta', geometryMeta).toBeObject();
    } else {
      geometryMeta = actuals;
    }
    var attribMap = geometryMeta.attributes;
    var keys = Object.keys(attribMap);
    var keysLen = keys.length;
    var k;
    var vertices = computeUniqueVertices_1.default(simplices);
    var vsLength = vertices.length;
    var i;
    var indices = simplices.map(Simplex_1.default.indices).reduce(concat, []);
    var outputs = [];
    for (k = 0; k < keysLen; k++) {
      var key = keys[k];
      var dims = attribSize(key, attribMap);
      var data = numberList(vsLength * dims, void 0);
      outputs.push({
        data: data,
        dimensions: dims,
        name: attribName(key, attribMap)
      });
    }
    for (i = 0; i < vsLength; i++) {
      var vertex = vertices[i];
      var vertexAttribs = vertex.attributes;
      if (vertex.index !== i) {
        expectArg_1.default('vertex.index', i).toSatisfy(false, "vertex.index must equal loop index, i");
      }
      for (k = 0; k < keysLen; k++) {
        var output = outputs[k];
        var size = output.dimensions;
        var value = vertexAttribs[keys[k]];
        if (!value) {
          value = new VectorN_1.default(numberList(size, 0), false, size);
        }
        var data = dataFromVectorN_1.default(value);
        copyToArray_1.default(data, output.data, i * output.dimensions);
      }
    }
    var attributes = {};
    for (k = 0; k < keysLen; k++) {
      var output = outputs[k];
      var data = output.data;
      attributes[output.name] = new DrawAttribute_1.default(data, output.dimensions);
    }
    switch (geometryMeta.k) {
      case Simplex_1.default.TRIANGLE:
        {
          return new DrawPrimitive_1.default(DrawMode_1.default.TRIANGLES, indices, attributes);
        }
        break;
      case Simplex_1.default.LINE:
        {
          return new DrawPrimitive_1.default(DrawMode_1.default.LINES, indices, attributes);
        }
        break;
      case Simplex_1.default.POINT:
        {
          return new DrawPrimitive_1.default(DrawMode_1.default.POINTS, indices, attributes);
        }
        break;
      case Simplex_1.default.EMPTY:
        {
          return new DrawPrimitive_1.default(DrawMode_1.default.POINTS, indices, attributes);
        }
        break;
      default:
        {
          throw new Error("k => " + geometryMeta.k);
        }
    }
  }
  exports_1("default", simplicesToDrawPrimitive);
  return {
    setters: [function(copyToArray_1_1) {
      copyToArray_1 = copyToArray_1_1;
    }, function(dataFromVectorN_1_1) {
      dataFromVectorN_1 = dataFromVectorN_1_1;
    }, function(DrawAttribute_1_1) {
      DrawAttribute_1 = DrawAttribute_1_1;
    }, function(DrawMode_1_1) {
      DrawMode_1 = DrawMode_1_1;
    }, function(DrawPrimitive_1_1) {
      DrawPrimitive_1 = DrawPrimitive_1_1;
    }, function(simplicesToGeometryMeta_1_1) {
      simplicesToGeometryMeta_1 = simplicesToGeometryMeta_1_1;
    }, function(computeUniqueVertices_1_1) {
      computeUniqueVertices_1 = computeUniqueVertices_1_1;
    }, function(expectArg_1_1) {
      expectArg_1 = expectArg_1_1;
    }, function(Simplex_1_1) {
      Simplex_1 = Simplex_1_1;
    }, function(VectorN_1_1) {
      VectorN_1 = VectorN_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/math/dotVectorE2.js", ["../checks/isDefined"], function(exports_1) {
  var isDefined_1;
  function dotVectorE2(a, b) {
    if (isDefined_1.default(a) && isDefined_1.default(b)) {
      return a.x * b.x + a.y * b.y;
    } else {
      return void 0;
    }
  }
  exports_1("default", dotVectorE2);
  return {
    setters: [function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/math/G2.js", ["../geometries/b2", "../geometries/b3", "./extE2", "./gauss", "./lcoE2", "./rcoE2", "./mulE2", "../i18n/notImplemented", "../i18n/readOnly", "./scpE2", "./stringFromCoordinates", "./Unit"], function(exports_1) {
  var b2_1,
      b3_1,
      extE2_1,
      gauss_1,
      lcoE2_1,
      rcoE2_1,
      mulE2_1,
      notImplemented_1,
      readOnly_1,
      scpE2_1,
      stringFromCoordinates_1,
      Unit_1;
  var COORD_SCALAR,
      COORD_X,
      COORD_Y,
      COORD_PSEUDO,
      G2;
  function add00(a00, a01, a10, a11, b00, b01, b10, b11) {
    a00 = +a00;
    a01 = +a01;
    a10 = +a10;
    a11 = +a11;
    b00 = +b00;
    b01 = +b01;
    b10 = +b10;
    b11 = +b11;
    return +(a00 + b00);
  }
  function add01(a00, a01, a10, a11, b00, b01, b10, b11) {
    a00 = +a00;
    a01 = +a01;
    a10 = +a10;
    a11 = +a11;
    b00 = +b00;
    b01 = +b01;
    b10 = +b10;
    b11 = +b11;
    return +(a01 + b01);
  }
  function add10(a00, a01, a10, a11, b00, b01, b10, b11) {
    a00 = +a00;
    a01 = +a01;
    a10 = +a10;
    a11 = +a11;
    b00 = +b00;
    b01 = +b01;
    b10 = +b10;
    b11 = +b11;
    return +(a10 + b10);
  }
  function add11(a00, a01, a10, a11, b00, b01, b10, b11) {
    a00 = +a00;
    a01 = +a01;
    a10 = +a10;
    a11 = +a11;
    b00 = +b00;
    b01 = +b01;
    b10 = +b10;
    b11 = +b11;
    return +(a11 + b11);
  }
  function subE2(a0, a1, a2, a3, b0, b1, b2, b3, index) {
    a0 = +a0;
    a1 = +a1;
    a2 = +a2;
    a3 = +a3;
    b0 = +b0;
    b1 = +b1;
    b2 = +b2;
    b3 = +b3;
    index = index | 0;
    var x = 0.0;
    switch (~(~index)) {
      case 0:
        {
          x = +(a0 - b0);
        }
        break;
      case 1:
        {
          x = +(a1 - b1);
        }
        break;
      case 2:
        {
          x = +(a2 - b2);
        }
        break;
      case 3:
        {
          x = +(a3 - b3);
        }
        break;
      default:
        {
          throw new Error("index must be in the range [0..3]");
        }
    }
    return +x;
  }
  return {
    setters: [function(b2_1_1) {
      b2_1 = b2_1_1;
    }, function(b3_1_1) {
      b3_1 = b3_1_1;
    }, function(extE2_1_1) {
      extE2_1 = extE2_1_1;
    }, function(gauss_1_1) {
      gauss_1 = gauss_1_1;
    }, function(lcoE2_1_1) {
      lcoE2_1 = lcoE2_1_1;
    }, function(rcoE2_1_1) {
      rcoE2_1 = rcoE2_1_1;
    }, function(mulE2_1_1) {
      mulE2_1 = mulE2_1_1;
    }, function(notImplemented_1_1) {
      notImplemented_1 = notImplemented_1_1;
    }, function(readOnly_1_1) {
      readOnly_1 = readOnly_1_1;
    }, function(scpE2_1_1) {
      scpE2_1 = scpE2_1_1;
    }, function(stringFromCoordinates_1_1) {
      stringFromCoordinates_1 = stringFromCoordinates_1_1;
    }, function(Unit_1_1) {
      Unit_1 = Unit_1_1;
    }],
    execute: function() {
      COORD_SCALAR = 0;
      COORD_X = 1;
      COORD_Y = 2;
      COORD_PSEUDO = 3;
      G2 = (function() {
        function G2(α, x, y, β, uom) {
          if (α === void 0) {
            α = 0;
          }
          if (x === void 0) {
            x = 0;
          }
          if (y === void 0) {
            y = 0;
          }
          if (β === void 0) {
            β = 0;
          }
          this._coords = [0, 0, 0, 0];
          this._coords[COORD_SCALAR] = α;
          this._coords[COORD_X] = x;
          this._coords[COORD_Y] = y;
          this._coords[COORD_PSEUDO] = β;
          this.uom = uom;
          if (this.uom && this.uom.multiplier !== 1) {
            var multiplier = this.uom.multiplier;
            this._coords[COORD_SCALAR] *= multiplier;
            this._coords[COORD_X] *= multiplier;
            this._coords[COORD_Y] *= multiplier;
            this._coords[COORD_PSEUDO] *= multiplier;
            this.uom = new Unit_1.default(1, uom.dimensions, uom.labels);
          }
        }
        Object.defineProperty(G2, "zero", {
          get: function() {
            return G2._zero;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('zero').message);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(G2, "one", {
          get: function() {
            return G2._one;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('one').message);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(G2, "e1", {
          get: function() {
            return G2._e1;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('e1').message);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(G2, "e2", {
          get: function() {
            return G2._e2;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('e2').message);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(G2, "I", {
          get: function() {
            return G2._I;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('I').message);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(G2.prototype, "α", {
          get: function() {
            return this._coords[COORD_SCALAR];
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('α').message);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(G2.prototype, "alpha", {
          get: function() {
            return this._coords[COORD_SCALAR];
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('alpha').message);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(G2.prototype, "x", {
          get: function() {
            return this._coords[COORD_X];
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('x').message);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(G2.prototype, "y", {
          get: function() {
            return this._coords[COORD_Y];
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('y').message);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(G2.prototype, "β", {
          get: function() {
            return this._coords[COORD_PSEUDO];
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('β').message);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(G2.prototype, "beta", {
          get: function() {
            return this._coords[COORD_PSEUDO];
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('beta').message);
          },
          enumerable: true,
          configurable: true
        });
        G2.prototype.fromCartesian = function(α, x, y, β, uom) {
          return new G2(α, x, y, β, uom);
        };
        G2.prototype.fromPolar = function(α, r, θ, β, uom) {
          return new G2(α, r * Math.cos(θ), r * Math.sin(θ), β, uom);
        };
        Object.defineProperty(G2.prototype, "coords", {
          get: function() {
            return [this.α, this.x, this.y, this.β];
          },
          enumerable: true,
          configurable: true
        });
        G2.prototype.coordinate = function(index) {
          switch (index) {
            case 0:
              return this.α;
            case 1:
              return this.x;
            case 2:
              return this.y;
            case 3:
              return this.β;
            default:
              throw new Error("index must be in the range [0..3]");
          }
        };
        G2.add = function(a, b) {
          var a00 = a[0];
          var a01 = a[1];
          var a10 = a[2];
          var a11 = a[3];
          var b00 = b[0];
          var b01 = b[1];
          var b10 = b[2];
          var b11 = b[3];
          var x00 = add00(a00, a01, a10, a11, b00, b01, b10, b11);
          var x01 = add01(a00, a01, a10, a11, b00, b01, b10, b11);
          var x10 = add10(a00, a01, a10, a11, b00, b01, b10, b11);
          var x11 = add11(a00, a01, a10, a11, b00, b01, b10, b11);
          return [x00, x01, x10, x11];
        };
        G2.prototype.add = function(rhs) {
          var xs = G2.add(this.coords, rhs.coords);
          return new G2(xs[0], xs[1], xs[2], xs[3], Unit_1.default.compatible(this.uom, rhs.uom));
        };
        G2.prototype.addPseudo = function(β) {
          return new G2(this.α, this.x, this.y, this.β + β, this.uom);
        };
        G2.prototype.addScalar = function(α) {
          return new G2(this.α + α, this.x, this.y, this.β, this.uom);
        };
        G2.prototype.adj = function() {
          throw new Error("TODO: adj");
        };
        G2.prototype.__add__ = function(other) {
          if (other instanceof G2) {
            return this.add(other);
          } else if (typeof other === 'number') {
            return this.add(new G2(other, 0, 0, 0, undefined));
          }
        };
        G2.prototype.__radd__ = function(other) {
          if (other instanceof G2) {
            return other.add(this);
          } else if (typeof other === 'number') {
            return new G2(other, 0, 0, 0, undefined).add(this);
          }
        };
        G2.prototype.angle = function() {
          return this.log().grade(2);
        };
        G2.prototype.clone = function() {
          return this;
        };
        G2.prototype.conj = function() {
          throw new Error(notImplemented_1.default('conj').message);
        };
        G2.prototype.cubicBezier = function(t, controlBegin, controlEnd, endPoint) {
          var α = b3_1.default(t, this.α, controlBegin.α, controlEnd.α, endPoint.α);
          var x = b3_1.default(t, this.x, controlBegin.x, controlEnd.x, endPoint.x);
          var y = b3_1.default(t, this.y, controlBegin.y, controlEnd.y, endPoint.y);
          var β = b3_1.default(t, this.β, controlBegin.β, controlEnd.β, endPoint.β);
          return new G2(α, x, y, β, this.uom);
        };
        G2.prototype.direction = function() {
          var m = this.magnitudeSansUnits();
          if (m !== 1) {
            return new G2(this.α / m, this.x / m, this.y / m, this.β / m);
          } else {
            if (this.uom) {
              return new G2(this.α, this.x, this.y, this.β);
            } else {
              return this;
            }
          }
        };
        G2.prototype.distanceTo = function(point) {
          throw new Error(notImplemented_1.default('diistanceTo').message);
        };
        G2.prototype.equals = function(point) {
          throw new Error(notImplemented_1.default('equals').message);
        };
        G2.sub = function(a, b) {
          var a0 = a[0];
          var a1 = a[1];
          var a2 = a[2];
          var a3 = a[3];
          var b0 = b[0];
          var b1 = b[1];
          var b2 = b[2];
          var b3 = b[3];
          var x0 = subE2(a0, a1, a2, a3, b0, b1, b2, b3, 0);
          var x1 = subE2(a0, a1, a2, a3, b0, b1, b2, b3, 1);
          var x2 = subE2(a0, a1, a2, a3, b0, b1, b2, b3, 2);
          var x3 = subE2(a0, a1, a2, a3, b0, b1, b2, b3, 3);
          return [x0, x1, x2, x3];
        };
        G2.prototype.sub = function(rhs) {
          var xs = G2.sub(this.coords, rhs.coords);
          return new G2(xs[0], xs[1], xs[2], xs[3], Unit_1.default.compatible(this.uom, rhs.uom));
        };
        G2.prototype.__sub__ = function(other) {
          if (other instanceof G2) {
            return this.sub(other);
          } else if (typeof other === 'number') {
            return this.sub(new G2(other, 0, 0, 0, undefined));
          }
        };
        G2.prototype.__rsub__ = function(other) {
          if (other instanceof G2) {
            return other.sub(this);
          } else if (typeof other === 'number') {
            return new G2(other, 0, 0, 0, undefined).sub(this);
          }
        };
        G2.prototype.mul = function(rhs) {
          var a0 = this.α;
          var a1 = this.x;
          var a2 = this.y;
          var a3 = this.β;
          var b0 = rhs.α;
          var b1 = rhs.x;
          var b2 = rhs.y;
          var b3 = rhs.β;
          var c0 = mulE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 0);
          var c1 = mulE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 1);
          var c2 = mulE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 2);
          var c3 = mulE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 3);
          return new G2(c0, c1, c2, c3, Unit_1.default.mul(this.uom, rhs.uom));
        };
        G2.prototype.__mul__ = function(other) {
          if (other instanceof G2) {
            return this.mul(other);
          } else if (typeof other === 'number') {
            return this.mul(new G2(other, 0, 0, 0, undefined));
          }
        };
        G2.prototype.__rmul__ = function(other) {
          if (other instanceof G2) {
            var lhs = other;
            return lhs.mul(this);
          } else if (typeof other === 'number') {
            var w = other;
            return new G2(w, 0, 0, 0, undefined).mul(this);
          }
        };
        G2.prototype.scale = function(α) {
          return new G2(this.α * α, this.x * α, this.y * α, this.β * α, this.uom);
        };
        G2.prototype.div = function(rhs) {
          return this.mul(rhs.inv());
        };
        G2.prototype.divByScalar = function(α) {
          return new G2(this.α / α, this.x / α, this.y / α, this.β / α, this.uom);
        };
        G2.prototype.__div__ = function(other) {
          if (other instanceof G2) {
            return this.div(other);
          } else if (typeof other === 'number') {
            var w = other;
            return this.div(new G2(w, 0, 0, 0, undefined));
          }
        };
        G2.prototype.__rdiv__ = function(other) {
          if (other instanceof G2) {
            return other.div(this);
          } else if (typeof other === 'number') {
            return new G2(other, 0, 0, 0, undefined).div(this);
          }
        };
        G2.prototype.scp = function(rhs) {
          var a0 = this.α;
          var a1 = this.x;
          var a2 = this.y;
          var a3 = this.β;
          var b0 = rhs.α;
          var b1 = rhs.x;
          var b2 = rhs.y;
          var b3 = rhs.β;
          var c0 = scpE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 0);
          return new G2(c0, 0, 0, 0, Unit_1.default.mul(this.uom, rhs.uom));
        };
        G2.ext = function(a, b) {
          var a0 = a[0];
          var a1 = a[1];
          var a2 = a[2];
          var a3 = a[3];
          var b0 = b[0];
          var b1 = b[1];
          var b2 = b[2];
          var b3 = b[3];
          var x0 = extE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 0);
          var x1 = extE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 1);
          var x2 = extE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 2);
          var x3 = extE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 3);
          return [x0, x1, x2, x3];
        };
        G2.prototype.ext = function(rhs) {
          var xs = G2.ext(this.coords, rhs.coords);
          return new G2(xs[0], xs[1], xs[2], xs[3], Unit_1.default.mul(this.uom, rhs.uom));
        };
        G2.prototype.__wedge__ = function(other) {
          if (other instanceof G2) {
            var rhs = other;
            return this.ext(rhs);
          } else if (typeof other === 'number') {
            var w = other;
            return this.ext(new G2(w, 0, 0, 0, undefined));
          }
        };
        G2.prototype.__rwedge__ = function(other) {
          if (other instanceof G2) {
            var lhs = other;
            return lhs.ext(this);
          } else if (typeof other === 'number') {
            var w = other;
            return new G2(w, 0, 0, 0, undefined).ext(this);
          }
        };
        G2.lshift = function(a, b) {
          var a0 = a[0];
          var a1 = a[1];
          var a2 = a[2];
          var a3 = a[3];
          var b0 = b[0];
          var b1 = b[1];
          var b2 = b[2];
          var b3 = b[3];
          var x0 = lcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 0);
          var x1 = lcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 1);
          var x2 = lcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 2);
          var x3 = lcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 3);
          return [x0, x1, x2, x3];
        };
        G2.prototype.lerp = function(target, α) {
          throw new Error(notImplemented_1.default('lerp').message);
        };
        G2.prototype.lco = function(rhs) {
          var xs = G2.lshift(this.coords, rhs.coords);
          return new G2(xs[0], xs[1], xs[2], xs[3], Unit_1.default.mul(this.uom, rhs.uom));
        };
        G2.prototype.__lshift__ = function(other) {
          if (other instanceof G2) {
            var rhs = other;
            return this.lco(rhs);
          } else if (typeof other === 'number') {
            var w = other;
            return this.lco(new G2(w, 0, 0, 0, undefined));
          }
        };
        G2.prototype.__rlshift__ = function(other) {
          if (other instanceof G2) {
            var lhs = other;
            return lhs.lco(this);
          } else if (typeof other === 'number') {
            var w = other;
            return new G2(w, 0, 0, 0, undefined).lco(this);
          }
        };
        G2.rshift = function(a, b) {
          var a0 = a[0];
          var a1 = a[1];
          var a2 = a[2];
          var a3 = a[3];
          var b0 = b[0];
          var b1 = b[1];
          var b2 = b[2];
          var b3 = b[3];
          var x0 = rcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 0);
          var x1 = rcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 1);
          var x2 = rcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 2);
          var x3 = rcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 3);
          return [x0, x1, x2, x3];
        };
        G2.prototype.rco = function(rhs) {
          var xs = G2.rshift(this.coords, rhs.coords);
          return new G2(xs[0], xs[1], xs[2], xs[3], Unit_1.default.mul(this.uom, rhs.uom));
        };
        G2.prototype.__rshift__ = function(other) {
          if (other instanceof G2) {
            return this.rco(other);
          } else if (typeof other === 'number') {
            return this.rco(new G2(other, 0, 0, 0, undefined));
          }
        };
        G2.prototype.__rrshift__ = function(other) {
          if (other instanceof G2) {
            return other.rco(this);
          } else if (typeof other === 'number') {
            return new G2(other, 0, 0, 0, undefined).rco(this);
          }
        };
        G2.prototype.__vbar__ = function(other) {
          if (other instanceof G2) {
            return this.scp(other);
          } else if (typeof other === 'number') {
            return this.scp(new G2(other, 0, 0, 0, undefined));
          }
        };
        G2.prototype.__rvbar__ = function(other) {
          if (other instanceof G2) {
            return other.scp(this);
          } else if (typeof other === 'number') {
            return new G2(other, 0, 0, 0, undefined).scp(this);
          }
        };
        G2.prototype.pow = function(exponent) {
          throw new Error(notImplemented_1.default('pow').message);
        };
        G2.prototype.__bang__ = function() {
          return this.inv();
        };
        G2.prototype.__pos__ = function() {
          return this;
        };
        G2.prototype.neg = function() {
          return new G2(-this.α, -this.x, -this.y, -this.β, this.uom);
        };
        G2.prototype.__neg__ = function() {
          return this.neg();
        };
        G2.prototype.__tilde__ = function() {
          return this.rev();
        };
        G2.prototype.grade = function(grade) {
          switch (grade) {
            case 0:
              return new G2(this.α, 0, 0, 0, this.uom);
            case 1:
              return new G2(0, this.x, this.y, 0, this.uom);
            case 2:
              return new G2(0, 0, 0, this.β, this.uom);
            default:
              return new G2(0, 0, 0, 0, this.uom);
          }
        };
        G2.prototype.cos = function() {
          throw new Error(notImplemented_1.default('cos').message);
        };
        G2.prototype.cosh = function() {
          throw new Error(notImplemented_1.default('cosh').message);
        };
        G2.prototype.exp = function() {
          Unit_1.default.assertDimensionless(this.uom);
          var expα = Math.exp(this.α);
          var cosβ = Math.cos(this.β);
          var sinβ = Math.sin(this.β);
          return new G2(expα * cosβ, 0, 0, expα * sinβ, this.uom);
        };
        G2.prototype.inv = function() {
          var α = this.α;
          var x = this.x;
          var y = this.y;
          var β = this.β;
          var A = [[α, x, y, -β], [x, α, β, -y], [y, -β, α, x], [β, -y, x, α]];
          var b = [1, 0, 0, 0];
          var X = gauss_1.default(A, b);
          var uom = this.uom ? this.uom.inv() : void 0;
          return new G2(X[0], X[1], X[2], X[3], uom);
        };
        G2.prototype.log = function() {
          throw new Error(notImplemented_1.default('log').message);
        };
        G2.prototype.magnitude = function() {
          return this.norm();
        };
        G2.prototype.magnitudeSansUnits = function() {
          return Math.sqrt(this.squaredNormSansUnits());
        };
        G2.prototype.norm = function() {
          return new G2(this.magnitudeSansUnits(), 0, 0, 0, this.uom);
        };
        G2.prototype.quad = function() {
          return this.squaredNorm();
        };
        G2.prototype.quadraticBezier = function(t, controlPoint, endPoint) {
          var α = b2_1.default(t, this.α, controlPoint.α, endPoint.α);
          var x = b2_1.default(t, this.x, controlPoint.x, endPoint.x);
          var y = b2_1.default(t, this.y, controlPoint.y, endPoint.y);
          var β = b2_1.default(t, this.β, controlPoint.β, endPoint.β);
          return new G2(α, x, y, β, this.uom);
        };
        G2.prototype.squaredNorm = function() {
          return new G2(this.squaredNormSansUnits(), 0, 0, 0, Unit_1.default.mul(this.uom, this.uom));
        };
        G2.prototype.squaredNormSansUnits = function() {
          var α = this.α;
          var x = this.x;
          var y = this.y;
          var β = this.β;
          return α * α + x * x + y * y + β * β;
        };
        G2.prototype.reflect = function(n) {
          var m = G2.fromVectorE2(n);
          return m.mul(this).mul(m).scale(-1);
        };
        G2.prototype.rev = function() {
          return new G2(this.α, this.x, this.y, -this.β, this.uom);
        };
        G2.prototype.rotate = function(spinor) {
          var x = this.x;
          var y = this.y;
          var α = spinor.α;
          var β = spinor.β;
          var α2 = α * α;
          var β2 = β * β;
          var p = α2 - β2;
          var q = 2 * α * β;
          var s = α2 + β2;
          return new G2(s * this.α, p * x + q * y, p * y - q * x, s * this.β, this.uom);
        };
        G2.prototype.sin = function() {
          throw new Error(notImplemented_1.default('sin').message);
        };
        G2.prototype.sinh = function() {
          throw new Error(notImplemented_1.default('sinh').message);
        };
        G2.prototype.slerp = function(target, α) {
          throw new Error(notImplemented_1.default('slerp').message);
        };
        G2.prototype.tan = function() {
          return this.sin().div(this.cos());
        };
        G2.prototype.isOne = function() {
          return this.α === 1 && this.x === 0 && this.y === 0 && this.β === 0;
        };
        G2.prototype.isNaN = function() {
          return isNaN(this.α) || isNaN(this.x) || isNaN(this.y) || isNaN(this.β);
        };
        G2.prototype.isZero = function() {
          return this.α === 0 && this.x === 0 && this.y === 0 && this.β === 0;
        };
        G2.prototype.toStringCustom = function(coordToString, labels) {
          var quantityString = stringFromCoordinates_1.default(this.coords, coordToString, labels);
          if (this.uom) {
            var unitString = this.uom.toString().trim();
            if (unitString) {
              return quantityString + ' ' + unitString;
            } else {
              return quantityString;
            }
          } else {
            return quantityString;
          }
        };
        G2.prototype.toExponential = function() {
          var coordToString = function(coord) {
            return coord.toExponential();
          };
          return this.toStringCustom(coordToString, ["1", "e1", "e2", "e12"]);
        };
        G2.prototype.toFixed = function(digits) {
          var coordToString = function(coord) {
            return coord.toFixed(digits);
          };
          return this.toStringCustom(coordToString, ["1", "e1", "e2", "e12"]);
        };
        G2.prototype.toString = function() {
          var coordToString = function(coord) {
            return coord.toString();
          };
          return this.toStringCustom(coordToString, ["1", "e1", "e2", "e12"]);
        };
        G2.prototype.toStringIJK = function() {
          var coordToString = function(coord) {
            return coord.toString();
          };
          return this.toStringCustom(coordToString, ["1", "i", "j", "I"]);
        };
        G2.prototype.toStringLATEX = function() {
          var coordToString = function(coord) {
            return coord.toString();
          };
          return this.toStringCustom(coordToString, ["1", "e_{1}", "e_{2}", "e_{12}"]);
        };
        G2.copy = function(m) {
          if (m instanceof G2) {
            return m;
          } else {
            return new G2(m.α, m.x, m.y, m.β, void 0);
          }
        };
        G2.fromVectorE2 = function(vector) {
          if (vector) {
            if (vector instanceof G2) {
              return new G2(0, vector.x, vector.y, 0, vector.uom);
            } else {
              return new G2(0, vector.x, vector.y, 0, void 0);
            }
          } else {
            return void 0;
          }
        };
        G2.vector = function(x, y, uom) {
          return new G2(0, x, y, 0, uom);
        };
        G2._zero = new G2(0, 0, 0, 0);
        G2._one = new G2(1, 0, 0, 0);
        G2._e1 = new G2(0, 1, 0, 0);
        G2._e2 = new G2(0, 0, 1, 0);
        G2._I = new G2(0, 0, 0, 1);
        G2.kilogram = new G2(1, 0, 0, 0, Unit_1.default.KILOGRAM);
        G2.meter = new G2(1, 0, 0, 0, Unit_1.default.METER);
        G2.second = new G2(1, 0, 0, 0, Unit_1.default.SECOND);
        G2.coulomb = new G2(1, 0, 0, 0, Unit_1.default.COULOMB);
        G2.ampere = new G2(1, 0, 0, 0, Unit_1.default.AMPERE);
        G2.kelvin = new G2(1, 0, 0, 0, Unit_1.default.KELVIN);
        G2.mole = new G2(1, 0, 0, 0, Unit_1.default.MOLE);
        G2.candela = new G2(1, 0, 0, 0, Unit_1.default.CANDELA);
        return G2;
      })();
      exports_1("default", G2);
    }
  };
});

System.register("davinci-eight/math/extE2.js", [], function(exports_1) {
  function extE2(a0, a1, a2, a3, b0, b1, b2, b3, index) {
    a0 = +a0;
    a1 = +a1;
    a2 = +a2;
    a3 = +a3;
    b0 = +b0;
    b1 = +b1;
    b2 = +b2;
    b3 = +b3;
    index = index | 0;
    var x = 0.0;
    switch (~(~index)) {
      case 0:
        {
          x = +(a0 * b0);
        }
        break;
      case 1:
        {
          x = +(a0 * b1 + a1 * b0);
        }
        break;
      case 2:
        {
          x = +(a0 * b2 + a2 * b0);
        }
        break;
      case 3:
        {
          x = +(a0 * b3 + a1 * b2 - a2 * b1 + a3 * b0);
        }
        break;
      default:
        {
          throw new Error("index must be in the range [0..3]");
        }
    }
    return +x;
  }
  exports_1("default", extE2);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/math/lcoE2.js", [], function(exports_1) {
  function lcoE2(a0, a1, a2, a3, b0, b1, b2, b3, index) {
    a0 = +a0;
    a1 = +a1;
    a2 = +a2;
    a3 = +a3;
    b0 = +b0;
    b1 = +b1;
    b2 = +b2;
    b3 = +b3;
    index = index | 0;
    var x = 0.0;
    switch (~(~index)) {
      case 0:
        {
          x = +(a0 * b0 + a1 * b1 + a2 * b2 - a3 * b3);
        }
        break;
      case 1:
        {
          x = +(a0 * b1 - a2 * b3);
        }
        break;
      case 2:
        {
          x = +(a0 * b2 + a1 * b3);
        }
        break;
      case 3:
        {
          x = +(a0 * b3);
        }
        break;
      default:
        {
          throw new Error("index must be in the range [0..3]");
        }
    }
    return +x;
  }
  exports_1("default", lcoE2);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/math/mulE2.js", [], function(exports_1) {
  function mulE2(a0, a1, a2, a3, b0, b1, b2, b3, index) {
    a0 = +a0;
    a1 = +a1;
    a2 = +a2;
    a3 = +a3;
    b0 = +b0;
    b1 = +b1;
    b2 = +b2;
    b3 = +b3;
    index = index | 0;
    var x = 0.0;
    switch (~(~index)) {
      case 0:
        {
          x = +(a0 * b0 + a1 * b1 + a2 * b2 - a3 * b3);
        }
        break;
      case 1:
        {
          x = +(a0 * b1 + a1 * b0 - a2 * b3 + a3 * b2);
        }
        break;
      case 2:
        {
          x = +(a0 * b2 + a1 * b3 + a2 * b0 - a3 * b1);
        }
        break;
      case 3:
        {
          x = +(a0 * b3 + a1 * b2 - a2 * b1 + a3 * b0);
        }
        break;
      default:
        {
          throw new Error("index must be in the range [0..3]");
        }
    }
    return +x;
  }
  exports_1("default", mulE2);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/math/dotVectorCartesianE2.js", [], function(exports_1) {
  function dotVectorCartesianE2(ax, ay, bx, by) {
    return ax * bx + ay * by;
  }
  exports_1("default", dotVectorCartesianE2);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/math/quadVectorE2.js", ["../math/dotVectorCartesianE2", "../checks/isDefined", "../checks/isNumber"], function(exports_1) {
  var dotVectorCartesianE2_1,
      isDefined_1,
      isNumber_1;
  function quadVectorE2(vector) {
    if (isDefined_1.default(vector)) {
      var x = vector.x;
      var y = vector.y;
      if (isNumber_1.default(x) && isNumber_1.default(y)) {
        return dotVectorCartesianE2_1.default(x, y, x, y);
      } else {
        return void 0;
      }
    } else {
      return void 0;
    }
  }
  exports_1("default", quadVectorE2);
  return {
    setters: [function(dotVectorCartesianE2_1_1) {
      dotVectorCartesianE2_1 = dotVectorCartesianE2_1_1;
    }, function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }, function(isNumber_1_1) {
      isNumber_1 = isNumber_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/math/rcoE2.js", [], function(exports_1) {
  function rcoE2(a0, a1, a2, a3, b0, b1, b2, b3, index) {
    a0 = +a0;
    a1 = +a1;
    a2 = +a2;
    a3 = +a3;
    b0 = +b0;
    b1 = +b1;
    b2 = +b2;
    b3 = +b3;
    index = index | 0;
    var x = 0.0;
    switch (~(~index)) {
      case 0:
        {
          x = +(a0 * b0 + a1 * b1 + a2 * b2 - a3 * b3);
        }
        break;
      case 1:
        {
          x = +(-a1 * b0 - a3 * b2);
        }
        break;
      case 2:
        {
          x = +(-a2 * b0 + a3 * b1);
        }
        break;
      case 3:
        {
          x = +(a3 * b0);
        }
        break;
      default:
        {
          throw new Error("index must be in the range [0..3]");
        }
    }
    return +x;
  }
  exports_1("default", rcoE2);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/math/scpE2.js", [], function(exports_1) {
  function scpE2(a0, a1, a2, a3, b0, b1, b2, b3, index) {
    switch (index) {
      case 0:
        return a0 * b0 + a1 * b1 + a2 * b2 - a3 * b3;
      case 1:
        return 0;
      case 2:
        return 0;
      case 3:
        return 0;
      default:
        throw new Error("index must be in the range [0..3]");
    }
  }
  exports_1("default", scpE2);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/math/G2m.js", ["../geometries/b2", "../geometries/b3", "../math/dotVectorE2", "../math/G2", "../math/extE2", "../checks/isDefined", "../checks/isNumber", "../checks/isObject", "../math/lcoE2", "../math/mulE2", "../checks/mustBeInteger", "../checks/mustBeNumber", "../checks/mustBeObject", "../math/quadVectorE2", "../math/rcoE2", "../math/rotorFromDirections", "../math/scpE2", "../math/stringFromCoordinates", "../math/VectorN", "../math/wedgeXY"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var b2_1,
      b3_1,
      dotVectorE2_1,
      G2_1,
      extE2_1,
      isDefined_1,
      isNumber_1,
      isObject_1,
      lcoE2_1,
      mulE2_1,
      mustBeInteger_1,
      mustBeNumber_1,
      mustBeObject_1,
      quadVectorE2_1,
      rcoE2_1,
      rotorFromDirections_1,
      scpE2_1,
      stringFromCoordinates_1,
      VectorN_1,
      wedgeXY_1;
  var COORD_SCALAR,
      COORD_X,
      COORD_Y,
      COORD_PSEUDO,
      abs,
      atan2,
      exp,
      log,
      cos,
      sin,
      sqrt,
      STANDARD_LABELS,
      G2m;
  function coordinates(m) {
    return [m.α, m.x, m.y, m.β];
  }
  function duckCopy(value) {
    if (isObject_1.default(value)) {
      var m = value;
      if (isNumber_1.default(m.x) && isNumber_1.default(m.y)) {
        if (isNumber_1.default(m.α) && isNumber_1.default(m.β)) {
          console.warn("Copying GeometricE2 to G2m");
          return G2m.copy(m);
        } else {
          console.warn("Copying VectorE2 to G2m");
          return G2m.fromVector(m);
        }
      } else {
        if (isNumber_1.default(m.α) && isNumber_1.default(m.β)) {
          console.warn("Copying SpinorE2 to G2m");
          return G2m.fromSpinor(m);
        } else {
          return void 0;
        }
      }
    } else {
      return void 0;
    }
  }
  return {
    setters: [function(b2_1_1) {
      b2_1 = b2_1_1;
    }, function(b3_1_1) {
      b3_1 = b3_1_1;
    }, function(dotVectorE2_1_1) {
      dotVectorE2_1 = dotVectorE2_1_1;
    }, function(G2_1_1) {
      G2_1 = G2_1_1;
    }, function(extE2_1_1) {
      extE2_1 = extE2_1_1;
    }, function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }, function(isNumber_1_1) {
      isNumber_1 = isNumber_1_1;
    }, function(isObject_1_1) {
      isObject_1 = isObject_1_1;
    }, function(lcoE2_1_1) {
      lcoE2_1 = lcoE2_1_1;
    }, function(mulE2_1_1) {
      mulE2_1 = mulE2_1_1;
    }, function(mustBeInteger_1_1) {
      mustBeInteger_1 = mustBeInteger_1_1;
    }, function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }, function(mustBeObject_1_1) {
      mustBeObject_1 = mustBeObject_1_1;
    }, function(quadVectorE2_1_1) {
      quadVectorE2_1 = quadVectorE2_1_1;
    }, function(rcoE2_1_1) {
      rcoE2_1 = rcoE2_1_1;
    }, function(rotorFromDirections_1_1) {
      rotorFromDirections_1 = rotorFromDirections_1_1;
    }, function(scpE2_1_1) {
      scpE2_1 = scpE2_1_1;
    }, function(stringFromCoordinates_1_1) {
      stringFromCoordinates_1 = stringFromCoordinates_1_1;
    }, function(VectorN_1_1) {
      VectorN_1 = VectorN_1_1;
    }, function(wedgeXY_1_1) {
      wedgeXY_1 = wedgeXY_1_1;
    }],
    execute: function() {
      COORD_SCALAR = 0;
      COORD_X = 1;
      COORD_Y = 2;
      COORD_PSEUDO = 3;
      abs = Math.abs;
      atan2 = Math.atan2;
      exp = Math.exp;
      log = Math.log;
      cos = Math.cos;
      sin = Math.sin;
      sqrt = Math.sqrt;
      STANDARD_LABELS = ["1", "e1", "e2", "I"];
      G2m = (function(_super) {
        __extends(G2m, _super);
        function G2m() {
          _super.call(this, [0, 0, 0, 0], false, 4);
        }
        Object.defineProperty(G2m.prototype, "α", {
          get: function() {
            return this.coords[COORD_SCALAR];
          },
          set: function(α) {
            this.modified = this.modified || this.coords[COORD_SCALAR] !== α;
            this.coords[COORD_SCALAR] = α;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(G2m.prototype, "alpha", {
          get: function() {
            return this.coords[COORD_SCALAR];
          },
          set: function(alpha) {
            this.modified = this.modified || this.coords[COORD_SCALAR] !== alpha;
            this.coords[COORD_SCALAR] = alpha;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(G2m.prototype, "x", {
          get: function() {
            return this.coords[COORD_X];
          },
          set: function(x) {
            this.modified = this.modified || this.coords[COORD_X] !== x;
            this.coords[COORD_X] = x;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(G2m.prototype, "y", {
          get: function() {
            return this.coords[COORD_Y];
          },
          set: function(y) {
            this.modified = this.modified || this.coords[COORD_Y] !== y;
            this.coords[COORD_Y] = y;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(G2m.prototype, "β", {
          get: function() {
            return this.coords[COORD_PSEUDO];
          },
          set: function(β) {
            this.modified = this.modified || this.coords[COORD_PSEUDO] !== β;
            this.coords[COORD_PSEUDO] = β;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(G2m.prototype, "beta", {
          get: function() {
            return this.coords[COORD_PSEUDO];
          },
          set: function(beta) {
            this.modified = this.modified || this.coords[COORD_PSEUDO] !== beta;
            this.coords[COORD_PSEUDO] = beta;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(G2m.prototype, "xy", {
          get: function() {
            return this.coords[COORD_PSEUDO];
          },
          set: function(xy) {
            this.modified = this.modified || this.coords[COORD_PSEUDO] !== xy;
            this.coords[COORD_PSEUDO] = xy;
          },
          enumerable: true,
          configurable: true
        });
        G2m.prototype.add = function(M, α) {
          if (α === void 0) {
            α = 1;
          }
          mustBeObject_1.default('M', M);
          mustBeNumber_1.default('α', α);
          this.α += M.α * α;
          this.x += M.x * α;
          this.y += M.y * α;
          this.β += M.β * α;
          return this;
        };
        G2m.prototype.add2 = function(a, b) {
          mustBeObject_1.default('a', a);
          mustBeObject_1.default('b', b);
          this.α = a.α + b.α;
          this.x = a.x + b.x;
          this.y = a.y + b.y;
          this.β = a.β + b.β;
          return this;
        };
        G2m.prototype.addPseudo = function(β) {
          mustBeNumber_1.default('β', β);
          this.β += β;
          return this;
        };
        G2m.prototype.addScalar = function(α) {
          mustBeNumber_1.default('α', α);
          this.α += α;
          return this;
        };
        G2m.prototype.addVector = function(v, α) {
          if (α === void 0) {
            α = 1;
          }
          mustBeObject_1.default('v', v);
          mustBeNumber_1.default('α', α);
          this.x += v.x * α;
          this.y += v.y * α;
          return this;
        };
        G2m.prototype.adj = function() {
          throw new Error('TODO: G2m.adj');
        };
        G2m.prototype.angle = function() {
          return this.log().grade(2);
        };
        G2m.prototype.clone = function() {
          var m = new G2m();
          m.copy(this);
          return m;
        };
        G2m.prototype.conj = function() {
          this.β = -this.β;
          return this;
        };
        G2m.prototype.cos = function() {
          throw new Error("TODO: G2m.cos");
        };
        G2m.prototype.cosh = function() {
          throw new Error("TODO: G2m.cosh");
        };
        G2m.prototype.distanceTo = function(point) {
          throw new Error("TODO: G2m.distanceTo");
        };
        G2m.prototype.equals = function(point) {
          throw new Error("TODO: G2m.equals");
        };
        G2m.prototype.copy = function(M) {
          mustBeObject_1.default('M', M);
          this.α = M.α;
          this.x = M.x;
          this.y = M.y;
          this.β = M.β;
          return this;
        };
        G2m.prototype.copyScalar = function(α) {
          return this.zero().addScalar(α);
        };
        G2m.prototype.copySpinor = function(spinor) {
          mustBeObject_1.default('spinor', spinor);
          this.α = spinor.α;
          this.x = 0;
          this.y = 0;
          this.β = spinor.β;
          return this;
        };
        G2m.prototype.copyVector = function(vector) {
          mustBeObject_1.default('vector', vector);
          this.α = 0;
          this.x = vector.x;
          this.y = vector.y;
          this.β = 0;
          return this;
        };
        G2m.prototype.cubicBezier = function(t, controlBegin, controlEnd, endPoint) {
          var α = b3_1.default(t, this.α, controlBegin.α, controlEnd.α, endPoint.α);
          var x = b3_1.default(t, this.x, controlBegin.x, controlEnd.x, endPoint.x);
          var y = b3_1.default(t, this.y, controlBegin.y, controlEnd.y, endPoint.y);
          var β = b3_1.default(t, this.β, controlBegin.β, controlEnd.β, endPoint.β);
          this.α = α;
          this.x = x;
          this.y = y;
          this.β = β;
          return this;
        };
        G2m.prototype.direction = function() {
          var norm = sqrt(this.squaredNormSansUnits());
          this.α = this.α / norm;
          this.x = this.x / norm;
          this.y = this.y / norm;
          this.β = this.β / norm;
          return this;
        };
        G2m.prototype.div = function(m) {
          return this.div2(this, m);
        };
        G2m.prototype.div2 = function(a, b) {
          return this;
        };
        G2m.prototype.divByScalar = function(α) {
          mustBeNumber_1.default('α', α);
          this.α /= α;
          this.x /= α;
          this.y /= α;
          this.β /= α;
          return this;
        };
        G2m.prototype.dual = function(m) {
          var w = -m.β;
          var x = +m.y;
          var y = -m.x;
          var β = +m.α;
          this.α = w;
          this.x = x;
          this.y = y;
          this.β = β;
          return this;
        };
        G2m.prototype.exp = function() {
          var w = this.α;
          var z = this.β;
          var expW = exp(w);
          var φ = sqrt(z * z);
          var s = expW * (φ !== 0 ? sin(φ) / φ : 1);
          this.α = expW * cos(φ);
          this.β = z * s;
          return this;
        };
        G2m.prototype.ext = function(m) {
          return this.ext2(this, m);
        };
        G2m.prototype.ext2 = function(a, b) {
          var a0 = a.α;
          var a1 = a.x;
          var a2 = a.y;
          var a3 = a.β;
          var b0 = b.α;
          var b1 = b.x;
          var b2 = b.y;
          var b3 = b.β;
          this.α = extE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 0);
          this.x = extE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 1);
          this.y = extE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 2);
          this.β = extE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 3);
          return this;
        };
        G2m.prototype.inv = function() {
          this.conj();
          return this;
        };
        G2m.prototype.isOne = function() {
          return this.α === 1 && this.x === 0 && this.y === 0 && this.β === 0;
        };
        G2m.prototype.isZero = function() {
          return this.α === 0 && this.x === 0 && this.y === 0 && this.β === 0;
        };
        G2m.prototype.lco = function(m) {
          return this.lco2(this, m);
        };
        G2m.prototype.lco2 = function(a, b) {
          var a0 = a.α;
          var a1 = a.x;
          var a2 = a.y;
          var a3 = a.β;
          var b0 = b.α;
          var b1 = b.x;
          var b2 = b.y;
          var b3 = b.β;
          this.α = lcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 0);
          this.x = lcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 1);
          this.y = lcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 2);
          this.β = lcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 3);
          return this;
        };
        G2m.prototype.lerp = function(target, α) {
          mustBeObject_1.default('target', target);
          mustBeNumber_1.default('α', α);
          this.α += (target.α - this.α) * α;
          this.x += (target.x - this.x) * α;
          this.y += (target.y - this.y) * α;
          this.β += (target.β - this.β) * α;
          return this;
        };
        G2m.prototype.lerp2 = function(a, b, α) {
          mustBeObject_1.default('a', a);
          mustBeObject_1.default('b', b);
          mustBeNumber_1.default('α', α);
          this.copy(a).lerp(b, α);
          return this;
        };
        G2m.prototype.log = function() {
          var α = this.α;
          var β = this.β;
          this.α = log(sqrt(α * α + β * β));
          this.x = 0;
          this.y = 0;
          this.β = atan2(β, α);
          return this;
        };
        G2m.prototype.magnitude = function() {
          return this.norm();
        };
        G2m.prototype.magnitudeSansUnits = function() {
          return sqrt(this.squaredNormSansUnits());
        };
        G2m.prototype.mul = function(m) {
          return this.mul2(this, m);
        };
        G2m.prototype.mul2 = function(a, b) {
          var a0 = a.α;
          var a1 = a.x;
          var a2 = a.y;
          var a3 = a.β;
          var b0 = b.α;
          var b1 = b.x;
          var b2 = b.y;
          var b3 = b.β;
          this.α = mulE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 0);
          this.x = mulE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 1);
          this.y = mulE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 2);
          this.β = mulE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 3);
          return this;
        };
        G2m.prototype.neg = function() {
          this.α = -this.α;
          this.x = -this.x;
          this.y = -this.y;
          this.β = -this.β;
          return this;
        };
        G2m.prototype.norm = function() {
          this.α = this.magnitudeSansUnits();
          this.x = 0;
          this.y = 0;
          this.β = 0;
          return this;
        };
        G2m.prototype.one = function() {
          this.α = 1;
          this.x = 0;
          this.y = 0;
          this.β = 0;
          return this;
        };
        G2m.prototype.pow = function() {
          throw new Error("TODO: G2m.pow");
        };
        G2m.prototype.quad = function() {
          this.α = this.squaredNormSansUnits();
          this.x = 0;
          this.y = 0;
          this.β = 0;
          return this;
        };
        G2m.prototype.quadraticBezier = function(t, controlPoint, endPoint) {
          var α = b2_1.default(t, this.α, controlPoint.α, endPoint.α);
          var x = b2_1.default(t, this.x, controlPoint.x, endPoint.x);
          var y = b2_1.default(t, this.y, controlPoint.y, endPoint.y);
          var β = b2_1.default(t, this.β, controlPoint.β, endPoint.β);
          this.α = α;
          this.x = x;
          this.y = y;
          this.β = β;
          return this;
        };
        G2m.prototype.rco = function(m) {
          return this.rco2(this, m);
        };
        G2m.prototype.rco2 = function(a, b) {
          var a0 = a.α;
          var a1 = a.x;
          var a2 = a.y;
          var a3 = a.β;
          var b0 = b.α;
          var b1 = b.x;
          var b2 = b.y;
          var b3 = b.β;
          this.α = rcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 0);
          this.x = rcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 1);
          this.y = rcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 2);
          this.β = rcoE2_1.default(a0, a1, a2, a3, b0, b1, b2, b3, 3);
          return this;
        };
        G2m.prototype.reflect = function(n) {
          mustBeObject_1.default('n', n);
          var N = G2_1.default.fromVectorE2(n);
          var M = G2_1.default.copy(this);
          var R = N.mul(M).mul(N).scale(-1);
          this.copy(R);
          return this;
        };
        G2m.prototype.rev = function() {
          this.α = this.α;
          this.x = this.x;
          this.y = this.y;
          this.β = -this.β;
          return this;
        };
        G2m.prototype.sin = function() {
          throw new Error("G2m.sin");
        };
        G2m.prototype.sinh = function() {
          throw new Error("G2m.sinh");
        };
        G2m.prototype.rotate = function(R) {
          mustBeObject_1.default('R', R);
          var x = this.x;
          var y = this.y;
          var β = R.β;
          var α = R.α;
          var ix = α * x + β * y;
          var iy = α * y - β * x;
          this.x = ix * α + iy * β;
          this.y = iy * α - ix * β;
          return this;
        };
        G2m.prototype.rotorFromDirections = function(a, b) {
          if (isDefined_1.default(rotorFromDirections_1.default(a, b, quadVectorE2_1.default, dotVectorE2_1.default, this))) {
            return this;
          } else {
            return G2m.fromCartesian(0, 0, 0, 1);
          }
          return this;
        };
        G2m.prototype.rotorFromGeneratorAngle = function(B, θ) {
          mustBeObject_1.default('B', B);
          mustBeNumber_1.default('θ', θ);
          var β = B.β;
          var φ = θ / 2;
          this.α = cos(abs(β) * φ);
          this.x = 0;
          this.y = 0;
          this.β = -sin(β * φ);
          return this;
        };
        G2m.prototype.scp = function(m) {
          return this.scp2(this, m);
        };
        G2m.prototype.scp2 = function(a, b) {
          this.α = scpE2_1.default(a.α, a.x, a.y, a.β, b.α, b.x, b.y, b.β, 0);
          this.x = 0;
          this.y = 0;
          this.β = 0;
          return this;
        };
        G2m.prototype.scale = function(α) {
          mustBeNumber_1.default('α', α);
          this.α *= α;
          this.x *= α;
          this.y *= α;
          this.β *= α;
          return this;
        };
        G2m.prototype.slerp = function(target, α) {
          mustBeObject_1.default('target', target);
          mustBeNumber_1.default('α', α);
          return this;
        };
        G2m.prototype.versor = function(a, b) {
          var ax = a.x;
          var ay = a.y;
          var bx = b.x;
          var by = b.y;
          this.α = dotVectorE2_1.default(a, b);
          this.x = 0;
          this.y = 0;
          this.β = wedgeXY_1.default(ax, ay, 0, bx, by, 0);
          return this;
        };
        G2m.prototype.squaredNorm = function() {
          this.α = this.squaredNormSansUnits();
          this.x = 0;
          this.y = 0;
          this.β = 0;
          return this;
        };
        G2m.prototype.squaredNormSansUnits = function() {
          var w = this.α;
          var x = this.x;
          var y = this.y;
          var B = this.β;
          return w * w + x * x + y * y + B * B;
        };
        G2m.prototype.sub = function(M, α) {
          if (α === void 0) {
            α = 1;
          }
          mustBeObject_1.default('M', M);
          mustBeNumber_1.default('α', α);
          this.α -= M.α * α;
          this.x -= M.x * α;
          this.y -= M.y * α;
          this.β -= M.β * α;
          return this;
        };
        G2m.prototype.sub2 = function(a, b) {
          mustBeObject_1.default('a', a);
          mustBeObject_1.default('b', b);
          this.α = a.α - b.α;
          this.x = a.x - b.x;
          this.y = a.y - b.y;
          this.β = a.β - b.β;
          return this;
        };
        G2m.prototype.toExponential = function() {
          var coordToString = function(coord) {
            return coord.toExponential();
          };
          return stringFromCoordinates_1.default(coordinates(this), coordToString, G2m.BASIS_LABELS);
        };
        G2m.prototype.toFixed = function(fractionDigits) {
          var coordToString = function(coord) {
            return coord.toFixed(fractionDigits);
          };
          return stringFromCoordinates_1.default(coordinates(this), coordToString, G2m.BASIS_LABELS);
        };
        G2m.prototype.toString = function() {
          var coordToString = function(coord) {
            return coord.toString();
          };
          return stringFromCoordinates_1.default(coordinates(this), coordToString, G2m.BASIS_LABELS);
        };
        G2m.prototype.grade = function(grade) {
          mustBeInteger_1.default('grade', grade);
          switch (grade) {
            case 0:
              {
                this.x = 0;
                this.y = 0;
                this.β = 0;
              }
              break;
            case 1:
              {
                this.α = 0;
                this.β = 0;
              }
              break;
            case 2:
              {
                this.α = 0;
                this.x = 0;
                this.y = 0;
              }
              break;
            default:
              {
                this.α = 0;
                this.x = 0;
                this.y = 0;
                this.β = 0;
              }
          }
          return this;
        };
        G2m.prototype.zero = function() {
          this.α = 0;
          this.x = 0;
          this.y = 0;
          this.β = 0;
          return this;
        };
        G2m.prototype.__add__ = function(rhs) {
          if (rhs instanceof G2m) {
            return G2m.copy(this).add(rhs);
          } else if (typeof rhs === 'number') {
            return G2m.fromScalar(rhs).add(this);
          } else {
            var rhsCopy = duckCopy(rhs);
            if (rhsCopy) {
              return rhsCopy.add(this);
            } else {
              return void 0;
            }
          }
        };
        G2m.prototype.__div__ = function(rhs) {
          if (rhs instanceof G2m) {
            return G2m.copy(this).div(rhs);
          } else if (typeof rhs === 'number') {
            return G2m.copy(this).divByScalar(rhs);
          } else {
            return void 0;
          }
        };
        G2m.prototype.__rdiv__ = function(lhs) {
          if (lhs instanceof G2m) {
            return G2m.copy(lhs).div(this);
          } else if (typeof lhs === 'number') {
            return G2m.fromScalar(lhs).div(this);
          } else {
            return void 0;
          }
        };
        G2m.prototype.__mul__ = function(rhs) {
          if (rhs instanceof G2m) {
            return G2m.copy(this).mul(rhs);
          } else if (typeof rhs === 'number') {
            return G2m.copy(this).scale(rhs);
          } else {
            var rhsCopy = duckCopy(rhs);
            if (rhsCopy) {
              return this.__mul__(rhsCopy);
            } else {
              return void 0;
            }
          }
        };
        G2m.prototype.__rmul__ = function(lhs) {
          if (lhs instanceof G2m) {
            return G2m.copy(lhs).mul(this);
          } else if (typeof lhs === 'number') {
            return G2m.copy(this).scale(lhs);
          } else {
            var lhsCopy = duckCopy(lhs);
            if (lhsCopy) {
              return lhsCopy.mul(this);
            } else {
              return void 0;
            }
          }
        };
        G2m.prototype.__radd__ = function(lhs) {
          if (lhs instanceof G2m) {
            return G2m.copy(lhs).add(this);
          } else if (typeof lhs === 'number') {
            return G2m.fromScalar(lhs).add(this);
          } else {
            var lhsCopy = duckCopy(lhs);
            if (lhsCopy) {
              return lhsCopy.add(this);
            } else {
              return void 0;
            }
          }
        };
        G2m.prototype.__sub__ = function(rhs) {
          if (rhs instanceof G2m) {
            return G2m.copy(this).sub(rhs);
          } else if (typeof rhs === 'number') {
            return G2m.fromScalar(-rhs).add(this);
          } else {
            return void 0;
          }
        };
        G2m.prototype.__rsub__ = function(lhs) {
          if (lhs instanceof G2m) {
            return G2m.copy(lhs).sub(this);
          } else if (typeof lhs === 'number') {
            return G2m.fromScalar(lhs).sub(this);
          } else {
            return void 0;
          }
        };
        G2m.prototype.__wedge__ = function(rhs) {
          if (rhs instanceof G2m) {
            return G2m.copy(this).ext(rhs);
          } else if (typeof rhs === 'number') {
            return G2m.copy(this).scale(rhs);
          } else {
            return void 0;
          }
        };
        G2m.prototype.__rwedge__ = function(lhs) {
          if (lhs instanceof G2m) {
            return G2m.copy(lhs).ext(this);
          } else if (typeof lhs === 'number') {
            return G2m.copy(this).scale(lhs);
          } else {
            return void 0;
          }
        };
        G2m.prototype.__lshift__ = function(rhs) {
          if (rhs instanceof G2m) {
            return G2m.copy(this).lco(rhs);
          } else if (typeof rhs === 'number') {
            return G2m.copy(this).lco(G2m.fromScalar(rhs));
          } else {
            return void 0;
          }
        };
        G2m.prototype.__rlshift__ = function(lhs) {
          if (lhs instanceof G2m) {
            return G2m.copy(lhs).lco(this);
          } else if (typeof lhs === 'number') {
            return G2m.fromScalar(lhs).lco(this);
          } else {
            return void 0;
          }
        };
        G2m.prototype.__rshift__ = function(rhs) {
          if (rhs instanceof G2m) {
            return G2m.copy(this).rco(rhs);
          } else if (typeof rhs === 'number') {
            return G2m.copy(this).rco(G2m.fromScalar(rhs));
          } else {
            return void 0;
          }
        };
        G2m.prototype.__rrshift__ = function(lhs) {
          if (lhs instanceof G2m) {
            return G2m.copy(lhs).rco(this);
          } else if (typeof lhs === 'number') {
            return G2m.fromScalar(lhs).rco(this);
          } else {
            return void 0;
          }
        };
        G2m.prototype.__vbar__ = function(rhs) {
          if (rhs instanceof G2m) {
            return G2m.copy(this).scp(rhs);
          } else if (typeof rhs === 'number') {
            return G2m.copy(this).scp(G2m.fromScalar(rhs));
          } else {
            return void 0;
          }
        };
        G2m.prototype.__rvbar__ = function(lhs) {
          if (lhs instanceof G2m) {
            return G2m.copy(lhs).scp(this);
          } else if (typeof lhs === 'number') {
            return G2m.fromScalar(lhs).scp(this);
          } else {
            return void 0;
          }
        };
        G2m.prototype.__bang__ = function() {
          return G2m.copy(this).inv();
        };
        G2m.prototype.__tilde__ = function() {
          return G2m.copy(this).rev();
        };
        G2m.prototype.__pos__ = function() {
          return G2m.copy(this);
        };
        G2m.prototype.__neg__ = function() {
          return G2m.copy(this).neg();
        };
        G2m.fromCartesian = function(α, x, y, β, uom) {
          var m = new G2m();
          m.α = α;
          m.x = x;
          m.y = y;
          m.β = β;
          m.uom = uom;
          return m;
        };
        G2m.copy = function(M) {
          var copy = new G2m();
          copy.α = M.α;
          copy.x = M.x;
          copy.y = M.y;
          copy.β = M.β;
          return copy;
        };
        G2m.fromScalar = function(α) {
          return new G2m().addScalar(α);
        };
        G2m.fromSpinor = function(spinor) {
          return new G2m().copySpinor(spinor);
        };
        G2m.fromVector = function(vector) {
          if (isDefined_1.default(vector)) {
            return new G2m().copyVector(vector);
          } else {
            return void 0;
          }
        };
        G2m.lerp = function(A, B, α) {
          return G2m.copy(A).lerp(B, α);
        };
        G2m.rotorFromDirections = function(a, b) {
          return new G2m().rotorFromDirections(a, b);
        };
        G2m.vector = function(x, y) {
          return this.fromCartesian(0, x, y, 0);
        };
        G2m.BASIS_LABELS = STANDARD_LABELS;
        return G2m;
      })(VectorN_1.default);
      exports_1("default", G2m);
    }
  };
});

System.register("davinci-eight/utils/EventEmitter.js", [], function(exports_1) {
  var EventEmitter;
  return {
    setters: [],
    execute: function() {
      EventEmitter = (function() {
        function EventEmitter(owner) {
          this.owner = owner;
        }
        EventEmitter.prototype.addEventListener = function(eventName, callback) {
          this._eventRegistry = this._eventRegistry || {};
          var listeners = this._eventRegistry[eventName];
          if (!listeners) {
            listeners = this._eventRegistry[eventName] = [];
          }
          if (listeners.indexOf(callback) === -1) {
            listeners.push(callback);
          }
          return callback;
        };
        EventEmitter.prototype.removeEventListener = function(eventName, callback) {
          this._eventRegistry = this._eventRegistry || {};
          var listeners = this._eventRegistry[eventName];
          if (!listeners)
            return;
          var index = listeners.indexOf(callback);
          if (index !== -1) {
            listeners.splice(index, 1);
          }
        };
        EventEmitter.prototype.emit = function(eventName, key, value) {
          if (this._eventRegistry) {
            var listeners = this._eventRegistry[eventName];
            if (listeners) {
              var iLength = listeners.length;
              if (iLength) {
                for (var i = 0; i < iLength; i++) {
                  listeners[i](eventName, key, value, this.owner);
                }
              }
            }
          }
        };
        return EventEmitter;
      })();
      exports_1("default", EventEmitter);
    }
  };
});

System.register("davinci-eight/math/isScalarG3.js", [], function(exports_1) {
  function default_1(m) {
    return m.x === 0 && m.y === 0 && m.z === 0 && m.xy === 0 && m.yz === 0 && m.zx === 0 && m.β === 0;
  }
  exports_1("default", default_1);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/math/G3m.js", ["./dotVectorE3", "./G3", "../utils/EventEmitter", "./extG3", "./isScalarG3", "./lcoG3", "./mulG3", "./quadVectorE3", "./rcoG3", "./rotorFromDirections", "./scpG3", "./squaredNormG3", "./stringFromCoordinates", "./VectorN", "./wedgeXY", "./wedgeYZ", "./wedgeZX"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var dotVectorE3_1,
      G3_1,
      EventEmitter_1,
      extG3_1,
      isScalarG3_1,
      lcoG3_1,
      mulG3_1,
      quadVectorE3_1,
      rcoG3_1,
      rotorFromDirections_1,
      scpG3_1,
      squaredNormG3_1,
      stringFromCoordinates_1,
      VectorN_1,
      wedgeXY_1,
      wedgeYZ_1,
      wedgeZX_1;
  var COORD_SCALAR,
      COORD_X,
      COORD_Y,
      COORD_Z,
      COORD_XY,
      COORD_YZ,
      COORD_ZX,
      COORD_PSEUDO,
      BASIS_LABELS,
      EVENT_NAME_CHANGE,
      atan2,
      exp,
      cos,
      log,
      sin,
      sqrt,
      G3m;
  function coordinates(m) {
    return [m.α, m.x, m.y, m.z, m.xy, m.yz, m.zx, m.β];
  }
  return {
    setters: [function(dotVectorE3_1_1) {
      dotVectorE3_1 = dotVectorE3_1_1;
    }, function(G3_1_1) {
      G3_1 = G3_1_1;
    }, function(EventEmitter_1_1) {
      EventEmitter_1 = EventEmitter_1_1;
    }, function(extG3_1_1) {
      extG3_1 = extG3_1_1;
    }, function(isScalarG3_1_1) {
      isScalarG3_1 = isScalarG3_1_1;
    }, function(lcoG3_1_1) {
      lcoG3_1 = lcoG3_1_1;
    }, function(mulG3_1_1) {
      mulG3_1 = mulG3_1_1;
    }, function(quadVectorE3_1_1) {
      quadVectorE3_1 = quadVectorE3_1_1;
    }, function(rcoG3_1_1) {
      rcoG3_1 = rcoG3_1_1;
    }, function(rotorFromDirections_1_1) {
      rotorFromDirections_1 = rotorFromDirections_1_1;
    }, function(scpG3_1_1) {
      scpG3_1 = scpG3_1_1;
    }, function(squaredNormG3_1_1) {
      squaredNormG3_1 = squaredNormG3_1_1;
    }, function(stringFromCoordinates_1_1) {
      stringFromCoordinates_1 = stringFromCoordinates_1_1;
    }, function(VectorN_1_1) {
      VectorN_1 = VectorN_1_1;
    }, function(wedgeXY_1_1) {
      wedgeXY_1 = wedgeXY_1_1;
    }, function(wedgeYZ_1_1) {
      wedgeYZ_1 = wedgeYZ_1_1;
    }, function(wedgeZX_1_1) {
      wedgeZX_1 = wedgeZX_1_1;
    }],
    execute: function() {
      COORD_SCALAR = 0;
      COORD_X = 1;
      COORD_Y = 2;
      COORD_Z = 3;
      COORD_XY = 4;
      COORD_YZ = 5;
      COORD_ZX = 6;
      COORD_PSEUDO = 7;
      BASIS_LABELS = ["1", "e1", "e2", "e3", "e12", "e23", "e31", "e123"];
      EVENT_NAME_CHANGE = 'change';
      atan2 = Math.atan2;
      exp = Math.exp;
      cos = Math.cos;
      log = Math.log;
      sin = Math.sin;
      sqrt = Math.sqrt;
      G3m = (function(_super) {
        __extends(G3m, _super);
        function G3m() {
          _super.call(this, [0, 0, 0, 0, 0, 0, 0, 0], false, 8);
          this.eventBus = new EventEmitter_1.default(this);
        }
        G3m.prototype.on = function(eventName, callback) {
          this.eventBus.addEventListener(eventName, callback);
        };
        G3m.prototype.off = function(eventName, callback) {
          this.eventBus.removeEventListener(eventName, callback);
        };
        G3m.prototype.setCoordinate = function(index, newValue, name) {
          var coords = this.coords;
          var previous = coords[index];
          if (newValue !== previous) {
            coords[index] = newValue;
            this.modified = true;
            this.eventBus.emit(EVENT_NAME_CHANGE, name, newValue);
          }
        };
        Object.defineProperty(G3m.prototype, "α", {
          get: function() {
            return this.coords[COORD_SCALAR];
          },
          set: function(α) {
            this.setCoordinate(COORD_SCALAR, α, 'α');
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(G3m.prototype, "alpha", {
          get: function() {
            return this.coords[COORD_SCALAR];
          },
          set: function(alpha) {
            this.setCoordinate(COORD_SCALAR, alpha, 'alpha');
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(G3m.prototype, "x", {
          get: function() {
            return this.coords[COORD_X];
          },
          set: function(x) {
            this.setCoordinate(COORD_X, x, 'x');
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(G3m.prototype, "y", {
          get: function() {
            return this.coords[COORD_Y];
          },
          set: function(y) {
            this.setCoordinate(COORD_Y, y, 'y');
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(G3m.prototype, "z", {
          get: function() {
            return this.coords[COORD_Z];
          },
          set: function(z) {
            this.setCoordinate(COORD_Z, z, 'z');
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(G3m.prototype, "yz", {
          get: function() {
            return this.coords[COORD_YZ];
          },
          set: function(yz) {
            this.setCoordinate(COORD_YZ, yz, 'yz');
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(G3m.prototype, "zx", {
          get: function() {
            return this.coords[COORD_ZX];
          },
          set: function(zx) {
            this.setCoordinate(COORD_ZX, zx, 'zx');
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(G3m.prototype, "xy", {
          get: function() {
            return this.coords[COORD_XY];
          },
          set: function(xy) {
            this.setCoordinate(COORD_XY, xy, 'xy');
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(G3m.prototype, "β", {
          get: function() {
            return this.coords[COORD_PSEUDO];
          },
          set: function(β) {
            this.setCoordinate(COORD_PSEUDO, β, 'β');
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(G3m.prototype, "beta", {
          get: function() {
            return this.coords[COORD_PSEUDO];
          },
          set: function(beta) {
            this.setCoordinate(COORD_PSEUDO, beta, 'beta');
          },
          enumerable: true,
          configurable: true
        });
        G3m.prototype.add = function(M, α) {
          if (α === void 0) {
            α = 1;
          }
          this.α += M.α * α;
          this.x += M.x * α;
          this.y += M.y * α;
          this.z += M.z * α;
          this.yz += M.yz * α;
          this.zx += M.zx * α;
          this.xy += M.xy * α;
          this.β += M.β * α;
          return this;
        };
        G3m.prototype.addPseudo = function(β) {
          this.β += β;
          return this;
        };
        G3m.prototype.addScalar = function(α) {
          this.α += α;
          return this;
        };
        G3m.prototype.addVector = function(v, α) {
          if (α === void 0) {
            α = 1;
          }
          this.x += v.x * α;
          this.y += v.y * α;
          this.z += v.z * α;
          return this;
        };
        G3m.prototype.add2 = function(a, b) {
          this.α = a.α + b.α;
          this.x = a.x + b.x;
          this.y = a.y + b.y;
          this.z = a.z + b.z;
          this.yz = a.yz + b.yz;
          this.zx = a.zx + b.zx;
          this.xy = a.xy + b.xy;
          this.β = a.β + b.β;
          return this;
        };
        G3m.prototype.adj = function() {
          throw new Error('TODO: G3m.adj');
        };
        G3m.prototype.angle = function() {
          return this.log().grade(2);
        };
        G3m.prototype.clone = function() {
          return G3m.copy(this);
        };
        G3m.prototype.conj = function() {
          this.yz = -this.yz;
          this.zx = -this.zx;
          this.xy = -this.xy;
          return this;
        };
        G3m.prototype.lco = function(m) {
          return this.lco2(this, m);
        };
        G3m.prototype.lco2 = function(a, b) {
          return lcoG3_1.default(a, b, this);
        };
        G3m.prototype.rco = function(m) {
          return this.rco2(this, m);
        };
        G3m.prototype.rco2 = function(a, b) {
          return rcoG3_1.default(a, b, this);
        };
        G3m.prototype.copy = function(M) {
          this.α = M.α;
          this.x = M.x;
          this.y = M.y;
          this.z = M.z;
          this.yz = M.yz;
          this.zx = M.zx;
          this.xy = M.xy;
          this.β = M.β;
          return this;
        };
        G3m.prototype.copyScalar = function(α) {
          return this.zero().addScalar(α);
        };
        G3m.prototype.copySpinor = function(spinor) {
          this.zero();
          this.α = spinor.α;
          this.yz = spinor.yz;
          this.zx = spinor.zx;
          this.xy = spinor.xy;
          return this;
        };
        G3m.prototype.copyVector = function(vector) {
          this.zero();
          this.x = vector.x;
          this.y = vector.y;
          this.z = vector.z;
          this.uom = vector.uom;
          return this;
        };
        G3m.prototype.div = function(m) {
          if (isScalarG3_1.default(m)) {
            return this.divByScalar(m.α);
          } else {
            throw new Error("division with arbitrary multivectors is not supported");
          }
        };
        G3m.prototype.divByScalar = function(α) {
          this.α /= α;
          this.x /= α;
          this.y /= α;
          this.z /= α;
          this.yz /= α;
          this.zx /= α;
          this.xy /= α;
          this.β /= α;
          return this;
        };
        G3m.prototype.div2 = function(a, b) {
          var a0 = a.α;
          var a1 = a.yz;
          var a2 = a.zx;
          var a3 = a.xy;
          var b0 = b.α;
          var b1 = b.yz;
          var b2 = b.zx;
          var b3 = b.xy;
          this.α = a0 * b0 - a1 * b1 - a2 * b2 - a3 * b3;
          this.yz = a0 * b1 + a1 * b0 - a2 * b3 + a3 * b2;
          this.zx = a0 * b2 + a1 * b3 + a2 * b0 - a3 * b1;
          this.xy = a0 * b3 - a1 * b2 + a2 * b1 + a3 * b0;
          return this;
        };
        G3m.prototype.dual = function(m) {
          var w = -m.β;
          var x = -m.yz;
          var y = -m.zx;
          var z = -m.xy;
          var yz = m.x;
          var zx = m.y;
          var xy = m.z;
          var β = m.α;
          this.α = w;
          this.x = x;
          this.y = y;
          this.z = z;
          this.yz = yz;
          this.zx = zx;
          this.xy = xy;
          this.β = β;
          return this;
        };
        G3m.prototype.exp = function() {
          var expW = exp(this.α);
          var yz = this.yz;
          var zx = this.zx;
          var xy = this.xy;
          var φ = sqrt(yz * yz + zx * zx + xy * xy);
          var s = φ !== 0 ? sin(φ) / φ : 1;
          var cosφ = cos(φ);
          this.α = cosφ;
          this.yz = yz * s;
          this.zx = zx * s;
          this.xy = xy * s;
          return this.scale(expW);
        };
        G3m.prototype.inv = function() {
          this.conj();
          return this;
        };
        G3m.prototype.isOne = function() {
          return this.α === 1 && this.x === 0 && this.y === 0 && this.z === 0 && this.yz === 0 && this.zx === 0 && this.xy === 0 && this.β === 0;
        };
        G3m.prototype.isZero = function() {
          return this.α === 0 && this.x === 0 && this.y === 0 && this.z === 0 && this.yz === 0 && this.zx === 0 && this.xy === 0 && this.β === 0;
        };
        G3m.prototype.lerp = function(target, α) {
          this.α += (target.α - this.α) * α;
          this.x += (target.x - this.x) * α;
          this.y += (target.y - this.y) * α;
          this.z += (target.z - this.z) * α;
          this.yz += (target.yz - this.yz) * α;
          this.zx += (target.zx - this.zx) * α;
          this.xy += (target.xy - this.xy) * α;
          this.β += (target.β - this.β) * α;
          return this;
        };
        G3m.prototype.lerp2 = function(a, b, α) {
          this.copy(a).lerp(b, α);
          return this;
        };
        G3m.prototype.log = function() {
          var α = this.α;
          var x = this.yz;
          var y = this.zx;
          var z = this.xy;
          var BB = x * x + y * y + z * z;
          var B = sqrt(BB);
          var f = atan2(B, α) / B;
          this.α = log(sqrt(α * α + BB));
          this.yz = x * f;
          this.zx = y * f;
          this.xy = z * f;
          return this;
        };
        G3m.prototype.magnitude = function() {
          return this.norm();
        };
        G3m.prototype.magnitudeSansUnits = function() {
          return sqrt(this.squaredNormSansUnits());
        };
        G3m.prototype.mul = function(m) {
          return this.mul2(this, m);
        };
        G3m.prototype.mul2 = function(a, b) {
          return mulG3_1.default(a, b, this);
        };
        G3m.prototype.neg = function() {
          this.α = -this.α;
          this.x = -this.x;
          this.y = -this.y;
          this.z = -this.z;
          this.yz = -this.yz;
          this.zx = -this.zx;
          this.xy = -this.xy;
          this.β = -this.β;
          return this;
        };
        G3m.prototype.norm = function() {
          this.α = this.magnitudeSansUnits();
          this.x = 0;
          this.y = 0;
          this.z = 0;
          this.yz = 0;
          this.zx = 0;
          this.xy = 0;
          this.β = 0;
          return this;
        };
        G3m.prototype.direction = function() {
          var norm = this.magnitudeSansUnits();
          this.α = this.α / norm;
          this.x = this.x / norm;
          this.y = this.y / norm;
          this.z = this.z / norm;
          this.yz = this.yz / norm;
          this.zx = this.zx / norm;
          this.xy = this.xy / norm;
          this.β = this.β / norm;
          this.uom = void 0;
          return this;
        };
        G3m.prototype.one = function() {
          this.α = 1;
          this.x = 0;
          this.y = 0;
          this.z = 0;
          this.yz = 0;
          this.zx = 0;
          this.xy = 0;
          this.β = 0;
          this.uom = void 0;
          return this;
        };
        G3m.prototype.quad = function() {
          return this.squaredNorm();
        };
        G3m.prototype.squaredNorm = function() {
          this.α = this.squaredNormSansUnits();
          this.yz = 0;
          this.zx = 0;
          this.xy = 0;
          return this;
        };
        G3m.prototype.squaredNormSansUnits = function() {
          return squaredNormG3_1.default(this);
        };
        G3m.prototype.reflect = function(n) {
          var N = G3_1.default.fromVector(n);
          var M = G3_1.default.copy(this);
          var R = N.mul(M).mul(N).scale(-1);
          this.copy(R);
          return this;
        };
        G3m.prototype.rev = function() {
          this.α = +this.α;
          this.x = +this.x;
          this.y = +this.y;
          this.z = +this.z;
          this.yz = -this.yz;
          this.zx = -this.zx;
          this.xy = -this.xy;
          this.β = -this.β;
          return this;
        };
        G3m.prototype.__tilde__ = function() {
          return G3m.copy(this).rev();
        };
        G3m.prototype.rotate = function(R) {
          var x = this.x;
          var y = this.y;
          var z = this.z;
          var a = R.xy;
          var b = R.yz;
          var c = R.zx;
          var α = R.α;
          var ix = α * x - c * z + a * y;
          var iy = α * y - a * x + b * z;
          var iz = α * z - b * y + c * x;
          var iα = b * x + c * y + a * z;
          this.x = ix * α + iα * b + iy * a - iz * c;
          this.y = iy * α + iα * c + iz * b - ix * a;
          this.z = iz * α + iα * a + ix * c - iy * b;
          return this;
        };
        G3m.prototype.rotorFromDirections = function(b, a) {
          if (rotorFromDirections_1.default(a, b, quadVectorE3_1.default, dotVectorE3_1.default, this) !== void 0) {
            return this;
          } else {
            var rx = Math.random();
            var ry = Math.random();
            var rz = Math.random();
            this.yz = wedgeYZ_1.default(rx, ry, rz, a.x, a.y, a.z);
            this.zx = wedgeZX_1.default(rx, ry, rz, a.x, a.y, a.z);
            this.xy = wedgeXY_1.default(rx, ry, rz, a.x, a.y, a.z);
            this.α = 0;
            this.x = 0;
            this.y = 0;
            this.z = 0;
            this.β = 0;
            this.direction();
            this.rotorFromGeneratorAngle(this, Math.PI);
            return this;
          }
        };
        G3m.prototype.rotorFromAxisAngle = function(axis, θ) {
          var φ = θ / 2;
          var s = sin(φ);
          this.yz = -axis.x * s;
          this.zx = -axis.y * s;
          this.xy = -axis.z * s;
          this.α = cos(φ);
          return this;
        };
        G3m.prototype.rotorFromGeneratorAngle = function(B, θ) {
          var φ = θ / 2;
          var s = sin(φ);
          this.yz = -B.yz * s;
          this.zx = -B.zx * s;
          this.xy = -B.xy * s;
          this.α = cos(φ);
          return this;
        };
        G3m.prototype.scp = function(m) {
          return this.scp2(this, m);
        };
        G3m.prototype.scp2 = function(a, b) {
          return scpG3_1.default(a, b, this);
        };
        G3m.prototype.scale = function(α) {
          this.α *= α;
          this.x *= α;
          this.y *= α;
          this.z *= α;
          this.yz *= α;
          this.zx *= α;
          this.xy *= α;
          this.β *= α;
          return this;
        };
        G3m.prototype.slerp = function(target, α) {
          return this;
        };
        G3m.prototype.versor = function(a, b) {
          var ax = a.x;
          var ay = a.y;
          var az = a.z;
          var bx = b.x;
          var by = b.y;
          var bz = b.z;
          this.zero();
          this.α = dotVectorE3_1.default(a, b);
          this.yz = wedgeYZ_1.default(ax, ay, az, bx, by, bz);
          this.zx = wedgeZX_1.default(ax, ay, az, bx, by, bz);
          this.xy = wedgeXY_1.default(ax, ay, az, bx, by, bz);
          return this;
        };
        G3m.prototype.sub = function(M, α) {
          if (α === void 0) {
            α = 1;
          }
          this.α -= M.α * α;
          this.x -= M.x * α;
          this.y -= M.y * α;
          this.z -= M.z * α;
          this.yz -= M.yz * α;
          this.zx -= M.zx * α;
          this.xy -= M.xy * α;
          this.β -= M.β * α;
          return this;
        };
        G3m.prototype.sub2 = function(a, b) {
          this.α = a.α - b.α;
          this.x = a.x - b.x;
          this.y = a.y - b.y;
          this.z = a.z - b.z;
          this.yz = a.yz - b.yz;
          this.zx = a.zx - b.zx;
          this.xy = a.xy - b.xy;
          this.β = a.β - b.β;
          return this;
        };
        G3m.prototype.toExponential = function() {
          var coordToString = function(coord) {
            return coord.toExponential();
          };
          return stringFromCoordinates_1.default(coordinates(this), coordToString, BASIS_LABELS);
        };
        G3m.prototype.toFixed = function(fractionDigits) {
          var coordToString = function(coord) {
            return coord.toFixed(fractionDigits);
          };
          return stringFromCoordinates_1.default(coordinates(this), coordToString, BASIS_LABELS);
        };
        G3m.prototype.toString = function() {
          var coordToString = function(coord) {
            return coord.toString();
          };
          return stringFromCoordinates_1.default(coordinates(this), coordToString, BASIS_LABELS);
        };
        G3m.prototype.grade = function(grade) {
          switch (grade) {
            case 0:
              {
                this.x = 0;
                this.y = 0;
                this.z = 0;
                this.yz = 0;
                this.zx = 0;
                this.xy = 0;
                this.β = 0;
              }
              break;
            case 1:
              {
                this.α = 0;
                this.yz = 0;
                this.zx = 0;
                this.xy = 0;
                this.β = 0;
              }
              break;
            case 2:
              {
                this.α = 0;
                this.x = 0;
                this.y = 0;
                this.z = 0;
                this.β = 0;
              }
              break;
            case 3:
              {
                this.α = 0;
                this.x = 0;
                this.y = 0;
                this.z = 0;
                this.yz = 0;
                this.zx = 0;
                this.xy = 0;
              }
              break;
            default:
              {
                this.α = 0;
                this.x = 0;
                this.y = 0;
                this.z = 0;
                this.yz = 0;
                this.zx = 0;
                this.xy = 0;
                this.β = 0;
              }
          }
          return this;
        };
        G3m.prototype.ext = function(m) {
          return this.ext2(this, m);
        };
        G3m.prototype.ext2 = function(a, b) {
          return extG3_1.default(a, b, this);
        };
        G3m.prototype.zero = function() {
          this.α = 0;
          this.x = 0;
          this.y = 0;
          this.z = 0;
          this.yz = 0;
          this.zx = 0;
          this.xy = 0;
          this.β = 0;
          this.uom = void 0;
          return this;
        };
        G3m.prototype.__add__ = function(rhs) {
          if (rhs instanceof G3m) {
            return G3m.copy(this).add(rhs);
          } else if (typeof rhs === 'number') {
            return G3m.copy(this).add(G3m.fromScalar(rhs));
          } else {
            return void 0;
          }
        };
        G3m.prototype.__div__ = function(rhs) {
          if (rhs instanceof G3m) {
            return G3m.copy(this).div(rhs);
          } else if (typeof rhs === 'number') {
            return G3m.copy(this).divByScalar(rhs);
          } else {
            return void 0;
          }
        };
        G3m.prototype.__rdiv__ = function(lhs) {
          if (lhs instanceof G3m) {
            return G3m.copy(lhs).div(this);
          } else if (typeof lhs === 'number') {
            return G3m.fromScalar(lhs).div(this);
          } else {
            return void 0;
          }
        };
        G3m.prototype.__mul__ = function(rhs) {
          if (rhs instanceof G3m) {
            return G3m.copy(this).mul(rhs);
          } else if (typeof rhs === 'number') {
            return G3m.copy(this).scale(rhs);
          } else {
            return void 0;
          }
        };
        G3m.prototype.__rmul__ = function(lhs) {
          if (lhs instanceof G3m) {
            return G3m.copy(lhs).mul(this);
          } else if (typeof lhs === 'number') {
            return G3m.copy(this).scale(lhs);
          } else {
            return void 0;
          }
        };
        G3m.prototype.__radd__ = function(lhs) {
          if (lhs instanceof G3m) {
            return G3m.copy(lhs).add(this);
          } else if (typeof lhs === 'number') {
            return G3m.fromScalar(lhs).add(this);
          } else {
            return void 0;
          }
        };
        G3m.prototype.__sub__ = function(rhs) {
          if (rhs instanceof G3m) {
            return G3m.copy(this).sub(rhs);
          } else if (typeof rhs === 'number') {
            return G3m.fromScalar(rhs).neg().add(this);
          } else {
            return void 0;
          }
        };
        G3m.prototype.__rsub__ = function(lhs) {
          if (lhs instanceof G3m) {
            return G3m.copy(lhs).sub(this);
          } else if (typeof lhs === 'number') {
            return G3m.fromScalar(lhs).sub(this);
          } else {
            return void 0;
          }
        };
        G3m.prototype.__wedge__ = function(rhs) {
          if (rhs instanceof G3m) {
            return G3m.copy(this).ext(rhs);
          } else if (typeof rhs === 'number') {
            return G3m.copy(this).scale(rhs);
          } else {
            return void 0;
          }
        };
        G3m.prototype.__rwedge__ = function(lhs) {
          if (lhs instanceof G3m) {
            return G3m.copy(lhs).ext(this);
          } else if (typeof lhs === 'number') {
            return G3m.copy(this).scale(lhs);
          } else {
            return void 0;
          }
        };
        G3m.prototype.__lshift__ = function(rhs) {
          if (rhs instanceof G3m) {
            return G3m.copy(this).lco(rhs);
          } else if (typeof rhs === 'number') {
            return G3m.copy(this).lco(G3m.fromScalar(rhs));
          } else {
            return void 0;
          }
        };
        G3m.prototype.__rlshift__ = function(lhs) {
          if (lhs instanceof G3m) {
            return G3m.copy(lhs).lco(this);
          } else if (typeof lhs === 'number') {
            return G3m.fromScalar(lhs).lco(this);
          } else {
            return void 0;
          }
        };
        G3m.prototype.__rshift__ = function(rhs) {
          if (rhs instanceof G3m) {
            return G3m.copy(this).rco(rhs);
          } else if (typeof rhs === 'number') {
            return G3m.copy(this).rco(G3m.fromScalar(rhs));
          } else {
            return void 0;
          }
        };
        G3m.prototype.__rrshift__ = function(lhs) {
          if (lhs instanceof G3m) {
            return G3m.copy(lhs).rco(this);
          } else if (typeof lhs === 'number') {
            return G3m.fromScalar(lhs).rco(this);
          } else {
            return void 0;
          }
        };
        G3m.prototype.__vbar__ = function(rhs) {
          if (rhs instanceof G3m) {
            return G3m.copy(this).scp(rhs);
          } else if (typeof rhs === 'number') {
            return G3m.copy(this).scp(G3m.fromScalar(rhs));
          } else {
            return void 0;
          }
        };
        G3m.prototype.__rvbar__ = function(lhs) {
          if (lhs instanceof G3m) {
            return G3m.copy(lhs).scp(this);
          } else if (typeof lhs === 'number') {
            return G3m.fromScalar(lhs).scp(this);
          } else {
            return void 0;
          }
        };
        G3m.prototype.__bang__ = function() {
          return G3m.copy(this).inv();
        };
        G3m.prototype.__pos__ = function() {
          return G3m.copy(this);
        };
        G3m.prototype.__neg__ = function() {
          return G3m.copy(this).neg();
        };
        G3m.zero = function() {
          return new G3m();
        };
        G3m.one = function() {
          return new G3m().addScalar(1);
        };
        G3m.e1 = function() {
          return G3m.vector(1, 0, 0);
        };
        G3m.e2 = function() {
          return G3m.vector(0, 1, 0);
        };
        G3m.e3 = function() {
          return G3m.vector(0, 0, 1);
        };
        G3m.I = function() {
          return new G3m().addPseudo(1);
        };
        G3m.copy = function(M) {
          var copy = new G3m();
          copy.α = M.α;
          copy.x = M.x;
          copy.y = M.y;
          copy.z = M.z;
          copy.yz = M.yz;
          copy.zx = M.zx;
          copy.xy = M.xy;
          copy.β = M.β;
          return copy;
        };
        G3m.fromScalar = function(α) {
          return new G3m().copyScalar(α);
        };
        G3m.fromSpinor = function(spinor) {
          var copy = new G3m();
          copy.α = spinor.α;
          copy.yz = spinor.yz;
          copy.zx = spinor.yz;
          copy.xy = spinor.xy;
          return copy;
        };
        G3m.fromVector = function(vector) {
          var copy = new G3m();
          copy.x = vector.x;
          copy.y = vector.y;
          copy.z = vector.z;
          return copy;
        };
        G3m.lerp = function(A, B, α) {
          return G3m.copy(A).lerp(B, α);
        };
        G3m.rotorFromDirections = function(a, b) {
          return new G3m().rotorFromDirections(a, b);
        };
        G3m.vector = function(x, y, z, uom) {
          var v = new G3m();
          v.x = x;
          v.y = y;
          v.z = z;
          v.uom = uom;
          return v;
        };
        return G3m;
      })(VectorN_1.default);
      exports_1("default", G3m);
    }
  };
});

System.register("davinci-eight/geometries/dataLength.js", ["../math/G2m", "../math/G3m", "../math/Vector2", "../math/Vector3"], function(exports_1) {
  var G2m_1,
      G3m_1,
      Vector2_1,
      Vector3_1;
  function dataLength(source) {
    if (source instanceof G3m_1.default) {
      if (source.length !== 8) {
        throw new Error("source.length is expected to be 8");
      }
      return 3;
    } else if (source instanceof G2m_1.default) {
      if (source.length !== 4) {
        throw new Error("source.length is expected to be 4");
      }
      return 2;
    } else if (source instanceof Vector3_1.default) {
      if (source.length !== 3) {
        throw new Error("source.length is expected to be 3");
      }
      return 3;
    } else if (source instanceof Vector2_1.default) {
      if (source.length !== 2) {
        throw new Error("source.length is expected to be 2");
      }
      return 2;
    } else {
      return source.length;
    }
  }
  exports_1("default", dataLength);
  return {
    setters: [function(G2m_1_1) {
      G2m_1 = G2m_1_1;
    }, function(G3m_1_1) {
      G3m_1 = G3m_1_1;
    }, function(Vector2_1_1) {
      Vector2_1 = Vector2_1_1;
    }, function(Vector3_1_1) {
      Vector3_1 = Vector3_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/geometries/simplicesToGeometryMeta.js", ["../geometries/dataLength", "../checks/expectArg", "../checks/isDefined", "../geometries/Simplex"], function(exports_1) {
  var dataLength_1,
      expectArg_1,
      isDefined_1,
      Simplex_1;
  function stringify(thing, space) {
    var cache = [];
    return JSON.stringify(thing, function(key, value) {
      if (typeof value === 'object' && value !== null) {
        if (cache.indexOf(value) !== -1) {
          return;
        }
        cache.push(value);
      }
      return value;
    }, space);
  }
  function simplicesToGeometryMeta(geometry) {
    var kValueOfSimplex = void 0;
    var knowns = {};
    var geometryLen = geometry.length;
    for (var i = 0; i < geometryLen; i++) {
      var simplex = geometry[i];
      if (!(simplex instanceof Simplex_1.default)) {
        expectArg_1.default('simplex', simplex).toSatisfy(false, "Every element must be a Simplex @ simplicesToGeometryMeta(). Found " + stringify(simplex, 2));
      }
      var vertices = simplex.vertices;
      kValueOfSimplex = simplex.k;
      for (var j = 0,
          vsLen = vertices.length; j < vsLen; j++) {
        var vertex = vertices[j];
        var attributes = vertex.attributes;
        var keys = Object.keys(attributes);
        var keysLen = keys.length;
        for (var k = 0; k < keysLen; k++) {
          var key = keys[k];
          var value = attributes[key];
          var dLength = dataLength_1.default(value);
          var known = knowns[key];
          if (known) {
            if (known.size !== dLength) {
              throw new Error("Something is rotten in Denmark!");
            }
          } else {
            knowns[key] = {size: dLength};
          }
        }
      }
    }
    if (isDefined_1.default(kValueOfSimplex)) {
      var info = {
        get attributes() {
          return knowns;
        },
        get k() {
          return kValueOfSimplex;
        }
      };
      return info;
    } else {
      return void 0;
    }
  }
  exports_1("default", simplicesToGeometryMeta);
  return {
    setters: [function(dataLength_1_1) {
      dataLength_1 = dataLength_1_1;
    }, function(expectArg_1_1) {
      expectArg_1 = expectArg_1_1;
    }, function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }, function(Simplex_1_1) {
      Simplex_1 = Simplex_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/math/Vector1.js", ["../math/VectorN"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var VectorN_1;
  var exp,
      log,
      sqrt,
      COORD_X,
      Vector1;
  return {
    setters: [function(VectorN_1_1) {
      VectorN_1 = VectorN_1_1;
    }],
    execute: function() {
      exp = Math.exp;
      log = Math.log;
      sqrt = Math.sqrt;
      COORD_X = 0;
      Vector1 = (function(_super) {
        __extends(Vector1, _super);
        function Vector1(data, modified) {
          if (data === void 0) {
            data = [0];
          }
          if (modified === void 0) {
            modified = false;
          }
          _super.call(this, data, modified, 1);
        }
        Object.defineProperty(Vector1.prototype, "x", {
          get: function() {
            return this.coords[COORD_X];
          },
          set: function(value) {
            this.modified = this.modified || this.x !== value;
            this.coords[COORD_X] = value;
          },
          enumerable: true,
          configurable: true
        });
        Vector1.prototype.set = function(x) {
          this.x = x;
          return this;
        };
        Vector1.prototype.add = function(vector, alpha) {
          if (alpha === void 0) {
            alpha = 1;
          }
          this.x += vector.x * alpha;
          return this;
        };
        Vector1.prototype.add2 = function(a, b) {
          this.x = a.x + b.x;
          return this;
        };
        Vector1.prototype.scp = function(v) {
          return this;
        };
        Vector1.prototype.adj = function() {
          throw new Error('TODO: Vector1.adj');
        };
        Vector1.prototype.conj = function() {
          return this;
        };
        Vector1.prototype.copy = function(v) {
          this.x = v.x;
          return this;
        };
        Vector1.prototype.det = function() {
          return this.x;
        };
        Vector1.prototype.dual = function() {
          return this;
        };
        Vector1.prototype.exp = function() {
          this.x = exp(this.x);
          return this;
        };
        Vector1.prototype.one = function() {
          this.x = 1;
          return this;
        };
        Vector1.prototype.inv = function() {
          this.x = 1 / this.x;
          return this;
        };
        Vector1.prototype.lco = function(v) {
          return this;
        };
        Vector1.prototype.log = function() {
          this.x = log(this.x);
          return this;
        };
        Vector1.prototype.mul = function(v) {
          this.x *= v.x;
          return this;
        };
        Vector1.prototype.norm = function() {
          return this;
        };
        Vector1.prototype.div = function(v) {
          this.x /= v.x;
          return this;
        };
        Vector1.prototype.divByScalar = function(scalar) {
          this.x /= scalar;
          return this;
        };
        Vector1.prototype.min = function(v) {
          if (this.x > v.x) {
            this.x = v.x;
          }
          return this;
        };
        Vector1.prototype.max = function(v) {
          if (this.x < v.x) {
            this.x = v.x;
          }
          return this;
        };
        Vector1.prototype.floor = function() {
          this.x = Math.floor(this.x);
          return this;
        };
        Vector1.prototype.ceil = function() {
          this.x = Math.ceil(this.x);
          return this;
        };
        Vector1.prototype.rev = function() {
          return this;
        };
        Vector1.prototype.rco = function(v) {
          return this;
        };
        Vector1.prototype.round = function() {
          this.x = Math.round(this.x);
          return this;
        };
        Vector1.prototype.roundToZero = function() {
          this.x = (this.x < 0) ? Math.ceil(this.x) : Math.floor(this.x);
          return this;
        };
        Vector1.prototype.scale = function(scalar) {
          this.x *= scalar;
          return this;
        };
        Vector1.prototype.sub = function(v) {
          this.x -= v.x;
          return this;
        };
        Vector1.prototype.subScalar = function(s) {
          this.x -= s;
          return this;
        };
        Vector1.prototype.sub2 = function(a, b) {
          this.x = a.x - b.x;
          return this;
        };
        Vector1.prototype.neg = function() {
          this.x = -this.x;
          return this;
        };
        Vector1.prototype.distanceTo = function(position) {
          return sqrt(this.quadranceTo(position));
        };
        Vector1.prototype.dot = function(v) {
          return this.x * v.x;
        };
        Vector1.prototype.magnitude = function() {
          return sqrt(this.squaredNorm());
        };
        Vector1.prototype.direction = function() {
          return this.divByScalar(this.magnitude());
        };
        Vector1.prototype.mul2 = function(a, b) {
          return this;
        };
        Vector1.prototype.quad = function() {
          var x = this.x;
          this.x = x * x;
          return this;
        };
        Vector1.prototype.squaredNorm = function() {
          return this.x * this.x;
        };
        Vector1.prototype.quadranceTo = function(position) {
          var dx = this.x - position.x;
          return dx * dx;
        };
        Vector1.prototype.reflect = function(n) {
          return this;
        };
        Vector1.prototype.reflection = function(n) {
          return this;
        };
        Vector1.prototype.rotate = function(rotor) {
          return this;
        };
        Vector1.prototype.lerp = function(v, α) {
          this.x += (v.x - this.x) * α;
          return this;
        };
        Vector1.prototype.lerp2 = function(a, b, α) {
          this.sub2(b, a).scale(α).add(a);
          return this;
        };
        Vector1.prototype.equals = function(v) {
          return v.x === this.x;
        };
        Vector1.prototype.fromArray = function(array, offset) {
          if (offset === void 0) {
            offset = 0;
          }
          this.x = array[offset];
          return this;
        };
        Vector1.prototype.slerp = function(v, α) {
          return this;
        };
        Vector1.prototype.toArray = function(array, offset) {
          if (array === void 0) {
            array = [];
          }
          if (offset === void 0) {
            offset = 0;
          }
          array[offset] = this.x;
          return array;
        };
        Vector1.prototype.toExponential = function() {
          return "TODO: Vector1.toExponential";
        };
        Vector1.prototype.toFixed = function(digits) {
          return "TODO: Vector1.toFixed";
        };
        Vector1.prototype.translation = function(d) {
          return this.one();
        };
        Vector1.prototype.fromAttribute = function(attribute, index, offset) {
          if (offset === void 0) {
            offset = 0;
          }
          index = index * attribute.itemSize + offset;
          this.x = attribute.array[index];
          return this;
        };
        Vector1.prototype.clone = function() {
          return new Vector1([this.x]);
        };
        Vector1.prototype.ext = function(v) {
          return this;
        };
        Vector1.prototype.zero = function() {
          this.x = 0;
          return this;
        };
        return Vector1;
      })(VectorN_1.default);
      exports_1("default", Vector1);
    }
  };
});

System.register("davinci-eight/geometries/SimplexPrimitivesBuilder.js", ["../math/G3", "../checks/mustBeBoolean", "../checks/mustBeInteger", "../geometries/PrimitivesBuilder", "../geometries/Simplex", "../core/GraphicsProgramSymbols", "../geometries/simplicesToDrawPrimitive", "../geometries/simplicesToGeometryMeta", "../math/Vector1", "../math/Vector3"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var G3_1,
      mustBeBoolean_1,
      mustBeInteger_1,
      PrimitivesBuilder_1,
      Simplex_1,
      GraphicsProgramSymbols_1,
      simplicesToDrawPrimitive_1,
      simplicesToGeometryMeta_1,
      Vector1_1,
      Vector3_1;
  var SimplexPrimitivesBuilder;
  return {
    setters: [function(G3_1_1) {
      G3_1 = G3_1_1;
    }, function(mustBeBoolean_1_1) {
      mustBeBoolean_1 = mustBeBoolean_1_1;
    }, function(mustBeInteger_1_1) {
      mustBeInteger_1 = mustBeInteger_1_1;
    }, function(PrimitivesBuilder_1_1) {
      PrimitivesBuilder_1 = PrimitivesBuilder_1_1;
    }, function(Simplex_1_1) {
      Simplex_1 = Simplex_1_1;
    }, function(GraphicsProgramSymbols_1_1) {
      GraphicsProgramSymbols_1 = GraphicsProgramSymbols_1_1;
    }, function(simplicesToDrawPrimitive_1_1) {
      simplicesToDrawPrimitive_1 = simplicesToDrawPrimitive_1_1;
    }, function(simplicesToGeometryMeta_1_1) {
      simplicesToGeometryMeta_1 = simplicesToGeometryMeta_1_1;
    }, function(Vector1_1_1) {
      Vector1_1 = Vector1_1_1;
    }, function(Vector3_1_1) {
      Vector3_1 = Vector3_1_1;
    }],
    execute: function() {
      SimplexPrimitivesBuilder = (function(_super) {
        __extends(SimplexPrimitivesBuilder, _super);
        function SimplexPrimitivesBuilder() {
          _super.call(this);
          this.data = [];
          this._k = new Vector1_1.default([Simplex_1.default.TRIANGLE]);
          this.curvedSegments = 16;
          this.flatSegments = 1;
          this.orientationColors = false;
          this._k.modified = true;
        }
        Object.defineProperty(SimplexPrimitivesBuilder.prototype, "k", {
          get: function() {
            return this._k.x;
          },
          set: function(k) {
            this._k.x = mustBeInteger_1.default('k', k);
          },
          enumerable: true,
          configurable: true
        });
        SimplexPrimitivesBuilder.prototype.regenerate = function() {
          console.warn("`public regenerate(): void` method should be implemented in derived class.");
        };
        SimplexPrimitivesBuilder.prototype.isModified = function() {
          return this._k.modified;
        };
        SimplexPrimitivesBuilder.prototype.setModified = function(modified) {
          mustBeBoolean_1.default('modified', modified);
          this._k.modified = modified;
          return this;
        };
        SimplexPrimitivesBuilder.prototype.boundary = function(times) {
          if (this.isModified()) {
            this.regenerate();
          }
          this.data = Simplex_1.default.boundary(this.data, times);
          return this.check();
        };
        SimplexPrimitivesBuilder.prototype.check = function() {
          this.meta = simplicesToGeometryMeta_1.default(this.data);
          return this;
        };
        SimplexPrimitivesBuilder.prototype.subdivide = function(times) {
          if (this.isModified()) {
            this.regenerate();
          }
          this.data = Simplex_1.default.subdivide(this.data, times);
          this.check();
          return this;
        };
        SimplexPrimitivesBuilder.prototype.setPosition = function(position) {
          _super.prototype.setPosition.call(this, position);
          return this;
        };
        SimplexPrimitivesBuilder.prototype.toPrimitives = function() {
          if (this.isModified()) {
            this.regenerate();
          }
          this.check();
          return [simplicesToDrawPrimitive_1.default(this.data, this.meta)];
        };
        SimplexPrimitivesBuilder.prototype.mergeVertices = function(precisionPoints) {
          if (precisionPoints === void 0) {
            precisionPoints = 4;
          }
        };
        SimplexPrimitivesBuilder.prototype.triangle = function(positions, normals, uvs) {
          var simplex = new Simplex_1.default(Simplex_1.default.TRIANGLE);
          simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = positions[0];
          simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = positions[1];
          simplex.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = positions[2];
          simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = normals[0];
          simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = normals[1];
          simplex.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = normals[2];
          simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_TEXTURE_COORDS] = uvs[0];
          simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_TEXTURE_COORDS] = uvs[1];
          simplex.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_TEXTURE_COORDS] = uvs[2];
          if (this.orientationColors) {
            simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR] = Vector3_1.default.copy(G3_1.default.e1);
            simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR] = Vector3_1.default.copy(G3_1.default.e2);
            simplex.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR] = Vector3_1.default.copy(G3_1.default.e3);
          }
          return this.data.push(simplex);
        };
        SimplexPrimitivesBuilder.prototype.lineSegment = function(positions, normals, uvs) {
          var simplex = new Simplex_1.default(Simplex_1.default.LINE);
          simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = positions[0];
          simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = positions[1];
          simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = normals[0];
          simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = normals[1];
          simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_TEXTURE_COORDS] = uvs[0];
          simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_TEXTURE_COORDS] = uvs[1];
          if (this.orientationColors) {
            simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR] = Vector3_1.default.copy(G3_1.default.e1);
            simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR] = Vector3_1.default.copy(G3_1.default.e2);
          }
          return this.data.push(simplex);
        };
        SimplexPrimitivesBuilder.prototype.point = function(positions, normals, uvs) {
          var simplex = new Simplex_1.default(Simplex_1.default.POINT);
          simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = positions[0];
          simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = normals[0];
          simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_TEXTURE_COORDS] = uvs[0];
          if (this.orientationColors) {
            simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_COLOR] = Vector3_1.default.copy(G3_1.default.e1);
          }
          return this.data.push(simplex);
        };
        SimplexPrimitivesBuilder.prototype.empty = function(positions, normals, uvs) {
          var simplex = new Simplex_1.default(Simplex_1.default.EMPTY);
          return this.data.push(simplex);
        };
        SimplexPrimitivesBuilder.prototype.enableTextureCoords = function(enable) {
          _super.prototype.enableTextureCoords.call(this, enable);
          return this;
        };
        return SimplexPrimitivesBuilder;
      })(PrimitivesBuilder_1.default);
      exports_1("default", SimplexPrimitivesBuilder);
    }
  };
});

System.register("davinci-eight/geometries/Vertex.js", [], function(exports_1) {
  var Vertex;
  function stringVectorN(name, vector) {
    if (vector) {
      return name + vector.toString();
    } else {
      return name;
    }
  }
  function stringifyVertex(vertex) {
    var attributes = vertex.attributes;
    var attribsKey = Object.keys(attributes).map(function(name) {
      var vector = attributes[name];
      return stringVectorN(name, vector);
    }).join(' ');
    return attribsKey;
  }
  return {
    setters: [],
    execute: function() {
      Vertex = (function() {
        function Vertex() {
          this.attributes = {};
        }
        Vertex.prototype.toString = function() {
          return stringifyVertex(this);
        };
        return Vertex;
      })();
      exports_1("default", Vertex);
    }
  };
});

System.register("davinci-eight/geometries/Simplex.js", ["../checks/expectArg", "../checks/isInteger", "../geometries/Vertex", "../math/VectorN"], function(exports_1) {
  var expectArg_1,
      isInteger_1,
      Vertex_1,
      VectorN_1;
  var Simplex;
  function checkIntegerArg(name, n, min, max) {
    if (isInteger_1.default(n) && n >= min && n <= max) {
      return n;
    }
    expectArg_1.default(name, n).toSatisfy(false, name + " must be an integer in the range [" + min + "," + max + "]");
  }
  function checkCountArg(count) {
    return checkIntegerArg('count', count, 0, 7);
  }
  function concatReduce(a, b) {
    return a.concat(b);
  }
  function lerp(a, b, alpha, data) {
    if (data === void 0) {
      data = [];
    }
    expectArg_1.default('b', b).toSatisfy(a.length === b.length, "a must be the same length as b");
    var dims = a.length;
    var i;
    var beta = 1 - alpha;
    for (i = 0; i < dims; i++) {
      data.push(beta * a[i] + alpha * b[i]);
    }
    return data;
  }
  function lerpVertexAttributeMap(a, b, alpha) {
    var attribMap = {};
    var keys = Object.keys(a);
    var keysLength = keys.length;
    for (var k = 0; k < keysLength; k++) {
      var key = keys[k];
      attribMap[key] = lerpVectorN(a[key], b[key], alpha);
    }
    return attribMap;
  }
  function lerpVectorN(a, b, alpha) {
    return new VectorN_1.default(lerp(a.coords, b.coords, alpha));
  }
  return {
    setters: [function(expectArg_1_1) {
      expectArg_1 = expectArg_1_1;
    }, function(isInteger_1_1) {
      isInteger_1 = isInteger_1_1;
    }, function(Vertex_1_1) {
      Vertex_1 = Vertex_1_1;
    }, function(VectorN_1_1) {
      VectorN_1 = VectorN_1_1;
    }],
    execute: function() {
      Simplex = (function() {
        function Simplex(k) {
          this.vertices = [];
          if (!isInteger_1.default(k)) {
            expectArg_1.default('k', k).toBeNumber();
          }
          var numVertices = k + 1;
          for (var i = 0; i < numVertices; i++) {
            this.vertices.push(new Vertex_1.default());
          }
        }
        Object.defineProperty(Simplex.prototype, "k", {
          get: function() {
            return this.vertices.length - 1;
          },
          enumerable: true,
          configurable: true
        });
        Simplex.indices = function(simplex) {
          return simplex.vertices.map(function(vertex) {
            return vertex.index;
          });
        };
        Simplex.boundaryMap = function(simplex) {
          var vertices = simplex.vertices;
          var k = simplex.k;
          if (k === Simplex.TRIANGLE) {
            var line01 = new Simplex(k - 1);
            line01.vertices[0].attributes = vertices[0].attributes;
            line01.vertices[1].attributes = vertices[1].attributes;
            var line12 = new Simplex(k - 1);
            line12.vertices[0].attributes = vertices[1].attributes;
            line12.vertices[1].attributes = vertices[2].attributes;
            var line20 = new Simplex(k - 1);
            line20.vertices[0].attributes = vertices[2].attributes;
            line20.vertices[1].attributes = vertices[0].attributes;
            return [line01, line12, line20];
          } else if (k === Simplex.LINE) {
            var point0 = new Simplex(k - 1);
            point0.vertices[0].attributes = simplex.vertices[0].attributes;
            var point1 = new Simplex(k - 1);
            point1.vertices[0].attributes = simplex.vertices[1].attributes;
            return [point0, point1];
          } else if (k === Simplex.POINT) {
            return [new Simplex(k - 1)];
          } else if (k === Simplex.EMPTY) {
            return [];
          } else {
            throw new Error("Unexpected k-simplex, k = " + simplex.k + " @ Simplex.boundaryMap()");
          }
        };
        Simplex.subdivideMap = function(simplex) {
          expectArg_1.default('simplex', simplex).toBeObject();
          var divs = [];
          var vertices = simplex.vertices;
          var k = simplex.k;
          if (k === Simplex.TRIANGLE) {
            var a = vertices[0].attributes;
            var b = vertices[1].attributes;
            var c = vertices[2].attributes;
            var m1 = lerpVertexAttributeMap(a, b, 0.5);
            var m2 = lerpVertexAttributeMap(b, c, 0.5);
            var m3 = lerpVertexAttributeMap(c, a, 0.5);
            var face1 = new Simplex(k);
            face1.vertices[0].attributes = c;
            face1.vertices[1].attributes = m3;
            face1.vertices[2].attributes = m2;
            var face2 = new Simplex(k);
            face2.vertices[0].attributes = a;
            face2.vertices[1].attributes = m1;
            face2.vertices[2].attributes = m3;
            var face3 = new Simplex(k);
            face3.vertices[0].attributes = b;
            face3.vertices[1].attributes = m2;
            face3.vertices[2].attributes = m1;
            var face4 = new Simplex(k);
            face4.vertices[0].attributes = m1;
            face4.vertices[1].attributes = m2;
            face4.vertices[2].attributes = m3;
            divs.push(face1);
            divs.push(face2);
            divs.push(face3);
            divs.push(face4);
          } else if (k === Simplex.LINE) {
            var a = vertices[0].attributes;
            var b = vertices[1].attributes;
            var m = lerpVertexAttributeMap(a, b, 0.5);
            var line1 = new Simplex(k);
            line1.vertices[0].attributes = a;
            line1.vertices[1].attributes = m;
            var line2 = new Simplex(k);
            line2.vertices[0].attributes = m;
            line2.vertices[1].attributes = b;
            divs.push(line1);
            divs.push(line2);
          } else if (k === Simplex.POINT) {
            divs.push(simplex);
          } else if (k === Simplex.EMPTY) {} else {
            throw new Error(k + "-simplex is not supported");
          }
          return divs;
        };
        Simplex.boundary = function(simplices, count) {
          if (count === void 0) {
            count = 1;
          }
          checkCountArg(count);
          for (var i = 0; i < count; i++) {
            simplices = simplices.map(Simplex.boundaryMap).reduce(concatReduce, []);
          }
          return simplices;
        };
        Simplex.subdivide = function(simplices, count) {
          if (count === void 0) {
            count = 1;
          }
          checkCountArg(count);
          for (var i = 0; i < count; i++) {
            simplices = simplices.map(Simplex.subdivideMap).reduce(concatReduce, []);
          }
          return simplices;
        };
        Simplex.setAttributeValues = function(attributes, simplex) {
          var names = Object.keys(attributes);
          var attribsLength = names.length;
          var attribIndex;
          for (attribIndex = 0; attribIndex < attribsLength; attribIndex++) {
            var name_1 = names[attribIndex];
            var values = attributes[name_1];
            var valuesLength = values.length;
            var valueIndex = void 0;
            for (valueIndex = 0; valueIndex < valuesLength; valueIndex++) {
              simplex.vertices[valueIndex].attributes[name_1] = values[valueIndex];
            }
          }
        };
        Simplex.EMPTY = -1;
        Simplex.POINT = 0;
        Simplex.LINE = 1;
        Simplex.TRIANGLE = 2;
        Simplex.TETRAHEDRON = 3;
        Simplex.FIVE_CELL = 4;
        return Simplex;
      })();
      exports_1("default", Simplex);
    }
  };
});

System.register("davinci-eight/math/Vector2.js", ["../geometries/b2", "../geometries/b3", "../i18n/notImplemented", "../math/stringFromCoordinates", "../math/VectorN"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var b2_1,
      b3_1,
      notImplemented_1,
      stringFromCoordinates_1,
      VectorN_1;
  var sqrt,
      COORD_X,
      COORD_Y,
      Vector2;
  return {
    setters: [function(b2_1_1) {
      b2_1 = b2_1_1;
    }, function(b3_1_1) {
      b3_1 = b3_1_1;
    }, function(notImplemented_1_1) {
      notImplemented_1 = notImplemented_1_1;
    }, function(stringFromCoordinates_1_1) {
      stringFromCoordinates_1 = stringFromCoordinates_1_1;
    }, function(VectorN_1_1) {
      VectorN_1 = VectorN_1_1;
    }],
    execute: function() {
      sqrt = Math.sqrt;
      COORD_X = 0;
      COORD_Y = 1;
      Vector2 = (function(_super) {
        __extends(Vector2, _super);
        function Vector2(data, modified) {
          if (data === void 0) {
            data = [0, 0];
          }
          if (modified === void 0) {
            modified = false;
          }
          _super.call(this, data, modified, 2);
        }
        Object.defineProperty(Vector2.prototype, "x", {
          get: function() {
            return this.coords[COORD_X];
          },
          set: function(value) {
            this.modified = this.modified || this.x !== value;
            this.coords[COORD_X] = value;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Vector2.prototype, "y", {
          get: function() {
            return this.coords[COORD_Y];
          },
          set: function(value) {
            this.modified = this.modified || this.y !== value;
            this.coords[COORD_Y] = value;
          },
          enumerable: true,
          configurable: true
        });
        Vector2.prototype.add = function(v, α) {
          if (α === void 0) {
            α = 1;
          }
          this.x += v.x * α;
          this.y += v.y * α;
          return this;
        };
        Vector2.prototype.add2 = function(a, b) {
          this.x = a.x + b.x;
          this.y = a.y + b.y;
          return this;
        };
        Vector2.prototype.applyMatrix = function(m) {
          var x = this.x;
          var y = this.y;
          var e = m.elements;
          this.x = e[0x0] * x + e[0x2] * y;
          this.y = e[0x1] * x + e[0x3] * y;
          return this;
        };
        Vector2.prototype.clone = function() {
          return new Vector2([this.x, this.y]);
        };
        Vector2.prototype.copy = function(v) {
          this.x = v.x;
          this.y = v.y;
          return this;
        };
        Vector2.prototype.cubicBezier = function(t, controlBegin, controlEnd, endPoint) {
          var x = b3_1.default(t, this.x, controlBegin.x, controlEnd.x, endPoint.x);
          var y = b3_1.default(t, this.y, controlBegin.y, controlEnd.y, endPoint.y);
          this.x = x;
          this.y = y;
          return this;
        };
        Vector2.prototype.distanceTo = function(position) {
          return sqrt(this.quadranceTo(position));
        };
        Vector2.prototype.sub = function(v) {
          this.x -= v.x;
          this.y -= v.y;
          return this;
        };
        Vector2.prototype.sub2 = function(a, b) {
          this.x = a.x - b.x;
          this.y = a.y - b.y;
          return this;
        };
        Vector2.prototype.scale = function(α) {
          this.x *= α;
          this.y *= α;
          return this;
        };
        Vector2.prototype.divByScalar = function(scalar) {
          if (scalar !== 0) {
            var invScalar = 1 / scalar;
            this.x *= invScalar;
            this.y *= invScalar;
          } else {
            this.x = 0;
            this.y = 0;
          }
          return this;
        };
        Vector2.prototype.min = function(v) {
          if (this.x > v.x) {
            this.x = v.x;
          }
          if (this.y > v.y) {
            this.y = v.y;
          }
          return this;
        };
        Vector2.prototype.max = function(v) {
          if (this.x < v.x) {
            this.x = v.x;
          }
          if (this.y < v.y) {
            this.y = v.y;
          }
          return this;
        };
        Vector2.prototype.floor = function() {
          this.x = Math.floor(this.x);
          this.y = Math.floor(this.y);
          return this;
        };
        Vector2.prototype.ceil = function() {
          this.x = Math.ceil(this.x);
          this.y = Math.ceil(this.y);
          return this;
        };
        Vector2.prototype.round = function() {
          this.x = Math.round(this.x);
          this.y = Math.round(this.y);
          return this;
        };
        Vector2.prototype.roundToZero = function() {
          this.x = (this.x < 0) ? Math.ceil(this.x) : Math.floor(this.x);
          this.y = (this.y < 0) ? Math.ceil(this.y) : Math.floor(this.y);
          return this;
        };
        Vector2.prototype.neg = function() {
          this.x = -this.x;
          this.y = -this.y;
          return this;
        };
        Vector2.prototype.dot = function(v) {
          return this.x * v.x + this.y * v.y;
        };
        Vector2.prototype.magnitude = function() {
          return sqrt(this.squaredNorm());
        };
        Vector2.prototype.direction = function() {
          return this.divByScalar(this.magnitude());
        };
        Vector2.prototype.squaredNorm = function() {
          return this.x * this.x + this.y * this.y;
        };
        Vector2.prototype.quadranceTo = function(position) {
          var dx = this.x - position.x;
          var dy = this.y - position.y;
          return dx * dx + dy * dy;
        };
        Vector2.prototype.quadraticBezier = function(t, controlPoint, endPoint) {
          var x = b2_1.default(t, this.x, controlPoint.x, endPoint.x);
          var y = b2_1.default(t, this.y, controlPoint.y, endPoint.y);
          this.x = x;
          this.y = y;
          return this;
        };
        Vector2.prototype.reflect = function(n) {
          throw new Error(notImplemented_1.default('reflect').message);
        };
        Vector2.prototype.rotate = function(spinor) {
          var x = this.x;
          var y = this.y;
          var α = spinor.α;
          var β = spinor.β;
          var p = α * α - β * β;
          var q = 2 * α * β;
          this.x = p * x + q * y;
          this.y = p * y - q * x;
          return this;
        };
        Vector2.prototype.lerp = function(v, α) {
          this.x += (v.x - this.x) * α;
          this.y += (v.y - this.y) * α;
          return this;
        };
        Vector2.prototype.lerp2 = function(a, b, α) {
          this.copy(a).lerp(b, α);
          return this;
        };
        Vector2.prototype.equals = function(v) {
          return ((v.x === this.x) && (v.y === this.y));
        };
        Vector2.prototype.slerp = function(v, α) {
          throw new Error(notImplemented_1.default('slerp').message);
        };
        Vector2.prototype.toExponential = function() {
          var coordToString = function(coord) {
            return coord.toExponential();
          };
          return stringFromCoordinates_1.default(this.coords, coordToString, ['e1', 'e2']);
        };
        Vector2.prototype.toFixed = function(fractionDigits) {
          var coordToString = function(coord) {
            return coord.toFixed(fractionDigits);
          };
          return stringFromCoordinates_1.default(this.coords, coordToString, ['e1', 'e2']);
        };
        Vector2.prototype.toString = function() {
          var coordToString = function(coord) {
            return coord.toString();
          };
          return stringFromCoordinates_1.default(this.coords, coordToString, ['e1', 'e2']);
        };
        Vector2.prototype.fromArray = function(array, offset) {
          if (offset === void 0) {
            offset = 0;
          }
          this.x = array[offset];
          this.y = array[offset + 1];
          return this;
        };
        Vector2.prototype.fromAttribute = function(attribute, index, offset) {
          if (offset === void 0) {
            offset = 0;
          }
          index = index * attribute.itemSize + offset;
          this.x = attribute.array[index];
          this.y = attribute.array[index + 1];
          return this;
        };
        Vector2.prototype.zero = function() {
          this.x = 0;
          this.y = 0;
          return this;
        };
        Vector2.copy = function(vector) {
          return Vector2.vector(vector.x, vector.y);
        };
        Vector2.lerp = function(a, b, α) {
          return Vector2.copy(b).sub(a).scale(α).add(a);
        };
        Vector2.random = function() {
          return Vector2.vector(Math.random(), Math.random());
        };
        Vector2.vector = function(x, y) {
          return new Vector2([x, y]);
        };
        return Vector2;
      })(VectorN_1.default);
      exports_1("default", Vector2);
    }
  };
});

System.register("davinci-eight/geometries/PolyhedronBuilder.js", ["../math/G3", "../geometries/SimplexPrimitivesBuilder", "../geometries/Simplex", "../core/GraphicsProgramSymbols", "../math/Vector2", "../math/Vector3"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var G3_1,
      SimplexPrimitivesBuilder_1,
      Simplex_1,
      GraphicsProgramSymbols_1,
      Vector2_1,
      Vector3_1;
  var PolyhedronBuilder;
  function azimuth(vector) {
    return Math.atan2(vector.z, -vector.x);
  }
  function inclination(pos) {
    return Math.atan2(-pos.y, Math.sqrt(pos.x * pos.x + pos.z * pos.z));
  }
  function prepare(point, points) {
    var vertex = Vector3_1.default.copy(point).direction();
    points.push(vertex);
    var u = azimuth(point) / 2 / Math.PI + 0.5;
    var v = inclination(point) / Math.PI + 0.5;
    var something = vertex;
    something['uv'] = new Vector2_1.default([u, 1 - v]);
    return vertex;
  }
  function correctUV(uv, vector, azimuth) {
    if ((azimuth < 0) && (uv.x === 1))
      uv = new Vector2_1.default([uv.x - 1, uv.y]);
    if ((vector.x === 0) && (vector.z === 0))
      uv = new Vector2_1.default([azimuth / 2 / Math.PI + 0.5, uv.y]);
    return uv.clone();
  }
  return {
    setters: [function(G3_1_1) {
      G3_1 = G3_1_1;
    }, function(SimplexPrimitivesBuilder_1_1) {
      SimplexPrimitivesBuilder_1 = SimplexPrimitivesBuilder_1_1;
    }, function(Simplex_1_1) {
      Simplex_1 = Simplex_1_1;
    }, function(GraphicsProgramSymbols_1_1) {
      GraphicsProgramSymbols_1 = GraphicsProgramSymbols_1_1;
    }, function(Vector2_1_1) {
      Vector2_1 = Vector2_1_1;
    }, function(Vector3_1_1) {
      Vector3_1 = Vector3_1_1;
    }],
    execute: function() {
      PolyhedronBuilder = (function(_super) {
        __extends(PolyhedronBuilder, _super);
        function PolyhedronBuilder(vertices, indices, radius, detail) {
          if (radius === void 0) {
            radius = 1;
          }
          if (detail === void 0) {
            detail = 0;
          }
          _super.call(this);
          var that = this;
          var points = [];
          for (var i = 0,
              l = vertices.length; i < l; i += 3) {
            prepare(new Vector3_1.default([vertices[i], vertices[i + 1], vertices[i + 2]]), points);
          }
          var faces = [];
          for (var i = 0,
              j = 0,
              l = indices.length; i < l; i += 3, j++) {
            var v1 = points[indices[i]];
            var v2 = points[indices[i + 1]];
            var v3 = points[indices[i + 2]];
            var simplex = new Simplex_1.default(Simplex_1.default.TRIANGLE);
            simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = v1;
            simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = Vector3_1.default.copy(v1);
            simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = v2;
            simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = Vector3_1.default.copy(v2);
            simplex.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = v3;
            simplex.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = Vector3_1.default.copy(v3);
            faces[j] = simplex;
          }
          for (var i = 0,
              facesLength = faces.length; i < facesLength; i++) {
            subdivide(faces[i], detail, points);
          }
          for (var i = 0,
              verticesLength = points.length; i < verticesLength; i++) {
            points[i].x *= radius;
            points[i].y *= radius;
            points[i].z *= radius;
          }
          this.mergeVertices();
          function centroid(v1, v2, v3) {
            var x = (v1.x + v2.x + v3.x) / 3;
            var y = (v1.y + v2.y + v3.y) / 3;
            var z = (v1.z + v2.z + v3.z) / 3;
            return new G3_1.default(0, x, y, z, 0, 0, 0, 0);
          }
          function make(v1, v2, v3) {
            var azi = azimuth(centroid(v1, v2, v3));
            var something1 = v1;
            var something2 = v2;
            var something3 = v3;
            var uv1 = correctUV(something1['uv'], v1, azi);
            var uv2 = correctUV(something2['uv'], v2, azi);
            var uv3 = correctUV(something3['uv'], v3, azi);
            var simplex = new Simplex_1.default(Simplex_1.default.TRIANGLE);
            simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = Vector3_1.default.copy(v1);
            simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = Vector3_1.default.copy(v1);
            simplex.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_TEXTURE_COORDS] = uv1;
            simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = Vector3_1.default.copy(v2);
            simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = Vector3_1.default.copy(v2);
            simplex.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_TEXTURE_COORDS] = uv2;
            simplex.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION] = Vector3_1.default.copy(v3);
            simplex.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_NORMAL] = Vector3_1.default.copy(v3);
            simplex.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_TEXTURE_COORDS] = uv3;
            that.data.push(simplex);
          }
          function subdivide(face, detail, points) {
            var cols = Math.pow(2, detail);
            var a = prepare(face.vertices[0].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION], points);
            var b = prepare(face.vertices[1].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION], points);
            var c = prepare(face.vertices[2].attributes[GraphicsProgramSymbols_1.default.ATTRIBUTE_POSITION], points);
            var v = [];
            for (var i = 0; i <= cols; i++) {
              v[i] = [];
              var aj = prepare(Vector3_1.default.copy(a).lerp(c, i / cols), points);
              var bj = prepare(Vector3_1.default.copy(b).lerp(c, i / cols), points);
              var rows = cols - i;
              for (var j = 0; j <= rows; j++) {
                if (j === 0 && i === cols) {
                  v[i][j] = aj;
                } else {
                  v[i][j] = prepare(Vector3_1.default.copy(aj).lerp(bj, j / rows), points);
                }
              }
            }
            for (var i = 0; i < cols; i++) {
              for (var j = 0; j < 2 * (cols - i) - 1; j++) {
                var k = Math.floor(j / 2);
                if (j % 2 === 0) {
                  make(v[i][k + 1], v[i + 1][k], v[i][k]);
                } else {
                  make(v[i][k + 1], v[i + 1][k + 1], v[i + 1][k]);
                }
              }
            }
          }
        }
        return PolyhedronBuilder;
      })(SimplexPrimitivesBuilder_1.default);
      exports_1("default", PolyhedronBuilder);
    }
  };
});

System.register("davinci-eight/geometries/TetrahedronGeometry.js", ["../core/GeometryContainer", "../core/GeometryPrimitive", "../checks/mustBeNumber", "../geometries/PolyhedronBuilder"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var GeometryContainer_1,
      GeometryPrimitive_1,
      mustBeNumber_1,
      PolyhedronBuilder_1;
  var vertices,
      indices,
      TetrahedronGeometry;
  function primitives(radius) {
    mustBeNumber_1.default('radius', radius);
    var builder = new PolyhedronBuilder_1.default(vertices, indices, radius);
    return builder.toPrimitives();
  }
  return {
    setters: [function(GeometryContainer_1_1) {
      GeometryContainer_1 = GeometryContainer_1_1;
    }, function(GeometryPrimitive_1_1) {
      GeometryPrimitive_1 = GeometryPrimitive_1_1;
    }, function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }, function(PolyhedronBuilder_1_1) {
      PolyhedronBuilder_1 = PolyhedronBuilder_1_1;
    }],
    execute: function() {
      vertices = [1, 1, 1, -1, -1, 1, -1, 1, -1, 1, -1, -1];
      indices = [2, 1, 0, 0, 3, 2, 1, 3, 0, 2, 3, 1];
      TetrahedronGeometry = (function(_super) {
        __extends(TetrahedronGeometry, _super);
        function TetrahedronGeometry(radius) {
          if (radius === void 0) {
            radius = 1;
          }
          _super.call(this);
          var ps = primitives(radius);
          var iLen = ps.length;
          for (var i = 0; i < iLen; i++) {
            var p = ps[i];
            var geometry = new GeometryPrimitive_1.default(p);
            this.addPart(geometry);
            geometry.release();
          }
        }
        return TetrahedronGeometry;
      })(GeometryContainer_1.default);
      exports_1("default", TetrahedronGeometry);
    }
  };
});

System.register("davinci-eight/visual/visualCache.js", ["../geometries/ArrowGeometry", "../geometries/BoxGeometry", "../geometries/CylinderGeometry", "../materials/LineMaterial", "../materials/MeshMaterial", "../geometries/SphereGeometry", "../geometries/TetrahedronGeometry"], function(exports_1) {
  var ArrowGeometry_1,
      BoxGeometry_1,
      CylinderGeometry_1,
      LineMaterial_1,
      MeshMaterial_1,
      SphereGeometry_1,
      TetrahedronGeometry_1;
  var VisualCache,
      visualCache;
  function wireFrame(options) {
    if (options.wireFrame) {
      return true;
    } else {
      return false;
    }
  }
  function arrow(options) {
    return new ArrowGeometry_1.default();
  }
  function box(options) {
    return new BoxGeometry_1.default({
      width: 1,
      height: 1,
      depth: 1,
      wireFrame: wireFrame(options)
    });
  }
  function cylinder(options) {
    return new CylinderGeometry_1.default();
  }
  function sphere(options) {
    return new SphereGeometry_1.default();
  }
  function tetrahedron(options) {
    return new TetrahedronGeometry_1.default();
  }
  function material(options) {
    if (wireFrame(options)) {
      return new LineMaterial_1.default();
    } else {
      return new MeshMaterial_1.default();
    }
  }
  function geometryKey(kind, options) {
    var copy = {};
    copy.wireFrame = wireFrame(options);
    return "" + kind + JSON.stringify(copy);
  }
  function materialKey(options) {
    var copy = {};
    copy.wireFrame = wireFrame(options);
    return "material" + JSON.stringify(copy);
  }
  return {
    setters: [function(ArrowGeometry_1_1) {
      ArrowGeometry_1 = ArrowGeometry_1_1;
    }, function(BoxGeometry_1_1) {
      BoxGeometry_1 = BoxGeometry_1_1;
    }, function(CylinderGeometry_1_1) {
      CylinderGeometry_1 = CylinderGeometry_1_1;
    }, function(LineMaterial_1_1) {
      LineMaterial_1 = LineMaterial_1_1;
    }, function(MeshMaterial_1_1) {
      MeshMaterial_1 = MeshMaterial_1_1;
    }, function(SphereGeometry_1_1) {
      SphereGeometry_1 = SphereGeometry_1_1;
    }, function(TetrahedronGeometry_1_1) {
      TetrahedronGeometry_1 = TetrahedronGeometry_1_1;
    }],
    execute: function() {
      VisualCache = (function() {
        function VisualCache() {
          this.geometryMap = {};
          this.materialMap = {};
        }
        VisualCache.prototype.isZombieGeometryOrMissing = function(key) {
          var geometry = this.geometryMap[key];
          if (geometry) {
            return geometry.isZombie();
          } else {
            return true;
          }
        };
        VisualCache.prototype.isZombieMaterialOrMissing = function(key) {
          var material = this.materialMap[key];
          if (material) {
            return material.isZombie();
          } else {
            return true;
          }
        };
        VisualCache.prototype.ensureGeometry = function(key, factory, options) {
          if (this.isZombieGeometryOrMissing(key)) {
            this.geometryMap[key] = factory(options);
          } else {
            this.geometryMap[key].addRef();
          }
          return this.geometryMap[key];
        };
        VisualCache.prototype.ensureMaterial = function(key, factory, options) {
          if (this.isZombieMaterialOrMissing(key)) {
            this.materialMap[key] = factory(options);
          } else {
            this.materialMap[key].addRef();
          }
          return this.materialMap[key];
        };
        VisualCache.prototype.arrow = function(options) {
          return this.ensureGeometry('arrow', arrow, options);
        };
        VisualCache.prototype.box = function(options) {
          return this.ensureGeometry(geometryKey('box', options), box, options);
        };
        VisualCache.prototype.cylinder = function(options) {
          return this.ensureGeometry('cylinder', cylinder, options);
        };
        VisualCache.prototype.sphere = function(options) {
          return this.ensureGeometry('sphere', sphere, options);
        };
        VisualCache.prototype.tetrahedron = function(options) {
          return this.ensureGeometry('tetrahedron', tetrahedron, options);
        };
        VisualCache.prototype.material = function(options) {
          var key = materialKey(options);
          return this.ensureMaterial(key, material, options);
        };
        return VisualCache;
      })();
      visualCache = new VisualCache();
      exports_1("default", visualCache);
    }
  };
});

System.register("davinci-eight/math/addE3.js", [], function(exports_1) {
  function addE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, index) {
    a0 = +a0;
    a1 = +a1;
    a2 = +a2;
    a3 = +a3;
    a4 = +a4;
    a5 = +a5;
    a6 = +a6;
    a7 = +a7;
    b0 = +b0;
    b1 = +b1;
    b2 = +b2;
    b3 = +b3;
    b4 = +b4;
    b5 = +b5;
    b6 = +b6;
    b7 = +b7;
    index = index | 0;
    var x = 0.0;
    switch (~(~index)) {
      case 0:
        {
          x = +(a0 + b0);
        }
        break;
      case 1:
        {
          x = +(a1 + b1);
        }
        break;
      case 2:
        {
          x = +(a2 + b2);
        }
        break;
      case 3:
        {
          x = +(a3 + b3);
        }
        break;
      case 4:
        {
          x = +(a4 + b4);
        }
        break;
      case 5:
        {
          x = +(a5 + b5);
        }
        break;
      case 6:
        {
          x = +(a6 + b6);
        }
        break;
      case 7:
        {
          x = +(a7 + b7);
        }
        break;
      default:
        {
          throw new Error("index must be in the range [0..7]");
        }
    }
    return +x;
  }
  exports_1("default", addE3);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/geometries/b2.js", [], function(exports_1) {
  function b2p0(t, p) {
    var k = 1 - t;
    return k * k * p;
  }
  function b2p1(t, p) {
    return 2 * (1 - t) * t * p;
  }
  function b2p2(t, p) {
    return t * t * p;
  }
  function b2(t, begin, control, end) {
    return b2p0(t, begin) + b2p1(t, control) + b2p2(t, end);
  }
  exports_1("default", b2);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/geometries/b3.js", [], function(exports_1) {
  function b3p0(t, p) {
    var k = 1 - t;
    return k * k * k * p;
  }
  function b3p1(t, p) {
    var k = 1 - t;
    return 3 * k * k * t * p;
  }
  function b3p2(t, p) {
    var k = 1 - t;
    return 3 * k * t * t * p;
  }
  function b3p3(t, p) {
    return t * t * t * p;
  }
  function default_1(t, p0, p1, p2, p3) {
    return b3p0(t, p0) + b3p1(t, p1) + b3p2(t, p2) + b3p3(t, p3);
  }
  exports_1("default", default_1);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/math/extE3.js", [], function(exports_1) {
  function extE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, index) {
    a0 = +a0;
    a1 = +a1;
    a2 = +a2;
    a3 = +a3;
    a4 = +a4;
    a5 = +a5;
    a6 = +a6;
    a7 = +a7;
    b0 = +b0;
    b1 = +b1;
    b2 = +b2;
    b3 = +b3;
    b4 = +b4;
    b5 = +b5;
    b6 = +b6;
    b7 = +b7;
    index = index | 0;
    var x = 0.0;
    switch (~(~index)) {
      case 0:
        {
          x = +(a0 * b0);
        }
        break;
      case 1:
        {
          x = +(a0 * b1 + a1 * b0);
        }
        break;
      case 2:
        {
          x = +(a0 * b2 + a2 * b0);
        }
        break;
      case 3:
        {
          x = +(a0 * b3 + a3 * b0);
        }
        break;
      case 4:
        {
          x = +(a0 * b4 + a1 * b2 - a2 * b1 + a4 * b0);
        }
        break;
      case 5:
        {
          x = +(a0 * b5 + a2 * b3 - a3 * b2 + a5 * b0);
        }
        break;
      case 6:
        {
          x = +(a0 * b6 - a1 * b3 + a3 * b1 + a6 * b0);
        }
        break;
      case 7:
        {
          x = +(a0 * b7 + a1 * b5 + a2 * b6 + a3 * b4 + a4 * b3 + a5 * b1 + a6 * b2 + a7 * b0);
        }
        break;
      default:
        {
          throw new Error("index must be in the range [0..7]");
        }
    }
    return +x;
  }
  exports_1("default", extE3);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/math/extG3.js", ["../math/compG3Get", "../math/extE3", "../math/compG3Set"], function(exports_1) {
  var compG3Get_1,
      extE3_1,
      compG3Set_1;
  function extG3(a, b, out) {
    var a0 = compG3Get_1.default(a, 0);
    var a1 = compG3Get_1.default(a, 1);
    var a2 = compG3Get_1.default(a, 2);
    var a3 = compG3Get_1.default(a, 3);
    var a4 = compG3Get_1.default(a, 4);
    var a5 = compG3Get_1.default(a, 5);
    var a6 = compG3Get_1.default(a, 6);
    var a7 = compG3Get_1.default(a, 7);
    var b0 = compG3Get_1.default(b, 0);
    var b1 = compG3Get_1.default(b, 1);
    var b2 = compG3Get_1.default(b, 2);
    var b3 = compG3Get_1.default(b, 3);
    var b4 = compG3Get_1.default(b, 4);
    var b5 = compG3Get_1.default(b, 5);
    var b6 = compG3Get_1.default(b, 6);
    var b7 = compG3Get_1.default(b, 7);
    for (var i = 0; i < 8; i++) {
      compG3Set_1.default(out, i, extE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, i));
    }
    return out;
  }
  exports_1("default", extG3);
  return {
    setters: [function(compG3Get_1_1) {
      compG3Get_1 = compG3Get_1_1;
    }, function(extE3_1_1) {
      extE3_1 = extE3_1_1;
    }, function(compG3Set_1_1) {
      compG3Set_1 = compG3Set_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/math/lcoE3.js", [], function(exports_1) {
  function lcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, index) {
    a0 = +a0;
    a1 = +a1;
    a2 = +a2;
    a3 = +a3;
    a4 = +a4;
    a5 = +a5;
    a6 = +a6;
    a7 = +a7;
    b0 = +b0;
    b1 = +b1;
    b2 = +b2;
    b3 = +b3;
    b4 = +b4;
    b5 = +b5;
    b6 = +b6;
    b7 = +b7;
    index = index | 0;
    var x = 0.0;
    switch (~(~index)) {
      case 0:
        {
          x = +(a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3 - a4 * b4 - a5 * b5 - a6 * b6 - a7 * b7);
        }
        break;
      case 1:
        {
          x = +(a0 * b1 - a2 * b4 + a3 * b6 - a5 * b7);
        }
        break;
      case 2:
        {
          x = +(a0 * b2 + a1 * b4 - a3 * b5 - a6 * b7);
        }
        break;
      case 3:
        {
          x = +(a0 * b3 - a1 * b6 + a2 * b5 - a4 * b7);
        }
        break;
      case 4:
        {
          x = +(a0 * b4 + a3 * b7);
        }
        break;
      case 5:
        {
          x = +(a0 * b5 + a1 * b7);
        }
        break;
      case 6:
        {
          x = +(a0 * b6 + a2 * b7);
        }
        break;
      case 7:
        {
          x = +(a0 * b7);
        }
        break;
      default:
        {
          throw new Error("index must be in the range [0..7]");
        }
    }
    return +x;
  }
  exports_1("default", lcoE3);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/math/lcoG3.js", ["../math/compG3Get", "../math/lcoE3", "../math/compG3Set"], function(exports_1) {
  var compG3Get_1,
      lcoE3_1,
      compG3Set_1;
  function lcoG3(a, b, out) {
    var a0 = compG3Get_1.default(a, 0);
    var a1 = compG3Get_1.default(a, 1);
    var a2 = compG3Get_1.default(a, 2);
    var a3 = compG3Get_1.default(a, 3);
    var a4 = compG3Get_1.default(a, 4);
    var a5 = compG3Get_1.default(a, 5);
    var a6 = compG3Get_1.default(a, 6);
    var a7 = compG3Get_1.default(a, 7);
    var b0 = compG3Get_1.default(b, 0);
    var b1 = compG3Get_1.default(b, 1);
    var b2 = compG3Get_1.default(b, 2);
    var b3 = compG3Get_1.default(b, 3);
    var b4 = compG3Get_1.default(b, 4);
    var b5 = compG3Get_1.default(b, 5);
    var b6 = compG3Get_1.default(b, 6);
    var b7 = compG3Get_1.default(b, 7);
    for (var i = 0; i < 8; i++) {
      compG3Set_1.default(out, i, lcoE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, i));
    }
    return out;
  }
  exports_1("default", lcoG3);
  return {
    setters: [function(compG3Get_1_1) {
      compG3Get_1 = compG3Get_1_1;
    }, function(lcoE3_1_1) {
      lcoE3_1 = lcoE3_1_1;
    }, function(compG3Set_1_1) {
      compG3Set_1 = compG3Set_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/math/mulG3.js", ["../math/compG3Get", "../math/mulE3", "../math/compG3Set"], function(exports_1) {
  var compG3Get_1,
      mulE3_1,
      compG3Set_1;
  function mulG3(a, b, out) {
    var a0 = compG3Get_1.default(a, 0);
    var a1 = compG3Get_1.default(a, 1);
    var a2 = compG3Get_1.default(a, 2);
    var a3 = compG3Get_1.default(a, 3);
    var a4 = compG3Get_1.default(a, 4);
    var a5 = compG3Get_1.default(a, 5);
    var a6 = compG3Get_1.default(a, 6);
    var a7 = compG3Get_1.default(a, 7);
    var b0 = compG3Get_1.default(b, 0);
    var b1 = compG3Get_1.default(b, 1);
    var b2 = compG3Get_1.default(b, 2);
    var b3 = compG3Get_1.default(b, 3);
    var b4 = compG3Get_1.default(b, 4);
    var b5 = compG3Get_1.default(b, 5);
    var b6 = compG3Get_1.default(b, 6);
    var b7 = compG3Get_1.default(b, 7);
    for (var i = 0; i < 8; i++) {
      compG3Set_1.default(out, i, mulE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, i));
    }
    return out;
  }
  exports_1("default", mulG3);
  return {
    setters: [function(compG3Get_1_1) {
      compG3Get_1 = compG3Get_1_1;
    }, function(mulE3_1_1) {
      mulE3_1 = mulE3_1_1;
    }, function(compG3Set_1_1) {
      compG3Set_1 = compG3Set_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/math/gauss.js", [], function(exports_1) {
  var abs;
  function makeColumnVector(n, v) {
    var a = [];
    for (var i = 0; i < n; i++) {
      a.push(v);
    }
    return a;
  }
  function rowWithMaximumInColumn(A, column, N) {
    var biggest = abs(A[column][column]);
    var maxRow = column;
    for (var row = column + 1; row < N; row++) {
      if (abs(A[row][column]) > biggest) {
        biggest = abs(A[row][column]);
        maxRow = row;
      }
    }
    return maxRow;
  }
  function swapRows(A, i, j, N) {
    var colLength = N + 1;
    for (var column = i; column < colLength; column++) {
      var temp = A[j][column];
      A[j][column] = A[i][column];
      A[i][column] = temp;
    }
  }
  function makeZeroBelow(A, i, N) {
    for (var row = i + 1; row < N; row++) {
      var c = -A[row][i] / A[i][i];
      for (var column = i; column < N + 1; column++) {
        if (i === column) {
          A[row][column] = 0;
        } else {
          A[row][column] += c * A[i][column];
        }
      }
    }
  }
  function solve(A, N) {
    var x = makeColumnVector(N, 0);
    for (var i = N - 1; i > -1; i--) {
      x[i] = A[i][N] / A[i][i];
      for (var k = i - 1; k > -1; k--) {
        A[k][N] -= A[k][i] * x[i];
      }
    }
    return x;
  }
  function gauss(A, b) {
    var N = A.length;
    for (var i = 0; i < N; i++) {
      var Ai = A[i];
      var bi = b[i];
      Ai.push(bi);
    }
    for (var j = 0; j < N; j++) {
      swapRows(A, j, rowWithMaximumInColumn(A, j, N), N);
      makeZeroBelow(A, j, N);
    }
    return solve(A, N);
  }
  exports_1("default", gauss);
  return {
    setters: [],
    execute: function() {
      abs = Math.abs;
    }
  };
});

System.register("davinci-eight/i18n/notImplemented.js", ["../checks/mustBeString"], function(exports_1) {
  var mustBeString_1;
  function default_1(name) {
    mustBeString_1.default('name', name);
    var message = {get message() {
        return "'" + name + "' method is not yet implemented.";
      }};
    return message;
  }
  exports_1("default", default_1);
  return {
    setters: [function(mustBeString_1_1) {
      mustBeString_1 = mustBeString_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/math/rcoE3.js", [], function(exports_1) {
  function rcoE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, index) {
    a0 = +a0;
    a1 = +a1;
    a2 = +a2;
    a3 = +a3;
    a4 = +a4;
    a5 = +a5;
    a6 = +a6;
    a7 = +a7;
    b0 = +b0;
    b1 = +b1;
    b2 = +b2;
    b3 = +b3;
    b4 = +b4;
    b5 = +b5;
    b6 = +b6;
    b7 = +b7;
    index = index | 0;
    var x = 0.0;
    switch (~(~index)) {
      case 0:
        {
          x = +(a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3 - a4 * b4 - a5 * b5 - a6 * b6 - a7 * b7);
        }
        break;
      case 1:
        {
          x = +(+a1 * b0 + a4 * b2 - a6 * b3 - a7 * b5);
        }
        break;
      case 2:
        {
          x = +(+a2 * b0 - a4 * b1 + a5 * b3 - a7 * b6);
        }
        break;
      case 3:
        {
          x = +(+a3 * b0 - a5 * b2 + a6 * b1 - a7 * b4);
        }
        break;
      case 4:
        {
          x = +(+a4 * b0 + a7 * b3);
        }
        break;
      case 5:
        {
          x = +(+a5 * b0 + a7 * b1);
        }
        break;
      case 6:
        {
          x = +(+a6 * b0 + a7 * b2);
        }
        break;
      case 7:
        {
          x = +(+a7 * b0);
        }
        break;
      default:
        {
          throw new Error("index must be in the range [0..7]");
        }
    }
    return +x;
  }
  exports_1("default", rcoE3);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/math/rcoG3.js", ["../math/compG3Get", "../math/rcoE3", "../math/compG3Set"], function(exports_1) {
  var compG3Get_1,
      rcoE3_1,
      compG3Set_1;
  function rcoG3(a, b, out) {
    var a0 = compG3Get_1.default(a, 0);
    var a1 = compG3Get_1.default(a, 1);
    var a2 = compG3Get_1.default(a, 2);
    var a3 = compG3Get_1.default(a, 3);
    var a4 = compG3Get_1.default(a, 4);
    var a5 = compG3Get_1.default(a, 5);
    var a6 = compG3Get_1.default(a, 6);
    var a7 = compG3Get_1.default(a, 7);
    var b0 = compG3Get_1.default(b, 0);
    var b1 = compG3Get_1.default(b, 1);
    var b2 = compG3Get_1.default(b, 2);
    var b3 = compG3Get_1.default(b, 3);
    var b4 = compG3Get_1.default(b, 4);
    var b5 = compG3Get_1.default(b, 5);
    var b6 = compG3Get_1.default(b, 6);
    var b7 = compG3Get_1.default(b, 7);
    for (var i = 0; i < 8; i++) {
      compG3Set_1.default(out, i, rcoE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, i));
    }
    return out;
  }
  exports_1("default", rcoG3);
  return {
    setters: [function(compG3Get_1_1) {
      compG3Get_1 = compG3Get_1_1;
    }, function(rcoE3_1_1) {
      rcoE3_1 = rcoE3_1_1;
    }, function(compG3Set_1_1) {
      compG3Set_1 = compG3Set_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/math/compG3Get.js", [], function(exports_1) {
  var COORD_W,
      COORD_X,
      COORD_Y,
      COORD_Z,
      COORD_XY,
      COORD_YZ,
      COORD_ZX,
      COORD_XYZ;
  function gcompE3(m, index) {
    switch (index) {
      case COORD_W:
        {
          return m.α;
        }
        break;
      case COORD_X:
        {
          return m.x;
        }
        break;
      case COORD_Y:
        {
          return m.y;
        }
        break;
      case COORD_Z:
        {
          return m.z;
        }
        break;
      case COORD_XY:
        {
          return m.xy;
        }
        break;
      case COORD_YZ:
        {
          return m.yz;
        }
        break;
      case COORD_ZX:
        {
          return m.zx;
        }
        break;
      case COORD_XYZ:
        {
          return m.β;
        }
        break;
      default:
        {
          throw new Error("index => " + index);
        }
    }
  }
  exports_1("default", gcompE3);
  return {
    setters: [],
    execute: function() {
      COORD_W = 0;
      COORD_X = 1;
      COORD_Y = 2;
      COORD_Z = 3;
      COORD_XY = 4;
      COORD_YZ = 5;
      COORD_ZX = 6;
      COORD_XYZ = 7;
    }
  };
});

System.register("davinci-eight/math/mulE3.js", [], function(exports_1) {
  function mulE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, index) {
    a0 = +a0;
    a1 = +a1;
    a2 = +a2;
    a3 = +a3;
    a4 = +a4;
    a5 = +a5;
    a6 = +a6;
    a7 = +a7;
    b0 = +b0;
    b1 = +b1;
    b2 = +b2;
    b3 = +b3;
    b4 = +b4;
    b5 = +b5;
    b6 = +b6;
    b7 = +b7;
    index = index | 0;
    var x = 0.0;
    switch (~(~index)) {
      case 0:
        {
          x = +(a0 * b0 + a1 * b1 + a2 * b2 + a3 * b3 - a4 * b4 - a5 * b5 - a6 * b6 - a7 * b7);
        }
        break;
      case 1:
        {
          x = +(a0 * b1 + a1 * b0 - a2 * b4 + a3 * b6 + a4 * b2 - a5 * b7 - a6 * b3 - a7 * b5);
        }
        break;
      case 2:
        {
          x = +(a0 * b2 + a1 * b4 + a2 * b0 - a3 * b5 - a4 * b1 + a5 * b3 - a6 * b7 - a7 * b6);
        }
        break;
      case 3:
        {
          x = +(a0 * b3 - a1 * b6 + a2 * b5 + a3 * b0 - a4 * b7 - a5 * b2 + a6 * b1 - a7 * b4);
        }
        break;
      case 4:
        {
          x = +(a0 * b4 + a1 * b2 - a2 * b1 + a3 * b7 + a4 * b0 - a5 * b6 + a6 * b5 + a7 * b3);
        }
        break;
      case 5:
        {
          x = +(a0 * b5 + a1 * b7 + a2 * b3 - a3 * b2 + a4 * b6 + a5 * b0 - a6 * b4 + a7 * b1);
        }
        break;
      case 6:
        {
          x = +(a0 * b6 - a1 * b3 + a2 * b7 + a3 * b1 - a4 * b5 + a5 * b4 + a6 * b0 + a7 * b2);
        }
        break;
      case 7:
        {
          x = +(a0 * b7 + a1 * b5 + a2 * b6 + a3 * b4 + a4 * b3 + a5 * b1 + a6 * b2 + a7 * b0);
        }
        break;
      default:
        {
          throw new Error("index must be in the range [0..7]");
        }
    }
    return +x;
  }
  exports_1("default", mulE3);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/math/compG3Set.js", [], function(exports_1) {
  var COORD_W,
      COORD_X,
      COORD_Y,
      COORD_Z,
      COORD_XY,
      COORD_YZ,
      COORD_ZX,
      COORD_XYZ;
  function compG3Set(m, index, value) {
    switch (index) {
      case COORD_W:
        {
          m.α = value;
        }
        break;
      case COORD_X:
        {
          m.x = value;
        }
        break;
      case COORD_Y:
        {
          m.y = value;
        }
        break;
      case COORD_Z:
        {
          m.z = value;
        }
        break;
      case COORD_XY:
        {
          m.xy = value;
        }
        break;
      case COORD_YZ:
        {
          m.yz = value;
        }
        break;
      case COORD_ZX:
        {
          m.zx = value;
        }
        break;
      case COORD_XYZ:
        {
          m.β = value;
        }
        break;
      default:
        throw new Error("index => " + index);
    }
  }
  exports_1("default", compG3Set);
  return {
    setters: [],
    execute: function() {
      COORD_W = 0;
      COORD_X = 1;
      COORD_Y = 2;
      COORD_Z = 3;
      COORD_XY = 4;
      COORD_YZ = 5;
      COORD_ZX = 6;
      COORD_XYZ = 7;
    }
  };
});

System.register("davinci-eight/math/scpG3.js", ["../math/compG3Get", "../math/mulE3", "../math/compG3Set"], function(exports_1) {
  var compG3Get_1,
      mulE3_1,
      compG3Set_1;
  function scpG3(a, b, out) {
    var a0 = compG3Get_1.default(a, 0);
    var a1 = compG3Get_1.default(a, 1);
    var a2 = compG3Get_1.default(a, 2);
    var a3 = compG3Get_1.default(a, 3);
    var a4 = compG3Get_1.default(a, 4);
    var a5 = compG3Get_1.default(a, 5);
    var a6 = compG3Get_1.default(a, 6);
    var a7 = compG3Get_1.default(a, 7);
    var b0 = compG3Get_1.default(b, 0);
    var b1 = compG3Get_1.default(b, 1);
    var b2 = compG3Get_1.default(b, 2);
    var b3 = compG3Get_1.default(b, 3);
    var b4 = compG3Get_1.default(b, 4);
    var b5 = compG3Get_1.default(b, 5);
    var b6 = compG3Get_1.default(b, 6);
    var b7 = compG3Get_1.default(b, 7);
    compG3Set_1.default(out, 0, mulE3_1.default(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0));
    compG3Set_1.default(out, 1, 0);
    compG3Set_1.default(out, 2, 0);
    compG3Set_1.default(out, 3, 0);
    compG3Set_1.default(out, 4, 0);
    compG3Set_1.default(out, 5, 0);
    compG3Set_1.default(out, 6, 0);
    compG3Set_1.default(out, 7, 0);
    return out;
  }
  exports_1("default", scpG3);
  return {
    setters: [function(compG3Get_1_1) {
      compG3Get_1 = compG3Get_1_1;
    }, function(mulE3_1_1) {
      mulE3_1 = mulE3_1_1;
    }, function(compG3Set_1_1) {
      compG3Set_1 = compG3Set_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/math/squaredNormG3.js", [], function(exports_1) {
  function squaredNormG3(m) {
    var w = m.α;
    var x = m.x;
    var y = m.y;
    var z = m.z;
    var yz = m.yz;
    var zx = m.zx;
    var xy = m.xy;
    var v = m.β;
    return w * w + x * x + y * y + z * z + yz * yz + zx * zx + xy * xy + v * v;
  }
  exports_1("default", squaredNormG3);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/math/subE3.js", [], function(exports_1) {
  function subE3(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, index) {
    a0 = +a0;
    a1 = +a1;
    a2 = +a2;
    a3 = +a3;
    a4 = +a4;
    a5 = +a5;
    a6 = +a6;
    a7 = +a7;
    b0 = +b0;
    b1 = +b1;
    b2 = +b2;
    b3 = +b3;
    b4 = +b4;
    b5 = +b5;
    b6 = +b6;
    b7 = +b7;
    index = index | 0;
    var x = 0.0;
    switch (~(~index)) {
      case 0:
        {
          x = +(a0 - b0);
        }
        break;
      case 1:
        {
          x = +(a1 - b1);
        }
        break;
      case 2:
        {
          x = +(a2 - b2);
        }
        break;
      case 3:
        {
          x = +(a3 - b3);
        }
        break;
      case 4:
        {
          x = +(a4 - b4);
        }
        break;
      case 5:
        {
          x = +(a5 - b5);
        }
        break;
      case 6:
        {
          x = +(a6 - b6);
        }
        break;
      case 7:
        {
          x = +(a7 - b7);
        }
        break;
      default:
        {
          throw new Error("index must be in the range [0..7]");
        }
    }
    return +x;
  }
  exports_1("default", subE3);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/math/Dimensions.js", ["../math/QQ"], function(exports_1) {
  var QQ_1;
  var R0,
      Vector1,
      M1,
      Dimensions;
  function assertArgRational(name, arg) {
    if (arg instanceof QQ_1.default) {
      return arg;
    } else {
      throw new Error("Argument '" + arg + "' must be a QQ");
    }
  }
  return {
    setters: [function(QQ_1_1) {
      QQ_1 = QQ_1_1;
    }],
    execute: function() {
      R0 = QQ_1.default.ZERO;
      Vector1 = QQ_1.default.ONE;
      M1 = QQ_1.default.MINUS_ONE;
      Dimensions = (function() {
        function Dimensions(M, L, T, Q, temperature, amount, intensity) {
          this.M = M;
          this.L = L;
          this.T = T;
          this.Q = Q;
          this.temperature = temperature;
          this.amount = amount;
          this.intensity = intensity;
          assertArgRational('M', M);
          assertArgRational('L', L);
          assertArgRational('T', T);
          assertArgRational('Q', Q);
          assertArgRational('temperature', temperature);
          assertArgRational('amount', amount);
          assertArgRational('intensity', intensity);
          if (arguments.length !== 7) {
            throw new Error("Expecting 7 arguments");
          }
        }
        Dimensions.prototype.compatible = function(rhs) {
          if (this.M.equals(rhs.M) && this.L.equals(rhs.L) && this.T.equals(rhs.T) && this.Q.equals(rhs.Q) && this.temperature.equals(rhs.temperature) && this.amount.equals(rhs.amount) && this.intensity.equals(rhs.intensity)) {
            return this;
          } else {
            throw new Error("Dimensions must be equal (" + this + ", " + rhs + ")");
          }
        };
        Dimensions.prototype.mul = function(rhs) {
          return new Dimensions(this.M.add(rhs.M), this.L.add(rhs.L), this.T.add(rhs.T), this.Q.add(rhs.Q), this.temperature.add(rhs.temperature), this.amount.add(rhs.amount), this.intensity.add(rhs.intensity));
        };
        Dimensions.prototype.div = function(rhs) {
          return new Dimensions(this.M.sub(rhs.M), this.L.sub(rhs.L), this.T.sub(rhs.T), this.Q.sub(rhs.Q), this.temperature.sub(rhs.temperature), this.amount.sub(rhs.amount), this.intensity.sub(rhs.intensity));
        };
        Dimensions.prototype.pow = function(exponent) {
          return new Dimensions(this.M.mul(exponent), this.L.mul(exponent), this.T.mul(exponent), this.Q.mul(exponent), this.temperature.mul(exponent), this.amount.mul(exponent), this.intensity.mul(exponent));
        };
        Dimensions.prototype.sqrt = function() {
          return new Dimensions(this.M.div(QQ_1.default.TWO), this.L.div(QQ_1.default.TWO), this.T.div(QQ_1.default.TWO), this.Q.div(QQ_1.default.TWO), this.temperature.div(QQ_1.default.TWO), this.amount.div(QQ_1.default.TWO), this.intensity.div(QQ_1.default.TWO));
        };
        Dimensions.prototype.isOne = function() {
          return this.M.isZero() && this.L.isZero() && this.T.isZero() && this.Q.isZero() && this.temperature.isZero() && this.amount.isZero() && this.intensity.isZero();
        };
        Dimensions.prototype.isZero = function() {
          return false;
        };
        Dimensions.prototype.inv = function() {
          return new Dimensions(this.M.neg(), this.L.neg(), this.T.neg(), this.Q.neg(), this.temperature.neg(), this.amount.neg(), this.intensity.neg());
        };
        Dimensions.prototype.neg = function() {
          return this;
        };
        Dimensions.prototype.toString = function() {
          var stringify = function(rational, label) {
            if (rational.numer === 0) {
              return null;
            } else if (rational.denom === 1) {
              if (rational.numer === 1) {
                return "" + label;
              } else {
                return "" + label + " ** " + rational.numer;
              }
            }
            return "" + label + " ** " + rational;
          };
          return [stringify(this.M, 'mass'), stringify(this.L, 'length'), stringify(this.T, 'time'), stringify(this.Q, 'charge'), stringify(this.temperature, 'thermodynamic temperature'), stringify(this.amount, 'amount of substance'), stringify(this.intensity, 'luminous intensity')].filter(function(x) {
            return typeof x === 'string';
          }).join(" * ");
        };
        Dimensions.prototype.__add__ = function(rhs) {
          if (rhs instanceof Dimensions) {
            return this.compatible(rhs);
          } else {
            return void 0;
          }
        };
        Dimensions.prototype.__radd__ = function(lhs) {
          if (lhs instanceof Dimensions) {
            return lhs.compatible(this);
          } else {
            return void 0;
          }
        };
        Dimensions.prototype.__sub__ = function(rhs) {
          if (rhs instanceof Dimensions) {
            return this.compatible(rhs);
          } else {
            return void 0;
          }
        };
        Dimensions.prototype.__rsub__ = function(lhs) {
          if (lhs instanceof Dimensions) {
            return lhs.compatible(this);
          } else {
            return void 0;
          }
        };
        Dimensions.prototype.__mul__ = function(rhs) {
          if (rhs instanceof Dimensions) {
            return this.mul(rhs);
          } else {
            return void 0;
          }
        };
        Dimensions.prototype.__rmul__ = function(lhs) {
          if (lhs instanceof Dimensions) {
            return lhs.mul(this);
          } else {
            return void 0;
          }
        };
        Dimensions.prototype.__div__ = function(rhs) {
          if (rhs instanceof Dimensions) {
            return this.div(rhs);
          } else {
            return void 0;
          }
        };
        Dimensions.prototype.__rdiv__ = function(lhs) {
          if (lhs instanceof Dimensions) {
            return lhs.div(this);
          } else {
            return void 0;
          }
        };
        Dimensions.prototype.__pos__ = function() {
          return this;
        };
        Dimensions.prototype.__neg__ = function() {
          return this;
        };
        Dimensions.ONE = new Dimensions(R0, R0, R0, R0, R0, R0, R0);
        Dimensions.MASS = new Dimensions(Vector1, R0, R0, R0, R0, R0, R0);
        Dimensions.LENGTH = new Dimensions(R0, Vector1, R0, R0, R0, R0, R0);
        Dimensions.TIME = new Dimensions(R0, R0, Vector1, R0, R0, R0, R0);
        Dimensions.CHARGE = new Dimensions(R0, R0, R0, Vector1, R0, R0, R0);
        Dimensions.CURRENT = new Dimensions(R0, R0, M1, Vector1, R0, R0, R0);
        Dimensions.TEMPERATURE = new Dimensions(R0, R0, R0, R0, Vector1, R0, R0);
        Dimensions.AMOUNT = new Dimensions(R0, R0, R0, R0, R0, Vector1, R0);
        Dimensions.INTENSITY = new Dimensions(R0, R0, R0, R0, R0, R0, Vector1);
        return Dimensions;
      })();
      exports_1("default", Dimensions);
    }
  };
});

System.register("davinci-eight/math/QQ.js", ["../core", "../checks/mustBeInteger", "../i18n/readOnly"], function(exports_1) {
  var core_1,
      mustBeInteger_1,
      readOnly_1;
  var QQ;
  return {
    setters: [function(core_1_1) {
      core_1 = core_1_1;
    }, function(mustBeInteger_1_1) {
      mustBeInteger_1 = mustBeInteger_1_1;
    }, function(readOnly_1_1) {
      readOnly_1 = readOnly_1_1;
    }],
    execute: function() {
      QQ = (function() {
        function QQ(n, d) {
          if (core_1.default.safemode) {
            mustBeInteger_1.default('n', n);
            mustBeInteger_1.default('d', d);
          }
          var g;
          var gcd = function(a, b) {
            if (core_1.default.safemode) {
              mustBeInteger_1.default('a', a);
              mustBeInteger_1.default('b', b);
            }
            var temp;
            if (a < 0) {
              a = -a;
            }
            if (b < 0) {
              b = -b;
            }
            if (b > a) {
              temp = a;
              a = b;
              b = temp;
            }
            while (true) {
              a %= b;
              if (a === 0) {
                return b;
              }
              b %= a;
              if (b === 0) {
                return a;
              }
            }
          };
          if (d === 0) {
            throw new Error("denominator must not be zero");
          }
          if (n === 0) {
            g = 1;
          } else {
            g = gcd(Math.abs(n), Math.abs(d));
          }
          if (d < 0) {
            n = -n;
            d = -d;
          }
          this._numer = n / g;
          this._denom = d / g;
        }
        Object.defineProperty(QQ.prototype, "numer", {
          get: function() {
            return this._numer;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('numer').message);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(QQ.prototype, "denom", {
          get: function() {
            return this._denom;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('denom').message);
          },
          enumerable: true,
          configurable: true
        });
        QQ.prototype.add = function(rhs) {
          return new QQ(this._numer * rhs._denom + this._denom * rhs._numer, this._denom * rhs._denom);
        };
        QQ.prototype.sub = function(rhs) {
          return new QQ(this._numer * rhs._denom - this._denom * rhs._numer, this._denom * rhs._denom);
        };
        QQ.prototype.mul = function(rhs) {
          return new QQ(this._numer * rhs._numer, this._denom * rhs._denom);
        };
        QQ.prototype.div = function(rhs) {
          if (typeof rhs === 'number') {
            return new QQ(this._numer, this._denom * rhs);
          } else {
            return new QQ(this._numer * rhs._denom, this._denom * rhs._numer);
          }
        };
        QQ.prototype.isOne = function() {
          return this._numer === 1 && this._denom === 1;
        };
        QQ.prototype.isZero = function() {
          return this._numer === 0 && this._denom === 1;
        };
        QQ.prototype.inv = function() {
          return new QQ(this._denom, this._numer);
        };
        QQ.prototype.neg = function() {
          return new QQ(-this._numer, this._denom);
        };
        QQ.prototype.equals = function(other) {
          if (other instanceof QQ) {
            return this._numer * other._denom === this._denom * other._numer;
          } else {
            return false;
          }
        };
        QQ.prototype.toString = function() {
          return "" + this._numer + "/" + this._denom + "";
        };
        QQ.prototype.__add__ = function(rhs) {
          if (rhs instanceof QQ) {
            return this.add(rhs);
          } else {
            return void 0;
          }
        };
        QQ.prototype.__radd__ = function(lhs) {
          if (lhs instanceof QQ) {
            return lhs.add(this);
          } else {
            return void 0;
          }
        };
        QQ.prototype.__sub__ = function(rhs) {
          if (rhs instanceof QQ) {
            return this.sub(rhs);
          } else {
            return void 0;
          }
        };
        QQ.prototype.__rsub__ = function(lhs) {
          if (lhs instanceof QQ) {
            return lhs.sub(this);
          } else {
            return void 0;
          }
        };
        QQ.prototype.__mul__ = function(rhs) {
          if (rhs instanceof QQ) {
            return this.mul(rhs);
          } else {
            return void 0;
          }
        };
        QQ.prototype.__rmul__ = function(lhs) {
          if (lhs instanceof QQ) {
            return lhs.mul(this);
          } else {
            return void 0;
          }
        };
        QQ.prototype.__div__ = function(rhs) {
          if (rhs instanceof QQ) {
            return this.div(rhs);
          } else {
            return void 0;
          }
        };
        QQ.prototype.__rdiv__ = function(lhs) {
          if (lhs instanceof QQ) {
            return lhs.div(this);
          } else {
            return void 0;
          }
        };
        QQ.prototype.__pos__ = function() {
          return this;
        };
        QQ.prototype.__neg__ = function() {
          return this.neg();
        };
        QQ.ONE = new QQ(1, 1);
        QQ.TWO = new QQ(2, 1);
        QQ.MINUS_ONE = new QQ(-1, 1);
        QQ.ZERO = new QQ(0, 1);
        return QQ;
      })();
      exports_1("default", QQ);
    }
  };
});

System.register("davinci-eight/math/Unit.js", ["../math/Dimensions", "../math/QQ"], function(exports_1) {
  var Dimensions_1,
      QQ_1;
  var LABELS_SI,
      dumbString,
      unitString,
      Unit;
  function assertArgNumber(name, x) {
    if (typeof x === 'number') {
      return x;
    } else {
      throw new Error("Argument '" + name + "' must be a number");
    }
  }
  function assertArgDimensions(name, arg) {
    if (arg instanceof Dimensions_1.default) {
      return arg;
    } else {
      throw new Error("Argument '" + arg + "' must be a Dimensions");
    }
  }
  function assertArgRational(name, arg) {
    if (arg instanceof QQ_1.default) {
      return arg;
    } else {
      throw new Error("Argument '" + arg + "' must be a QQ");
    }
  }
  function assertArgUnit(name, arg) {
    if (arg instanceof Unit) {
      return arg;
    } else {
      throw new Error("Argument '" + arg + "' must be a Unit");
    }
  }
  function assertArgUnitOrUndefined(name, arg) {
    if (typeof arg === 'undefined') {
      return arg;
    } else {
      return assertArgUnit(name, arg);
    }
  }
  function add(lhs, rhs) {
    return new Unit(lhs.multiplier + rhs.multiplier, lhs.dimensions.compatible(rhs.dimensions), lhs.labels);
  }
  function sub(lhs, rhs) {
    return new Unit(lhs.multiplier - rhs.multiplier, lhs.dimensions.compatible(rhs.dimensions), lhs.labels);
  }
  function mul(lhs, rhs) {
    return new Unit(lhs.multiplier * rhs.multiplier, lhs.dimensions.mul(rhs.dimensions), lhs.labels);
  }
  function scale(α, unit) {
    return new Unit(α * unit.multiplier, unit.dimensions, unit.labels);
  }
  function div(lhs, rhs) {
    return new Unit(lhs.multiplier / rhs.multiplier, lhs.dimensions.div(rhs.dimensions), lhs.labels);
  }
  return {
    setters: [function(Dimensions_1_1) {
      Dimensions_1 = Dimensions_1_1;
    }, function(QQ_1_1) {
      QQ_1 = QQ_1_1;
    }],
    execute: function() {
      LABELS_SI = ['kg', 'm', 's', 'C', 'K', 'mol', 'candela'];
      dumbString = function(multiplier, dimensions, labels) {
        assertArgNumber('multiplier', multiplier);
        assertArgDimensions('dimensions', dimensions);
        var operatorStr;
        var scaleString;
        var unitsString;
        var stringify = function(rational, label) {
          if (rational.numer === 0) {
            return null;
          } else if (rational.denom === 1) {
            if (rational.numer === 1) {
              return "" + label;
            } else {
              return "" + label + " ** " + rational.numer;
            }
          }
          return "" + label + " ** " + rational;
        };
        operatorStr = multiplier === 1 || dimensions.isOne() ? "" : " ";
        scaleString = multiplier === 1 ? "" : "" + multiplier;
        unitsString = [stringify(dimensions.M, labels[0]), stringify(dimensions.L, labels[1]), stringify(dimensions.T, labels[2]), stringify(dimensions.Q, labels[3]), stringify(dimensions.temperature, labels[4]), stringify(dimensions.amount, labels[5]), stringify(dimensions.intensity, labels[6])].filter(function(x) {
          return typeof x === 'string';
        }).join(" ");
        return "" + scaleString + operatorStr + unitsString;
      };
      unitString = function(multiplier, dimensions, labels) {
        var patterns = [[-1, 1, -3, 1, 2, 1, 2, 1, 0, 1, 0, 1, 0, 1], [-1, 1, -2, 1, 1, 1, 2, 1, 0, 1, 0, 1, 0, 1], [-1, 1, -2, 1, 2, 1, 2, 1, 0, 1, 0, 1, 0, 1], [-1, 1, 3, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1], [0, 1, 0, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1], [0, 1, 0, 1, -1, 1, 1, 1, 0, 1, 0, 1, 0, 1], [0, 1, 1, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1], [0, 1, 1, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1], [1, 1, 1, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1], [1, 1, -1, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1], [1, 1, -1, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1], [1, 1, 0, 1, -3, 1, 0, 1, 0, 1, 0, 1, 0, 1], [1, 1, 0, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1], [1, 1, 0, 1, -1, 1, -1, 1, 0, 1, 0, 1, 0, 1], [1, 1, 1, 1, -3, 1, 0, 1, -1, 1, 0, 1, 0, 1], [1, 1, 1, 1, -2, 1, -1, 1, 0, 1, 0, 1, 0, 1], [1, 1, 1, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1], [1, 1, 1, 1, 0, 1, -2, 1, 0, 1, 0, 1, 0, 1], [1, 1, 2, 1, -2, 1, 0, 1, -1, 1, 0, 1, 0, 1], [0, 1, 2, 1, -2, 1, 0, 1, -1, 1, 0, 1, 0, 1], [1, 1, 2, 1, -2, 1, 0, 1, -1, 1, -1, 1, 0, 1], [1, 1, 2, 1, -2, 1, 0, 1, 0, 1, -1, 1, 0, 1], [1, 1, 2, 1, -2, 1, 0, 1, 0, 1, 0, 1, 0, 1], [1, 1, 2, 1, -1, 1, 0, 1, 0, 1, 0, 1, 0, 1], [1, 1, 2, 1, -3, 1, 0, 1, 0, 1, 0, 1, 0, 1], [1, 1, 2, 1, -2, 1, -1, 1, 0, 1, 0, 1, 0, 1], [1, 1, 2, 1, -1, 1, -2, 1, 0, 1, 0, 1, 0, 1], [1, 1, 2, 1, 0, 1, -2, 1, 0, 1, 0, 1, 0, 1], [1, 1, 2, 1, -1, 1, -1, 1, 0, 1, 0, 1, 0, 1]];
        var decodes = [["F/m"], ["S"], ["F"], ["N·m ** 2/kg ** 2"], ["Hz"], ["A"], ["m/s ** 2"], ["m/s"], ["kg·m/s"], ["Pa"], ["Pa·s"], ["W/m ** 2"], ["N/m"], ["T"], ["W/(m·K)"], ["V/m"], ["N"], ["H/m"], ["J/K"], ["J/(kg·K)"], ["J/(mol·K)"], ["J/mol"], ["J"], ["J·s"], ["W"], ["V"], ["Ω"], ["H"], ["Wb"]];
        var M = dimensions.M;
        var L = dimensions.L;
        var T = dimensions.T;
        var Q = dimensions.Q;
        var temperature = dimensions.temperature;
        var amount = dimensions.amount;
        var intensity = dimensions.intensity;
        for (var i = 0,
            len = patterns.length; i < len; i++) {
          var pattern = patterns[i];
          if (M.numer === pattern[0] && M.denom === pattern[1] && L.numer === pattern[2] && L.denom === pattern[3] && T.numer === pattern[4] && T.denom === pattern[5] && Q.numer === pattern[6] && Q.denom === pattern[7] && temperature.numer === pattern[8] && temperature.denom === pattern[9] && amount.numer === pattern[10] && amount.denom === pattern[11] && intensity.numer === pattern[12] && intensity.denom === pattern[13]) {
            if (multiplier !== 1) {
              return multiplier + " * " + decodes[i][0];
            } else {
              return decodes[i][0];
            }
          }
        }
        return dumbString(multiplier, dimensions, labels);
      };
      Unit = (function() {
        function Unit(multiplier, dimensions, labels) {
          this.multiplier = multiplier;
          this.dimensions = dimensions;
          this.labels = labels;
          if (labels.length !== 7) {
            throw new Error("Expecting 7 elements in the labels array.");
          }
          this.multiplier = multiplier;
          this.dimensions = dimensions;
          this.labels = labels;
        }
        Unit.prototype.compatible = function(rhs) {
          if (rhs instanceof Unit) {
            this.dimensions.compatible(rhs.dimensions);
            return this;
          } else {
            throw new Error("Illegal Argument for Unit.compatible: " + rhs);
          }
        };
        Unit.prototype.add = function(rhs) {
          assertArgUnit('rhs', rhs);
          return add(this, rhs);
        };
        Unit.prototype.__add__ = function(rhs) {
          if (rhs instanceof Unit) {
            return add(this, rhs);
          } else {
            return;
          }
        };
        Unit.prototype.__radd__ = function(lhs) {
          if (lhs instanceof Unit) {
            return add(lhs, this);
          } else {
            return;
          }
        };
        Unit.prototype.sub = function(rhs) {
          assertArgUnit('rhs', rhs);
          return sub(this, rhs);
        };
        Unit.prototype.__sub__ = function(rhs) {
          if (rhs instanceof Unit) {
            return sub(this, rhs);
          } else {
            return;
          }
        };
        Unit.prototype.__rsub__ = function(lhs) {
          if (lhs instanceof Unit) {
            return sub(lhs, this);
          } else {
            return;
          }
        };
        Unit.prototype.mul = function(rhs) {
          assertArgUnit('rhs', rhs);
          return mul(this, rhs);
        };
        Unit.prototype.__mul__ = function(rhs) {
          if (rhs instanceof Unit) {
            return mul(this, rhs);
          } else if (typeof rhs === 'number') {
            return scale(rhs, this);
          } else {
            return;
          }
        };
        Unit.prototype.__rmul__ = function(lhs) {
          if (lhs instanceof Unit) {
            return mul(lhs, this);
          } else if (typeof lhs === 'number') {
            return scale(lhs, this);
          } else {
            return;
          }
        };
        Unit.prototype.div = function(rhs) {
          assertArgUnit('rhs', rhs);
          return div(this, rhs);
        };
        Unit.prototype.divByScalar = function(α) {
          return new Unit(this.multiplier / α, this.dimensions, this.labels);
        };
        Unit.prototype.__div__ = function(other) {
          if (other instanceof Unit) {
            return div(this, other);
          } else if (typeof other === 'number') {
            return new Unit(this.multiplier / other, this.dimensions, this.labels);
          } else {
            return;
          }
        };
        Unit.prototype.__rdiv__ = function(other) {
          if (other instanceof Unit) {
            return div(other, this);
          } else if (typeof other === 'number') {
            return new Unit(other / this.multiplier, this.dimensions.inv(), this.labels);
          } else {
            return;
          }
        };
        Unit.prototype.pow = function(exponent) {
          assertArgRational('exponent', exponent);
          return new Unit(Math.pow(this.multiplier, exponent.numer / exponent.denom), this.dimensions.pow(exponent), this.labels);
        };
        Unit.prototype.inv = function() {
          return new Unit(1 / this.multiplier, this.dimensions.inv(), this.labels);
        };
        Unit.prototype.neg = function() {
          return new Unit(-this.multiplier, this.dimensions, this.labels);
        };
        Unit.prototype.isOne = function() {
          return this.dimensions.isOne() && (this.multiplier === 1);
        };
        Unit.prototype.isZero = function() {
          return this.dimensions.isZero() || (this.multiplier === 0);
        };
        Unit.prototype.lerp = function(target, α) {
          return this;
        };
        Unit.prototype.norm = function() {
          return new Unit(Math.abs(this.multiplier), this.dimensions, this.labels);
        };
        Unit.prototype.quad = function() {
          return new Unit(this.multiplier * this.multiplier, this.dimensions.mul(this.dimensions), this.labels);
        };
        Unit.prototype.reflect = function(n) {
          return this;
        };
        Unit.prototype.rotate = function(rotor) {
          return this;
        };
        Unit.prototype.scale = function(α) {
          return new Unit(this.multiplier * α, this.dimensions, this.labels);
        };
        Unit.prototype.slerp = function(target, α) {
          return this;
        };
        Unit.prototype.toExponential = function() {
          return unitString(this.multiplier, this.dimensions, this.labels);
        };
        Unit.prototype.toFixed = function(digits) {
          return unitString(this.multiplier, this.dimensions, this.labels);
        };
        Unit.prototype.toString = function() {
          return unitString(this.multiplier, this.dimensions, this.labels);
        };
        Unit.prototype.__pos__ = function() {
          return this;
        };
        Unit.prototype.__neg__ = function() {
          return this.neg();
        };
        Unit.isOne = function(uom) {
          if (typeof uom === 'undefined') {
            return true;
          } else if (uom instanceof Unit) {
            return uom.isOne();
          } else {
            throw new Error("isOne argument must be a Unit or undefined.");
          }
        };
        Unit.assertDimensionless = function(uom) {
          if (!Unit.isOne(uom)) {
            throw new Error("uom must be dimensionless.");
          }
        };
        Unit.compatible = function(lhs, rhs) {
          assertArgUnitOrUndefined('lhs', lhs);
          assertArgUnitOrUndefined('rhs', rhs);
          if (lhs) {
            if (rhs) {
              return lhs.compatible(rhs);
            } else {
              if (lhs.isOne()) {
                return void 0;
              } else {
                throw new Error(lhs + " is incompatible with 1");
              }
            }
          } else {
            if (rhs) {
              if (rhs.isOne()) {
                return void 0;
              } else {
                throw new Error("1 is incompatible with " + rhs);
              }
            } else {
              return void 0;
            }
          }
        };
        Unit.mul = function(lhs, rhs) {
          if (lhs instanceof Unit) {
            if (rhs instanceof Unit) {
              return lhs.mul(rhs);
            } else if (Unit.isOne(rhs)) {
              return lhs;
            } else {
              return void 0;
            }
          } else if (Unit.isOne(lhs)) {
            return rhs;
          } else {
            return void 0;
          }
        };
        Unit.div = function(lhs, rhs) {
          if (lhs instanceof Unit) {
            if (rhs instanceof Unit) {
              return lhs.div(rhs);
            } else {
              return lhs;
            }
          } else {
            if (rhs instanceof Unit) {
              return rhs.inv();
            } else {
              return void 0;
            }
          }
        };
        Unit.sqrt = function(uom) {
          if (typeof uom !== 'undefined') {
            assertArgUnit('uom', uom);
            if (!uom.isOne()) {
              return new Unit(Math.sqrt(uom.multiplier), uom.dimensions.sqrt(), uom.labels);
            } else {
              return void 0;
            }
          } else {
            return void 0;
          }
        };
        Unit.ONE = new Unit(1.0, Dimensions_1.default.ONE, LABELS_SI);
        Unit.KILOGRAM = new Unit(1.0, Dimensions_1.default.MASS, LABELS_SI);
        Unit.METER = new Unit(1.0, Dimensions_1.default.LENGTH, LABELS_SI);
        Unit.SECOND = new Unit(1.0, Dimensions_1.default.TIME, LABELS_SI);
        Unit.COULOMB = new Unit(1.0, Dimensions_1.default.CHARGE, LABELS_SI);
        Unit.AMPERE = new Unit(1.0, Dimensions_1.default.CURRENT, LABELS_SI);
        Unit.KELVIN = new Unit(1.0, Dimensions_1.default.TEMPERATURE, LABELS_SI);
        Unit.MOLE = new Unit(1.0, Dimensions_1.default.AMOUNT, LABELS_SI);
        Unit.CANDELA = new Unit(1.0, Dimensions_1.default.INTENSITY, LABELS_SI);
        return Unit;
      })();
      exports_1("default", Unit);
    }
  };
});

System.register("davinci-eight/math/BASIS_LABELS_G3_GEOMETRIC.js", [], function(exports_1) {
  var SCALAR_POS_SYMBOL,
      E1_NEG_SYMBOL,
      E1_POS_SYMBOL,
      E2_POS_SYMBOL,
      E2_NEG_SYMBOL,
      E3_POS_SYMBOL,
      E3_NEG_SYMBOL,
      E12_NEG_SYMBOL,
      E12_POS_SYMBOL,
      E31_POS_SYMBOL,
      E31_NEG_SYMBOL,
      E23_NEG_SYMBOL,
      E23_POS_SYMBOL,
      PSEUDO_POS_SYMBOL,
      PSEUDO_NEG_SYMBOL,
      BASIS_LABELS_G3_GEOMETRIC;
  return {
    setters: [],
    execute: function() {
      SCALAR_POS_SYMBOL = "1";
      E1_NEG_SYMBOL = "←";
      E1_POS_SYMBOL = "→";
      E2_POS_SYMBOL = "↑";
      E2_NEG_SYMBOL = "↓";
      E3_POS_SYMBOL = "⊙";
      E3_NEG_SYMBOL = "⊗";
      E12_NEG_SYMBOL = "↻";
      E12_POS_SYMBOL = "↺";
      E31_POS_SYMBOL = "⊶";
      E31_NEG_SYMBOL = "⊷";
      E23_NEG_SYMBOL = "⬘";
      E23_POS_SYMBOL = "⬙";
      PSEUDO_POS_SYMBOL = "☐";
      PSEUDO_NEG_SYMBOL = "■";
      BASIS_LABELS_G3_GEOMETRIC = [[SCALAR_POS_SYMBOL, SCALAR_POS_SYMBOL], [E1_NEG_SYMBOL, E1_POS_SYMBOL], [E2_NEG_SYMBOL, E2_POS_SYMBOL], [E3_NEG_SYMBOL, E3_POS_SYMBOL], [E12_NEG_SYMBOL, E12_POS_SYMBOL], [E23_NEG_SYMBOL, E23_POS_SYMBOL], [E31_NEG_SYMBOL, E31_POS_SYMBOL], [PSEUDO_NEG_SYMBOL, PSEUDO_POS_SYMBOL]];
      exports_1("default", BASIS_LABELS_G3_GEOMETRIC);
    }
  };
});

System.register("davinci-eight/math/BASIS_LABELS_G3_HAMILTON.js", [], function(exports_1) {
  var SCALAR_SYMBOL,
      E1_SYMBOL,
      E2_SYMBOL,
      E3_SYMBOL,
      E12_SYMBOL,
      E23_SYMBOL,
      E31_SYMBOL,
      PSEUDO_SYMBOL,
      BASIS_LABELS_G3_HAMILTON;
  return {
    setters: [],
    execute: function() {
      SCALAR_SYMBOL = "1";
      E1_SYMBOL = "i";
      E2_SYMBOL = "j";
      E3_SYMBOL = "k";
      E12_SYMBOL = "ij";
      E23_SYMBOL = "jk";
      E31_SYMBOL = "ki";
      PSEUDO_SYMBOL = "ijk";
      BASIS_LABELS_G3_HAMILTON = [[SCALAR_SYMBOL], [E1_SYMBOL], [E2_SYMBOL], [E3_SYMBOL], [E12_SYMBOL], [E23_SYMBOL], [E31_SYMBOL], [PSEUDO_SYMBOL]];
      exports_1("default", BASIS_LABELS_G3_HAMILTON);
    }
  };
});

System.register("davinci-eight/math/BASIS_LABELS_G3_STANDARD.js", [], function(exports_1) {
  var SCALAR_SYMBOL,
      E1_SYMBOL,
      E2_SYMBOL,
      E3_SYMBOL,
      E12_SYMBOL,
      E23_SYMBOL,
      E31_SYMBOL,
      PSEUDO_SYMBOL,
      BASIS_LABELS_G3_STANDARD;
  return {
    setters: [],
    execute: function() {
      SCALAR_SYMBOL = "1";
      E1_SYMBOL = "e1";
      E2_SYMBOL = "e2";
      E3_SYMBOL = "e3";
      E12_SYMBOL = "e12";
      E23_SYMBOL = "e23";
      E31_SYMBOL = "e31";
      PSEUDO_SYMBOL = "I";
      BASIS_LABELS_G3_STANDARD = [[SCALAR_SYMBOL], [E1_SYMBOL], [E2_SYMBOL], [E3_SYMBOL], [E12_SYMBOL], [E23_SYMBOL], [E31_SYMBOL], [PSEUDO_SYMBOL]];
      exports_1("default", BASIS_LABELS_G3_STANDARD);
    }
  };
});

System.register("davinci-eight/math/BASIS_LABELS_G3_STANDARD_HTML.js", [], function(exports_1) {
  var SCALAR_SYMBOL,
      E1_SYMBOL,
      E2_SYMBOL,
      E3_SYMBOL,
      E12_SYMBOL,
      E23_SYMBOL,
      E31_SYMBOL,
      PSEUDO_SYMBOL,
      BASIS_LABELS_G3_STANDARD_HTML;
  return {
    setters: [],
    execute: function() {
      SCALAR_SYMBOL = "1";
      E1_SYMBOL = "<b>e</b><sub>1</sub>";
      E2_SYMBOL = "<b>e</b><sub>2</sub>";
      E3_SYMBOL = "<b>e</b><sub>3</sub>";
      E12_SYMBOL = E1_SYMBOL + E2_SYMBOL;
      E23_SYMBOL = E2_SYMBOL + E3_SYMBOL;
      E31_SYMBOL = E3_SYMBOL + E1_SYMBOL;
      PSEUDO_SYMBOL = E1_SYMBOL + E2_SYMBOL + E3_SYMBOL;
      BASIS_LABELS_G3_STANDARD_HTML = [[SCALAR_SYMBOL], [E1_SYMBOL], [E2_SYMBOL], [E3_SYMBOL], [E12_SYMBOL], [E23_SYMBOL], [E31_SYMBOL], [PSEUDO_SYMBOL]];
      exports_1("default", BASIS_LABELS_G3_STANDARD_HTML);
    }
  };
});

System.register("davinci-eight/math/G3.js", ["../math/addE3", "../geometries/b2", "../geometries/b3", "../math/extG3", "../math/lcoG3", "../math/mulG3", "./gauss", "../i18n/notImplemented", "./quadSpinorE3", "../math/rcoG3", "../i18n/readOnly", "../math/scpG3", "../math/squaredNormG3", "../math/stringFromCoordinates", "../math/subE3", "../math/Unit", "../math/BASIS_LABELS_G3_GEOMETRIC", "../math/BASIS_LABELS_G3_HAMILTON", "../math/BASIS_LABELS_G3_STANDARD", "../math/BASIS_LABELS_G3_STANDARD_HTML"], function(exports_1) {
  var addE3_1,
      b2_1,
      b3_1,
      extG3_1,
      lcoG3_1,
      mulG3_1,
      gauss_1,
      notImplemented_1,
      quadSpinorE3_1,
      rcoG3_1,
      readOnly_1,
      scpG3_1,
      squaredNormG3_1,
      stringFromCoordinates_1,
      subE3_1,
      Unit_1,
      BASIS_LABELS_G3_GEOMETRIC_1,
      BASIS_LABELS_G3_HAMILTON_1,
      BASIS_LABELS_G3_STANDARD_1,
      BASIS_LABELS_G3_STANDARD_HTML_1;
  var COORD_SCALAR,
      COORD_X,
      COORD_Y,
      COORD_Z,
      COORD_XY,
      COORD_YZ,
      COORD_ZX,
      COORD_PSEUDO,
      G3;
  function compute(f, a, b, coord, pack, uom) {
    var a0 = coord(a, 0);
    var a1 = coord(a, 1);
    var a2 = coord(a, 2);
    var a3 = coord(a, 3);
    var a4 = coord(a, 4);
    var a5 = coord(a, 5);
    var a6 = coord(a, 6);
    var a7 = coord(a, 7);
    var b0 = coord(b, 0);
    var b1 = coord(b, 1);
    var b2 = coord(b, 2);
    var b3 = coord(b, 3);
    var b4 = coord(b, 4);
    var b5 = coord(b, 5);
    var b6 = coord(b, 6);
    var b7 = coord(b, 7);
    var x0 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 0);
    var x1 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 1);
    var x2 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 2);
    var x3 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 3);
    var x4 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 4);
    var x5 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 5);
    var x6 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 6);
    var x7 = f(a0, a1, a2, a3, a4, a5, a6, a7, b0, b1, b2, b3, b4, b5, b6, b7, 7);
    return pack(x0, x1, x2, x3, x4, x5, x6, x7, uom);
  }
  return {
    setters: [function(addE3_1_1) {
      addE3_1 = addE3_1_1;
    }, function(b2_1_1) {
      b2_1 = b2_1_1;
    }, function(b3_1_1) {
      b3_1 = b3_1_1;
    }, function(extG3_1_1) {
      extG3_1 = extG3_1_1;
    }, function(lcoG3_1_1) {
      lcoG3_1 = lcoG3_1_1;
    }, function(mulG3_1_1) {
      mulG3_1 = mulG3_1_1;
    }, function(gauss_1_1) {
      gauss_1 = gauss_1_1;
    }, function(notImplemented_1_1) {
      notImplemented_1 = notImplemented_1_1;
    }, function(quadSpinorE3_1_1) {
      quadSpinorE3_1 = quadSpinorE3_1_1;
    }, function(rcoG3_1_1) {
      rcoG3_1 = rcoG3_1_1;
    }, function(readOnly_1_1) {
      readOnly_1 = readOnly_1_1;
    }, function(scpG3_1_1) {
      scpG3_1 = scpG3_1_1;
    }, function(squaredNormG3_1_1) {
      squaredNormG3_1 = squaredNormG3_1_1;
    }, function(stringFromCoordinates_1_1) {
      stringFromCoordinates_1 = stringFromCoordinates_1_1;
    }, function(subE3_1_1) {
      subE3_1 = subE3_1_1;
    }, function(Unit_1_1) {
      Unit_1 = Unit_1_1;
    }, function(BASIS_LABELS_G3_GEOMETRIC_1_1) {
      BASIS_LABELS_G3_GEOMETRIC_1 = BASIS_LABELS_G3_GEOMETRIC_1_1;
    }, function(BASIS_LABELS_G3_HAMILTON_1_1) {
      BASIS_LABELS_G3_HAMILTON_1 = BASIS_LABELS_G3_HAMILTON_1_1;
    }, function(BASIS_LABELS_G3_STANDARD_1_1) {
      BASIS_LABELS_G3_STANDARD_1 = BASIS_LABELS_G3_STANDARD_1_1;
    }, function(BASIS_LABELS_G3_STANDARD_HTML_1_1) {
      BASIS_LABELS_G3_STANDARD_HTML_1 = BASIS_LABELS_G3_STANDARD_HTML_1_1;
    }],
    execute: function() {
      COORD_SCALAR = 0;
      COORD_X = 1;
      COORD_Y = 2;
      COORD_Z = 3;
      COORD_XY = 4;
      COORD_YZ = 5;
      COORD_ZX = 6;
      COORD_PSEUDO = 7;
      G3 = (function() {
        function G3(α, x, y, z, xy, yz, zx, β, uom) {
          this._coords = [0, 0, 0, 0, 0, 0, 0, 0];
          this._coords[COORD_SCALAR] = α;
          this._coords[COORD_X] = x;
          this._coords[COORD_Y] = y;
          this._coords[COORD_Z] = z;
          this._coords[COORD_XY] = xy;
          this._coords[COORD_YZ] = yz;
          this._coords[COORD_ZX] = zx;
          this._coords[COORD_PSEUDO] = β;
          this.uom = uom;
          if (this.uom && this.uom.multiplier !== 1) {
            var multiplier = this.uom.multiplier;
            this._coords[COORD_SCALAR] *= multiplier;
            this._coords[COORD_X] *= multiplier;
            this._coords[COORD_Y] *= multiplier;
            this._coords[COORD_Z] *= multiplier;
            this._coords[COORD_XY] *= multiplier;
            this._coords[COORD_YZ] *= multiplier;
            this._coords[COORD_ZX] *= multiplier;
            this._coords[COORD_PSEUDO] *= multiplier;
            this.uom = new Unit_1.default(1, uom.dimensions, uom.labels);
          }
        }
        Object.defineProperty(G3, "BASIS_LABELS_GEOMETRIC", {
          get: function() {
            return BASIS_LABELS_G3_GEOMETRIC_1.default;
          },
          enumerable: true,
          configurable: true
        });
        ;
        Object.defineProperty(G3, "BASIS_LABELS_HAMILTON", {
          get: function() {
            return BASIS_LABELS_G3_HAMILTON_1.default;
          },
          enumerable: true,
          configurable: true
        });
        ;
        Object.defineProperty(G3, "BASIS_LABELS_STANDARD", {
          get: function() {
            return BASIS_LABELS_G3_STANDARD_1.default;
          },
          enumerable: true,
          configurable: true
        });
        ;
        Object.defineProperty(G3, "BASIS_LABELS_STANDARD_HTML", {
          get: function() {
            return BASIS_LABELS_G3_STANDARD_HTML_1.default;
          },
          enumerable: true,
          configurable: true
        });
        ;
        Object.defineProperty(G3.prototype, "α", {
          get: function() {
            return this._coords[COORD_SCALAR];
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('α').message);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(G3.prototype, "alpha", {
          get: function() {
            return this._coords[COORD_SCALAR];
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('alpha').message);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(G3.prototype, "x", {
          get: function() {
            return this._coords[COORD_X];
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('x').message);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(G3.prototype, "y", {
          get: function() {
            return this._coords[COORD_Y];
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('y').message);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(G3.prototype, "z", {
          get: function() {
            return this._coords[COORD_Z];
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('z').message);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(G3.prototype, "xy", {
          get: function() {
            return this._coords[COORD_XY];
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('xy').message);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(G3.prototype, "yz", {
          get: function() {
            return this._coords[COORD_YZ];
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('yz').message);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(G3.prototype, "zx", {
          get: function() {
            return this._coords[COORD_ZX];
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('zx').message);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(G3.prototype, "β", {
          get: function() {
            return this._coords[COORD_PSEUDO];
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('β').message);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(G3.prototype, "beta", {
          get: function() {
            return this._coords[COORD_PSEUDO];
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('beta').message);
          },
          enumerable: true,
          configurable: true
        });
        G3.fromCartesian = function(α, x, y, z, xy, yz, zx, β, uom) {
          return new G3(α, x, y, z, xy, yz, zx, β, uom);
        };
        Object.defineProperty(G3.prototype, "coords", {
          get: function() {
            return [this.α, this.x, this.y, this.z, this.xy, this.yz, this.zx, this.β];
          },
          enumerable: true,
          configurable: true
        });
        G3.prototype.coordinate = function(index) {
          switch (index) {
            case 0:
              return this.α;
            case 1:
              return this.x;
            case 2:
              return this.y;
            case 3:
              return this.z;
            case 4:
              return this.xy;
            case 5:
              return this.yz;
            case 6:
              return this.zx;
            case 7:
              return this.β;
            default:
              throw new Error("index must be in the range [0..7]");
          }
        };
        G3.prototype.add = function(rhs) {
          var coord = function(x, n) {
            return x[n];
          };
          var pack = function(w, x, y, z, xy, yz, zx, xyz, uom) {
            return G3.fromCartesian(w, x, y, z, xy, yz, zx, xyz, uom);
          };
          return compute(addE3_1.default, this.coords, rhs.coords, coord, pack, Unit_1.default.compatible(this.uom, rhs.uom));
        };
        G3.prototype.addPseudo = function(β) {
          return new G3(this.α, this.x, this.y, this.z, this.xy, this.yz, this.zx, this.β + β, this.uom);
        };
        G3.prototype.addScalar = function(α) {
          return new G3(this.α + α, this.x, this.y, this.z, this.xy, this.yz, this.zx, this.β, this.uom);
        };
        G3.prototype.__add__ = function(rhs) {
          if (rhs instanceof G3) {
            return this.add(rhs);
          } else if (typeof rhs === 'number') {
            return this.addScalar(rhs);
          }
        };
        G3.prototype.__radd__ = function(lhs) {
          if (lhs instanceof G3) {
            return lhs.add(this);
          } else if (typeof lhs === 'number') {
            return this.addScalar(lhs);
          }
        };
        G3.prototype.adj = function() {
          throw new Error(notImplemented_1.default('adj').message);
        };
        G3.prototype.angle = function() {
          return this.log().grade(2);
        };
        G3.prototype.conj = function() {
          return new G3(this.α, -this.x, -this.y, -this.z, -this.xy, -this.yz, -this.zx, +this.β, this.uom);
        };
        G3.prototype.cubicBezier = function(t, controlBegin, controlEnd, endPoint) {
          var x = b3_1.default(t, this.x, controlBegin.x, controlEnd.x, endPoint.x);
          var y = b3_1.default(t, this.y, controlBegin.y, controlEnd.y, endPoint.y);
          var z = b3_1.default(t, this.z, controlBegin.z, controlEnd.z, endPoint.z);
          return new G3(0, x, y, z, 0, 0, 0, 0, this.uom);
        };
        G3.prototype.direction = function() {
          return this.div(this.norm());
        };
        G3.prototype.sub = function(rhs) {
          var coord = function(x, n) {
            return x[n];
          };
          var pack = function(w, x, y, z, xy, yz, zx, xyz, uom) {
            return G3.fromCartesian(w, x, y, z, xy, yz, zx, xyz, uom);
          };
          return compute(subE3_1.default, this.coords, rhs.coords, coord, pack, Unit_1.default.compatible(this.uom, rhs.uom));
        };
        G3.prototype.__sub__ = function(rhs) {
          if (rhs instanceof G3) {
            return this.sub(rhs);
          } else if (typeof rhs === 'number') {
            return this.addScalar(-rhs);
          }
        };
        G3.prototype.__rsub__ = function(lhs) {
          if (lhs instanceof G3) {
            return lhs.sub(this);
          } else if (typeof lhs === 'number') {
            return this.neg().addScalar(lhs);
          }
        };
        G3.prototype.mul = function(rhs) {
          var out = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.mul(this.uom, rhs.uom));
          mulG3_1.default(this, rhs, G3.mutator(out));
          return out;
        };
        G3.prototype.__mul__ = function(rhs) {
          if (rhs instanceof G3) {
            return this.mul(rhs);
          } else if (typeof rhs === 'number') {
            return this.scale(rhs);
          }
        };
        G3.prototype.__rmul__ = function(lhs) {
          if (lhs instanceof G3) {
            return lhs.mul(this);
          } else if (typeof lhs === 'number') {
            return this.scale(lhs);
          }
        };
        G3.prototype.scale = function(α) {
          return new G3(this.α * α, this.x * α, this.y * α, this.z * α, this.xy * α, this.yz * α, this.zx * α, this.β * α, this.uom);
        };
        G3.prototype.div = function(rhs) {
          return this.mul(rhs.inv());
        };
        G3.prototype.divByScalar = function(α) {
          return new G3(this.α / α, this.x / α, this.y / α, this.z / α, this.xy / α, this.yz / α, this.zx / α, this.β / α, this.uom);
        };
        G3.prototype.__div__ = function(rhs) {
          if (rhs instanceof G3) {
            return this.div(rhs);
          } else if (typeof rhs === 'number') {
            return this.divByScalar(rhs);
          }
        };
        G3.prototype.__rdiv__ = function(lhs) {
          if (lhs instanceof G3) {
            return lhs.div(this);
          } else if (typeof lhs === 'number') {
            return new G3(lhs, 0, 0, 0, 0, 0, 0, 0, void 0).div(this);
          }
        };
        G3.prototype.dual = function() {
          throw new Error(notImplemented_1.default('dual').message);
        };
        G3.prototype.scp = function(rhs) {
          var out = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.mul(this.uom, rhs.uom));
          scpG3_1.default(this, rhs, G3.mutator(out));
          return out;
        };
        G3.prototype.ext = function(rhs) {
          var out = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.mul(this.uom, rhs.uom));
          extG3_1.default(this, rhs, G3.mutator(out));
          return out;
        };
        G3.prototype.__vbar__ = function(rhs) {
          if (rhs instanceof G3) {
            return this.scp(rhs);
          } else if (typeof rhs === 'number') {
            return this.scp(new G3(rhs, 0, 0, 0, 0, 0, 0, 0, void 0));
          }
        };
        G3.prototype.__rvbar__ = function(lhs) {
          if (lhs instanceof G3) {
            return lhs.scp(this);
          } else if (typeof lhs === 'number') {
            return new G3(lhs, 0, 0, 0, 0, 0, 0, 0, void 0).scp(this);
          }
        };
        G3.prototype.__wedge__ = function(rhs) {
          if (rhs instanceof G3) {
            return this.ext(rhs);
          } else if (typeof rhs === 'number') {
            return this.scale(rhs);
          }
        };
        G3.prototype.__rwedge__ = function(lhs) {
          if (lhs instanceof G3) {
            return lhs.ext(this);
          } else if (typeof lhs === 'number') {
            return this.scale(lhs);
          }
        };
        G3.prototype.lco = function(rhs) {
          var out = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.mul(this.uom, rhs.uom));
          lcoG3_1.default(this, rhs, G3.mutator(out));
          return out;
        };
        G3.prototype.__lshift__ = function(rhs) {
          if (rhs instanceof G3) {
            return this.lco(rhs);
          } else if (typeof rhs === 'number') {
            return this.lco(new G3(rhs, 0, 0, 0, 0, 0, 0, 0, void 0));
          }
        };
        G3.prototype.__rlshift__ = function(lhs) {
          if (lhs instanceof G3) {
            return lhs.lco(this);
          } else if (typeof lhs === 'number') {
            return new G3(lhs, 0, 0, 0, 0, 0, 0, 0, void 0).lco(this);
          }
        };
        G3.prototype.rco = function(rhs) {
          var out = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.mul(this.uom, rhs.uom));
          rcoG3_1.default(this, rhs, G3.mutator(out));
          return out;
        };
        G3.prototype.__rshift__ = function(rhs) {
          if (rhs instanceof G3) {
            return this.rco(rhs);
          } else if (typeof rhs === 'number') {
            return this.rco(new G3(rhs, 0, 0, 0, 0, 0, 0, 0, void 0));
          }
        };
        G3.prototype.__rrshift__ = function(lhs) {
          if (lhs instanceof G3) {
            return lhs.rco(this);
          } else if (typeof lhs === 'number') {
            return new G3(lhs, 0, 0, 0, 0, 0, 0, 0, void 0).rco(this);
          }
        };
        G3.prototype.pow = function(exponent) {
          throw new Error('pow');
        };
        G3.prototype.__bang__ = function() {
          return this.inv();
        };
        G3.prototype.__pos__ = function() {
          return this;
        };
        G3.prototype.neg = function() {
          return new G3(-this.α, -this.x, -this.y, -this.z, -this.xy, -this.yz, -this.zx, -this.β, this.uom);
        };
        G3.prototype.__neg__ = function() {
          return this.neg();
        };
        G3.prototype.rev = function() {
          return new G3(this.α, this.x, this.y, this.z, -this.xy, -this.yz, -this.zx, -this.β, this.uom);
        };
        G3.prototype.__tilde__ = function() {
          return this.rev();
        };
        G3.prototype.grade = function(grade) {
          switch (grade) {
            case 0:
              return G3.fromCartesian(this.α, 0, 0, 0, 0, 0, 0, 0, this.uom);
            case 1:
              return G3.fromCartesian(0, this.x, this.y, this.z, 0, 0, 0, 0, this.uom);
            case 2:
              return G3.fromCartesian(0, 0, 0, 0, this.xy, this.yz, this.zx, 0, this.uom);
            case 3:
              return G3.fromCartesian(0, 0, 0, 0, 0, 0, 0, this.β, this.uom);
            default:
              return G3.fromCartesian(0, 0, 0, 0, 0, 0, 0, 0, this.uom);
          }
        };
        G3.prototype.cross = function(vector) {
          var x;
          var x1;
          var x2;
          var y;
          var y1;
          var y2;
          var z;
          var z1;
          var z2;
          x1 = this.x;
          y1 = this.y;
          z1 = this.z;
          x2 = vector.x;
          y2 = vector.y;
          z2 = vector.z;
          x = y1 * z2 - z1 * y2;
          y = z1 * x2 - x1 * z2;
          z = x1 * y2 - y1 * x2;
          return new G3(0, x, y, z, 0, 0, 0, 0, Unit_1.default.mul(this.uom, vector.uom));
        };
        G3.prototype.isOne = function() {
          return (this.α === 1) && (this.x === 0) && (this.y === 0) && (this.z === 0) && (this.yz === 0) && (this.zx === 0) && (this.xy === 0) && (this.β === 0);
        };
        G3.prototype.isZero = function() {
          return (this.α === 0) && (this.x === 0) && (this.y === 0) && (this.z === 0) && (this.yz === 0) && (this.zx === 0) && (this.xy === 0) && (this.β === 0);
        };
        G3.prototype.lerp = function(target, α) {
          throw new Error(notImplemented_1.default('lerp').message);
        };
        G3.prototype.cos = function() {
          Unit_1.default.assertDimensionless(this.uom);
          var cosW = Math.cos(this.α);
          return new G3(cosW, 0, 0, 0, 0, 0, 0, 0);
        };
        G3.prototype.cosh = function() {
          throw new Error(notImplemented_1.default('cosh').message);
        };
        G3.prototype.distanceTo = function(point) {
          var dx = this.x - point.x;
          var dy = this.y - point.y;
          var dz = this.z - point.z;
          return Math.sqrt(dx * dx + dy * dy + dz * dz);
        };
        G3.prototype.equals = function(other) {
          if (this.α === other.α && this.x === other.x && this.y === other.y && this.z === other.z && this.xy === other.xy && this.yz === other.yz && this.zx === other.zx && this.β === other.β) {
            if (this.uom) {
              if (other.uom) {
                return true;
              } else {
                return false;
              }
            } else {
              if (other.uom) {
                return false;
              } else {
                return true;
              }
            }
          } else {
            return false;
          }
        };
        G3.prototype.exp = function() {
          Unit_1.default.assertDimensionless(this.uom);
          var bivector = this.grade(2);
          var a = bivector.norm();
          if (!a.isZero()) {
            var c = a.cos();
            var s = a.sin();
            var B = bivector.direction();
            return c.add(B.mul(s));
          } else {
            return new G3(1, 0, 0, 0, 0, 0, 0, 0, this.uom);
          }
        };
        G3.prototype.inv = function() {
          var α = this.α;
          var x = this.x;
          var y = this.y;
          var z = this.z;
          var xy = this.xy;
          var yz = this.yz;
          var zx = this.zx;
          var β = this.β;
          var A = [[α, x, y, z, -xy, -yz, -zx, -β], [x, α, xy, -zx, -y, -β, z, -yz], [y, -xy, α, yz, x, -z, -β, -zx], [z, zx, -yz, α, -β, y, -x, -xy], [xy, -y, x, β, α, zx, -yz, z], [yz, β, -z, y, -zx, α, xy, x], [zx, z, β, -x, yz, -xy, α, y], [β, yz, zx, xy, z, x, y, α]];
          var b = [1, 0, 0, 0, 0, 0, 0, 0];
          var X = gauss_1.default(A, b);
          var uom = this.uom ? this.uom.inv() : void 0;
          return new G3(X[0], X[1], X[2], X[3], X[4], X[5], X[6], X[7], uom);
        };
        G3.prototype.log = function() {
          throw new Error(notImplemented_1.default('log').message);
        };
        G3.prototype.magnitude = function() {
          return this.norm();
        };
        G3.prototype.magnitudeSansUnits = function() {
          return Math.sqrt(this.squaredNormSansUnits());
        };
        G3.prototype.norm = function() {
          return new G3(this.magnitudeSansUnits(), 0, 0, 0, 0, 0, 0, 0, this.uom);
        };
        G3.prototype.quad = function() {
          return this.squaredNorm();
        };
        G3.prototype.quadraticBezier = function(t, controlPoint, endPoint) {
          var x = b2_1.default(t, this.x, controlPoint.x, endPoint.x);
          var y = b2_1.default(t, this.y, controlPoint.y, endPoint.y);
          var z = b2_1.default(t, this.z, controlPoint.z, endPoint.z);
          return new G3(0, x, y, z, 0, 0, 0, 0, this.uom);
        };
        G3.prototype.squaredNorm = function() {
          return new G3(this.squaredNormSansUnits(), 0, 0, 0, 0, 0, 0, 0, Unit_1.default.mul(this.uom, this.uom));
        };
        G3.prototype.squaredNormSansUnits = function() {
          return squaredNormG3_1.default(this);
        };
        G3.prototype.reflect = function(n) {
          var m = G3.fromVector(n);
          return m.mul(this).mul(m).scale(-1);
        };
        G3.prototype.rotate = function(R) {
          var x = this.x;
          var y = this.y;
          var z = this.z;
          var a = R.xy;
          var b = R.yz;
          var c = R.zx;
          var α = R.α;
          var quadR = quadSpinorE3_1.default(R);
          var ix = α * x - c * z + a * y;
          var iy = α * y - a * x + b * z;
          var iz = α * z - b * y + c * x;
          var iα = b * x + c * y + a * z;
          var αOut = quadR * this.α;
          var xOut = ix * α + iα * b + iy * a - iz * c;
          var yOut = iy * α + iα * c + iz * b - ix * a;
          var zOut = iz * α + iα * a + ix * c - iy * b;
          var βOut = quadR * this.β;
          return G3.fromCartesian(αOut, xOut, yOut, zOut, 0, 0, 0, βOut, this.uom);
        };
        G3.prototype.sin = function() {
          Unit_1.default.assertDimensionless(this.uom);
          var sinW = Math.sin(this.α);
          return new G3(sinW, 0, 0, 0, 0, 0, 0, 0, void 0);
        };
        G3.prototype.sinh = function() {
          throw new Error(notImplemented_1.default('sinh').message);
        };
        G3.prototype.slerp = function(target, α) {
          throw new Error(notImplemented_1.default('slerp').message);
        };
        G3.prototype.sqrt = function() {
          return new G3(Math.sqrt(this.α), 0, 0, 0, 0, 0, 0, 0, Unit_1.default.sqrt(this.uom));
        };
        G3.prototype.tan = function() {
          return this.sin().div(this.cos());
        };
        G3.prototype.toStringCustom = function(coordToString, labels) {
          var quantityString = stringFromCoordinates_1.default(this.coords, coordToString, labels);
          if (this.uom) {
            var unitString = this.uom.toString().trim();
            if (unitString) {
              return quantityString + ' ' + unitString;
            } else {
              return quantityString;
            }
          } else {
            return quantityString;
          }
        };
        G3.prototype.toExponential = function() {
          var coordToString = function(coord) {
            return coord.toExponential();
          };
          return this.toStringCustom(coordToString, G3.BASIS_LABELS);
        };
        G3.prototype.toFixed = function(digits) {
          var coordToString = function(coord) {
            return coord.toFixed(digits);
          };
          return this.toStringCustom(coordToString, G3.BASIS_LABELS);
        };
        G3.prototype.toString = function() {
          var coordToString = function(coord) {
            return coord.toString();
          };
          return this.toStringCustom(coordToString, G3.BASIS_LABELS);
        };
        G3.mutator = function(M) {
          var that = {
            set α(α) {
              M._coords[COORD_SCALAR] = α;
            },
            set alpha(alpha) {
              M._coords[COORD_SCALAR] = alpha;
            },
            set x(x) {
              M._coords[COORD_X] = x;
            },
            set y(y) {
              M._coords[COORD_Y] = y;
            },
            set z(z) {
              M._coords[COORD_Z] = z;
            },
            set yz(yz) {
              M._coords[COORD_YZ] = yz;
            },
            set zx(zx) {
              M._coords[COORD_ZX] = zx;
            },
            set xy(xy) {
              M._coords[COORD_XY] = xy;
            },
            set β(β) {
              M._coords[COORD_PSEUDO] = β;
            },
            set beta(beta) {
              M._coords[COORD_PSEUDO] = beta;
            },
            set uom(uom) {
              M.uom = uom;
            }
          };
          return that;
        };
        G3.copy = function(m) {
          if (m instanceof G3) {
            return m;
          } else {
            return new G3(m.α, m.x, m.y, m.z, m.xy, m.yz, m.zx, m.β, m.uom);
          }
        };
        G3.fromSpinor = function(spinor) {
          if (spinor) {
            return new G3(spinor.α, 0, 0, 0, spinor.xy, spinor.yz, spinor.zx, 0, void 0);
          } else {
            return void 0;
          }
        };
        G3.fromVector = function(vector) {
          if (vector) {
            return new G3(0, vector.x, vector.y, vector.z, 0, 0, 0, 0, vector.uom);
          } else {
            return void 0;
          }
        };
        G3.random = function(uom) {
          return new G3(Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), uom);
        };
        G3.scalar = function(α, uom) {
          return new G3(α, 0, 0, 0, 0, 0, 0, 0, uom);
        };
        G3.vector = function(x, y, z, uom) {
          return new G3(0, x, y, z, 0, 0, 0, 0, uom);
        };
        G3.BASIS_LABELS = BASIS_LABELS_G3_STANDARD_1.default;
        G3.zero = new G3(0, 0, 0, 0, 0, 0, 0, 0);
        G3.one = new G3(1, 0, 0, 0, 0, 0, 0, 0);
        G3.e1 = new G3(0, 1, 0, 0, 0, 0, 0, 0);
        G3.e2 = new G3(0, 0, 1, 0, 0, 0, 0, 0);
        G3.e3 = new G3(0, 0, 0, 1, 0, 0, 0, 0);
        G3.kilogram = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.KILOGRAM);
        G3.meter = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.METER);
        G3.second = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.SECOND);
        G3.coulomb = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.COULOMB);
        G3.ampere = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.AMPERE);
        G3.kelvin = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.KELVIN);
        G3.mole = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.MOLE);
        G3.candela = new G3(1, 0, 0, 0, 0, 0, 0, 0, Unit_1.default.CANDELA);
        return G3;
      })();
      exports_1("default", G3);
    }
  };
});

System.register("davinci-eight/math/clamp.js", ["../checks/mustBeNumber"], function(exports_1) {
  var mustBeNumber_1;
  function clamp(x, min, max) {
    mustBeNumber_1.default('x', x);
    mustBeNumber_1.default('min', min);
    mustBeNumber_1.default('max', max);
    return (x < min) ? min : ((x > max) ? max : x);
  }
  exports_1("default", clamp);
  return {
    setters: [function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/checks/isGE.js", [], function(exports_1) {
  function default_1(value, limit) {
    return value >= limit;
  }
  exports_1("default", default_1);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/checks/mustBeGE.js", ["../checks/mustSatisfy", "../checks/isGE"], function(exports_1) {
  var mustSatisfy_1,
      isGE_1;
  function default_1(name, value, limit, contextBuilder) {
    mustSatisfy_1.default(name, isGE_1.default(value, limit), function() {
      return "be greater than or equal to " + limit;
    }, contextBuilder);
    return value;
  }
  exports_1("default", default_1);
  return {
    setters: [function(mustSatisfy_1_1) {
      mustSatisfy_1 = mustSatisfy_1_1;
    }, function(isGE_1_1) {
      isGE_1 = isGE_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/checks/isLE.js", [], function(exports_1) {
  function default_1(value, limit) {
    return value <= limit;
  }
  exports_1("default", default_1);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/checks/mustBeLE.js", ["../checks/mustSatisfy", "../checks/isLE"], function(exports_1) {
  var mustSatisfy_1,
      isLE_1;
  function default_1(name, value, limit, contextBuilder) {
    mustSatisfy_1.default(name, isLE_1.default(value, limit), function() {
      return "be less than or equal to " + limit;
    }, contextBuilder);
    return value;
  }
  exports_1("default", default_1);
  return {
    setters: [function(mustSatisfy_1_1) {
      mustSatisfy_1 = mustSatisfy_1_1;
    }, function(isLE_1_1) {
      isLE_1 = isLE_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/core/principalAngle.js", [], function(exports_1) {
  function principalAngle(angle) {
    if (angle > 2 * Math.PI) {
      return principalAngle(angle - 2 * Math.PI);
    } else if (angle < 0) {
      return principalAngle(angle + 2 * Math.PI);
    } else {
      return angle;
    }
  }
  exports_1("default", principalAngle);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/core/Color.js", ["../math/clamp", "../checks/mustBeArray", "../checks/mustBeGE", "../checks/mustBeLE", "../checks/mustBeNumber", "./principalAngle", "../math/VectorN"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var clamp_1,
      mustBeArray_1,
      mustBeGE_1,
      mustBeLE_1,
      mustBeNumber_1,
      principalAngle_1,
      VectorN_1;
  var pow,
      COORD_R,
      COORD_G,
      COORD_B,
      Color;
  return {
    setters: [function(clamp_1_1) {
      clamp_1 = clamp_1_1;
    }, function(mustBeArray_1_1) {
      mustBeArray_1 = mustBeArray_1_1;
    }, function(mustBeGE_1_1) {
      mustBeGE_1 = mustBeGE_1_1;
    }, function(mustBeLE_1_1) {
      mustBeLE_1 = mustBeLE_1_1;
    }, function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }, function(principalAngle_1_1) {
      principalAngle_1 = principalAngle_1_1;
    }, function(VectorN_1_1) {
      VectorN_1 = VectorN_1_1;
    }],
    execute: function() {
      pow = Math.pow;
      COORD_R = 0;
      COORD_G = 1;
      COORD_B = 2;
      Color = (function(_super) {
        __extends(Color, _super);
        function Color(r, g, b) {
          _super.call(this, [r, g, b], false, 3);
          mustBeGE_1.default('r', r, 0);
          mustBeLE_1.default('r', r, 1);
          mustBeGE_1.default('g', g, 0);
          mustBeLE_1.default('g', g, 1);
          mustBeGE_1.default('b', b, 0);
          mustBeLE_1.default('b', b, 1);
        }
        Object.defineProperty(Color.prototype, "r", {
          get: function() {
            return this.coords[COORD_R];
          },
          set: function(r) {
            this.coords[COORD_R] = clamp_1.default(r, 0, 1);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Color.prototype, "g", {
          get: function() {
            return this.coords[COORD_G];
          },
          set: function(g) {
            this.coords[COORD_G] = clamp_1.default(g, 0, 1);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Color.prototype, "b", {
          get: function() {
            return this.coords[COORD_B];
          },
          set: function(b) {
            this.coords[COORD_B] = clamp_1.default(b, 0, 1);
          },
          enumerable: true,
          configurable: true
        });
        Color.prototype.clone = function() {
          return new Color(this.r, this.g, this.b);
        };
        Color.prototype.copy = function(color) {
          this.r = color.r;
          this.g = color.g;
          this.b = color.b;
          return this;
        };
        Color.prototype.interpolate = function(target, α) {
          this.r += (target.r - this.r) * α;
          this.g += (target.g - this.g) * α;
          this.b += (target.b - this.b) * α;
          return this;
        };
        Object.defineProperty(Color.prototype, "luminance", {
          get: function() {
            return Color.luminance(this.r, this.g, this.b);
          },
          enumerable: true,
          configurable: true
        });
        Color.prototype.toString = function() {
          return "Color(" + this.r + ", " + this.g + ", " + this.b + ")";
        };
        Color.luminance = function(r, g, b) {
          mustBeNumber_1.default('r', r);
          mustBeNumber_1.default('g', g);
          mustBeNumber_1.default('b', b);
          var γ = 2.2;
          return 0.2126 * pow(r, γ) + 0.7152 * pow(b, γ) + 0.0722 * pow(b, γ);
        };
        Color.fromColor = function(color) {
          return new Color(color.r, color.g, color.b);
        };
        Color.fromCoords = function(coords) {
          mustBeArray_1.default('coords', coords);
          var r = mustBeNumber_1.default('r', coords[COORD_R]);
          var g = mustBeNumber_1.default('g', coords[COORD_G]);
          var b = mustBeNumber_1.default('b', coords[COORD_B]);
          return new Color(r, g, b);
        };
        Color.fromHSL = function(H, S, L) {
          mustBeNumber_1.default('H', H);
          mustBeNumber_1.default('S', S);
          mustBeNumber_1.default('L', L);
          var C = (1 - Math.abs(2 * L - 1)) * S;
          function matchLightness(R, G, B) {
            var m = L - 0.5 * C;
            return new Color(R + m, G + m, B + m);
          }
          var sextant = ((principalAngle_1.default(H) / Math.PI) * 3) % 6;
          var X = C * (1 - Math.abs(sextant % 2 - 1));
          if (sextant >= 0 && sextant < 1) {
            return matchLightness(C, X, 0);
          } else if (sextant >= 1 && sextant < 2) {
            return matchLightness(X, C, 0);
          } else if (sextant >= 2 && sextant < 3) {
            return matchLightness(0, C, C * (sextant - 2));
          } else if (sextant >= 3 && sextant < 4) {
            return matchLightness(0, C * (4 - sextant), C);
          } else if (sextant >= 4 && sextant < 5) {
            return matchLightness(X, 0, C);
          } else if (sextant >= 5 && sextant < 6) {
            return matchLightness(C, 0, X);
          } else {
            return matchLightness(0, 0, 0);
          }
        };
        Color.fromRGB = function(r, g, b) {
          mustBeNumber_1.default('r', r);
          mustBeNumber_1.default('g', g);
          mustBeNumber_1.default('b', b);
          return new Color(r, g, b);
        };
        Color.interpolate = function(a, b, α) {
          return Color.fromColor(a).interpolate(b, α);
        };
        Color.black = new Color(0, 0, 0);
        Color.blue = new Color(0, 0, 1);
        Color.green = new Color(0, 1, 0);
        Color.cyan = new Color(0, 1, 1);
        Color.red = new Color(1, 0, 0);
        Color.magenta = new Color(1, 0, 1);
        Color.yellow = new Color(1, 1, 0);
        Color.white = new Color(1, 1, 1);
        return Color;
      })(VectorN_1.default);
      exports_1("default", Color);
    }
  };
});

System.register("davinci-eight/facets/ColorFacet.js", ["../core/Color", "../core", "../checks/mustBeNumber", "../core/GraphicsProgramSymbols"], function(exports_1) {
  var Color_1,
      core_1,
      mustBeNumber_1,
      GraphicsProgramSymbols_1;
  var COORD_R,
      COORD_G,
      COORD_B,
      ColorFacet;
  function checkPropertyName(name) {
    if (typeof name !== 'string') {
      var msg = "ColorFacet property 'name' must be a string.";
      if (core_1.default.strict) {
        throw new TypeError(msg);
      } else {
        console.warn(msg);
      }
    }
    switch (name) {
      case ColorFacet.PROP_RGB:
        return;
      default:
        {
          var msg = "ColorFacet property 'name' must be one of " + [ColorFacet.PROP_RGB, ColorFacet.PROP_RGBA, ColorFacet.PROP_RED, ColorFacet.PROP_GREEN, ColorFacet.PROP_BLUE, ColorFacet.PROP_ALPHA] + ".";
          if (core_1.default.strict) {
            throw new Error(msg);
          } else {
            console.warn(msg);
          }
        }
    }
  }
  return {
    setters: [function(Color_1_1) {
      Color_1 = Color_1_1;
    }, function(core_1_1) {
      core_1 = core_1_1;
    }, function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }, function(GraphicsProgramSymbols_1_1) {
      GraphicsProgramSymbols_1 = GraphicsProgramSymbols_1_1;
    }],
    execute: function() {
      COORD_R = 0;
      COORD_G = 1;
      COORD_B = 2;
      ColorFacet = (function() {
        function ColorFacet() {
          this.color = Color_1.default.fromRGB(1, 1, 1);
          this.a = 1;
          this.uColorName = GraphicsProgramSymbols_1.default.UNIFORM_COLOR;
          this.uAlphaName = GraphicsProgramSymbols_1.default.UNIFORM_ALPHA;
        }
        Object.defineProperty(ColorFacet.prototype, "r", {
          get: function() {
            return this.color.r;
          },
          set: function(red) {
            mustBeNumber_1.default('red', red);
            this.color.r = red;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(ColorFacet.prototype, "g", {
          get: function() {
            return this.color.g;
          },
          set: function(green) {
            mustBeNumber_1.default('green', green);
            this.color.g = green;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(ColorFacet.prototype, "b", {
          get: function() {
            return this.color.b;
          },
          set: function(blue) {
            mustBeNumber_1.default('blue', blue);
            this.color.b = blue;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(ColorFacet.prototype, "α", {
          get: function() {
            return this.a;
          },
          set: function(α) {
            this.a = α;
          },
          enumerable: true,
          configurable: true
        });
        ColorFacet.prototype.scaleRGB = function(α) {
          this.r *= α;
          this.g *= α;
          this.b *= α;
          return this;
        };
        ColorFacet.prototype.scaleRGBA = function(α) {
          this.r *= α;
          this.g *= α;
          this.b *= α;
          this.α *= α;
          return this;
        };
        ColorFacet.prototype.setRGB = function(red, green, blue) {
          this.r = red;
          this.g = green;
          this.b = blue;
          return this;
        };
        ColorFacet.prototype.setRGBA = function(red, green, blue, α) {
          this.r = red;
          this.g = green;
          this.b = blue;
          this.α = α;
          return this;
        };
        ColorFacet.prototype.getProperty = function(name) {
          checkPropertyName(name);
          switch (name) {
            case ColorFacet.PROP_RGB:
              {
                return [this.r, this.g, this.b];
              }
              break;
            case ColorFacet.PROP_RED:
              {
                return [this.r];
              }
              break;
            case ColorFacet.PROP_GREEN:
              {
                return [this.g];
              }
              break;
            default:
              {
                return void 0;
              }
          }
        };
        ColorFacet.prototype.setProperty = function(name, data) {
          checkPropertyName(name);
          switch (name) {
            case ColorFacet.PROP_RGB:
              {
                this.r = data[COORD_R];
                this.g = data[COORD_G];
                this.b = data[COORD_B];
              }
              break;
            case ColorFacet.PROP_RED:
              {
                this.r = data[COORD_R];
              }
              break;
            default:
              {}
          }
          return this;
        };
        ColorFacet.prototype.setUniforms = function(visitor) {
          if (this.uColorName) {
            visitor.vector3(this.uColorName, this.color.coords);
          }
          if (this.uAlphaName) {
            visitor.uniform1f(this.uAlphaName, this.a);
          }
        };
        ColorFacet.PROP_RGB = 'rgb';
        ColorFacet.PROP_RGBA = 'rgba';
        ColorFacet.PROP_RED = 'r';
        ColorFacet.PROP_GREEN = 'g';
        ColorFacet.PROP_BLUE = 'b';
        ColorFacet.PROP_ALPHA = 'a';
        return ColorFacet;
      })();
      exports_1("default", ColorFacet);
    }
  };
});

System.register("davinci-eight/checks/isBoolean.js", [], function(exports_1) {
  function isBoolean(x) {
    return (typeof x === 'boolean');
  }
  exports_1("default", isBoolean);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/checks/mustBeBoolean.js", ["../checks/mustSatisfy", "../checks/isBoolean"], function(exports_1) {
  var mustSatisfy_1,
      isBoolean_1;
  function beBoolean() {
    return "be `boolean`";
  }
  function mustBeBoolean(name, value, contextBuilder) {
    mustSatisfy_1.default(name, isBoolean_1.default(value), beBoolean, contextBuilder);
    return value;
  }
  exports_1("default", mustBeBoolean);
  return {
    setters: [function(mustSatisfy_1_1) {
      mustSatisfy_1 = mustSatisfy_1_1;
    }, function(isBoolean_1_1) {
      isBoolean_1 = isBoolean_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/core/cleanUp.js", [], function(exports_1) {
  function cleanUp(context, consumer) {
    if (context) {
      var gl = context.gl;
      if (gl) {
        if (gl.isContextLost()) {
          consumer.contextLost();
        } else {
          consumer.contextFree(context);
        }
      }
    }
  }
  exports_1("default", cleanUp);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/core/ShareableContextListener.js", ["./cleanUp", "../i18n/readOnly", "./Shareable"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var cleanUp_1,
      readOnly_1,
      Shareable_1;
  var ShareableContextListener;
  return {
    setters: [function(cleanUp_1_1) {
      cleanUp_1 = cleanUp_1_1;
    }, function(readOnly_1_1) {
      readOnly_1 = readOnly_1_1;
    }, function(Shareable_1_1) {
      Shareable_1 = Shareable_1_1;
    }],
    execute: function() {
      ShareableContextListener = (function(_super) {
        __extends(ShareableContextListener, _super);
        function ShareableContextListener(type) {
          _super.call(this, type);
        }
        ShareableContextListener.prototype.destructor = function() {
          this.unsubscribe();
          _super.prototype.destructor.call(this);
        };
        ShareableContextListener.prototype.subscribe = function(visual) {
          if (!this._context) {
            visual.addRef();
            this._context = visual;
            visual.addContextListener(this);
            visual.synchronize(this);
          } else {
            this.unsubscribe();
            this.subscribe(visual);
          }
        };
        ShareableContextListener.prototype.unsubscribe = function() {
          if (this.mirror) {
            cleanUp_1.default(this.mirror, this);
          }
          if (this._context) {
            this._context.removeContextListener(this);
            this._context.release();
            this._context = void 0;
          }
        };
        ShareableContextListener.prototype.contextFree = function(context) {
          this.mirror = void 0;
        };
        ShareableContextListener.prototype.contextGain = function(context) {
          this.mirror = context;
        };
        ShareableContextListener.prototype.contextLost = function() {
          this.mirror = void 0;
        };
        Object.defineProperty(ShareableContextListener.prototype, "gl", {
          get: function() {
            if (this.mirror) {
              return this.mirror.gl;
            } else {
              return void 0;
            }
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('gl').message);
          },
          enumerable: true,
          configurable: true
        });
        return ShareableContextListener;
      })(Shareable_1.default);
      exports_1("default", ShareableContextListener);
    }
  };
});

System.register("davinci-eight/core/Drawable.js", ["../checks/mustBeBoolean", "../i18n/readOnly", "../core/ShareableContextListener"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var mustBeBoolean_1,
      readOnly_1,
      ShareableContextListener_1;
  var Drawable;
  return {
    setters: [function(mustBeBoolean_1_1) {
      mustBeBoolean_1 = mustBeBoolean_1_1;
    }, function(readOnly_1_1) {
      readOnly_1 = readOnly_1_1;
    }, function(ShareableContextListener_1_1) {
      ShareableContextListener_1 = ShareableContextListener_1_1;
    }],
    execute: function() {
      Drawable = (function(_super) {
        __extends(Drawable, _super);
        function Drawable(geometry, material, type) {
          if (type === void 0) {
            type = 'Drawable';
          }
          _super.call(this, type);
          this._visible = true;
          this._geometry = geometry;
          this._geometry.addRef();
          this._material = material;
          this._material.addRef();
          this._facets = {};
        }
        Drawable.prototype.destructor = function() {
          this._geometry.release();
          this._geometry = void 0;
          this._material.release();
          this._material = void 0;
          _super.prototype.destructor.call(this);
        };
        Drawable.prototype.setUniforms = function() {
          var material = this._material;
          var facets = this._facets;
          var keys = Object.keys(facets);
          var keysLength = keys.length;
          for (var i = 0; i < keysLength; i++) {
            var key = keys[i];
            var facet = facets[key];
            facet.setUniforms(material);
          }
        };
        Drawable.prototype.draw = function(ambients) {
          if (this._visible) {
            var material = this._material;
            material.use();
            var iL = ambients.length;
            for (var i = 0; i < iL; i++) {
              var facet = ambients[i];
              facet.setUniforms(material);
            }
            this.setUniforms();
            this._geometry.draw(material);
          }
        };
        Drawable.prototype.contextFree = function(context) {
          this._geometry.contextFree(context);
          this._material.contextFree(context);
        };
        Drawable.prototype.contextGain = function(context) {
          this._geometry.contextGain(context);
          this._material.contextGain(context);
        };
        Drawable.prototype.contextLost = function() {
          this._geometry.contextLost();
          this._material.contextLost();
        };
        Drawable.prototype.getFacet = function(name) {
          return this._facets[name];
        };
        Drawable.prototype.setFacet = function(name, facet) {
          this._facets[name] = facet;
        };
        Object.defineProperty(Drawable.prototype, "geometry", {
          get: function() {
            this._geometry.addRef();
            return this._geometry;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('geometry').message);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Drawable.prototype, "material", {
          get: function() {
            this._material.addRef();
            return this._material;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('material').message);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Drawable.prototype, "visible", {
          get: function() {
            return this._visible;
          },
          set: function(visible) {
            var _this = this;
            mustBeBoolean_1.default('visible', visible, function() {
              return _this._type;
            });
            this._visible = visible;
          },
          enumerable: true,
          configurable: true
        });
        return Drawable;
      })(ShareableContextListener_1.default);
      exports_1("default", Drawable);
    }
  };
});

System.register("davinci-eight/math/quadSpinorE3.js", ["../checks/isDefined", "../checks/isNumber"], function(exports_1) {
  var isDefined_1,
      isNumber_1;
  function quadSpinorE3(s) {
    if (isDefined_1.default(s)) {
      var α = s.α;
      var x = s.yz;
      var y = s.zx;
      var z = s.xy;
      if (isNumber_1.default(α) && isNumber_1.default(x) && isNumber_1.default(y) && isNumber_1.default(z)) {
        return α * α + x * x + y * y + z * z;
      } else {
        return void 0;
      }
    } else {
      return void 0;
    }
  }
  exports_1("default", quadSpinorE3);
  return {
    setters: [function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }, function(isNumber_1_1) {
      isNumber_1 = isNumber_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/math/quadVectorE3.js", ["../math/dotVectorCartesianE3", "../checks/isDefined", "../checks/isNumber"], function(exports_1) {
  var dotVectorCartesianE3_1,
      isDefined_1,
      isNumber_1;
  function quadVectorE3(vector) {
    if (isDefined_1.default(vector)) {
      var x = vector.x;
      var y = vector.y;
      var z = vector.z;
      if (isNumber_1.default(x) && isNumber_1.default(y) && isNumber_1.default(z)) {
        return dotVectorCartesianE3_1.default(x, y, z, x, y, z);
      } else {
        return void 0;
      }
    } else {
      return void 0;
    }
  }
  exports_1("default", quadVectorE3);
  return {
    setters: [function(dotVectorCartesianE3_1_1) {
      dotVectorCartesianE3_1 = dotVectorCartesianE3_1_1;
    }, function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }, function(isNumber_1_1) {
      isNumber_1 = isNumber_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/math/rotorFromDirections.js", [], function(exports_1) {
  var sqrt;
  function rotorFromDirections(a, b, quad, dot, m) {
    var quadA = quad(a);
    var absA = sqrt(quadA);
    var quadB = quad(b);
    var absB = sqrt(quadB);
    var BA = absB * absA;
    var denom = sqrt(2 * (quadB * quadA + BA * dot(b, a)));
    if (denom !== 0) {
      m = m.versor(b, a);
      m = m.addScalar(BA);
      m = m.divByScalar(denom);
      return m;
    } else {
      return void 0;
    }
  }
  exports_1("default", rotorFromDirections);
  return {
    setters: [],
    execute: function() {
      sqrt = Math.sqrt;
    }
  };
});

System.register("davinci-eight/math/Spinor3.js", ["../math/dotVectorCartesianE3", "../math/dotVectorE3", "../checks/mustBeInteger", "../checks/mustBeNumber", "../checks/mustBeObject", "../math/quadSpinorE3", "../math/quadVectorE3", "../math/rotorFromDirections", "../math/VectorN", "../math/wedgeXY", "../math/wedgeYZ", "../math/wedgeZX"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var dotVectorCartesianE3_1,
      dotVectorE3_1,
      mustBeInteger_1,
      mustBeNumber_1,
      mustBeObject_1,
      quadSpinorE3_1,
      quadVectorE3_1,
      rotorFromDirections_1,
      VectorN_1,
      wedgeXY_1,
      wedgeYZ_1,
      wedgeZX_1;
  var COORD_YZ,
      COORD_ZX,
      COORD_XY,
      COORD_SCALAR,
      exp,
      cos,
      sin,
      sqrt,
      Spinor3;
  function one() {
    var coords = [0, 0, 0, 0];
    coords[COORD_SCALAR] = 1;
    return coords;
  }
  return {
    setters: [function(dotVectorCartesianE3_1_1) {
      dotVectorCartesianE3_1 = dotVectorCartesianE3_1_1;
    }, function(dotVectorE3_1_1) {
      dotVectorE3_1 = dotVectorE3_1_1;
    }, function(mustBeInteger_1_1) {
      mustBeInteger_1 = mustBeInteger_1_1;
    }, function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }, function(mustBeObject_1_1) {
      mustBeObject_1 = mustBeObject_1_1;
    }, function(quadSpinorE3_1_1) {
      quadSpinorE3_1 = quadSpinorE3_1_1;
    }, function(quadVectorE3_1_1) {
      quadVectorE3_1 = quadVectorE3_1_1;
    }, function(rotorFromDirections_1_1) {
      rotorFromDirections_1 = rotorFromDirections_1_1;
    }, function(VectorN_1_1) {
      VectorN_1 = VectorN_1_1;
    }, function(wedgeXY_1_1) {
      wedgeXY_1 = wedgeXY_1_1;
    }, function(wedgeYZ_1_1) {
      wedgeYZ_1 = wedgeYZ_1_1;
    }, function(wedgeZX_1_1) {
      wedgeZX_1 = wedgeZX_1_1;
    }],
    execute: function() {
      COORD_YZ = 0;
      COORD_ZX = 1;
      COORD_XY = 2;
      COORD_SCALAR = 3;
      exp = Math.exp;
      cos = Math.cos;
      sin = Math.sin;
      sqrt = Math.sqrt;
      Spinor3 = (function(_super) {
        __extends(Spinor3, _super);
        function Spinor3(coordinates, modified) {
          if (coordinates === void 0) {
            coordinates = one();
          }
          if (modified === void 0) {
            modified = false;
          }
          _super.call(this, coordinates, modified, 4);
        }
        Object.defineProperty(Spinor3.prototype, "yz", {
          get: function() {
            return this.coords[COORD_YZ];
          },
          set: function(yz) {
            mustBeNumber_1.default('yz', yz);
            this.modified = this.modified || this.yz !== yz;
            this.coords[COORD_YZ] = yz;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Spinor3.prototype, "zx", {
          get: function() {
            return this.coords[COORD_ZX];
          },
          set: function(zx) {
            mustBeNumber_1.default('zx', zx);
            this.modified = this.modified || this.zx !== zx;
            this.coords[COORD_ZX] = zx;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Spinor3.prototype, "xy", {
          get: function() {
            return this.coords[COORD_XY];
          },
          set: function(xy) {
            mustBeNumber_1.default('xy', xy);
            this.modified = this.modified || this.xy !== xy;
            this.coords[COORD_XY] = xy;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Spinor3.prototype, "alpha", {
          get: function() {
            return this.coords[COORD_SCALAR];
          },
          set: function(alpha) {
            mustBeNumber_1.default('alpha', alpha);
            this.modified = this.modified || this.alpha !== alpha;
            this.coords[COORD_SCALAR] = alpha;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Spinor3.prototype, "α", {
          get: function() {
            return this.coords[COORD_SCALAR];
          },
          set: function(α) {
            mustBeNumber_1.default('α', α);
            this.modified = this.modified || this.α !== α;
            this.coords[COORD_SCALAR] = α;
          },
          enumerable: true,
          configurable: true
        });
        Spinor3.prototype.add = function(spinor, α) {
          if (α === void 0) {
            α = 1;
          }
          mustBeObject_1.default('spinor', spinor);
          mustBeNumber_1.default('α', α);
          this.yz += spinor.yz * α;
          this.zx += spinor.zx * α;
          this.xy += spinor.xy * α;
          this.α += spinor.α * α;
          return this;
        };
        Spinor3.prototype.add2 = function(a, b) {
          this.α = a.α + b.α;
          this.yz = a.yz + b.yz;
          this.zx = a.zx + b.zx;
          this.xy = a.xy + b.xy;
          return this;
        };
        Spinor3.prototype.addPseudo = function(β) {
          mustBeNumber_1.default('β', β);
          return this;
        };
        Spinor3.prototype.addScalar = function(α) {
          mustBeNumber_1.default('α', α);
          this.α += α;
          return this;
        };
        Spinor3.prototype.adj = function() {
          throw new Error('TODO: Spinor3.adj');
        };
        Spinor3.prototype.angle = function() {
          return this.log().grade(2);
        };
        Spinor3.prototype.clone = function() {
          return Spinor3.copy(this);
        };
        Spinor3.prototype.conj = function() {
          this.yz = -this.yz;
          this.zx = -this.zx;
          this.xy = -this.xy;
          return this;
        };
        Spinor3.prototype.copy = function(spinor) {
          mustBeObject_1.default('spinor', spinor);
          this.yz = mustBeNumber_1.default('spinor.yz', spinor.yz);
          this.zx = mustBeNumber_1.default('spinor.zx', spinor.zx);
          this.xy = mustBeNumber_1.default('spinor.xy', spinor.xy);
          this.α = mustBeNumber_1.default('spinor.α', spinor.α);
          return this;
        };
        Spinor3.prototype.copyScalar = function(α) {
          return this.zero().addScalar(α);
        };
        Spinor3.prototype.copySpinor = function(s) {
          return this.copy(s);
        };
        Spinor3.prototype.copyVector = function(vector) {
          return this.zero();
        };
        Spinor3.prototype.div = function(s) {
          return this.div2(this, s);
        };
        Spinor3.prototype.div2 = function(a, b) {
          var a0 = a.α;
          var a1 = a.yz;
          var a2 = a.zx;
          var a3 = a.xy;
          var b0 = b.α;
          var b1 = b.yz;
          var b2 = b.zx;
          var b3 = b.xy;
          this.α = a0 * b0 - a1 * b1 - a2 * b2 - a3 * b3;
          this.yz = a0 * b1 + a1 * b0 - a2 * b3 + a3 * b2;
          this.zx = a0 * b2 + a1 * b3 + a2 * b0 - a3 * b1;
          this.xy = a0 * b3 - a1 * b2 + a2 * b1 + a3 * b0;
          return this;
        };
        Spinor3.prototype.divByScalar = function(α) {
          this.yz /= α;
          this.zx /= α;
          this.xy /= α;
          this.α /= α;
          return this;
        };
        Spinor3.prototype.dual = function(v) {
          mustBeObject_1.default('v', v);
          this.α = 0;
          this.yz = mustBeNumber_1.default('v.x', v.x);
          this.zx = mustBeNumber_1.default('v.y', v.y);
          this.xy = mustBeNumber_1.default('v.z', v.z);
          return this;
        };
        Spinor3.prototype.exp = function() {
          var w = this.α;
          var x = this.yz;
          var y = this.zx;
          var z = this.xy;
          var expW = exp(w);
          var φ = sqrt(x * x + y * y + z * z);
          var s = expW * (φ !== 0 ? sin(φ) / φ : 1);
          this.α = expW * cos(φ);
          this.yz = x * s;
          this.zx = y * s;
          this.xy = z * s;
          return this;
        };
        Spinor3.prototype.inv = function() {
          this.conj();
          this.divByScalar(this.squaredNormSansUnits());
          return this;
        };
        Spinor3.prototype.lco = function(rhs) {
          return this.lco2(this, rhs);
        };
        Spinor3.prototype.lco2 = function(a, b) {
          return this;
        };
        Spinor3.prototype.lerp = function(target, α) {
          var Vector2 = Spinor3.copy(target);
          var Vector1 = this.clone();
          var R = Vector2.mul(Vector1.inv());
          R.log();
          R.scale(α);
          R.exp();
          this.copy(R);
          return this;
        };
        Spinor3.prototype.lerp2 = function(a, b, α) {
          this.sub2(b, a).scale(α).add(a);
          return this;
        };
        Spinor3.prototype.log = function() {
          var w = this.α;
          var x = this.yz;
          var y = this.zx;
          var z = this.xy;
          var bb = x * x + y * y + z * z;
          var Vector2 = sqrt(bb);
          var R0 = Math.abs(w);
          var R = sqrt(w * w + bb);
          this.α = Math.log(R);
          var θ = Math.atan2(Vector2, R0) / Vector2;
          this.yz = x * θ;
          this.zx = y * θ;
          this.xy = z * θ;
          return this;
        };
        Spinor3.prototype.magnitude = function() {
          return this.norm();
        };
        Spinor3.prototype.magnitudeSansUnits = function() {
          return sqrt(this.squaredNormSansUnits());
        };
        Spinor3.prototype.mul = function(s) {
          return this.mul2(this, s);
        };
        Spinor3.prototype.mul2 = function(a, b) {
          var a0 = a.α;
          var a1 = a.yz;
          var a2 = a.zx;
          var a3 = a.xy;
          var b0 = b.α;
          var b1 = b.yz;
          var b2 = b.zx;
          var b3 = b.xy;
          this.α = a0 * b0 - a1 * b1 - a2 * b2 - a3 * b3;
          this.yz = a0 * b1 + a1 * b0 - a2 * b3 + a3 * b2;
          this.zx = a0 * b2 + a1 * b3 + a2 * b0 - a3 * b1;
          this.xy = a0 * b3 - a1 * b2 + a2 * b1 + a3 * b0;
          return this;
        };
        Spinor3.prototype.neg = function() {
          this.α = -this.α;
          this.yz = -this.yz;
          this.zx = -this.zx;
          this.xy = -this.xy;
          return this;
        };
        Spinor3.prototype.norm = function() {
          var norm = this.magnitudeSansUnits();
          return this.zero().addScalar(norm);
        };
        Spinor3.prototype.direction = function() {
          var modulus = this.magnitudeSansUnits();
          this.yz = this.yz / modulus;
          this.zx = this.zx / modulus;
          this.xy = this.xy / modulus;
          this.α = this.α / modulus;
          return this;
        };
        Spinor3.prototype.one = function() {
          this.α = 1;
          this.yz = 0;
          this.zx = 0;
          this.xy = 0;
          return this;
        };
        Spinor3.prototype.quad = function() {
          return this.squaredNorm();
        };
        Spinor3.prototype.squaredNorm = function() {
          var squaredNorm = this.squaredNormSansUnits();
          return this.zero().addScalar(squaredNorm);
        };
        Spinor3.prototype.squaredNormSansUnits = function() {
          return quadSpinorE3_1.default(this);
        };
        Spinor3.prototype.rco = function(rhs) {
          return this.rco2(this, rhs);
        };
        Spinor3.prototype.rco2 = function(a, b) {
          return this;
        };
        Spinor3.prototype.rev = function() {
          this.yz *= -1;
          this.zx *= -1;
          this.xy *= -1;
          return this;
        };
        Spinor3.prototype.reflect = function(n) {
          var w = this.α;
          var yz = this.yz;
          var zx = this.zx;
          var xy = this.xy;
          var nx = n.x;
          var ny = n.y;
          var nz = n.z;
          var nn = nx * nx + ny * ny + nz * nz;
          var nB = nx * yz + ny * zx + nz * xy;
          this.α = nn * w;
          this.xy = 2 * nz * nB - nn * xy;
          this.yz = 2 * nx * nB - nn * yz;
          this.zx = 2 * ny * nB - nn * zx;
          return this;
        };
        Spinor3.prototype.rotate = function(rotor) {
          console.warn("Spinor3.rotate is not implemented");
          return this;
        };
        Spinor3.prototype.rotorFromDirections = function(a, b) {
          return rotorFromDirections_1.default(a, b, quadVectorE3_1.default, dotVectorE3_1.default, this);
        };
        Spinor3.prototype.rotorFromAxisAngle = function(axis, θ) {
          var φ = θ / 2;
          var s = sin(φ);
          this.yz = -axis.x * s;
          this.zx = -axis.y * s;
          this.xy = -axis.z * s;
          this.α = cos(φ);
          return this;
        };
        Spinor3.prototype.rotorFromGeneratorAngle = function(B, θ) {
          var φ = θ / 2;
          var s = sin(φ);
          this.yz = -B.yz * s;
          this.zx = -B.zx * s;
          this.xy = -B.xy * s;
          this.α = cos(φ);
          return this;
        };
        Spinor3.prototype.scp = function(rhs) {
          return this.scp2(this, rhs);
        };
        Spinor3.prototype.scp2 = function(a, b) {
          return this;
        };
        Spinor3.prototype.scale = function(α) {
          mustBeNumber_1.default('α', α);
          this.yz *= α;
          this.zx *= α;
          this.xy *= α;
          this.α *= α;
          return this;
        };
        Spinor3.prototype.slerp = function(target, α) {
          var Vector2 = Spinor3.copy(target);
          var Vector1 = this.clone();
          var R = Vector2.mul(Vector1.inv());
          R.log();
          R.scale(α);
          R.exp();
          this.copy(R);
          return this;
        };
        Spinor3.prototype.sub = function(s, α) {
          if (α === void 0) {
            α = 1;
          }
          mustBeObject_1.default('s', s);
          mustBeNumber_1.default('α', α);
          this.yz -= s.yz * α;
          this.zx -= s.zx * α;
          this.xy -= s.xy * α;
          this.α -= s.α * α;
          return this;
        };
        Spinor3.prototype.sub2 = function(a, b) {
          this.yz = a.yz - b.yz;
          this.zx = a.zx - b.zx;
          this.xy = a.xy - b.xy;
          this.α = a.α - b.α;
          return this;
        };
        Spinor3.prototype.versor = function(a, b) {
          var ax = a.x;
          var ay = a.y;
          var az = a.z;
          var bx = b.x;
          var by = b.y;
          var bz = b.z;
          this.α = dotVectorCartesianE3_1.default(ax, ay, az, bx, by, bz);
          this.yz = wedgeYZ_1.default(ax, ay, az, bx, by, bz);
          this.zx = wedgeZX_1.default(ax, ay, az, bx, by, bz);
          this.xy = wedgeXY_1.default(ax, ay, az, bx, by, bz);
          return this;
        };
        Spinor3.prototype.grade = function(grade) {
          mustBeInteger_1.default('grade', grade);
          switch (grade) {
            case 0:
              {
                this.yz = 0;
                this.zx = 0;
                this.xy = 0;
              }
              break;
            case 2:
              {
                this.α = 0;
              }
              break;
            default:
              {
                this.α = 0;
                this.yz = 0;
                this.zx = 0;
                this.xy = 0;
              }
          }
          return this;
        };
        Spinor3.prototype.toExponential = function() {
          return this.toString();
        };
        Spinor3.prototype.toFixed = function(digits) {
          return this.toString();
        };
        Spinor3.prototype.toString = function() {
          return "Spinor3({yz: " + this.yz + ", zx: " + this.zx + ", xy: " + this.xy + ", w: " + this.α + "})";
        };
        Spinor3.prototype.ext = function(rhs) {
          return this.ext2(this, rhs);
        };
        Spinor3.prototype.ext2 = function(a, b) {
          return this;
        };
        Spinor3.prototype.zero = function() {
          this.α = 0;
          this.yz = 0;
          this.zx = 0;
          this.xy = 0;
          return this;
        };
        Spinor3.copy = function(spinor) {
          return new Spinor3().copy(spinor);
        };
        Spinor3.dual = function(v) {
          return new Spinor3().dual(v);
        };
        Spinor3.lerp = function(a, b, α) {
          return Spinor3.copy(a).lerp(b, α);
        };
        Spinor3.rotorFromDirections = function(a, b) {
          return new Spinor3().rotorFromDirections(a, b);
        };
        return Spinor3;
      })(VectorN_1.default);
      exports_1("default", Spinor3);
    }
  };
});

System.register("davinci-eight/facets/ModelE3.js", ["../math/Vector3", "../math/Spinor3", "../i18n/readOnly"], function(exports_1) {
  var Vector3_1,
      Spinor3_1,
      readOnly_1;
  var ModelE3;
  return {
    setters: [function(Vector3_1_1) {
      Vector3_1 = Vector3_1_1;
    }, function(Spinor3_1_1) {
      Spinor3_1 = Spinor3_1_1;
    }, function(readOnly_1_1) {
      readOnly_1 = readOnly_1_1;
    }],
    execute: function() {
      'use strict';
      ModelE3 = (function() {
        function ModelE3() {
          this._position = new Vector3_1.default().zero();
          this._attitude = new Spinor3_1.default().zero().addScalar(1);
          this._posCache = new Vector3_1.default();
          this._attCache = new Spinor3_1.default();
          this._position.modified = true;
          this._attitude.modified = true;
        }
        Object.defineProperty(ModelE3.prototype, "R", {
          get: function() {
            return this._attitude;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default(ModelE3.PROP_ATTITUDE).message);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(ModelE3.prototype, "X", {
          get: function() {
            return this._position;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default(ModelE3.PROP_POSITION).message);
          },
          enumerable: true,
          configurable: true
        });
        ModelE3.prototype.getProperty = function(name) {
          switch (name) {
            case ModelE3.PROP_ATTITUDE:
              {
                return this._attCache.copy(this._attitude).coords;
              }
              break;
            case ModelE3.PROP_POSITION:
              {
                return this._posCache.copy(this._position).coords;
              }
              break;
            default:
              {
                console.warn("ModelE3.getProperty " + name);
                return void 0;
              }
          }
        };
        ModelE3.prototype.setProperty = function(name, data) {
          switch (name) {
            case ModelE3.PROP_ATTITUDE:
              {
                this._attCache.coords = data;
                this._attitude.copy(this._attCache);
              }
              break;
            case ModelE3.PROP_POSITION:
              {
                this._posCache.coords = data;
                this._position.copy(this._posCache);
              }
              break;
            default:
              {
                console.warn("ModelE3.setProperty " + name);
              }
          }
          return this;
        };
        ModelE3.PROP_ATTITUDE = 'R';
        ModelE3.PROP_POSITION = 'X';
        return ModelE3;
      })();
      exports_1("default", ModelE3);
    }
  };
});

System.register("davinci-eight/math/dotVectorCartesianE3.js", [], function(exports_1) {
  function dotVectorCartesianE3(ax, ay, az, bx, by, bz) {
    return ax * bx + ay * by + az * bz;
  }
  exports_1("default", dotVectorCartesianE3);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/math/dotVectorE3.js", ["../math/dotVectorCartesianE3", "../checks/isDefined"], function(exports_1) {
  var dotVectorCartesianE3_1,
      isDefined_1;
  function dotVectorE3(a, b) {
    if (isDefined_1.default(a) && isDefined_1.default(b)) {
      return dotVectorCartesianE3_1.default(a.x, a.y, a.z, b.x, b.y, b.z);
    } else {
      return void 0;
    }
  }
  exports_1("default", dotVectorE3);
  return {
    setters: [function(dotVectorCartesianE3_1_1) {
      dotVectorCartesianE3_1 = dotVectorCartesianE3_1_1;
    }, function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/math/add3x3.js", [], function(exports_1) {
  function default_1(a, b, c) {
    var a11 = a[0x0],
        a12 = a[0x3],
        a13 = a[0x6];
    var a21 = a[0x1],
        a22 = a[0x4],
        a23 = a[0x7];
    var a31 = a[0x2],
        a32 = a[0x5],
        a33 = a[0x8];
    var b11 = b[0x0],
        b12 = b[0x3],
        b13 = b[0x6];
    var b21 = b[0x1],
        b22 = b[0x4],
        b23 = b[0x7];
    var b31 = b[0x2],
        b32 = b[0x5],
        b33 = b[0x8];
    c[0x0] = a11 + b11;
    c[0x3] = a12 + b12;
    c[0x6] = a13 + b13;
    c[0x1] = a21 + b21;
    c[0x4] = a22 + b22;
    c[0x7] = a23 + b23;
    c[0x2] = a31 + b31;
    c[0x5] = a32 + b32;
    c[0x8] = a33 + b33;
    return c;
  }
  exports_1("default", default_1);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/math/det3x3.js", [], function(exports_1) {
  function default_1(m) {
    var m00 = m[0x0],
        m01 = m[0x3],
        m02 = m[0x6];
    var m10 = m[0x1],
        m11 = m[0x4],
        m12 = m[0x7];
    var m20 = m[0x2],
        m21 = m[0x5],
        m22 = m[0x8];
    return m00 * m11 * m22 + m01 * m12 * m20 + m02 * m10 * m21 - m00 * m12 * m21 - m01 * m10 * m22 - m02 * m11 * m20;
  }
  exports_1("default", default_1);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/math/inv3x3.js", ["../math/det3x3"], function(exports_1) {
  var det3x3_1;
  function inv3x3(m, te) {
    var det = det3x3_1.default(m);
    var m11 = m[0x0],
        m12 = m[0x3],
        m13 = m[0x6];
    var m21 = m[0x1],
        m22 = m[0x4],
        m23 = m[0x7];
    var m31 = m[0x2],
        m32 = m[0x5],
        m33 = m[0x8];
    var o11 = m22 * m33 - m23 * m32;
    var o12 = m13 * m32 - m12 * m33;
    var o13 = m12 * m23 - m13 * m22;
    var o21 = m23 * m31 - m21 * m33;
    var o22 = m11 * m33 - m13 * m31;
    var o23 = m13 * m21 - m11 * m23;
    var o31 = m21 * m32 - m22 * m31;
    var o32 = m12 * m31 - m11 * m32;
    var o33 = m11 * m22 - m12 * m21;
    var α = 1 / det;
    te[0x0] = o11 * α;
    te[0x3] = o12 * α;
    te[0x6] = o13 * α;
    te[0x1] = o21 * α;
    te[0x4] = o22 * α;
    te[0x7] = o23 * α;
    te[0x2] = o31 * α;
    te[0x5] = o32 * α;
    te[0x8] = o33 * α;
  }
  exports_1("default", inv3x3);
  return {
    setters: [function(det3x3_1_1) {
      det3x3_1 = det3x3_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/math/mul3x3.js", [], function(exports_1) {
  function mul3x3(a, b, c) {
    var a11 = a[0x0],
        a12 = a[0x3],
        a13 = a[0x6];
    var a21 = a[0x1],
        a22 = a[0x4],
        a23 = a[0x7];
    var a31 = a[0x2],
        a32 = a[0x5],
        a33 = a[0x8];
    var b11 = b[0x0],
        b12 = b[0x3],
        b13 = b[0x6];
    var b21 = b[0x1],
        b22 = b[0x4],
        b23 = b[0x7];
    var b31 = b[0x2],
        b32 = b[0x5],
        b33 = b[0x8];
    c[0x0] = a11 * b11 + a12 * b21 + a13 * b31;
    c[0x3] = a11 * b12 + a12 * b22 + a13 * b32;
    c[0x6] = a11 * b13 + a12 * b23 + a13 * b33;
    c[0x1] = a21 * b11 + a22 * b21 + a23 * b31;
    c[0x4] = a21 * b12 + a22 * b22 + a23 * b32;
    c[0x7] = a21 * b13 + a22 * b23 + a23 * b33;
    c[0x2] = a31 * b11 + a32 * b21 + a33 * b31;
    c[0x5] = a31 * b12 + a32 * b22 + a33 * b32;
    c[0x8] = a31 * b13 + a32 * b23 + a33 * b33;
    return c;
  }
  exports_1("default", mul3x3);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/math/Matrix3.js", ["../math/AbstractMatrix", "../math/add3x3", "../math/det3x3", "../math/inv3x3", "../math/mul3x3", "../checks/mustBeNumber"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var AbstractMatrix_1,
      add3x3_1,
      det3x3_1,
      inv3x3_1,
      mul3x3_1,
      mustBeNumber_1;
  var Matrix3;
  return {
    setters: [function(AbstractMatrix_1_1) {
      AbstractMatrix_1 = AbstractMatrix_1_1;
    }, function(add3x3_1_1) {
      add3x3_1 = add3x3_1_1;
    }, function(det3x3_1_1) {
      det3x3_1 = det3x3_1_1;
    }, function(inv3x3_1_1) {
      inv3x3_1 = inv3x3_1_1;
    }, function(mul3x3_1_1) {
      mul3x3_1 = mul3x3_1_1;
    }, function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }],
    execute: function() {
      Matrix3 = (function(_super) {
        __extends(Matrix3, _super);
        function Matrix3(elements) {
          _super.call(this, elements, 3);
        }
        Matrix3.prototype.add = function(rhs) {
          return this.add2(this, rhs);
        };
        Matrix3.prototype.add2 = function(a, b) {
          add3x3_1.default(a.elements, b.elements, this.elements);
          return this;
        };
        Matrix3.prototype.clone = function() {
          return Matrix3.zero().copy(this);
        };
        Matrix3.prototype.det = function() {
          return det3x3_1.default(this.elements);
        };
        Matrix3.prototype.getInverse = function(matrix, throwOnInvertible) {
          var me = matrix.elements;
          var te = this.elements;
          te[0] = me[10] * me[5] - me[6] * me[9];
          te[1] = -me[10] * me[1] + me[2] * me[9];
          te[2] = me[6] * me[1] - me[2] * me[5];
          te[3] = -me[10] * me[4] + me[6] * me[8];
          te[4] = me[10] * me[0] - me[2] * me[8];
          te[5] = -me[6] * me[0] + me[2] * me[4];
          te[6] = me[9] * me[4] - me[5] * me[8];
          te[7] = -me[9] * me[0] + me[1] * me[8];
          te[8] = me[5] * me[0] - me[1] * me[4];
          var det = me[0] * te[0] + me[1] * te[3] + me[2] * te[6];
          if (det === 0) {
            var msg = "Matrix3.getInverse(): can't invert matrix, determinant is 0";
            if (throwOnInvertible || !throwOnInvertible) {
              throw new Error(msg);
            } else {
              console.warn(msg);
            }
            this.one();
            return this;
          }
          this.scale(1.0 / det);
          return this;
        };
        Matrix3.prototype.inv = function() {
          inv3x3_1.default(this.elements, this.elements);
          return this;
        };
        Matrix3.prototype.isOne = function() {
          var te = this.elements;
          var m11 = te[0x0],
              m12 = te[0x3],
              m13 = te[0x6];
          var m21 = te[0x1],
              m22 = te[0x4],
              m23 = te[0x7];
          var m31 = te[0x2],
              m32 = te[0x5],
              m33 = te[0x8];
          return (m11 === 1 && m12 === 0 && m13 === 0 && m21 === 0 && m22 === 1 && m23 === 0 && m31 === 0 && m32 === 0 && m33 === 1);
        };
        Matrix3.prototype.isZero = function() {
          var te = this.elements;
          var m11 = te[0x0],
              m12 = te[0x3],
              m13 = te[0x6];
          var m21 = te[0x1],
              m22 = te[0x4],
              m23 = te[0x7];
          var m31 = te[0x2],
              m32 = te[0x5],
              m33 = te[0x8];
          return (m11 === 0 && m12 === 0 && m13 === 0 && m21 === 0 && m22 === 0 && m23 === 0 && m31 === 0 && m32 === 0 && m33 === 0);
        };
        Matrix3.prototype.mul = function(rhs) {
          return this.mul2(this, rhs);
        };
        Matrix3.prototype.mul2 = function(a, b) {
          mul3x3_1.default(a.elements, b.elements, this.elements);
          return this;
        };
        Matrix3.prototype.neg = function() {
          return this.scale(-1);
        };
        Matrix3.prototype.normalFromMatrix4 = function(m) {
          return this.getInverse(m).transpose();
        };
        Matrix3.prototype.one = function() {
          return this.set(1, 0, 0, 0, 1, 0, 0, 0, 1);
        };
        Matrix3.prototype.reflection = function(n) {
          var nx = mustBeNumber_1.default('n.x', n.x);
          var ny = mustBeNumber_1.default('n.y', n.y);
          var aa = -2 * nx * ny;
          var xx = 1 - 2 * nx * nx;
          var yy = 1 - 2 * ny * ny;
          this.set(xx, aa, 0, aa, yy, 0, 0, 0, 1);
          return this;
        };
        Matrix3.prototype.row = function(i) {
          var te = this.elements;
          return [te[0 + i], te[3 + i], te[6 + i]];
        };
        Matrix3.prototype.scale = function(s) {
          var m = this.elements;
          m[0] *= s;
          m[3] *= s;
          m[6] *= s;
          m[1] *= s;
          m[4] *= s;
          m[7] *= s;
          m[2] *= s;
          m[5] *= s;
          m[8] *= s;
          return this;
        };
        Matrix3.prototype.set = function(n11, n12, n13, n21, n22, n23, n31, n32, n33) {
          var te = this.elements;
          te[0] = n11;
          te[3] = n12;
          te[6] = n13;
          te[1] = n21;
          te[4] = n22;
          te[7] = n23;
          te[2] = n31;
          te[5] = n32;
          te[8] = n33;
          return this;
        };
        Matrix3.prototype.sub = function(rhs) {
          var te = this.elements;
          var t11 = te[0];
          var t21 = te[1];
          var t31 = te[2];
          var t12 = te[3];
          var t22 = te[4];
          var t32 = te[5];
          var t13 = te[6];
          var t23 = te[7];
          var t33 = te[5];
          var re = rhs.elements;
          var r11 = re[0];
          var r21 = re[1];
          var r31 = re[2];
          var r12 = re[3];
          var r22 = re[4];
          var r32 = re[5];
          var r13 = re[6];
          var r23 = re[7];
          var r33 = re[8];
          var m11 = t11 - r11;
          var m21 = t21 - r21;
          var m31 = t31 - r31;
          var m12 = t12 - r12;
          var m22 = t22 - r22;
          var m32 = t32 - r32;
          var m13 = t13 - r13;
          var m23 = t23 - r23;
          var m33 = t33 - r33;
          return this.set(m11, m12, m13, m21, m22, m23, m31, m32, m33);
        };
        Matrix3.prototype.toString = function() {
          var text = [];
          for (var i = 0; i < this.dimensions; i++) {
            text.push(this.row(i).map(function(element, index) {
              return element.toString();
            }).join(' '));
          }
          return text.join('\n');
        };
        Matrix3.prototype.translation = function(d) {
          var x = d.x;
          var y = d.y;
          return this.set(1, 0, x, 0, 1, y, 0, 0, 1);
        };
        Matrix3.prototype.transpose = function() {
          var tmp;
          var m = this.elements;
          tmp = m[1];
          m[1] = m[3];
          m[3] = tmp;
          tmp = m[2];
          m[2] = m[6];
          m[6] = tmp;
          tmp = m[5];
          m[5] = m[7];
          m[7] = tmp;
          return this;
        };
        Matrix3.prototype.zero = function() {
          return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
        };
        Matrix3.prototype.__add__ = function(rhs) {
          if (rhs instanceof Matrix3) {
            return this.clone().add(rhs);
          } else {
            return void 0;
          }
        };
        Matrix3.prototype.__radd__ = function(lhs) {
          if (lhs instanceof Matrix3) {
            return lhs.clone().add(this);
          } else {
            return void 0;
          }
        };
        Matrix3.prototype.__mul__ = function(rhs) {
          if (rhs instanceof Matrix3) {
            return this.clone().mul(rhs);
          } else if (typeof rhs === 'number') {
            return this.clone().scale(rhs);
          } else {
            return void 0;
          }
        };
        Matrix3.prototype.__rmul__ = function(lhs) {
          if (lhs instanceof Matrix3) {
            return lhs.clone().mul(this);
          } else if (typeof lhs === 'number') {
            return this.clone().scale(lhs);
          } else {
            return void 0;
          }
        };
        Matrix3.prototype.__pos__ = function() {
          return this.clone();
        };
        Matrix3.prototype.__neg__ = function() {
          return this.clone().scale(-1);
        };
        Matrix3.prototype.__sub__ = function(rhs) {
          if (rhs instanceof Matrix3) {
            return this.clone().sub(rhs);
          } else {
            return void 0;
          }
        };
        Matrix3.prototype.__rsub__ = function(lhs) {
          if (lhs instanceof Matrix3) {
            return lhs.clone().sub(this);
          } else {
            return void 0;
          }
        };
        Matrix3.one = function() {
          return new Matrix3(new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]));
        };
        Matrix3.reflection = function(n) {
          return Matrix3.zero().reflection(n);
        };
        Matrix3.zero = function() {
          return new Matrix3(new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0]));
        };
        return Matrix3;
      })(AbstractMatrix_1.default);
      exports_1("default", Matrix3);
    }
  };
});

System.register("davinci-eight/checks/expectArg.js", ["../checks/isUndefined", "../checks/mustBeNumber"], function(exports_1) {
  var isUndefined_1,
      mustBeNumber_1;
  function message(standard, override) {
    return isUndefined_1.default(override) ? standard : override();
  }
  function expectArg(name, value) {
    var arg = {
      toSatisfy: function(condition, message) {
        if (isUndefined_1.default(condition)) {
          throw new Error("condition must be specified");
        }
        if (isUndefined_1.default(message)) {
          throw new Error("message must be specified");
        }
        if (!condition) {
          throw new Error(message);
        }
        return arg;
      },
      toBeBoolean: function(override) {
        var typeOfValue = typeof value;
        if (typeOfValue !== 'boolean') {
          throw new Error(message("Expecting argument " + name + ": " + typeOfValue + " to be a boolean.", override));
        }
        return arg;
      },
      toBeDefined: function() {
        var typeOfValue = typeof value;
        if (typeOfValue === 'undefined') {
          var message_1 = "Expecting argument " + name + ": " + typeOfValue + " to be defined.";
          throw new Error(message_1);
        }
        return arg;
      },
      toBeInClosedInterval: function(lower, upper) {
        var something = value;
        var x = something;
        mustBeNumber_1.default('x', x);
        if (x >= lower && x <= upper) {
          return arg;
        } else {
          var message_2 = "Expecting argument " + name + " => " + value + " to be in the range [" + lower + ", " + upper + "].";
          throw new Error(message_2);
        }
      },
      toBeFunction: function() {
        var typeOfValue = typeof value;
        if (typeOfValue !== 'function') {
          var message_3 = "Expecting argument " + name + ": " + typeOfValue + " to be a function.";
          throw new Error(message_3);
        }
        return arg;
      },
      toBeNumber: function(override) {
        var typeOfValue = typeof value;
        if (typeOfValue !== 'number') {
          throw new Error(message("Expecting argument " + name + ": " + typeOfValue + " to be a number.", override));
        }
        return arg;
      },
      toBeObject: function(override) {
        var typeOfValue = typeof value;
        if (typeOfValue !== 'object') {
          throw new Error(message("Expecting argument " + name + ": " + typeOfValue + " to be an object.", override));
        }
        return arg;
      },
      toBeString: function() {
        var typeOfValue = typeof value;
        if (typeOfValue !== 'string') {
          var message_4 = "Expecting argument " + name + ": " + typeOfValue + " to be a string.";
          throw new Error(message_4);
        }
        return arg;
      },
      toBeUndefined: function() {
        var typeOfValue = typeof value;
        if (typeOfValue !== 'undefined') {
          var message_5 = "Expecting argument " + name + ": " + typeOfValue + " to be undefined.";
          throw new Error(message_5);
        }
        return arg;
      },
      toNotBeNull: function() {
        if (value === null) {
          var message_6 = "Expecting argument " + name + " to not be null.";
          throw new Error(message_6);
        } else {
          return arg;
        }
      },
      get value() {
        return value;
      }
    };
    return arg;
  }
  exports_1("default", expectArg);
  return {
    setters: [function(isUndefined_1_1) {
      isUndefined_1 = isUndefined_1_1;
    }, function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/math/AbstractMatrix.js", ["../checks/mustBeDefined", "../checks/mustBeInteger", "../checks/expectArg", "../i18n/readOnly"], function(exports_1) {
  var mustBeDefined_1,
      mustBeInteger_1,
      expectArg_1,
      readOnly_1;
  var AbstractMatrix;
  return {
    setters: [function(mustBeDefined_1_1) {
      mustBeDefined_1 = mustBeDefined_1_1;
    }, function(mustBeInteger_1_1) {
      mustBeInteger_1 = mustBeInteger_1_1;
    }, function(expectArg_1_1) {
      expectArg_1 = expectArg_1_1;
    }, function(readOnly_1_1) {
      readOnly_1 = readOnly_1_1;
    }],
    execute: function() {
      AbstractMatrix = (function() {
        function AbstractMatrix(elements, dimensions) {
          this._elements = mustBeDefined_1.default('elements', elements);
          this._dimensions = mustBeInteger_1.default('dimensions', dimensions);
          this._length = dimensions * dimensions;
          expectArg_1.default('elements', elements).toSatisfy(elements.length === this._length, 'elements must have length ' + this._length);
          this.modified = false;
        }
        Object.defineProperty(AbstractMatrix.prototype, "elements", {
          get: function() {
            if (this._elements) {
              return this._elements;
            } else if (this._callback) {
              var elements = this._callback();
              expectArg_1.default('callback()', elements).toSatisfy(elements.length === this._length, "callback() length must be " + this._length);
              return this._callback();
            } else {
              throw new Error("Matrix" + Math.sqrt(this._length) + " is undefined.");
            }
          },
          set: function(elements) {
            expectArg_1.default('elements', elements).toSatisfy(elements.length === this._length, "elements length must be " + this._length);
            this._elements = elements;
            this._callback = void 0;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(AbstractMatrix.prototype, "callback", {
          get: function() {
            return this._callback;
          },
          set: function(reactTo) {
            this._callback = reactTo;
            this._elements = void 0;
          },
          enumerable: true,
          configurable: true
        });
        AbstractMatrix.prototype.copy = function(m) {
          this.elements.set(m.elements);
          return this;
        };
        Object.defineProperty(AbstractMatrix.prototype, "dimensions", {
          get: function() {
            return this._dimensions;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('dimensions').message);
          },
          enumerable: true,
          configurable: true
        });
        return AbstractMatrix;
      })();
      exports_1("default", AbstractMatrix);
    }
  };
});

System.register("davinci-eight/math/add4x4.js", [], function(exports_1) {
  function add4x4(a, b, c) {
    var a11 = a[0x0],
        a12 = a[0x4],
        a13 = a[0x8],
        a14 = a[0xC];
    var a21 = a[0x1],
        a22 = a[0x5],
        a23 = a[0x9],
        a24 = a[0xD];
    var a31 = a[0x2],
        a32 = a[0x6],
        a33 = a[0xA],
        a34 = a[0xE];
    var a41 = a[0x3],
        a42 = a[0x7],
        a43 = a[0xB],
        a44 = a[0xF];
    var b11 = b[0x0],
        b12 = b[0x4],
        b13 = b[0x8],
        b14 = b[0xC];
    var b21 = b[0x1],
        b22 = b[0x5],
        b23 = b[0x9],
        b24 = b[0xD];
    var b31 = b[0x2],
        b32 = b[0x6],
        b33 = b[0xA],
        b34 = b[0xE];
    var b41 = b[0x3],
        b42 = b[0x7],
        b43 = b[0xB],
        b44 = b[0xF];
    c[0x0] = a11 + b11;
    c[0x4] = a12 + b12;
    c[0x8] = a13 + b13;
    c[0xC] = a14 + b14;
    c[0x1] = a21 + b21;
    c[0x5] = a22 + b22;
    c[0x9] = a23 + b23;
    c[0xD] = a24 + b24;
    c[0x2] = a31 + b31;
    c[0x6] = a32 + b32;
    c[0xA] = a33 + b33;
    c[0xE] = a34 + b34;
    c[0x3] = a41 + b41;
    c[0x7] = a42 + b42;
    c[0xB] = a43 + b43;
    c[0xF] = a44 + b44;
    return c;
  }
  exports_1("default", add4x4);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/math/inv4x4.js", [], function(exports_1) {
  function inv4x4(src, dest) {
    var n11 = src[0x0],
        n12 = src[0x4],
        n13 = src[0x8],
        n14 = src[0xC];
    var n21 = src[0x1],
        n22 = src[0x5],
        n23 = src[0x9],
        n24 = src[0xD];
    var n31 = src[0x2],
        n32 = src[0x6],
        n33 = src[0xA],
        n34 = src[0xE];
    var n41 = src[0x3],
        n42 = src[0x7],
        n43 = src[0xB],
        n44 = src[0xF];
    var o11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44;
    var o12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44;
    var o13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44;
    var o14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;
    var o21 = n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44;
    var o22 = n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44;
    var o23 = n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44;
    var o24 = n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34;
    var o31 = n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44;
    var o32 = n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44;
    var o33 = n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44;
    var o34 = n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34;
    var o41 = n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43;
    var o42 = n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43;
    var o43 = n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43;
    var o44 = n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33;
    var det = n11 * o11 + n21 * o12 + n31 * o13 + n41 * o14;
    var α = 1 / det;
    dest[0x0] = o11 * α;
    dest[0x4] = o12 * α;
    dest[0x8] = o13 * α;
    dest[0xC] = o14 * α;
    dest[0x1] = o21 * α;
    dest[0x5] = o22 * α;
    dest[0x9] = o23 * α;
    dest[0xD] = o24 * α;
    dest[0x2] = o31 * α;
    dest[0x6] = o32 * α;
    dest[0xA] = o33 * α;
    dest[0xE] = o34 * α;
    dest[0x3] = o41 * α;
    dest[0x7] = o42 * α;
    dest[0xB] = o43 * α;
    dest[0xF] = o44 * α;
  }
  exports_1("default", inv4x4);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/math/mul4x4.js", [], function(exports_1) {
  function mul4x4(a, b, c) {
    var a11 = a[0x0],
        a12 = a[0x4],
        a13 = a[0x8],
        a14 = a[0xC];
    var a21 = a[0x1],
        a22 = a[0x5],
        a23 = a[0x9],
        a24 = a[0xD];
    var a31 = a[0x2],
        a32 = a[0x6],
        a33 = a[0xA],
        a34 = a[0xE];
    var a41 = a[0x3],
        a42 = a[0x7],
        a43 = a[0xB],
        a44 = a[0xF];
    var b11 = b[0x0],
        b12 = b[0x4],
        b13 = b[0x8],
        b14 = b[0xC];
    var b21 = b[0x1],
        b22 = b[0x5],
        b23 = b[0x9],
        b24 = b[0xD];
    var b31 = b[0x2],
        b32 = b[0x6],
        b33 = b[0xA],
        b34 = b[0xE];
    var b41 = b[0x3],
        b42 = b[0x7],
        b43 = b[0xB],
        b44 = b[0xF];
    c[0x0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
    c[0x4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
    c[0x8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
    c[0xC] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
    c[0x1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
    c[0x5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
    c[0x9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
    c[0xD] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
    c[0x2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
    c[0x6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
    c[0xA] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
    c[0xE] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
    c[0x3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
    c[0x7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
    c[0xB] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
    c[0xF] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
    return c;
  }
  exports_1("default", mul4x4);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/math/Matrix4.js", ["../math/AbstractMatrix", "../math/add4x4", "../math/inv4x4", "../math/mul4x4"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var AbstractMatrix_1,
      add4x4_1,
      inv4x4_1,
      mul4x4_1;
  var Matrix4;
  return {
    setters: [function(AbstractMatrix_1_1) {
      AbstractMatrix_1 = AbstractMatrix_1_1;
    }, function(add4x4_1_1) {
      add4x4_1 = add4x4_1_1;
    }, function(inv4x4_1_1) {
      inv4x4_1 = inv4x4_1_1;
    }, function(mul4x4_1_1) {
      mul4x4_1 = mul4x4_1_1;
    }],
    execute: function() {
      Matrix4 = (function(_super) {
        __extends(Matrix4, _super);
        function Matrix4(elements) {
          _super.call(this, elements, 4);
        }
        Matrix4.one = function() {
          return new Matrix4(new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]));
        };
        Matrix4.zero = function() {
          return new Matrix4(new Float32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]));
        };
        Matrix4.scaling = function(scale) {
          return Matrix4.one().scaling(scale);
        };
        Matrix4.translation = function(vector) {
          return Matrix4.one().translation(vector);
        };
        Matrix4.rotation = function(spinor) {
          return Matrix4.one().rotation(spinor);
        };
        Matrix4.prototype.add = function(rhs) {
          return this.add2(this, rhs);
        };
        Matrix4.prototype.add2 = function(a, b) {
          add4x4_1.default(a.elements, b.elements, this.elements);
          return this;
        };
        Matrix4.prototype.clone = function() {
          return Matrix4.zero().copy(this);
        };
        Matrix4.prototype.compose = function(scale, attitude, position) {
          this.scaling(scale);
          this.rotate(attitude);
          this.translate(position);
          return this;
        };
        Matrix4.prototype.copy = function(m) {
          this.elements.set(m.elements);
          return this;
        };
        Matrix4.prototype.det = function() {
          var te = this.elements;
          var n11 = te[0],
              n12 = te[4],
              n13 = te[8],
              n14 = te[12];
          var n21 = te[1],
              n22 = te[5],
              n23 = te[9],
              n24 = te[13];
          var n31 = te[2],
              n32 = te[6],
              n33 = te[10],
              n34 = te[14];
          var n41 = te[3],
              n42 = te[7],
              n43 = te[11],
              n44 = te[15];
          var n1122 = n11 * n22;
          var n1123 = n11 * n23;
          var n1124 = n11 * n24;
          var n1221 = n12 * n21;
          var n1223 = n12 * n23;
          var n1224 = n12 * n24;
          var n1321 = n13 * n21;
          var n1322 = n13 * n22;
          var n1324 = n13 * n24;
          var n1421 = n14 * n21;
          var n1422 = n14 * n22;
          var n1423 = n14 * n23;
          return n41 * ((n1423 - n1324) * n32 + (n1224 - n1422) * n33 + (n1322 - n1223) * n34) + n42 * ((n1324 - n1423) * n31 + (n1421 - n1124) * n33 + (n1123 - n1321) * n34) + n43 * ((n1422 - n1224) * n31 + (n1124 - n1421) * n32 + (n1221 - n1122) * n34) + n44 * ((n1223 - n1322) * n31 + (n1321 - n1123) * n32 + (n1122 - n1221) * n33);
        };
        Matrix4.prototype.inv = function() {
          inv4x4_1.default(this.elements, this.elements);
          return this;
        };
        Matrix4.prototype.invert = function(m) {
          inv4x4_1.default(m.elements, this.elements);
          return this;
        };
        Matrix4.prototype.one = function() {
          return this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        };
        Matrix4.prototype.scale = function(s) {
          var te = this.elements;
          te[0] *= s;
          te[4] *= s;
          te[8] *= s;
          te[12] *= s;
          te[1] *= s;
          te[5] *= s;
          te[9] *= s;
          te[13] *= s;
          te[2] *= s;
          te[6] *= s;
          te[10] *= s;
          te[14] *= s;
          te[3] *= s;
          te[7] *= s;
          te[11] *= s;
          te[15] *= s;
          return this;
        };
        Matrix4.prototype.transpose = function() {
          var te = this.elements;
          var tmp;
          tmp = te[1];
          te[1] = te[4];
          te[4] = tmp;
          tmp = te[2];
          te[2] = te[8];
          te[8] = tmp;
          tmp = te[6];
          te[6] = te[9];
          te[9] = tmp;
          tmp = te[3];
          te[3] = te[12];
          te[12] = tmp;
          tmp = te[7];
          te[7] = te[13];
          te[13] = tmp;
          tmp = te[11];
          te[11] = te[14];
          te[14] = tmp;
          return this;
        };
        Matrix4.prototype.frustum = function(left, right, bottom, top, near, far) {
          var te = this.elements;
          var x = 2 * near / (right - left);
          var y = 2 * near / (top - bottom);
          var a = (right + left) / (right - left);
          var b = (top + bottom) / (top - bottom);
          var c = -(far + near) / (far - near);
          var d = -2 * far * near / (far - near);
          te[0] = x;
          te[4] = 0;
          te[8] = a;
          te[12] = 0;
          te[1] = 0;
          te[5] = y;
          te[9] = b;
          te[13] = 0;
          te[2] = 0;
          te[6] = 0;
          te[10] = c;
          te[14] = d;
          te[3] = 0;
          te[7] = 0;
          te[11] = -1;
          te[15] = 0;
          return this;
        };
        Matrix4.prototype.rotationAxis = function(axis, angle) {
          var c = Math.cos(angle);
          var s = Math.sin(angle);
          var t = 1 - c;
          var x = axis.x,
              y = axis.y,
              z = axis.z;
          var tx = t * x,
              ty = t * y;
          return this.set(tx * x + c, tx * y - s * z, tx * z + s * y, 0, tx * y + s * z, ty * y + c, ty * z - s * x, 0, tx * z - s * y, ty * z + s * x, t * z * z + c, 0, 0, 0, 0, 1);
        };
        Matrix4.prototype.mul = function(rhs) {
          return this.mul2(this, rhs);
        };
        Matrix4.prototype.mul2 = function(a, b) {
          mul4x4_1.default(a.elements, b.elements, this.elements);
          return this;
        };
        Matrix4.prototype.rmul = function(lhs) {
          return this.mul2(lhs, this);
        };
        Matrix4.prototype.reflection = function(n) {
          var nx = n.x;
          var ny = n.y;
          var nz = n.z;
          var aa = -2 * nx * ny;
          var cc = -2 * ny * nz;
          var bb = -2 * nz * nx;
          var xx = 1 - 2 * nx * nx;
          var yy = 1 - 2 * ny * ny;
          var zz = 1 - 2 * nz * nz;
          this.set(xx, aa, bb, 0, aa, yy, cc, 0, bb, cc, zz, 0, 0, 0, 0, 1);
          return this;
        };
        Matrix4.prototype.rotate = function(spinor) {
          return this.rmul(Matrix4.rotation(spinor));
        };
        Matrix4.prototype.rotation = function(spinor) {
          var x = -spinor.yz;
          var y = -spinor.zx;
          var z = -spinor.xy;
          var α = spinor.α;
          var x2 = x + x;
          var y2 = y + y;
          var z2 = z + z;
          var xx = x * x2;
          var xy = x * y2;
          var xz = x * z2;
          var yy = y * y2;
          var yz = y * z2;
          var zz = z * z2;
          var wx = α * x2;
          var wy = α * y2;
          var wz = α * z2;
          this.set(1 - yy - zz, xy - wz, xz + wy, 0, xy + wz, 1 - xx - zz, yz - wx, 0, xz - wy, yz + wx, 1 - xx - yy, 0, 0, 0, 0, 1);
          return this;
        };
        Matrix4.prototype.row = function(i) {
          var te = this.elements;
          return [te[0 + i], te[4 + i], te[8 + i], te[12 + i]];
        };
        Matrix4.prototype.scaleXYZ = function(scale) {
          return this.rmul(Matrix4.scaling(scale));
        };
        Matrix4.prototype.scaling = function(scale) {
          return this.set(scale.x, 0, 0, 0, 0, scale.y, 0, 0, 0, 0, scale.z, 0, 0, 0, 0, 1);
        };
        Matrix4.prototype.set = function(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {
          var te = this.elements;
          te[0x0] = n11;
          te[0x4] = n12;
          te[0x8] = n13;
          te[0xC] = n14;
          te[0x1] = n21;
          te[0x5] = n22;
          te[0x9] = n23;
          te[0xD] = n24;
          te[0x2] = n31;
          te[0x6] = n32;
          te[0xA] = n33;
          te[0xE] = n34;
          te[0x3] = n41;
          te[0x7] = n42;
          te[0xB] = n43;
          te[0xF] = n44;
          return this;
        };
        Matrix4.prototype.toFixed = function(digits) {
          var text = [];
          for (var i = 0; i < this.dimensions; i++) {
            text.push(this.row(i).map(function(element, index) {
              return element.toFixed(digits);
            }).join(' '));
          }
          return text.join('\n');
        };
        Matrix4.prototype.toString = function() {
          var text = [];
          for (var i = 0; i < this.dimensions; i++) {
            text.push(this.row(i).map(function(element, index) {
              return element.toString();
            }).join(' '));
          }
          return text.join('\n');
        };
        Matrix4.prototype.translate = function(d) {
          return this.rmul(Matrix4.translation(d));
        };
        Matrix4.prototype.translation = function(d) {
          var x = d.x;
          var y = d.y;
          var z = d.z;
          return this.set(1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1);
        };
        Matrix4.prototype.zero = function() {
          return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
        };
        Matrix4.prototype.__mul__ = function(rhs) {
          if (rhs instanceof Matrix4) {
            return Matrix4.one().mul2(this, rhs);
          } else if (typeof rhs === 'number') {
            return this.clone().scale(rhs);
          } else {
            return void 0;
          }
        };
        Matrix4.prototype.__rmul__ = function(lhs) {
          if (lhs instanceof Matrix4) {
            return Matrix4.one().mul2(lhs, this);
          } else if (typeof lhs === 'number') {
            return this.clone().scale(lhs);
          } else {
            return void 0;
          }
        };
        return Matrix4;
      })(AbstractMatrix_1.default);
      exports_1("default", Matrix4);
    }
  };
});

System.register("davinci-eight/checks/isArray.js", [], function(exports_1) {
  function isArray(x) {
    return Object.prototype.toString.call(x) === '[object Array]';
  }
  exports_1("default", isArray);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/checks/mustBeArray.js", ["../checks/mustSatisfy", "../checks/isArray"], function(exports_1) {
  var mustSatisfy_1,
      isArray_1;
  function beAnArray() {
    return "be an array";
  }
  function default_1(name, value, contextBuilder) {
    mustSatisfy_1.default(name, isArray_1.default(value), beAnArray, contextBuilder);
    return value;
  }
  exports_1("default", default_1);
  return {
    setters: [function(mustSatisfy_1_1) {
      mustSatisfy_1 = mustSatisfy_1_1;
    }, function(isArray_1_1) {
      isArray_1 = isArray_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/math/stringFromCoordinates.js", ["../checks/isDefined", "../checks/mustBeArray"], function(exports_1) {
  var isDefined_1,
      mustBeArray_1;
  function isLabelOne(label) {
    if (typeof label === 'string') {
      return label === "1";
    } else {
      var labels = mustBeArray_1.default('label', label);
      if (labels.length === 2) {
        return isLabelOne(labels[0]) && isLabelOne(labels[1]);
      } else if (labels.length === 1) {
        return isLabelOne(labels[0]);
      } else {
        return false;
      }
    }
  }
  function appendLabel(coord, label, sb) {
    if (typeof label === 'string') {
      sb.push(label);
    } else {
      var labels = mustBeArray_1.default('label', label);
      if (labels.length === 2) {
        sb.push(coord > 0 ? labels[1] : labels[0]);
      } else if (labels.length === 1) {
        sb.push(labels[0]);
      } else if (labels.length === 0) {} else {
        throw new Error("Unexpected basis label array length: " + labels.length);
      }
    }
  }
  function appendCoord(coord, numberToString, label, sb) {
    if (coord !== 0) {
      if (coord >= 0) {
        if (sb.length > 0) {
          sb.push("+");
        }
      } else {
        if (typeof label === 'string') {
          sb.push("-");
        } else {
          var labels = mustBeArray_1.default('label', label);
          if (labels.length === 2) {
            if (labels[0] !== labels[1]) {
              if (sb.length > 0) {
                sb.push("+");
              }
            } else {
              sb.push("-");
            }
          } else if (labels.length === 1) {
            sb.push("-");
          } else {
            sb.push("-");
          }
        }
      }
      var n = Math.abs(coord);
      if (n === 1) {
        appendLabel(coord, label, sb);
      } else {
        sb.push(numberToString(n));
        if (!isLabelOne(label)) {
          sb.push("*");
          appendLabel(coord, label, sb);
        } else {}
      }
    } else {}
  }
  function stringFromCoordinates(coordinates, numberToString, labels) {
    var sb = [];
    for (var i = 0,
        iLength = coordinates.length; i < iLength; i++) {
      var coord = coordinates[i];
      if (isDefined_1.default(coord)) {
        appendCoord(coord, numberToString, labels[i], sb);
      } else {
        return void 0;
      }
    }
    return sb.length > 0 ? sb.join("") : "0";
  }
  exports_1("default", stringFromCoordinates);
  return {
    setters: [function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }, function(mustBeArray_1_1) {
      mustBeArray_1 = mustBeArray_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/math/toStringCustom.js", ["../math/stringFromCoordinates"], function(exports_1) {
  var stringFromCoordinates_1;
  function toStringCustom(coordinates, uom, coordToString, labels) {
    var quantityString = stringFromCoordinates_1.default(coordinates, coordToString, labels);
    if (uom) {
      var unitString = uom.toString().trim();
      if (unitString) {
        return quantityString + ' ' + unitString;
      } else {
        return quantityString;
      }
    } else {
      return quantityString;
    }
  }
  exports_1("default", toStringCustom);
  return {
    setters: [function(stringFromCoordinates_1_1) {
      stringFromCoordinates_1 = stringFromCoordinates_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/checks/isUndefined.js", [], function(exports_1) {
  function isUndefined(arg) {
    return (typeof arg === 'undefined');
  }
  exports_1("default", isUndefined);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/math/VectorN.js", ["../checks/isDefined", "../checks/isUndefined", "../checks/mustSatisfy"], function(exports_1) {
  var isDefined_1,
      isUndefined_1,
      mustSatisfy_1;
  var VectorN;
  function pushString(T) {
    return "push(value: " + T + "): number";
  }
  function popString(T) {
    return "pop(): " + T;
  }
  function verboten(operation) {
    return operation + " is not allowed for a fixed size vector";
  }
  function verbotenPush() {
    return verboten(pushString('T'));
  }
  function verbotenPop() {
    return verboten(popString('T'));
  }
  return {
    setters: [function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }, function(isUndefined_1_1) {
      isUndefined_1 = isUndefined_1_1;
    }, function(mustSatisfy_1_1) {
      mustSatisfy_1 = mustSatisfy_1_1;
    }],
    execute: function() {
      VectorN = (function() {
        function VectorN(data, modified, size) {
          if (modified === void 0) {
            modified = false;
          }
          this.modified = modified;
          if (isDefined_1.default(size)) {
            this._size = size;
            this._data = data;
            mustSatisfy_1.default('data.length', data.length === size, function() {
              return "" + size;
            });
          } else {
            this._size = void 0;
            this._data = data;
          }
        }
        Object.defineProperty(VectorN.prototype, "coords", {
          get: function() {
            if (this._data) {
              return this._data;
            } else if (this._callback) {
              return this._callback();
            } else {
              throw new Error("Vector" + this._size + " is undefined.");
            }
          },
          set: function(data) {
            this._data = data;
            this._callback = void 0;
            this.modified = true;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(VectorN.prototype, "callback", {
          get: function() {
            return this._callback;
          },
          set: function(reactTo) {
            this._callback = reactTo;
            this._data = void 0;
            this.modified = true;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(VectorN.prototype, "length", {
          get: function() {
            return this.coords.length;
          },
          enumerable: true,
          configurable: true
        });
        VectorN.prototype.clone = function() {
          return new VectorN(this._data, this.modified, this._size);
        };
        VectorN.prototype.getComponent = function(index) {
          return this.coords[index];
        };
        VectorN.prototype.pop = function() {
          if (isUndefined_1.default(this._size)) {
            return this.coords.pop();
          } else {
            throw new Error(verbotenPop());
          }
        };
        VectorN.prototype.push = function(value) {
          if (isUndefined_1.default(this._size)) {
            var data = this.coords;
            var newLength = data.push(value);
            this.coords = data;
            return newLength;
          } else {
            throw new Error(verbotenPush());
          }
        };
        VectorN.prototype.setComponent = function(index, value) {
          var coords = this.coords;
          var previous = coords[index];
          if (value !== previous) {
            coords[index] = value;
            this.coords = coords;
            this.modified = true;
          }
        };
        VectorN.prototype.toArray = function(array, offset) {
          if (array === void 0) {
            array = [];
          }
          if (offset === void 0) {
            offset = 0;
          }
          var data = this.coords;
          var length = data.length;
          for (var i = 0; i < length; i++) {
            array[offset + i] = data[i];
          }
          return array;
        };
        VectorN.prototype.toLocaleString = function() {
          return this.coords.toLocaleString();
        };
        VectorN.prototype.toString = function() {
          return this.coords.toString();
        };
        return VectorN;
      })();
      exports_1("default", VectorN);
    }
  };
});

System.register("davinci-eight/math/wedgeXY.js", [], function(exports_1) {
  function wedgeXY(ax, ay, az, bx, by, bz) {
    return ax * by - ay * bx;
  }
  exports_1("default", wedgeXY);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/math/wedgeYZ.js", [], function(exports_1) {
  function wedgeYZ(ax, ay, az, bx, by, bz) {
    return ay * bz - az * by;
  }
  exports_1("default", wedgeYZ);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/math/wedgeZX.js", [], function(exports_1) {
  function wedgeZX(ax, ay, az, bx, by, bz) {
    return az * bx - ax * bz;
  }
  exports_1("default", wedgeZX);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/math/Vector3.js", ["./dotVectorE3", "./Matrix3", "./Matrix4", "../checks/isDefined", "../checks/isNumber", "./toStringCustom", "./VectorN", "./wedgeXY", "./wedgeYZ", "./wedgeZX"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var dotVectorE3_1,
      Matrix3_1,
      Matrix4_1,
      isDefined_1,
      isNumber_1,
      toStringCustom_1,
      VectorN_1,
      wedgeXY_1,
      wedgeYZ_1,
      wedgeZX_1;
  var sqrt,
      COORD_X,
      COORD_Y,
      COORD_Z,
      BASIS_LABELS,
      Vector3;
  function coordinates(m) {
    return [m.x, m.y, m.z];
  }
  return {
    setters: [function(dotVectorE3_1_1) {
      dotVectorE3_1 = dotVectorE3_1_1;
    }, function(Matrix3_1_1) {
      Matrix3_1 = Matrix3_1_1;
    }, function(Matrix4_1_1) {
      Matrix4_1 = Matrix4_1_1;
    }, function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }, function(isNumber_1_1) {
      isNumber_1 = isNumber_1_1;
    }, function(toStringCustom_1_1) {
      toStringCustom_1 = toStringCustom_1_1;
    }, function(VectorN_1_1) {
      VectorN_1 = VectorN_1_1;
    }, function(wedgeXY_1_1) {
      wedgeXY_1 = wedgeXY_1_1;
    }, function(wedgeYZ_1_1) {
      wedgeYZ_1 = wedgeYZ_1_1;
    }, function(wedgeZX_1_1) {
      wedgeZX_1 = wedgeZX_1_1;
    }],
    execute: function() {
      sqrt = Math.sqrt;
      COORD_X = 0;
      COORD_Y = 1;
      COORD_Z = 2;
      BASIS_LABELS = ['e1', 'e2', 'e3'];
      Vector3 = (function(_super) {
        __extends(Vector3, _super);
        function Vector3(data, modified) {
          if (data === void 0) {
            data = [0, 0, 0];
          }
          if (modified === void 0) {
            modified = false;
          }
          _super.call(this, data, modified, 3);
        }
        Vector3.dot = function(a, b) {
          return a.x * b.x + a.y * b.y + a.z * b.z;
        };
        Object.defineProperty(Vector3.prototype, "x", {
          get: function() {
            return this.coords[COORD_X];
          },
          set: function(value) {
            this.modified = this.modified || this.x !== value;
            this.coords[COORD_X] = value;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Vector3.prototype, "y", {
          get: function() {
            return this.coords[COORD_Y];
          },
          set: function(value) {
            this.modified = this.modified || this.y !== value;
            this.coords[COORD_Y] = value;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Vector3.prototype, "z", {
          get: function() {
            return this.coords[COORD_Z];
          },
          set: function(value) {
            this.modified = this.modified || this.z !== value;
            this.coords[COORD_Z] = value;
          },
          enumerable: true,
          configurable: true
        });
        Vector3.prototype.add = function(vector, α) {
          if (α === void 0) {
            α = 1;
          }
          this.x += vector.x * α;
          this.y += vector.y * α;
          this.z += vector.z * α;
          return this;
        };
        Vector3.prototype.add2 = function(a, b) {
          this.x = a.x + b.x;
          this.y = a.y + b.y;
          this.z = a.z + b.z;
          return this;
        };
        Vector3.prototype.applyMatrix = function(m) {
          var x = this.x;
          var y = this.y;
          var z = this.z;
          var e = m.elements;
          this.x = e[0x0] * x + e[0x3] * y + e[0x6] * z;
          this.y = e[0x1] * x + e[0x4] * y + e[0x7] * z;
          this.z = e[0x2] * x + e[0x5] * y + e[0x8] * z;
          return this;
        };
        Vector3.prototype.applyMatrix4 = function(m) {
          var x = this.x,
              y = this.y,
              z = this.z;
          var e = m.elements;
          this.x = e[0x0] * x + e[0x4] * y + e[0x8] * z + e[0xC];
          this.y = e[0x1] * x + e[0x5] * y + e[0x9] * z + e[0xD];
          this.z = e[0x2] * x + e[0x6] * y + e[0xA] * z + e[0xE];
          return this;
        };
        Vector3.prototype.reflect = function(n) {
          var ax = this.x;
          var ay = this.y;
          var az = this.z;
          var nx = n.x;
          var ny = n.y;
          var nz = n.z;
          var dot2 = (ax * nx + ay * ny + az * nz) * 2;
          this.x = ax - dot2 * nx;
          this.y = ay - dot2 * ny;
          this.z = az - dot2 * nz;
          return this;
        };
        Vector3.prototype.rotate = function(R) {
          var x = this.x;
          var y = this.y;
          var z = this.z;
          var a = R.xy;
          var b = R.yz;
          var c = R.zx;
          var w = R.α;
          var ix = w * x - c * z + a * y;
          var iy = w * y - a * x + b * z;
          var iz = w * z - b * y + c * x;
          var iw = b * x + c * y + a * z;
          this.x = ix * w + iw * b + iy * a - iz * c;
          this.y = iy * w + iw * c + iz * b - ix * a;
          this.z = iz * w + iw * a + ix * c - iy * b;
          return this;
        };
        Vector3.prototype.clone = function() {
          return new Vector3([this.x, this.y, this.z]);
        };
        Vector3.prototype.copy = function(v) {
          this.x = v.x;
          this.y = v.y;
          this.z = v.z;
          return this;
        };
        Vector3.prototype.copyCoordinates = function(coordinates) {
          this.x = coordinates[COORD_X];
          this.y = coordinates[COORD_Y];
          this.z = coordinates[COORD_Z];
          return this;
        };
        Vector3.prototype.cross = function(v) {
          return this.cross2(this, v);
        };
        Vector3.prototype.cross2 = function(a, b) {
          var ax = a.x,
              ay = a.y,
              az = a.z;
          var bx = b.x,
              by = b.y,
              bz = b.z;
          this.x = wedgeYZ_1.default(ax, ay, az, bx, by, bz);
          this.y = wedgeZX_1.default(ax, ay, az, bx, by, bz);
          this.z = wedgeXY_1.default(ax, ay, az, bx, by, bz);
          return this;
        };
        Vector3.prototype.distanceTo = function(point) {
          if (isDefined_1.default(point)) {
            return sqrt(this.quadranceTo(point));
          } else {
            return void 0;
          }
        };
        Vector3.prototype.quadranceTo = function(point) {
          if (isDefined_1.default(point)) {
            var dx = this.x - point.x;
            var dy = this.y - point.y;
            var dz = this.z - point.z;
            return dx * dx + dy * dy + dz * dz;
          } else {
            return void 0;
          }
        };
        Vector3.prototype.divByScalar = function(α) {
          if (α !== 0) {
            var invScalar = 1 / α;
            this.x *= invScalar;
            this.y *= invScalar;
            this.z *= invScalar;
          } else {
            this.x = 0;
            this.y = 0;
            this.z = 0;
          }
          return this;
        };
        Vector3.prototype.dot = function(v) {
          return Vector3.dot(this, v);
        };
        Vector3.prototype.magnitude = function() {
          return sqrt(this.squaredNorm());
        };
        Vector3.prototype.neg = function() {
          this.x = -this.x;
          this.y = -this.y;
          this.z = -this.z;
          return this;
        };
        Vector3.prototype.lerp = function(target, α) {
          this.x += (target.x - this.x) * α;
          this.y += (target.y - this.y) * α;
          this.z += (target.z - this.z) * α;
          return this;
        };
        Vector3.prototype.lerp2 = function(a, b, α) {
          this.copy(a).lerp(b, α);
          return this;
        };
        Vector3.prototype.direction = function() {
          return this.divByScalar(this.magnitude());
        };
        Vector3.prototype.scale = function(α) {
          this.x *= α;
          this.y *= α;
          this.z *= α;
          return this;
        };
        Vector3.prototype.setXYZ = function(x, y, z) {
          this.x = x;
          this.y = y;
          this.z = z;
          return this;
        };
        Vector3.prototype.setY = function(y) {
          this.y = y;
          return this;
        };
        Vector3.prototype.slerp = function(target, α) {
          return this;
        };
        Vector3.prototype.squaredNorm = function() {
          return dotVectorE3_1.default(this, this);
        };
        Vector3.prototype.sub = function(v, α) {
          if (α === void 0) {
            α = 1;
          }
          this.x -= v.x * α;
          this.y -= v.y * α;
          this.z -= v.z * α;
          return this;
        };
        Vector3.prototype.sub2 = function(a, b) {
          this.x = a.x - b.x;
          this.y = a.y - b.y;
          this.z = a.z - b.z;
          return this;
        };
        Vector3.prototype.toExponential = function() {
          var coordToString = function(coord) {
            return coord.toExponential();
          };
          return toStringCustom_1.default(coordinates(this), void 0, coordToString, BASIS_LABELS);
        };
        Vector3.prototype.toFixed = function(digits) {
          var coordToString = function(coord) {
            return coord.toFixed(digits);
          };
          return toStringCustom_1.default(coordinates(this), void 0, coordToString, BASIS_LABELS);
        };
        Vector3.prototype.toString = function() {
          var coordToString = function(coord) {
            return coord.toString();
          };
          return toStringCustom_1.default(coordinates(this), void 0, coordToString, BASIS_LABELS);
        };
        Vector3.prototype.zero = function() {
          this.x = 0;
          this.y = 0;
          this.z = 0;
          return this;
        };
        Vector3.prototype.__add__ = function(rhs) {
          if (rhs instanceof Vector3) {
            return this.clone().add(rhs, 1.0);
          } else {
            return void 0;
          }
        };
        Vector3.prototype.__sub__ = function(rhs) {
          if (rhs instanceof Vector3) {
            return this.clone().sub(rhs);
          } else {
            return void 0;
          }
        };
        Vector3.prototype.__mul__ = function(rhs) {
          if (isNumber_1.default(rhs)) {
            return this.clone().scale(rhs);
          } else {
            return void 0;
          }
        };
        Vector3.prototype.__rmul__ = function(lhs) {
          if (typeof lhs === 'number') {
            return this.clone().scale(lhs);
          } else if (lhs instanceof Matrix3_1.default) {
            var m33 = lhs;
            return this.clone().applyMatrix(m33);
          } else if (lhs instanceof Matrix4_1.default) {
            var m44 = lhs;
            return this.clone().applyMatrix4(m44);
          } else {
            return void 0;
          }
        };
        Vector3.copy = function(vector) {
          return new Vector3([vector.x, vector.y, vector.z]);
        };
        Vector3.lerp = function(a, b, α) {
          return Vector3.copy(b).sub(a).scale(α).add(a);
        };
        Vector3.random = function() {
          return new Vector3([Math.random(), Math.random(), Math.random()]);
        };
        Vector3.vector = function(x, y, z, uom) {
          var v = new Vector3([x, y, z]);
          v.uom = uom;
          return v;
        };
        return Vector3;
      })(VectorN_1.default);
      exports_1("default", Vector3);
    }
  };
});

System.register("davinci-eight/core/GraphicsProgramSymbols.js", [], function(exports_1) {
  var GraphicsProgramSymbols;
  return {
    setters: [],
    execute: function() {
      GraphicsProgramSymbols = (function() {
        function GraphicsProgramSymbols() {}
        GraphicsProgramSymbols.ATTRIBUTE_COLOR = 'aColor';
        GraphicsProgramSymbols.ATTRIBUTE_GEOMETRY_INDEX = 'aGeometryIndex';
        GraphicsProgramSymbols.ATTRIBUTE_NORMAL = 'aNormal';
        GraphicsProgramSymbols.ATTRIBUTE_POSITION = 'aPosition';
        GraphicsProgramSymbols.ATTRIBUTE_TEXTURE_COORDS = 'aTextureCoords';
        GraphicsProgramSymbols.UNIFORM_ALPHA = 'uAlpha';
        GraphicsProgramSymbols.UNIFORM_AMBIENT_LIGHT = 'uAmbientLight';
        GraphicsProgramSymbols.UNIFORM_COLOR = 'uColor';
        GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR = 'uDirectionalLightColor';
        GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_DIRECTION = 'uDirectionalLightDirection';
        GraphicsProgramSymbols.UNIFORM_POINT_LIGHT_COLOR = 'uPointLightColor';
        GraphicsProgramSymbols.UNIFORM_POINT_LIGHT_POSITION = 'uPointLightPosition';
        GraphicsProgramSymbols.UNIFORM_POINT_SIZE = 'uPointSize';
        GraphicsProgramSymbols.UNIFORM_PROJECTION_MATRIX = 'uProjection';
        GraphicsProgramSymbols.UNIFORM_REFLECTION_ONE_MATRIX = 'uReflectionOne';
        GraphicsProgramSymbols.UNIFORM_REFLECTION_TWO_MATRIX = 'uReflectionTwo';
        GraphicsProgramSymbols.UNIFORM_MODEL_MATRIX = 'uModel';
        GraphicsProgramSymbols.UNIFORM_NORMAL_MATRIX = 'uNormal';
        GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX = 'uView';
        GraphicsProgramSymbols.VARYING_COLOR = 'vColor';
        GraphicsProgramSymbols.VARYING_LIGHT = 'vLight';
        return GraphicsProgramSymbols;
      })();
      exports_1("default", GraphicsProgramSymbols);
    }
  };
});

System.register("davinci-eight/facets/ModelFacet.js", ["../math/Matrix3", "../math/Matrix4", "./ModelE3", "../checks/mustBeArray", "../checks/mustBeString", "../math/Vector3", "../i18n/readOnly", "../core/GraphicsProgramSymbols"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Matrix3_1,
      Matrix4_1,
      ModelE3_1,
      mustBeArray_1,
      mustBeString_1,
      Vector3_1,
      readOnly_1,
      GraphicsProgramSymbols_1;
  var ModelFacet;
  return {
    setters: [function(Matrix3_1_1) {
      Matrix3_1 = Matrix3_1_1;
    }, function(Matrix4_1_1) {
      Matrix4_1 = Matrix4_1_1;
    }, function(ModelE3_1_1) {
      ModelE3_1 = ModelE3_1_1;
    }, function(mustBeArray_1_1) {
      mustBeArray_1 = mustBeArray_1_1;
    }, function(mustBeString_1_1) {
      mustBeString_1 = mustBeString_1_1;
    }, function(Vector3_1_1) {
      Vector3_1 = Vector3_1_1;
    }, function(readOnly_1_1) {
      readOnly_1 = readOnly_1_1;
    }, function(GraphicsProgramSymbols_1_1) {
      GraphicsProgramSymbols_1 = GraphicsProgramSymbols_1_1;
    }],
    execute: function() {
      ModelFacet = (function(_super) {
        __extends(ModelFacet, _super);
        function ModelFacet() {
          _super.call(this);
          this._scaleXYZ = new Vector3_1.default([1, 1, 1]);
          this._matM = Matrix4_1.default.one();
          this._matN = Matrix3_1.default.one();
          this.matR = Matrix4_1.default.one();
          this.matS = Matrix4_1.default.one();
          this.matT = Matrix4_1.default.one();
          this.X.modified = true;
          this.R.modified = true;
          this._scaleXYZ.modified = true;
        }
        Object.defineProperty(ModelFacet.prototype, "scale", {
          get: function() {
            return this._scaleXYZ;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default(ModelFacet.PROP_SCALEXYZ).message);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(ModelFacet.prototype, "matrix", {
          get: function() {
            return this._matM;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('matrix').message);
          },
          enumerable: true,
          configurable: true
        });
        ModelFacet.prototype.setUniforms = function(visitor) {
          this.updateMatrices();
          visitor.mat4(GraphicsProgramSymbols_1.default.UNIFORM_MODEL_MATRIX, this._matM, false);
          visitor.mat3(GraphicsProgramSymbols_1.default.UNIFORM_NORMAL_MATRIX, this._matN, false);
        };
        ModelFacet.prototype.updateMatrices = function() {
          var modified = false;
          if (this.X.modified) {
            this.matT.translation(this.X);
            this.X.modified = false;
            modified = true;
          }
          if (this.R.modified) {
            this.matR.rotation(this.R);
            this.R.modified = false;
            modified = true;
          }
          if (this.scale.modified) {
            this.matS.scaling(this.scale);
            this.scale.modified = false;
            modified = true;
          }
          if (modified) {
            this._matM.copy(this.matT).mul(this.matR).mul(this.matS);
            this._matN.normalFromMatrix4(this._matM);
          }
        };
        ModelFacet.prototype.setProperty = function(name, data) {
          mustBeString_1.default('name', name);
          mustBeArray_1.default('data', data);
          _super.prototype.setProperty.call(this, name, data);
          return this;
        };
        ModelFacet.PROP_SCALEXYZ = 'scaleXYZ';
        return ModelFacet;
      })(ModelE3_1.default);
      exports_1("default", ModelFacet);
    }
  };
});

System.register("davinci-eight/core/Mesh.js", ["../facets/ColorFacet", "./Drawable", "../facets/ModelFacet", "../i18n/readOnly"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var ColorFacet_1,
      Drawable_1,
      ModelFacet_1,
      readOnly_1;
  var COLOR_FACET_NAME,
      MODEL_FACET_NAME,
      Mesh;
  return {
    setters: [function(ColorFacet_1_1) {
      ColorFacet_1 = ColorFacet_1_1;
    }, function(Drawable_1_1) {
      Drawable_1 = Drawable_1_1;
    }, function(ModelFacet_1_1) {
      ModelFacet_1 = ModelFacet_1_1;
    }, function(readOnly_1_1) {
      readOnly_1 = readOnly_1_1;
    }],
    execute: function() {
      COLOR_FACET_NAME = 'color';
      MODEL_FACET_NAME = 'model';
      Mesh = (function(_super) {
        __extends(Mesh, _super);
        function Mesh(geometry, material, type) {
          if (type === void 0) {
            type = 'Mesh';
          }
          _super.call(this, geometry, material, type);
          var modelFacet = new ModelFacet_1.default();
          this.setFacet(MODEL_FACET_NAME, modelFacet);
          var colorFacet = new ColorFacet_1.default();
          this.setFacet(COLOR_FACET_NAME, colorFacet);
        }
        Mesh.prototype.destructor = function() {
          _super.prototype.destructor.call(this);
        };
        Object.defineProperty(Mesh.prototype, "attitude", {
          get: function() {
            var facet = this.getFacet(MODEL_FACET_NAME);
            if (facet) {
              return facet.R;
            } else {
              return void 0;
            }
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('attitude').message);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Mesh.prototype, "color", {
          get: function() {
            var facet = this.getFacet(COLOR_FACET_NAME);
            if (facet) {
              return facet.color;
            } else {
              return void 0;
            }
          },
          set: function(color) {
            var facet = this.getFacet(COLOR_FACET_NAME);
            if (facet) {
              facet.color.copy(color);
            } else {}
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Mesh.prototype, "matrix", {
          get: function() {
            return this.getFacet(MODEL_FACET_NAME).matrix;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('modelMatrix').message);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Mesh.prototype, "position", {
          get: function() {
            var facet = this.getFacet(MODEL_FACET_NAME);
            if (facet) {
              return facet.X;
            } else {
              return void 0;
            }
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('position').message);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(Mesh.prototype, "scale", {
          get: function() {
            var facet = this.getFacet(MODEL_FACET_NAME);
            if (facet) {
              return facet.scale;
            } else {
              return void 0;
            }
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('scale').message);
          },
          enumerable: true,
          configurable: true
        });
        return Mesh;
      })(Drawable_1.default);
      exports_1("default", Mesh);
    }
  };
});

System.register("davinci-eight/visual/RigidBody.js", ["../math/G3", "../checks/mustBeObject", "../core/Mesh"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var G3_1,
      mustBeObject_1,
      Mesh_1;
  var RigidBody;
  return {
    setters: [function(G3_1_1) {
      G3_1 = G3_1_1;
    }, function(mustBeObject_1_1) {
      mustBeObject_1 = mustBeObject_1_1;
    }, function(Mesh_1_1) {
      Mesh_1 = Mesh_1_1;
    }],
    execute: function() {
      RigidBody = (function(_super) {
        __extends(RigidBody, _super);
        function RigidBody(geometry, material, type) {
          if (type === void 0) {
            type = 'RigidBody';
          }
          _super.call(this, geometry, material, type);
          this._mass = G3_1.default.one;
          this._momentum = G3_1.default.zero;
        }
        RigidBody.prototype.destructor = function() {
          _super.prototype.destructor.call(this);
        };
        Object.defineProperty(RigidBody.prototype, "axis", {
          get: function() {
            return G3_1.default.e2.rotate(this.attitude);
          },
          set: function(axis) {
            mustBeObject_1.default('axis', axis);
            this.attitude.rotorFromDirections(G3_1.default.e2, axis);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(RigidBody.prototype, "m", {
          get: function() {
            return this._mass;
          },
          set: function(m) {
            var _this = this;
            mustBeObject_1.default('m', m, function() {
              return _this._type;
            });
            this._mass = m;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(RigidBody.prototype, "P", {
          get: function() {
            return this._momentum;
          },
          set: function(P) {
            this._momentum = P;
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(RigidBody.prototype, "R", {
          get: function() {
            return G3_1.default.fromSpinor(this.attitude);
          },
          set: function(R) {
            var _this = this;
            mustBeObject_1.default('R', R, function() {
              return _this._type;
            });
            this.attitude.copySpinor(R);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(RigidBody.prototype, "X", {
          get: function() {
            return G3_1.default.fromVector(this.position);
          },
          set: function(X) {
            var _this = this;
            mustBeObject_1.default('X', X, function() {
              return _this._type;
            });
            this.position.copy(X);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(RigidBody.prototype, "pos", {
          get: function() {
            return G3_1.default.fromVector(this.position);
          },
          set: function(pos) {
            var _this = this;
            mustBeObject_1.default('pos', pos, function() {
              return _this._type;
            });
            this.position.copy(pos);
          },
          enumerable: true,
          configurable: true
        });
        RigidBody.prototype.getScaleX = function() {
          return this.scale.x;
        };
        RigidBody.prototype.setScaleX = function(x) {
          this.scale.x = x;
        };
        RigidBody.prototype.getScaleY = function() {
          return this.scale.y;
        };
        RigidBody.prototype.setScaleY = function(y) {
          this.scale.y = y;
        };
        RigidBody.prototype.getScaleZ = function() {
          return this.scale.z;
        };
        RigidBody.prototype.setScaleZ = function(z) {
          this.scale.z = z;
        };
        return RigidBody;
      })(Mesh_1.default);
      exports_1("default", RigidBody);
    }
  };
});

System.register("davinci-eight/visual/TrailConfig.js", [], function(exports_1) {
  'use strict';
  var TrailConfig;
  return {
    setters: [],
    execute: function() {
      TrailConfig = (function() {
        function TrailConfig() {
          this.enabled = false;
          this.interval = 10;
          this.retain = 10;
        }
        return TrailConfig;
      })();
      exports_1("default", TrailConfig);
    }
  };
});

System.register("davinci-eight/visual/Trail.js", ["../checks/mustBeObject", "./TrailConfig"], function(exports_1) {
  var mustBeObject_1,
      TrailConfig_1;
  var Trail;
  return {
    setters: [function(mustBeObject_1_1) {
      mustBeObject_1 = mustBeObject_1_1;
    }, function(TrailConfig_1_1) {
      TrailConfig_1 = TrailConfig_1_1;
    }],
    execute: function() {
      Trail = (function() {
        function Trail(rigidBody) {
          this.Xs = [];
          this.Rs = [];
          this.config = new TrailConfig_1.default();
          this.counter = 0;
          mustBeObject_1.default('rigidBody', rigidBody);
          this.rigidBody = rigidBody;
        }
        Trail.prototype.snapshot = function() {
          if (this.counter % this.config.interval === 0) {
            this.Xs.unshift(this.rigidBody.X);
            this.Rs.unshift(this.rigidBody.R);
          }
          while (this.Xs.length > this.config.retain) {
            this.Xs.pop();
            this.Rs.pop();
          }
          this.counter++;
        };
        Trail.prototype.draw = function(ambients) {
          var X = this.rigidBody.X;
          var R = this.rigidBody.R;
          for (var i = 0,
              iLength = this.Xs.length; i < iLength; i++) {
            this.rigidBody.X = this.Xs[i];
            this.rigidBody.R = this.Rs[i];
            this.rigidBody.draw(ambients);
          }
          this.rigidBody.X = X;
          this.rigidBody.R = R;
        };
        return Trail;
      })();
      exports_1("default", Trail);
    }
  };
});

System.register("davinci-eight/visual/VisualBody.js", ["./RigidBody", "../i18n/readOnly", "./Trail"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var RigidBody_1,
      readOnly_1,
      Trail_1;
  var VisualBody;
  return {
    setters: [function(RigidBody_1_1) {
      RigidBody_1 = RigidBody_1_1;
    }, function(readOnly_1_1) {
      readOnly_1 = readOnly_1_1;
    }, function(Trail_1_1) {
      Trail_1 = Trail_1_1;
    }],
    execute: function() {
      VisualBody = (function(_super) {
        __extends(VisualBody, _super);
        function VisualBody(geometry, material, type) {
          if (type === void 0) {
            type = 'VisualBody';
          }
          _super.call(this, geometry, material, type);
          this.dontLoop = false;
          this.history = new Trail_1.default(this);
        }
        VisualBody.prototype.draw = function(ambients) {
          if (this.history.config.enabled) {
            if (this.dontLoop) {
              _super.prototype.draw.call(this, ambients);
            } else {
              this.history.snapshot();
              this.dontLoop = true;
              this.history.draw(ambients);
              this.dontLoop = false;
            }
          } else {
            _super.prototype.draw.call(this, ambients);
          }
        };
        Object.defineProperty(VisualBody.prototype, "trail", {
          get: function() {
            return this.history.config;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('trail').message);
          },
          enumerable: true,
          configurable: true
        });
        return VisualBody;
      })(RigidBody_1.default);
      exports_1("default", VisualBody);
    }
  };
});

System.register("davinci-eight/visual/Sphere.js", ["../checks/mustBeNumber", "./visualCache", "./VisualBody"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var mustBeNumber_1,
      visualCache_1,
      VisualBody_1;
  var Sphere;
  return {
    setters: [function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }, function(visualCache_1_1) {
      visualCache_1 = visualCache_1_1;
    }, function(VisualBody_1_1) {
      VisualBody_1 = VisualBody_1_1;
    }],
    execute: function() {
      Sphere = (function(_super) {
        __extends(Sphere, _super);
        function Sphere(options) {
          if (options === void 0) {
            options = {};
          }
          _super.call(this, visualCache_1.default.sphere(options), visualCache_1.default.material(options), 'Sphere');
          this._geometry.release();
          this._material.release();
        }
        Sphere.prototype.destructor = function() {
          _super.prototype.destructor.call(this);
        };
        Object.defineProperty(Sphere.prototype, "radius", {
          get: function() {
            return this.getScaleX();
          },
          set: function(radius) {
            mustBeNumber_1.default('radius', radius);
            this.setScaleX(radius);
            this.setScaleY(radius);
            this.setScaleZ(radius);
          },
          enumerable: true,
          configurable: true
        });
        return Sphere;
      })(VisualBody_1.default);
      exports_1("default", Sphere);
    }
  };
});

System.register("davinci-eight/visual/World.js", ["./Arrow", "../core/Color", "../core", "./Box", "./Cylinder", "../math/G3", "../checks/isDefined", "../facets/AmbientLight", "../core/Drawable", "../checks/mustBeNumber", "../i18n/readOnly", "../core/Shareable", "./Sphere"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Arrow_1,
      Color_1,
      core_1,
      Box_1,
      Cylinder_1,
      G3_1,
      isDefined_1,
      AmbientLight_1,
      Drawable_1,
      mustBeNumber_1,
      readOnly_1,
      Shareable_1,
      Sphere_1;
  var World;
  function updateRigidBody(body, options) {
    if (options.axis) {
      body.axis = G3_1.default.fromVector(options.axis);
    }
    if (options.color) {
      body.color.copy(options.color);
    } else {
      body.color = Color_1.default.fromRGB(0.6, 0.6, 0.6);
    }
    if (options.pos) {
      body.pos = G3_1.default.fromVector(options.pos);
    }
  }
  return {
    setters: [function(Arrow_1_1) {
      Arrow_1 = Arrow_1_1;
    }, function(Color_1_1) {
      Color_1 = Color_1_1;
    }, function(core_1_1) {
      core_1 = core_1_1;
    }, function(Box_1_1) {
      Box_1 = Box_1_1;
    }, function(Cylinder_1_1) {
      Cylinder_1 = Cylinder_1_1;
    }, function(G3_1_1) {
      G3_1 = G3_1_1;
    }, function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }, function(AmbientLight_1_1) {
      AmbientLight_1 = AmbientLight_1_1;
    }, function(Drawable_1_1) {
      Drawable_1 = Drawable_1_1;
    }, function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }, function(readOnly_1_1) {
      readOnly_1 = readOnly_1_1;
    }, function(Shareable_1_1) {
      Shareable_1 = Shareable_1_1;
    }, function(Sphere_1_1) {
      Sphere_1 = Sphere_1_1;
    }],
    execute: function() {
      World = (function(_super) {
        __extends(World, _super);
        function World(renderer, drawList, ambients, controls) {
          _super.call(this, 'World');
          this._ambientLight = new AmbientLight_1.default(Color_1.default.fromRGB(0.3, 0.3, 0.3));
          renderer.addRef();
          this.renderer = renderer;
          drawList.addRef();
          this.drawList = drawList;
          this.drawList.subscribe(renderer);
          this._ambients = ambients;
          this._ambients.push(this._ambientLight);
          controls.addRef();
          this._controls = controls;
        }
        World.prototype.destructor = function() {
          this.controls.release();
          this.drawList.unsubscribe();
          this.drawList.release();
          this.renderer.release();
          _super.prototype.destructor.call(this);
        };
        Object.defineProperty(World.prototype, "ambients", {
          get: function() {
            return this._ambients;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('ambients').message);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(World.prototype, "canvas", {
          get: function() {
            return this.renderer.canvas;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('canvas').message);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(World.prototype, "controls", {
          get: function() {
            return this._controls;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('controls').message);
          },
          enumerable: true,
          configurable: true
        });
        World.prototype.add = function(mesh) {
          if (core_1.default.safemode) {
            if (!(mesh instanceof Drawable_1.default)) {
              throw new Error("mesh must be an instance of Drawable");
            }
          }
          this.drawList.add(mesh);
        };
        World.prototype.arrow = function(options) {
          if (options === void 0) {
            options = {};
          }
          var arrow = new Arrow_1.default();
          updateRigidBody(arrow, options);
          this.drawList.add(arrow);
          arrow.release();
          return arrow;
        };
        World.prototype.box = function(options) {
          if (options === void 0) {
            options = {};
          }
          var box = new Box_1.default(options);
          updateRigidBody(box, options);
          this.drawList.add(box);
          box.release();
          return box;
        };
        World.prototype.cylinder = function(options) {
          if (options === void 0) {
            options = {};
          }
          var cylinder = new Cylinder_1.default();
          updateRigidBody(cylinder, options);
          cylinder.radius = isDefined_1.default(options.radius) ? mustBeNumber_1.default('radius', options.radius) : 0.5;
          this.drawList.add(cylinder);
          cylinder.release();
          return cylinder;
        };
        World.prototype.sphere = function(options) {
          if (options === void 0) {
            options = {};
          }
          var sphere = new Sphere_1.default();
          updateRigidBody(sphere, options);
          sphere.radius = isDefined_1.default(options.radius) ? mustBeNumber_1.default('radius', options.radius) : 0.5;
          this.drawList.add(sphere);
          sphere.release();
          return sphere;
        };
        return World;
      })(Shareable_1.default);
      exports_1("default", World);
    }
  };
});

System.register("davinci-eight/core.js", [], function(exports_1) {
  var Eight,
      core;
  return {
    setters: [],
    execute: function() {
      Eight = (function() {
        function Eight() {
          this.safemode = true;
          this.strict = false;
          this.GITHUB = 'https://github.com/geometryzen/davinci-eight';
          this.LAST_MODIFIED = '2016-02-20';
          this.NAMESPACE = 'EIGHT';
          this.verbose = false;
          this.VERSION = '2.192.0';
          this.logging = {};
        }
        return Eight;
      })();
      core = new Eight();
      exports_1("default", core);
    }
  };
});

System.register("davinci-eight/collections/ShareableArray.js", ["../core/Shareable"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Shareable_1;
  var ShareableArray;
  function transferOwnership(data) {
    if (data) {
      var result = new ShareableArray(data);
      for (var i = 0,
          iLength = data.length; i < iLength; i++) {
        var element = data[i];
        if (element) {
          element.release();
        }
      }
      return result;
    } else {
      return void 0;
    }
  }
  return {
    setters: [function(Shareable_1_1) {
      Shareable_1 = Shareable_1_1;
    }],
    execute: function() {
      ShareableArray = (function(_super) {
        __extends(ShareableArray, _super);
        function ShareableArray(elements) {
          if (elements === void 0) {
            elements = [];
          }
          _super.call(this, 'ShareableArray');
          this._elements = elements;
          for (var i = 0,
              l = this._elements.length; i < l; i++) {
            this._elements[i].addRef();
          }
        }
        ShareableArray.prototype.destructor = function() {
          for (var i = 0,
              l = this._elements.length; i < l; i++) {
            this._elements[i].release();
          }
          this._elements = void 0;
          _super.prototype.destructor.call(this);
        };
        ShareableArray.prototype.find = function(match) {
          var result = new ShareableArray();
          var elements = this._elements;
          var iLen = elements.length;
          for (var i = 0; i < iLen; i++) {
            var candidate = elements[i];
            if (match(candidate)) {
              result.push(candidate);
            }
          }
          return result;
        };
        ShareableArray.prototype.findOne = function(match) {
          var elements = this._elements;
          for (var i = 0,
              iLength = elements.length; i < iLength; i++) {
            var candidate = elements[i];
            if (match(candidate)) {
              candidate.addRef();
              return candidate;
            }
          }
          return void 0;
        };
        ShareableArray.prototype.get = function(index) {
          var element = this.getWeakRef(index);
          if (element) {
            element.addRef();
          }
          return element;
        };
        ShareableArray.prototype.getWeakRef = function(index) {
          return this._elements[index];
        };
        ShareableArray.prototype.indexOf = function(searchElement, fromIndex) {
          return this._elements.indexOf(searchElement, fromIndex);
        };
        Object.defineProperty(ShareableArray.prototype, "length", {
          get: function() {
            if (this._elements) {
              return this._elements.length;
            } else {
              console.warn("ShareableArray is now a zombie, length is undefined");
              return void 0;
            }
          },
          enumerable: true,
          configurable: true
        });
        ShareableArray.prototype.slice = function(begin, end) {
          return new ShareableArray(this._elements.slice(begin, end));
        };
        ShareableArray.prototype.splice = function(index, deleteCount) {
          return transferOwnership(this._elements.splice(index, deleteCount));
        };
        ShareableArray.prototype.shift = function() {
          return this._elements.shift();
        };
        ShareableArray.prototype.forEach = function(callback) {
          return this._elements.forEach(callback);
        };
        ShareableArray.prototype.push = function(element) {
          if (element) {
            element.addRef();
          }
          return this.pushWeakRef(element);
        };
        ShareableArray.prototype.pushWeakRef = function(element) {
          return this._elements.push(element);
        };
        ShareableArray.prototype.pop = function() {
          return this._elements.pop();
        };
        ShareableArray.prototype.unshift = function(element) {
          element.addRef();
          return this.unshiftWeakRef(element);
        };
        ShareableArray.prototype.unshiftWeakRef = function(element) {
          return this._elements.unshift(element);
        };
        return ShareableArray;
      })(Shareable_1.default);
      exports_1("default", ShareableArray);
    }
  };
});

System.register("davinci-eight/core/initWebGL.js", ["../checks/isDefined"], function(exports_1) {
  var isDefined_1;
  function initWebGL(canvas, attributes) {
    if (isDefined_1.default(canvas)) {
      var context;
      try {
        context = (canvas.getContext('webgl', attributes) || canvas.getContext('experimental-webgl', attributes));
      } catch (e) {}
      if (context) {
        return context;
      } else {
        throw new Error("Unable to initialize WebGL. Your browser may not support it.");
      }
    } else {
      return void 0;
    }
  }
  exports_1("default", initWebGL);
  return {
    setters: [function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/checks/isObject.js", [], function(exports_1) {
  function isObject(x) {
    return (typeof x === 'object');
  }
  exports_1("default", isObject);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/checks/mustBeObject.js", ["../checks/mustSatisfy", "../checks/isObject"], function(exports_1) {
  var mustSatisfy_1,
      isObject_1;
  function beObject() {
    return "be an `object`";
  }
  function mustBeObject(name, value, contextBuilder) {
    mustSatisfy_1.default(name, isObject_1.default(value), beObject, contextBuilder);
    return value;
  }
  exports_1("default", mustBeObject);
  return {
    setters: [function(mustSatisfy_1_1) {
      mustSatisfy_1 = mustSatisfy_1_1;
    }, function(isObject_1_1) {
      isObject_1 = isObject_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/commands/WebGLClearColor.js", ["../checks/mustBeNumber", "../core/Shareable"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var mustBeNumber_1,
      Shareable_1;
  var WebGLClearColor;
  return {
    setters: [function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }, function(Shareable_1_1) {
      Shareable_1 = Shareable_1_1;
    }],
    execute: function() {
      WebGLClearColor = (function(_super) {
        __extends(WebGLClearColor, _super);
        function WebGLClearColor(red, green, blue, alpha) {
          if (red === void 0) {
            red = 0;
          }
          if (green === void 0) {
            green = 0;
          }
          if (blue === void 0) {
            blue = 0;
          }
          if (alpha === void 0) {
            alpha = 1;
          }
          _super.call(this, 'WebGLClearColor');
          this.red = mustBeNumber_1.default('red', red);
          this.green = mustBeNumber_1.default('green', green);
          this.blue = mustBeNumber_1.default('blue', blue);
          this.alpha = mustBeNumber_1.default('alpha', alpha);
        }
        WebGLClearColor.prototype.destructor = function() {
          this.red = void 0;
          this.green = void 0;
          this.blue = void 0;
          this.alpha = void 0;
          _super.prototype.destructor.call(this);
        };
        WebGLClearColor.prototype.contextFree = function(manager) {};
        WebGLClearColor.prototype.contextGain = function(manager) {
          mustBeNumber_1.default('red', this.red);
          mustBeNumber_1.default('green', this.green);
          mustBeNumber_1.default('blue', this.blue);
          mustBeNumber_1.default('alpha', this.alpha);
          manager.gl.clearColor(this.red, this.green, this.blue, this.alpha);
        };
        WebGLClearColor.prototype.contextLost = function() {};
        return WebGLClearColor;
      })(Shareable_1.default);
      exports_1("default", WebGLClearColor);
    }
  };
});

System.register("davinci-eight/commands/WebGLEnable.js", ["../commands/glCapability", "../checks/mustBeNumber", "../core/Shareable"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var glCapability_1,
      mustBeNumber_1,
      Shareable_1;
  var WebGLEnable;
  return {
    setters: [function(glCapability_1_1) {
      glCapability_1 = glCapability_1_1;
    }, function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }, function(Shareable_1_1) {
      Shareable_1 = Shareable_1_1;
    }],
    execute: function() {
      WebGLEnable = (function(_super) {
        __extends(WebGLEnable, _super);
        function WebGLEnable(capability) {
          _super.call(this, 'WebGLEnable');
          this._capability = mustBeNumber_1.default('capability', capability);
        }
        WebGLEnable.prototype.contextFree = function(manager) {};
        WebGLEnable.prototype.contextGain = function(manager) {
          manager.gl.enable(glCapability_1.default(this._capability, manager.gl));
        };
        WebGLEnable.prototype.contextLost = function() {};
        WebGLEnable.prototype.destructor = function() {
          this._capability = void 0;
          _super.prototype.destructor.call(this);
        };
        return WebGLEnable;
      })(Shareable_1.default);
      exports_1("default", WebGLEnable);
    }
  };
});

System.register("davinci-eight/commands/Capability.js", [], function(exports_1) {
  var Capability;
  return {
    setters: [],
    execute: function() {
      (function(Capability) {
        Capability[Capability["BLEND"] = 0] = "BLEND";
        Capability[Capability["CULL_FACE"] = 1] = "CULL_FACE";
        Capability[Capability["DEPTH_TEST"] = 2] = "DEPTH_TEST";
        Capability[Capability["POLYGON_OFFSET_FILL"] = 3] = "POLYGON_OFFSET_FILL";
        Capability[Capability["SCISSOR_TEST"] = 4] = "SCISSOR_TEST";
      })(Capability || (Capability = {}));
      exports_1("default", Capability);
    }
  };
});

System.register("davinci-eight/checks/mustBeDefined.js", ["../checks/mustSatisfy", "../checks/isDefined"], function(exports_1) {
  var mustSatisfy_1,
      isDefined_1;
  function beDefined() {
    return "not be 'undefined'";
  }
  function mustBeDefined(name, value, contextBuilder) {
    mustSatisfy_1.default(name, isDefined_1.default(value), beDefined, contextBuilder);
    return value;
  }
  exports_1("default", mustBeDefined);
  return {
    setters: [function(mustSatisfy_1_1) {
      mustSatisfy_1 = mustSatisfy_1_1;
    }, function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/checks/isInteger.js", ["../checks/isNumber"], function(exports_1) {
  var isNumber_1;
  function isInteger(x) {
    return isNumber_1.default(x) && x % 1 === 0;
  }
  exports_1("default", isInteger);
  return {
    setters: [function(isNumber_1_1) {
      isNumber_1 = isNumber_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/checks/mustBeInteger.js", ["../checks/mustSatisfy", "../checks/isInteger"], function(exports_1) {
  var mustSatisfy_1,
      isInteger_1;
  function beAnInteger() {
    return "be an integer";
  }
  function mustBeInteger(name, value, contextBuilder) {
    mustSatisfy_1.default(name, isInteger_1.default(value), beAnInteger, contextBuilder);
    return value;
  }
  exports_1("default", mustBeInteger);
  return {
    setters: [function(mustSatisfy_1_1) {
      mustSatisfy_1 = mustSatisfy_1_1;
    }, function(isInteger_1_1) {
      isInteger_1 = isInteger_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/commands/glCapability.js", ["../commands/Capability", "../checks/isDefined", "../checks/mustBeDefined", "../checks/mustBeInteger"], function(exports_1) {
  var Capability_1,
      isDefined_1,
      mustBeDefined_1,
      mustBeInteger_1;
  function glCapability(capability, gl) {
    if (isDefined_1.default(capability)) {
      mustBeInteger_1.default('capability', capability);
      mustBeDefined_1.default('gl', gl);
      switch (capability) {
        case Capability_1.default.BLEND:
          return gl.BLEND;
        case Capability_1.default.CULL_FACE:
          return gl.CULL_FACE;
        case Capability_1.default.DEPTH_TEST:
          return gl.DEPTH_TEST;
        case Capability_1.default.POLYGON_OFFSET_FILL:
          return gl.POLYGON_OFFSET_FILL;
        case Capability_1.default.SCISSOR_TEST:
          return gl.SCISSOR_TEST;
        default:
          {
            throw new Error(capability + " is not a valid capability.");
          }
      }
    } else {
      return void 0;
    }
  }
  exports_1("default", glCapability);
  return {
    setters: [function(Capability_1_1) {
      Capability_1 = Capability_1_1;
    }, function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }, function(mustBeDefined_1_1) {
      mustBeDefined_1 = mustBeDefined_1_1;
    }, function(mustBeInteger_1_1) {
      mustBeInteger_1 = mustBeInteger_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/checks/isNumber.js", [], function(exports_1) {
  function isNumber(x) {
    return (typeof x === 'number');
  }
  exports_1("default", isNumber);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/checks/mustBeNumber.js", ["../checks/mustSatisfy", "../checks/isNumber"], function(exports_1) {
  var mustSatisfy_1,
      isNumber_1;
  function beANumber() {
    return "be a `number`";
  }
  function default_1(name, value, contextBuilder) {
    mustSatisfy_1.default(name, isNumber_1.default(value), beANumber, contextBuilder);
    return value;
  }
  exports_1("default", default_1);
  return {
    setters: [function(mustSatisfy_1_1) {
      mustSatisfy_1 = mustSatisfy_1_1;
    }, function(isNumber_1_1) {
      isNumber_1 = isNumber_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/checks/mustSatisfy.js", [], function(exports_1) {
  function mustSatisfy(name, condition, messageBuilder, contextBuilder) {
    if (!condition) {
      var message = messageBuilder ? messageBuilder() : "satisfy some condition";
      var context = contextBuilder ? " in " + contextBuilder() : "";
      throw new Error(name + " must " + message + context + ".");
    }
  }
  exports_1("default", mustSatisfy);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/checks/isString.js", [], function(exports_1) {
  function isString(s) {
    return (typeof s === 'string');
  }
  exports_1("default", isString);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/checks/mustBeString.js", ["../checks/mustSatisfy", "../checks/isString"], function(exports_1) {
  var mustSatisfy_1,
      isString_1;
  function beAString() {
    return "be a string";
  }
  function default_1(name, value, contextBuilder) {
    mustSatisfy_1.default(name, isString_1.default(value), beAString, contextBuilder);
    return value;
  }
  exports_1("default", default_1);
  return {
    setters: [function(mustSatisfy_1_1) {
      mustSatisfy_1 = mustSatisfy_1_1;
    }, function(isString_1_1) {
      isString_1 = isString_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/i18n/readOnly.js", ["../checks/mustBeString"], function(exports_1) {
  var mustBeString_1;
  function readOnly(name) {
    mustBeString_1.default('name', name);
    var message = {get message() {
        return "Property `" + name + "` is readonly.";
      }};
    return message;
  }
  exports_1("default", readOnly);
  return {
    setters: [function(mustBeString_1_1) {
      mustBeString_1 = mustBeString_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight/checks/isDefined.js", [], function(exports_1) {
  function isDefined(arg) {
    return (typeof arg !== 'undefined');
  }
  exports_1("default", isDefined);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/core/refChange.js", ["../checks/isDefined"], function(exports_1) {
  var isDefined_1;
  var statistics,
      skip,
      trace,
      traceName,
      LOGGING_NAME_REF_CHANGE;
  function prefix(message) {
    return LOGGING_NAME_REF_CHANGE + ": " + message;
  }
  function log(message) {
    return console.log(prefix(message));
  }
  function warn(message) {
    return console.warn(prefix(message));
  }
  function error(message) {
    return console.error(prefix(message));
  }
  function garbageCollect() {
    var uuids = Object.keys(statistics);
    uuids.forEach(function(uuid) {
      var element = statistics[uuid];
      if (element.refCount === 0) {
        delete statistics[uuid];
      }
    });
  }
  function computeOutstanding() {
    var uuids = Object.keys(statistics);
    var uuidsLength = uuids.length;
    var total = 0;
    for (var i = 0; i < uuidsLength; i++) {
      var uuid = uuids[i];
      var statistic = statistics[uuid];
      total += statistic.refCount;
    }
    return total;
  }
  function stop() {
    if (skip) {
      warn("Nothing to see because skip mode is " + skip);
    }
    garbageCollect();
    return computeOutstanding();
  }
  function dump() {
    var outstanding = stop();
    if (outstanding > 0) {
      warn(JSON.stringify(statistics, null, 2));
    } else {
      log("There are " + outstanding + " outstanding reference counts.");
    }
    return outstanding;
  }
  function default_1(uuid, name, change) {
    if (change === void 0) {
      change = 0;
    }
    if (change !== 0 && skip) {
      return;
    }
    if (trace) {
      if (traceName) {
        if (name === traceName) {
          var element = statistics[uuid];
          if (element) {
            log(change + " on " + uuid + " @ " + name);
          } else {
            log(change + " on " + uuid + " @ " + name);
          }
        }
      } else {
        log(change + " on " + uuid + " @ " + name);
      }
    }
    if (change === +1) {
      var element = statistics[uuid];
      if (!element) {
        element = {
          refCount: 0,
          name: name,
          zombie: false
        };
        statistics[uuid] = element;
      }
      element.refCount += change;
    } else if (change === -1) {
      var element = statistics[uuid];
      if (element) {
        element.refCount += change;
        if (element.refCount === 0) {
          element.zombie = true;
        } else if (element.refCount < 0) {
          error("refCount < 0 for " + name);
        }
      } else {
        error(change + " on " + uuid + " @ " + name);
      }
    } else if (change === 0) {
      var message = isDefined_1.default(name) ? uuid + " @ " + name : uuid;
      log(message);
      if (uuid === 'stop') {
        return stop();
      }
      if (uuid === 'dump') {
        return dump();
      } else if (uuid === 'start') {
        skip = false;
        trace = false;
      } else if (uuid === 'reset') {
        statistics = {};
        skip = true;
        trace = false;
        traceName = void 0;
      } else if (uuid === 'trace') {
        skip = false;
        trace = true;
        traceName = name;
      } else {
        throw new Error(prefix("Unexpected command " + message));
      }
    } else {
      throw new Error(prefix("change must be +1 or -1 for normal recording, or 0 for logging to the console."));
    }
  }
  exports_1("default", default_1);
  return {
    setters: [function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }],
    execute: function() {
      statistics = {};
      skip = true;
      trace = false;
      traceName = void 0;
      LOGGING_NAME_REF_CHANGE = 'refChange';
    }
  };
});

System.register("davinci-eight/core/uuid4.js", [], function(exports_1) {
  function uuid4() {
    var maxFromBits = function(bits) {
      return Math.pow(2, bits);
    };
    var limitUI06 = maxFromBits(6);
    var limitUI08 = maxFromBits(8);
    var limitUI12 = maxFromBits(12);
    var limitUI16 = maxFromBits(16);
    var limitUI32 = maxFromBits(32);
    var getRandomInt = function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    var randomUI06 = function() {
      return getRandomInt(0, limitUI06 - 1);
    };
    var randomUI08 = function() {
      return getRandomInt(0, limitUI08 - 1);
    };
    var randomUI12 = function() {
      return getRandomInt(0, limitUI12 - 1);
    };
    var randomUI16 = function() {
      return getRandomInt(0, limitUI16 - 1);
    };
    var randomUI32 = function() {
      return getRandomInt(0, limitUI32 - 1);
    };
    var randomUI48 = function() {
      return (0 | Math.random() * (1 << 30)) + (0 | Math.random() * (1 << 48 - 30)) * (1 << 30);
    };
    var paddedString = function(str, length, z) {
      str = String(str);
      z = (!z) ? '0' : z;
      var i = length - str.length;
      for (; i > 0; i >>>= 1, z += z) {
        if (i & 1) {
          str = z + str;
        }
      }
      return str;
    };
    var fromParts = function(timeLow, timeMid, timeHiAndVersion, clockSeqHiAndReserved, clockSeqLow, node) {
      var hex = paddedString(timeLow.toString(16), 8) + '-' + paddedString(timeMid.toString(16), 4) + '-' + paddedString(timeHiAndVersion.toString(16), 4) + '-' + paddedString(clockSeqHiAndReserved.toString(16), 2) + paddedString(clockSeqLow.toString(16), 2) + '-' + paddedString(node.toString(16), 12);
      return hex;
    };
    return {
      generate: function() {
        return fromParts(randomUI32(), randomUI16(), 0x4000 | randomUI12(), 0x80 | randomUI06(), randomUI08(), randomUI48());
      },
      validate: function(uuid) {
        var testPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return testPattern.test(uuid);
      }
    };
  }
  exports_1("default", uuid4);
  return {
    setters: [],
    execute: function() {}
  };
});

System.register("davinci-eight/core/Shareable.js", ["../checks/mustBeString", "../i18n/readOnly", "./refChange", "./uuid4"], function(exports_1) {
  var mustBeString_1,
      readOnly_1,
      refChange_1,
      uuid4_1;
  var Shareable;
  return {
    setters: [function(mustBeString_1_1) {
      mustBeString_1 = mustBeString_1_1;
    }, function(readOnly_1_1) {
      readOnly_1 = readOnly_1_1;
    }, function(refChange_1_1) {
      refChange_1 = refChange_1_1;
    }, function(uuid4_1_1) {
      uuid4_1 = uuid4_1_1;
    }],
    execute: function() {
      Shareable = (function() {
        function Shareable(type) {
          this._refCount = 1;
          this._uuid = uuid4_1.default().generate();
          this._type = mustBeString_1.default('type', type);
          refChange_1.default(this._uuid, type, +1);
        }
        Shareable.prototype.isZombie = function() {
          return typeof this._refCount === 'undefined';
        };
        Shareable.prototype.addRef = function() {
          this._refCount++;
          refChange_1.default(this._uuid, this._type, +1);
          return this._refCount;
        };
        Shareable.prototype.release = function() {
          this._refCount--;
          refChange_1.default(this._uuid, this._type, -1);
          var refCount = this._refCount;
          if (refCount === 0) {
            this.destructor(true);
            this._refCount = void 0;
          }
          return refCount;
        };
        Shareable.prototype.destructor = function(grumble) {
          if (grumble === void 0) {
            grumble = false;
          }
          if (grumble) {
            console.warn("`protected destructor(): void` method should be implemented by `" + this._type + "`.");
          }
        };
        Object.defineProperty(Shareable.prototype, "uuid", {
          get: function() {
            return this._uuid;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('uuid').message);
          },
          enumerable: true,
          configurable: true
        });
        return Shareable;
      })();
      exports_1("default", Shareable);
    }
  };
});

System.register("davinci-eight/commands/WebGLDisable.js", ["../commands/glCapability", "../checks/mustBeNumber", "../core/Shareable"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var glCapability_1,
      mustBeNumber_1,
      Shareable_1;
  var WebGLDisable;
  return {
    setters: [function(glCapability_1_1) {
      glCapability_1 = glCapability_1_1;
    }, function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }, function(Shareable_1_1) {
      Shareable_1 = Shareable_1_1;
    }],
    execute: function() {
      WebGLDisable = (function(_super) {
        __extends(WebGLDisable, _super);
        function WebGLDisable(capability) {
          _super.call(this, 'WebGLDisable');
          this._capability = mustBeNumber_1.default('capability', capability);
        }
        WebGLDisable.prototype.contextFree = function(manager) {};
        WebGLDisable.prototype.contextGain = function(manager) {
          manager.gl.disable(glCapability_1.default(this._capability, manager.gl));
        };
        WebGLDisable.prototype.contextLost = function() {};
        WebGLDisable.prototype.destructor = function() {
          this._capability = void 0;
          _super.prototype.destructor.call(this);
        };
        return WebGLDisable;
      })(Shareable_1.default);
      exports_1("default", WebGLDisable);
    }
  };
});

System.register("davinci-eight/core/WebGLRenderer.js", ["../commands/Capability", "../core", "../collections/ShareableArray", "./initWebGL", "../checks/isDefined", "../checks/mustBeDefined", "../checks/mustBeObject", "../i18n/readOnly", "./Shareable", "../commands/WebGLClearColor", "../commands/WebGLEnable", "../commands/WebGLDisable"], function(exports_1) {
  var __extends = (this && this.__extends) || function(d, b) {
    for (var p in b)
      if (b.hasOwnProperty(p))
        d[p] = b[p];
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
  var Capability_1,
      core_1,
      ShareableArray_1,
      initWebGL_1,
      isDefined_1,
      mustBeDefined_1,
      mustBeObject_1,
      readOnly_1,
      Shareable_1,
      WebGLClearColor_1,
      WebGLEnable_1,
      WebGLDisable_1;
  var WebGLContextProvider,
      WebGLRenderer;
  return {
    setters: [function(Capability_1_1) {
      Capability_1 = Capability_1_1;
    }, function(core_1_1) {
      core_1 = core_1_1;
    }, function(ShareableArray_1_1) {
      ShareableArray_1 = ShareableArray_1_1;
    }, function(initWebGL_1_1) {
      initWebGL_1 = initWebGL_1_1;
    }, function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }, function(mustBeDefined_1_1) {
      mustBeDefined_1 = mustBeDefined_1_1;
    }, function(mustBeObject_1_1) {
      mustBeObject_1 = mustBeObject_1_1;
    }, function(readOnly_1_1) {
      readOnly_1 = readOnly_1_1;
    }, function(Shareable_1_1) {
      Shareable_1 = Shareable_1_1;
    }, function(WebGLClearColor_1_1) {
      WebGLClearColor_1 = WebGLClearColor_1_1;
    }, function(WebGLEnable_1_1) {
      WebGLEnable_1 = WebGLEnable_1_1;
    }, function(WebGLDisable_1_1) {
      WebGLDisable_1 = WebGLDisable_1_1;
    }],
    execute: function() {
      WebGLContextProvider = (function(_super) {
        __extends(WebGLContextProvider, _super);
        function WebGLContextProvider(renderer) {
          _super.call(this, 'WebGLContextProvider');
          this._renderer = renderer;
        }
        WebGLContextProvider.prototype.destructor = function() {
          _super.prototype.destructor.call(this);
        };
        Object.defineProperty(WebGLContextProvider.prototype, "gl", {
          get: function() {
            return this._renderer.gl;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('gl').message);
          },
          enumerable: true,
          configurable: true
        });
        return WebGLContextProvider;
      })(Shareable_1.default);
      WebGLRenderer = (function(_super) {
        __extends(WebGLRenderer, _super);
        function WebGLRenderer(attributes) {
          var _this = this;
          _super.call(this, 'WebGLRenderer');
          this._users = [];
          this._commands = new ShareableArray_1.default([]);
          this._attributes = attributes;
          this._contextProvider = new WebGLContextProvider(this);
          this.enable(Capability_1.default.DEPTH_TEST);
          this._webGLContextLost = function(event) {
            if (isDefined_1.default(_this._canvas)) {
              event.preventDefault();
              _this._gl = void 0;
              _this._users.forEach(function(user) {
                user.contextLost();
              });
            }
          };
          this._webGLContextRestored = function(event) {
            if (isDefined_1.default(_this._canvas)) {
              event.preventDefault();
              _this._gl = initWebGL_1.default(_this._canvas, attributes);
              _this._users.forEach(function(user) {
                user.contextGain(_this._contextProvider);
              });
            }
          };
        }
        WebGLRenderer.prototype.destructor = function() {
          this.stop();
          this._contextProvider.release();
          while (this._users.length > 0) {
            this._users.pop();
          }
          this._commands.release();
          _super.prototype.destructor.call(this);
        };
        WebGLRenderer.prototype.addContextListener = function(user) {
          mustBeObject_1.default('user', user);
          var index = this._users.indexOf(user);
          if (index < 0) {
            this._users.push(user);
          } else {
            console.warn("user already exists for addContextListener");
          }
        };
        Object.defineProperty(WebGLRenderer.prototype, "canvas", {
          get: function() {
            if (!this._canvas) {
              this.start(document.createElement('canvas'));
            }
            return this._canvas;
          },
          set: function(canvas) {
            throw new Error(readOnly_1.default('canvas').message);
          },
          enumerable: true,
          configurable: true
        });
        Object.defineProperty(WebGLRenderer.prototype, "commands", {
          get: function() {
            this._commands.addRef();
            return this._commands;
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('commands').message);
          },
          enumerable: true,
          configurable: true
        });
        WebGLRenderer.prototype.clearColor = function(red, green, blue, alpha) {
          this._commands.pushWeakRef(new WebGLClearColor_1.default(red, green, blue, alpha));
          if (this._gl) {
            this._gl.clearColor(red, green, blue, alpha);
          }
          return this;
        };
        WebGLRenderer.prototype.disable = function(capability) {
          this._commands.pushWeakRef(new WebGLDisable_1.default(capability));
          return this;
        };
        WebGLRenderer.prototype.enable = function(capability) {
          this._commands.pushWeakRef(new WebGLEnable_1.default(capability));
          return this;
        };
        Object.defineProperty(WebGLRenderer.prototype, "gl", {
          get: function() {
            if (this._gl) {
              return this._gl;
            } else {
              return void 0;
            }
          },
          set: function(unused) {
            throw new Error(readOnly_1.default('gl').message);
          },
          enumerable: true,
          configurable: true
        });
        WebGLRenderer.prototype.removeContextListener = function(user) {
          mustBeObject_1.default('user', user);
          var index = this._users.indexOf(user);
          if (index >= 0) {
            this._users.splice(index, 1);
          }
        };
        WebGLRenderer.prototype.clear = function() {
          var gl = this._gl;
          if (gl) {
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
          }
        };
        WebGLRenderer.prototype.viewport = function(x, y, width, height) {
          var gl = this._gl;
          if (gl) {
            this._gl.viewport(x, y, width, height);
          } else {
            console.warn(this._type + ".viewport() ignored because no context.");
          }
          return this;
        };
        WebGLRenderer.prototype.start = function(canvas) {
          if (!(canvas instanceof HTMLCanvasElement)) {
            console.warn("canvas must be an HTMLCanvasElement to start the context.");
            return this;
          }
          mustBeDefined_1.default('canvas', canvas);
          var alreadyStarted = isDefined_1.default(this._canvas);
          if (!alreadyStarted) {
            this._canvas = canvas;
          } else {
            if (core_1.default.verbose) {
              console.warn(this._type + " Ignoring start() because already started.");
            }
            return;
          }
          if (isDefined_1.default(this._canvas)) {
            this._gl = initWebGL_1.default(this._canvas, this._attributes);
            this.emitStartEvent();
            this._canvas.addEventListener('webglcontextlost', this._webGLContextLost, false);
            this._canvas.addEventListener('webglcontextrestored', this._webGLContextRestored, false);
          }
          return this;
        };
        WebGLRenderer.prototype.stop = function() {
          if (isDefined_1.default(this._canvas)) {
            this._canvas.removeEventListener('webglcontextrestored', this._webGLContextRestored, false);
            this._canvas.removeEventListener('webglcontextlost', this._webGLContextLost, false);
            if (this._gl) {
              this.emitStopEvent();
              this._gl = void 0;
            }
            this._canvas = void 0;
          }
          return this;
        };
        WebGLRenderer.prototype.emitStartEvent = function() {
          var _this = this;
          this._users.forEach(function(user) {
            _this.emitContextGain(user);
          });
          this._commands.forEach(function(command) {
            _this.emitContextGain(command);
          });
        };
        WebGLRenderer.prototype.emitContextGain = function(consumer) {
          if (this._gl.isContextLost()) {
            consumer.contextLost();
          } else {
            consumer.contextGain(this._contextProvider);
          }
        };
        WebGLRenderer.prototype.emitStopEvent = function() {
          var _this = this;
          this._users.forEach(function(user) {
            _this.emitContextFree(user);
          });
          this._commands.forEach(function(command) {
            _this.emitContextFree(command);
          });
        };
        WebGLRenderer.prototype.emitContextFree = function(consumer) {
          if (this._gl.isContextLost()) {
            consumer.contextLost();
          } else {
            consumer.contextFree(this._contextProvider);
          }
        };
        WebGLRenderer.prototype.synchronize = function(consumer) {
          if (this._gl) {
            this.emitContextGain(consumer);
          } else {}
        };
        return WebGLRenderer;
      })(Shareable_1.default);
      exports_1("default", WebGLRenderer);
    }
  };
});

System.register("davinci-eight/visual/bootstrap.js", ["../core/Color", "../math/R3", "../facets/DirectionalLight", "../checks/isDefined", "../checks/mustBeBoolean", "../checks/mustBeFunction", "../checks/mustBeNumber", "../checks/mustBeString", "./DrawList", "../facets/PerspectiveCamera", "../core/refChange", "../controls/CameraControls", "./World", "../core/WebGLRenderer"], function(exports_1) {
  var Color_1,
      R3_1,
      DirectionalLight_1,
      isDefined_1,
      mustBeBoolean_1,
      mustBeFunction_1,
      mustBeNumber_1,
      mustBeString_1,
      DrawList_1,
      PerspectiveCamera_1,
      refChange_1,
      CameraControls_1,
      World_1,
      WebGLRenderer_1;
  function default_1(canvasId, animate, options) {
    if (options === void 0) {
      options = {};
    }
    mustBeString_1.default('canvasId', canvasId);
    mustBeFunction_1.default('animate', animate);
    options.height = isDefined_1.default(options.height) ? mustBeNumber_1.default('options.height', options.height) : void 0;
    options.memcheck = isDefined_1.default(options.memcheck) ? mustBeBoolean_1.default('options.memcheck', options.memcheck) : false;
    options.onload = isDefined_1.default(options.onload) ? mustBeFunction_1.default('options.onload', options.onload) : void 0;
    options.onunload = isDefined_1.default(options.onunload) ? mustBeFunction_1.default('options.onunload', options.onunload) : void 0;
    options.width = isDefined_1.default(options.width) ? mustBeNumber_1.default('options.width', options.width) : void 0;
    if (options.memcheck) {
      refChange_1.default('start', 'bootstrap');
    }
    var renderer = new WebGLRenderer_1.default();
    renderer.clearColor(0.1, 0.1, 0.1, 1.0);
    var drawList = new DrawList_1.default();
    var ambients = [];
    var dirLight = new DirectionalLight_1.default(R3_1.default.e3.neg(), Color_1.default.white);
    ambients.push(dirLight);
    var camera = new PerspectiveCamera_1.default(45 * Math.PI / 180, 1, 0.1, 1000);
    camera.position.setXYZ(0, 0, 7);
    camera.look.setXYZ(0, 0, 0);
    camera.up.setXYZ(0, 1, 0);
    ambients.push(camera);
    var controls = new CameraControls_1.default(camera);
    var world = new World_1.default(renderer, drawList, ambients, controls);
    var requestId;
    function step(timestamp) {
      requestId = window.requestAnimationFrame(step);
      renderer.clear();
      controls.update();
      dirLight.direction.copy(camera.look).sub(camera.position);
      try {
        animate(timestamp);
      } catch (e) {
        window.cancelAnimationFrame(requestId);
        console.warn(e);
      }
      drawList.draw(ambients);
    }
    window.onload = function() {
      var canvas = document.getElementById(canvasId);
      if (isDefined_1.default(options.height)) {
        canvas.height = options.height;
      } else {
        canvas.height = 600;
      }
      if (isDefined_1.default(options.width)) {
        canvas.width = options.width;
      } else {
        canvas.width = 600;
      }
      renderer.start(canvas);
      controls.subscribe(world.canvas);
      controls.rotateSpeed = 4;
      if (options.onload) {
        options.onload();
      }
      requestId = window.requestAnimationFrame(step);
    };
    window.onunload = function() {
      if (options.onunload) {
        options.onunload();
      }
      controls.release();
      world.release();
      drawList.release();
      renderer.release();
      if (options.memcheck) {
        refChange_1.default('stop', 'onunload');
        refChange_1.default('dump', 'onunload');
      }
    };
    return world;
  }
  exports_1("default", default_1);
  return {
    setters: [function(Color_1_1) {
      Color_1 = Color_1_1;
    }, function(R3_1_1) {
      R3_1 = R3_1_1;
    }, function(DirectionalLight_1_1) {
      DirectionalLight_1 = DirectionalLight_1_1;
    }, function(isDefined_1_1) {
      isDefined_1 = isDefined_1_1;
    }, function(mustBeBoolean_1_1) {
      mustBeBoolean_1 = mustBeBoolean_1_1;
    }, function(mustBeFunction_1_1) {
      mustBeFunction_1 = mustBeFunction_1_1;
    }, function(mustBeNumber_1_1) {
      mustBeNumber_1 = mustBeNumber_1_1;
    }, function(mustBeString_1_1) {
      mustBeString_1 = mustBeString_1_1;
    }, function(DrawList_1_1) {
      DrawList_1 = DrawList_1_1;
    }, function(PerspectiveCamera_1_1) {
      PerspectiveCamera_1 = PerspectiveCamera_1_1;
    }, function(refChange_1_1) {
      refChange_1 = refChange_1_1;
    }, function(CameraControls_1_1) {
      CameraControls_1 = CameraControls_1_1;
    }, function(World_1_1) {
      World_1 = World_1_1;
    }, function(WebGLRenderer_1_1) {
      WebGLRenderer_1 = WebGLRenderer_1_1;
    }],
    execute: function() {}
  };
});

System.register("davinci-eight.js", ["davinci-eight/commands/BlendFactor", "davinci-eight/commands/WebGLBlendFunc", "davinci-eight/commands/WebGLClearColor", "davinci-eight/commands/Capability", "davinci-eight/commands/WebGLDisable", "davinci-eight/commands/WebGLEnable", "davinci-eight/controls/CameraControls", "davinci-eight/core/AttribLocation", "davinci-eight/core/Color", "davinci-eight/core", "davinci-eight/core/Drawable", "davinci-eight/core/DrawMode", "davinci-eight/core/GeometryContainer", "davinci-eight/core/GeometryElements", "davinci-eight/core/GeometryPrimitive", "davinci-eight/core/GraphicsProgramSymbols", "davinci-eight/core/Mesh", "davinci-eight/core/Scene", "davinci-eight/core/UniformLocation", "davinci-eight/core/WebGLRenderer", "davinci-eight/curves/Curve", "davinci-eight/facets/AmbientLight", "davinci-eight/facets/ColorFacet", "davinci-eight/facets/DirectionalLight", "davinci-eight/facets/ModelFacet", "davinci-eight/facets/PointSizeFacet", "davinci-eight/facets/ReflectionFacetE2", "davinci-eight/facets/ReflectionFacetE3", "davinci-eight/facets/Vector3Facet", "davinci-eight/facets/frustumMatrix", "davinci-eight/facets/PerspectiveCamera", "davinci-eight/facets/perspectiveMatrix", "davinci-eight/facets/viewMatrix", "davinci-eight/facets/ModelE2", "davinci-eight/facets/ModelE3", "davinci-eight/geometries/DrawAttribute", "davinci-eight/geometries/DrawPrimitive", "davinci-eight/geometries/Simplex", "davinci-eight/geometries/Vertex", "davinci-eight/geometries/ArrowGeometry", "davinci-eight/geometries/BoxGeometry", "davinci-eight/geometries/CylinderGeometry", "davinci-eight/geometries/SphereGeometry", "davinci-eight/geometries/TetrahedronGeometry", "davinci-eight/materials/HTMLScriptsMaterial", "davinci-eight/materials/LineMaterial", "davinci-eight/materials/MeshMaterial", "davinci-eight/materials/MeshNormalMaterial", "davinci-eight/materials/PointMaterial", "davinci-eight/materials/GraphicsProgramBuilder", "davinci-eight/materials/smartProgram", "davinci-eight/materials/programFromScripts", "davinci-eight/math/Dimensions", "davinci-eight/math/G2", "davinci-eight/math/G3", "davinci-eight/math/mathcore", "davinci-eight/math/Vector1", "davinci-eight/math/Matrix2", "davinci-eight/math/Matrix3", "davinci-eight/math/Matrix4", "davinci-eight/math/QQ", "davinci-eight/math/Unit", "davinci-eight/math/G2m", "davinci-eight/math/G3m", "davinci-eight/math/Spinor2", "davinci-eight/math/Spinor3", "davinci-eight/math/Vector2", "davinci-eight/math/Vector3", "davinci-eight/math/Vector4", "davinci-eight/math/VectorN", "davinci-eight/overlay/Overlay", "davinci-eight/utils/getCanvasElementById", "davinci-eight/collections/ShareableArray", "davinci-eight/collections/NumberIUnknownMap", "davinci-eight/core/refChange", "davinci-eight/core/Shareable", "davinci-eight/collections/StringIUnknownMap", "davinci-eight/utils/animation", "davinci-eight/visual/Arrow", "davinci-eight/visual/Sphere", "davinci-eight/visual/Box", "davinci-eight/visual/RigidBody", "davinci-eight/visual/Cylinder", "davinci-eight/visual/Tetrahedron", "davinci-eight/visual/Trail", "davinci-eight/visual/bootstrap"], function(exports_1) {
  var BlendFactor_1,
      WebGLBlendFunc_1,
      WebGLClearColor_1,
      Capability_1,
      WebGLDisable_1,
      WebGLEnable_1,
      CameraControls_1,
      AttribLocation_1,
      Color_1,
      core_1,
      Drawable_1,
      DrawMode_1,
      GeometryContainer_1,
      GeometryElements_1,
      GeometryPrimitive_1,
      GraphicsProgramSymbols_1,
      Mesh_1,
      Scene_1,
      UniformLocation_1,
      WebGLRenderer_1,
      Curve_1,
      AmbientLight_1,
      ColorFacet_1,
      DirectionalLight_1,
      ModelFacet_1,
      PointSizeFacet_1,
      ReflectionFacetE2_1,
      ReflectionFacetE3_1,
      Vector3Facet_1,
      frustumMatrix_1,
      PerspectiveCamera_1,
      perspectiveMatrix_1,
      viewMatrix_1,
      ModelE2_1,
      ModelE3_1,
      DrawAttribute_1,
      DrawPrimitive_1,
      Simplex_1,
      Vertex_1,
      ArrowGeometry_1,
      BoxGeometry_1,
      CylinderGeometry_1,
      SphereGeometry_1,
      TetrahedronGeometry_1,
      HTMLScriptsMaterial_1,
      LineMaterial_1,
      MeshMaterial_1,
      MeshNormalMaterial_1,
      PointMaterial_1,
      GraphicsProgramBuilder_1,
      smartProgram_1,
      programFromScripts_1,
      Dimensions_1,
      G2_1,
      G3_1,
      mathcore_1,
      Vector1_1,
      Matrix2_1,
      Matrix3_1,
      Matrix4_1,
      QQ_1,
      Unit_1,
      G2m_1,
      G3m_1,
      Spinor2_1,
      Spinor3_1,
      Vector2_1,
      Vector3_1,
      Vector4_1,
      VectorN_1,
      Overlay_1,
      getCanvasElementById_1,
      ShareableArray_1,
      NumberIUnknownMap_1,
      refChange_1,
      Shareable_1,
      StringIUnknownMap_1,
      animation_1,
      Arrow_1,
      Sphere_1,
      Box_1,
      RigidBody_1,
      Cylinder_1,
      Tetrahedron_1,
      Trail_1,
      bootstrap_1;
  var eight;
  return {
    setters: [function(BlendFactor_1_1) {
      BlendFactor_1 = BlendFactor_1_1;
    }, function(WebGLBlendFunc_1_1) {
      WebGLBlendFunc_1 = WebGLBlendFunc_1_1;
    }, function(WebGLClearColor_1_1) {
      WebGLClearColor_1 = WebGLClearColor_1_1;
    }, function(Capability_1_1) {
      Capability_1 = Capability_1_1;
    }, function(WebGLDisable_1_1) {
      WebGLDisable_1 = WebGLDisable_1_1;
    }, function(WebGLEnable_1_1) {
      WebGLEnable_1 = WebGLEnable_1_1;
    }, function(CameraControls_1_1) {
      CameraControls_1 = CameraControls_1_1;
    }, function(AttribLocation_1_1) {
      AttribLocation_1 = AttribLocation_1_1;
    }, function(Color_1_1) {
      Color_1 = Color_1_1;
    }, function(core_1_1) {
      core_1 = core_1_1;
    }, function(Drawable_1_1) {
      Drawable_1 = Drawable_1_1;
    }, function(DrawMode_1_1) {
      DrawMode_1 = DrawMode_1_1;
    }, function(GeometryContainer_1_1) {
      GeometryContainer_1 = GeometryContainer_1_1;
    }, function(GeometryElements_1_1) {
      GeometryElements_1 = GeometryElements_1_1;
    }, function(GeometryPrimitive_1_1) {
      GeometryPrimitive_1 = GeometryPrimitive_1_1;
    }, function(GraphicsProgramSymbols_1_1) {
      GraphicsProgramSymbols_1 = GraphicsProgramSymbols_1_1;
    }, function(Mesh_1_1) {
      Mesh_1 = Mesh_1_1;
    }, function(Scene_1_1) {
      Scene_1 = Scene_1_1;
    }, function(UniformLocation_1_1) {
      UniformLocation_1 = UniformLocation_1_1;
    }, function(WebGLRenderer_1_1) {
      WebGLRenderer_1 = WebGLRenderer_1_1;
    }, function(Curve_1_1) {
      Curve_1 = Curve_1_1;
    }, function(AmbientLight_1_1) {
      AmbientLight_1 = AmbientLight_1_1;
    }, function(ColorFacet_1_1) {
      ColorFacet_1 = ColorFacet_1_1;
    }, function(DirectionalLight_1_1) {
      DirectionalLight_1 = DirectionalLight_1_1;
    }, function(ModelFacet_1_1) {
      ModelFacet_1 = ModelFacet_1_1;
    }, function(PointSizeFacet_1_1) {
      PointSizeFacet_1 = PointSizeFacet_1_1;
    }, function(ReflectionFacetE2_1_1) {
      ReflectionFacetE2_1 = ReflectionFacetE2_1_1;
    }, function(ReflectionFacetE3_1_1) {
      ReflectionFacetE3_1 = ReflectionFacetE3_1_1;
    }, function(Vector3Facet_1_1) {
      Vector3Facet_1 = Vector3Facet_1_1;
    }, function(frustumMatrix_1_1) {
      frustumMatrix_1 = frustumMatrix_1_1;
    }, function(PerspectiveCamera_1_1) {
      PerspectiveCamera_1 = PerspectiveCamera_1_1;
    }, function(perspectiveMatrix_1_1) {
      perspectiveMatrix_1 = perspectiveMatrix_1_1;
    }, function(viewMatrix_1_1) {
      viewMatrix_1 = viewMatrix_1_1;
    }, function(ModelE2_1_1) {
      ModelE2_1 = ModelE2_1_1;
    }, function(ModelE3_1_1) {
      ModelE3_1 = ModelE3_1_1;
    }, function(DrawAttribute_1_1) {
      DrawAttribute_1 = DrawAttribute_1_1;
    }, function(DrawPrimitive_1_1) {
      DrawPrimitive_1 = DrawPrimitive_1_1;
    }, function(Simplex_1_1) {
      Simplex_1 = Simplex_1_1;
    }, function(Vertex_1_1) {
      Vertex_1 = Vertex_1_1;
    }, function(ArrowGeometry_1_1) {
      ArrowGeometry_1 = ArrowGeometry_1_1;
    }, function(BoxGeometry_1_1) {
      BoxGeometry_1 = BoxGeometry_1_1;
    }, function(CylinderGeometry_1_1) {
      CylinderGeometry_1 = CylinderGeometry_1_1;
    }, function(SphereGeometry_1_1) {
      SphereGeometry_1 = SphereGeometry_1_1;
    }, function(TetrahedronGeometry_1_1) {
      TetrahedronGeometry_1 = TetrahedronGeometry_1_1;
    }, function(HTMLScriptsMaterial_1_1) {
      HTMLScriptsMaterial_1 = HTMLScriptsMaterial_1_1;
    }, function(LineMaterial_1_1) {
      LineMaterial_1 = LineMaterial_1_1;
    }, function(MeshMaterial_1_1) {
      MeshMaterial_1 = MeshMaterial_1_1;
    }, function(MeshNormalMaterial_1_1) {
      MeshNormalMaterial_1 = MeshNormalMaterial_1_1;
    }, function(PointMaterial_1_1) {
      PointMaterial_1 = PointMaterial_1_1;
    }, function(GraphicsProgramBuilder_1_1) {
      GraphicsProgramBuilder_1 = GraphicsProgramBuilder_1_1;
    }, function(smartProgram_1_1) {
      smartProgram_1 = smartProgram_1_1;
    }, function(programFromScripts_1_1) {
      programFromScripts_1 = programFromScripts_1_1;
    }, function(Dimensions_1_1) {
      Dimensions_1 = Dimensions_1_1;
    }, function(G2_1_1) {
      G2_1 = G2_1_1;
    }, function(G3_1_1) {
      G3_1 = G3_1_1;
    }, function(mathcore_1_1) {
      mathcore_1 = mathcore_1_1;
    }, function(Vector1_1_1) {
      Vector1_1 = Vector1_1_1;
    }, function(Matrix2_1_1) {
      Matrix2_1 = Matrix2_1_1;
    }, function(Matrix3_1_1) {
      Matrix3_1 = Matrix3_1_1;
    }, function(Matrix4_1_1) {
      Matrix4_1 = Matrix4_1_1;
    }, function(QQ_1_1) {
      QQ_1 = QQ_1_1;
    }, function(Unit_1_1) {
      Unit_1 = Unit_1_1;
    }, function(G2m_1_1) {
      G2m_1 = G2m_1_1;
    }, function(G3m_1_1) {
      G3m_1 = G3m_1_1;
    }, function(Spinor2_1_1) {
      Spinor2_1 = Spinor2_1_1;
    }, function(Spinor3_1_1) {
      Spinor3_1 = Spinor3_1_1;
    }, function(Vector2_1_1) {
      Vector2_1 = Vector2_1_1;
    }, function(Vector3_1_1) {
      Vector3_1 = Vector3_1_1;
    }, function(Vector4_1_1) {
      Vector4_1 = Vector4_1_1;
    }, function(VectorN_1_1) {
      VectorN_1 = VectorN_1_1;
    }, function(Overlay_1_1) {
      Overlay_1 = Overlay_1_1;
    }, function(getCanvasElementById_1_1) {
      getCanvasElementById_1 = getCanvasElementById_1_1;
    }, function(ShareableArray_1_1) {
      ShareableArray_1 = ShareableArray_1_1;
    }, function(NumberIUnknownMap_1_1) {
      NumberIUnknownMap_1 = NumberIUnknownMap_1_1;
    }, function(refChange_1_1) {
      refChange_1 = refChange_1_1;
    }, function(Shareable_1_1) {
      Shareable_1 = Shareable_1_1;
    }, function(StringIUnknownMap_1_1) {
      StringIUnknownMap_1 = StringIUnknownMap_1_1;
    }, function(animation_1_1) {
      animation_1 = animation_1_1;
    }, function(Arrow_1_1) {
      Arrow_1 = Arrow_1_1;
    }, function(Sphere_1_1) {
      Sphere_1 = Sphere_1_1;
    }, function(Box_1_1) {
      Box_1 = Box_1_1;
    }, function(RigidBody_1_1) {
      RigidBody_1 = RigidBody_1_1;
    }, function(Cylinder_1_1) {
      Cylinder_1 = Cylinder_1_1;
    }, function(Tetrahedron_1_1) {
      Tetrahedron_1 = Tetrahedron_1_1;
    }, function(Trail_1_1) {
      Trail_1 = Trail_1_1;
    }, function(bootstrap_1_1) {
      bootstrap_1 = bootstrap_1_1;
    }],
    execute: function() {
      eight = {
        get LAST_MODIFIED() {
          return core_1.default.LAST_MODIFIED;
        },
        get safemode() {
          return core_1.default.safemode;
        },
        set safemode(safemode) {
          core_1.default.safemode = safemode;
        },
        get strict() {
          return core_1.default.strict;
        },
        set strict(value) {
          core_1.default.strict = value;
        },
        get verbose() {
          return core_1.default.verbose;
        },
        set verbose(value) {
          if (typeof value === 'boolean') {
            core_1.default.verbose = value;
          } else {
            throw new TypeError('verbose must be a boolean');
          }
        },
        get VERSION() {
          return core_1.default.VERSION;
        },
        get HTMLScriptsMaterial() {
          return HTMLScriptsMaterial_1.default;
        },
        get LineMaterial() {
          return LineMaterial_1.default;
        },
        get MeshMaterial() {
          return MeshMaterial_1.default;
        },
        get MeshNormalMaterial() {
          return MeshNormalMaterial_1.default;
        },
        get PointMaterial() {
          return PointMaterial_1.default;
        },
        get GraphicsProgramBuilder() {
          return GraphicsProgramBuilder_1.default;
        },
        get BlendFactor() {
          return BlendFactor_1.default;
        },
        get Capability() {
          return Capability_1.default;
        },
        get WebGLBlendFunc() {
          return WebGLBlendFunc_1.default;
        },
        get WebGLClearColor() {
          return WebGLClearColor_1.default;
        },
        get WebGLDisable() {
          return WebGLDisable_1.default;
        },
        get WebGLEnable() {
          return WebGLEnable_1.default;
        },
        get ModelE2() {
          return ModelE2_1.default;
        },
        get ModelE3() {
          return ModelE3_1.default;
        },
        get ModelFacet() {
          return ModelFacet_1.default;
        },
        get Simplex() {
          return Simplex_1.default;
        },
        get Vertex() {
          return Vertex_1.default;
        },
        get frustumMatrix() {
          return frustumMatrix_1.default;
        },
        get perspectiveMatrix() {
          return perspectiveMatrix_1.default;
        },
        get viewMatrix() {
          return viewMatrix_1.default;
        },
        get Scene() {
          return Scene_1.default;
        },
        get Drawable() {
          return Drawable_1.default;
        },
        get PerspectiveCamera() {
          return PerspectiveCamera_1.default;
        },
        get getCanvasElementById() {
          return getCanvasElementById_1.default;
        },
        get WebGLRenderer() {
          return WebGLRenderer_1.default;
        },
        get animation() {
          return animation_1.default;
        },
        get DrawMode() {
          return DrawMode_1.default;
        },
        get AttribLocation() {
          return AttribLocation_1.default;
        },
        get UniformLocation() {
          return UniformLocation_1.default;
        },
        get smartProgram() {
          return smartProgram_1.default;
        },
        get Color() {
          return Color_1.default;
        },
        get CameraControls() {
          return CameraControls_1.default;
        },
        get AmbientLight() {
          return AmbientLight_1.default;
        },
        get ColorFacet() {
          return ColorFacet_1.default;
        },
        get DirectionalLight() {
          return DirectionalLight_1.default;
        },
        get PointSizeFacet() {
          return PointSizeFacet_1.default;
        },
        get ReflectionFacetE2() {
          return ReflectionFacetE2_1.default;
        },
        get ReflectionFacetE3() {
          return ReflectionFacetE3_1.default;
        },
        get Vector3Facet() {
          return Vector3Facet_1.default;
        },
        get ArrowGeometry() {
          return ArrowGeometry_1.default;
        },
        get BoxGeometry() {
          return BoxGeometry_1.default;
        },
        get CylinderGeometry() {
          return CylinderGeometry_1.default;
        },
        get SphereGeometry() {
          return SphereGeometry_1.default;
        },
        get TetrahedronGeometry() {
          return TetrahedronGeometry_1.default;
        },
        get Dimensions() {
          return Dimensions_1.default;
        },
        get Unit() {
          return Unit_1.default;
        },
        get G2() {
          return G2_1.default;
        },
        get G3() {
          return G3_1.default;
        },
        get Matrix2() {
          return Matrix2_1.default;
        },
        get Matrix3() {
          return Matrix3_1.default;
        },
        get Matrix4() {
          return Matrix4_1.default;
        },
        get QQ() {
          return QQ_1.default;
        },
        get G2m() {
          return G2m_1.default;
        },
        get G3m() {
          return G3m_1.default;
        },
        get Vector1() {
          return Vector1_1.default;
        },
        get Spinor2() {
          return Spinor2_1.default;
        },
        get Spinor3() {
          return Spinor3_1.default;
        },
        get Vector2() {
          return Vector2_1.default;
        },
        get Vector3() {
          return Vector3_1.default;
        },
        get Vector4() {
          return Vector4_1.default;
        },
        get VectorN() {
          return VectorN_1.default;
        },
        get Curve() {
          return Curve_1.default;
        },
        get GraphicsProgramSymbols() {
          return GraphicsProgramSymbols_1.default;
        },
        get GeometryContainer() {
          return GeometryContainer_1.default;
        },
        get GeometryElements() {
          return GeometryElements_1.default;
        },
        get GeometryPrimitive() {
          return GeometryPrimitive_1.default;
        },
        get Overlay() {
          return Overlay_1.default;
        },
        get programFromScripts() {
          return programFromScripts_1.default;
        },
        get DrawAttribute() {
          return DrawAttribute_1.default;
        },
        get DrawPrimitive() {
          return DrawPrimitive_1.default;
        },
        get ShareableArray() {
          return ShareableArray_1.default;
        },
        get NumberIUnknownMap() {
          return NumberIUnknownMap_1.default;
        },
        get refChange() {
          return refChange_1.default;
        },
        get Shareable() {
          return Shareable_1.default;
        },
        get StringIUnknownMap() {
          return StringIUnknownMap_1.default;
        },
        get cos() {
          return mathcore_1.default.cos;
        },
        get cosh() {
          return mathcore_1.default.cosh;
        },
        get exp() {
          return mathcore_1.default.exp;
        },
        get log() {
          return mathcore_1.default.log;
        },
        get norm() {
          return mathcore_1.default.norm;
        },
        get quad() {
          return mathcore_1.default.quad;
        },
        get sin() {
          return mathcore_1.default.sin;
        },
        get sinh() {
          return mathcore_1.default.sinh;
        },
        get sqrt() {
          return mathcore_1.default.sqrt;
        },
        get Arrow() {
          return Arrow_1.default;
        },
        get Sphere() {
          return Sphere_1.default;
        },
        get Box() {
          return Box_1.default;
        },
        get Mesh() {
          return Mesh_1.default;
        },
        get RigidBody() {
          return RigidBody_1.default;
        },
        get Cylinder() {
          return Cylinder_1.default;
        },
        get Tetrahedron() {
          return Tetrahedron_1.default;
        },
        get Trail() {
          return Trail_1.default;
        },
        get bootstrap() {
          return bootstrap_1.default;
        }
      };
      exports_1("default", eight);
    }
  };
});

//# sourceMappingURL=davinci-eight-system-es5.js.map