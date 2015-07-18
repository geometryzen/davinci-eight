import UniformMetaInfos = require('../core/UniformMetaInfos');
import Vector3 = require('../math/Vector3');
import VertexUniformProvider = require('../core/VertexUniformProvider');

class ChainedVertexUniformProvider implements VertexUniformProvider {
  private provider: VertexUniformProvider;
  private fallback: VertexUniformProvider;
  constructor(provider: VertexUniformProvider, fallback: VertexUniformProvider) {
    this.provider = provider;
    this.fallback = fallback;
  }
  getUniformMatrix3(name: string) {
    var m3 = this.provider.getUniformMatrix3(name);
    if (m3) {
      return m3;
    }
    else {
      return this.fallback.getUniformMatrix3(name);
    }
  }
  getUniformMatrix4(name: string) {
    var m4 = this.provider.getUniformMatrix4(name);
    if (m4) {
      return m4;
    }
    else {
      return this.fallback.getUniformMatrix4(name);
    }
  }
  getUniformVector3(name: string): Vector3 {
    var v3: Vector3 = this.provider.getUniformVector3(name);
    if (v3) {
      return v3;
    }
    else {
      return this.fallback.getUniformVector3(name);
    }
  }
  getUniformMetaInfos(): UniformMetaInfos {
    var uniforms: UniformMetaInfos = {};
    var ones = this.provider.getUniformMetaInfos();
    for (name in ones) {
      uniforms[name] = ones[name];
    }
    var twos = this.fallback.getUniformMetaInfos();
    for (name in twos) {
      uniforms[name] = twos[name];
    }
    return uniforms;
  }
}

export = ChainedVertexUniformProvider;
