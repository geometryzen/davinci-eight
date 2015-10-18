import IContextMonitor = require('../core/IContextMonitor');
import getAttribVarName = require('../core/getAttribVarName');
import GeometryElements = require('../geometries/GeometryElements');
import getUniformVarName = require('../core/getUniformVarName');
import glslAttribType = require('../programs/glslAttribType');
import Material = require('../materials/Material');
import mustBeInteger = require('../checks/mustBeInteger');
import mustBeString = require('../checks/mustBeString');
import SmartMaterial = require('../materials/SmartMaterial');
import UniformMetaInfo = require('../core/UniformMetaInfo');
import vColorRequired = require('../programs/vColorRequired');
import vLightRequired = require('../programs/vLightRequired');

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
  private aMeta: { [key: string]: { size: number; } } = {};
  private uParams: { [key: string]: { glslType: string; name?: string } } = {};
  /**
   * @class SmartMaterialBuilder
   * @constructor
   * @param elements [GeometryElements]
   */
  constructor(elements?: GeometryElements) {
    if (elements) {
      let attributes = elements.attributes;
      let keys = Object.keys(attributes);
      let keysLength = keys.length;
      for (var i = 0; i < keysLength; i++) {
        let key = keys[i];
        let attribute = attributes[key];
        this.attribute(key, attribute.size);
      }
    }
  }
  /**
   * Declares that the material should have an `attribute` with the specified name and size.
   * @method attribute
   * @param name {string}
   * @param size {number}
   */
  public attribute(name: string, size: number): SmartMaterialBuilder {
    mustBeString('name', name);
    mustBeInteger('size', size);

    this.aMeta[name] = { size: size };
    return this;
  }
  /**
   * Declares that the material should have a `uniform` with the specified name and type.
   * @method uniform
   * @param name {string}
   * @param type {string} The GLSL type. e.g. 'float', 'vec3', 'mat2'
   */
  public uniform(name: string, type: string): SmartMaterialBuilder {
    mustBeString('name', name);
    mustBeString('type', type);  // Must also be a valid GLSL type.

    this.uParams[name] = { glslType: type };
    return this;
  }
  /**
   * @method build
   * @param contexts {IContextMonitor[]}
   * @return {Material}
   */
  public build(contexts: IContextMonitor[]): Material {
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