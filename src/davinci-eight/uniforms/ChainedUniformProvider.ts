import UniformMetaInfos = require('../core/UniformMetaInfos');
import UniformProvider = require('../core/UniformProvider');

class ChainedUniformProvider implements UniformProvider {
  private provider: UniformProvider;
  private fallback: UniformProvider;
  constructor(provider: UniformProvider, fallback: UniformProvider) {
    this.provider = provider;
    this.fallback = fallback;
  }
  getUniformMatrix3(name: string) {
    let m3 = this.provider.getUniformMatrix3(name);
    if (m3) {
      return m3;
    }
    else {
      return this.fallback.getUniformMatrix3(name);
    }
  }
  getUniformMatrix4(name: string) {
    let m4 = this.provider.getUniformMatrix4(name);
    if (m4) {
      return m4;
    }
    else {
      return this.fallback.getUniformMatrix4(name);
    }
  }
  getUniformVector2(name: string): number[] {
    let v2: number[] = this.provider.getUniformVector2(name);
    if (v2) {
      return v2;
    }
    else {
      return this.fallback.getUniformVector3(name);
    }
  }
  getUniformVector3(name: string): number[] {
    let v3: number[] = this.provider.getUniformVector3(name);
    if (v3) {
      return v3;
    }
    else {
      return this.fallback.getUniformVector3(name);
    }
  }
  getUniformVector4(name: string): number[] {
    let v4: number[] = this.provider.getUniformVector4(name);
    if (v4) {
      return v4;
    }
    else {
      return this.fallback.getUniformVector4(name);
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

export = ChainedUniformProvider;
