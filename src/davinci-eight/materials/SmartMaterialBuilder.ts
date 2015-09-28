import ContextMonitor = require('../core/ContextMonitor');
import getAttribVarName = require('../core/getAttribVarName');
import SerialGeometry = require('../geometries/SerialGeometry');
import getUniformVarName = require('../core/getUniformVarName');
import glslAttribType = require('../programs/glslAttribType');
import Material = require('../materials/Material');
import mustBeInteger = require('../checks/mustBeInteger');
import mustBeString = require('../checks/mustBeString');
import SmartMaterial = require('../materials/SmartMaterial');
import UniformMetaInfo = require('../core/UniformMetaInfo');
import vColorRequired = require('../programs/vColorRequired');
import vLightRequired = require('../programs/vLightRequired');

// FIXME: Probably shuld do this calculation
function computeAttribParams(values: { [key: string]: { size: number, name?: string}}) {
  var result: { [key: string]: { glslType: string, name?: string}} = {}
  let keys = Object.keys(values);
  let keysLength = keys.length;
  for (var i = 0; i < keysLength;i++) {
    let key = keys[i];
    let attribute = values[key];
    let size = mustBeInteger('size', attribute.size);
    let varName = getAttribVarName(attribute, key);
    result[varName] = {glslType: glslAttribType(key, size)};
  }
  return result;
}

function updateUniformMeta(uniforms: {[key: string]: UniformMetaInfo}[]) {
  uniforms.forEach(function(values) {
    let keys = Object.keys(values);
    let keysLength = keys.length;
    for (var i = 0; i < keysLength; i++) {
      let key = keys[i];
      let uniform = values[key];
      let varName = getUniformVarName(uniform, key);
      this.uParams[varName] = { glslType: uniform.glslType };
    }
  });
}

/**
 * @class SmartMaterialBuilder
 */
class SmartMaterialBuilder {
  private aMeta: { [key: string]: { size: number; name?: string } } = {};
  private uParams: { [key: string]: { glslType: string; name?: string } } = {};
  /**
   * @class SmartMaterialBuilder
   * @constructor
   * @param geometry {Geometry} Optional.
   */
  constructor(geometry?: SerialGeometry) {
    if (geometry) {
      let attributes = geometry.meta.attributes;
      let keys = Object.keys(attributes);
      let keysLength = keys.length;
      for (var i = 0; i < keysLength; i++) {
        let key = keys[i];
        let attribute = attributes[key];
        this.attribute(key, attribute.size, attribute.name);
      }
    }
  }
  public attribute(key: string, size: number, name?: string): SmartMaterialBuilder {
    mustBeString('key', key);
    mustBeInteger('size', size);

    this.aMeta[key] = { size: size };
    if (name) {
      mustBeString('name', name);
      this.aMeta[key].name = name;
    }
    return this;
  }
  public uniform(key: string, type: string, name?: string): SmartMaterialBuilder {
    mustBeString('key', key);
    mustBeString('type', type);  // Must also be a valid GLSL type.

    this.uParams[key] = { glslType: type };
    if (name) {
      mustBeString('name', name);
      this.uParams[key].name = name;
    }
    return this;
  }
  public build(contexts: ContextMonitor[]): Material {
    // FIXME: Push this calculation down into the functions.
    // Then the data structures are based on size.
    // uniforms based on numeric type?
    let aParams = computeAttribParams(this.aMeta);
    let vColor = vColorRequired(aParams, this.uParams);
    let vLight = vLightRequired(aParams, this.uParams);
    return new SmartMaterial(contexts, aParams, this.uParams, vColor, vLight);
  }
}

export = SmartMaterialBuilder;