import UniformMetaInfos = require('../core/UniformMetaInfos');
import UniformProvider = require('../core/UniformProvider');
import DefaultUniformProvider = require('../core/DefaultUniformProvider');

function isDefined(value): boolean {return value !== void 0;}

class MultiUniformProvider extends DefaultUniformProvider {
  private providers: UniformProvider[] = [];
  constructor(providers: UniformProvider[]) {
    super();
    this.providers = providers;
  }
  getUniformFloat(name: string): number {
    var values = this.providers.map(function(provider) { return provider.getUniformFloat(name) }).filter(isDefined);
    if (values.length === 1) {
      return values[0];
    }
    else {
      return super.getUniformFloat(name);
    }
  }
  getUniformMatrix2(name: string) {
    var values = this.providers.map(function(provider) { return provider.getUniformMatrix2(name) }).filter(isDefined);
    if (values.length === 1) {
      return values[0];
    }
    else {
      return super.getUniformMatrix2(name);
    }
  }
  getUniformMatrix3(name: string) {
    var values = this.providers.map(function(provider) { return provider.getUniformMatrix3(name) }).filter(isDefined);
    if (values.length === 1) {
      return values[0];
    }
    else {
      return super.getUniformMatrix3(name);
    }
  }
  getUniformMatrix4(name: string) {
    var values = this.providers.map(function(provider) { return provider.getUniformMatrix4(name) }).filter(isDefined);
    if (values.length === 1) {
      return values[0];
    }
    else {
      return super.getUniformMatrix4(name);
    }
  }
  getUniformVector2(name: string): number[] {
    var values = this.providers.map(function(provider) { return provider.getUniformVector2(name) }).filter(isDefined);
    if (values.length === 1) {
      return values[0];
    }
    else {
      return super.getUniformVector2(name);
    }
  }
  getUniformVector3(name: string): number[] {
    var values = this.providers.map(function(provider) { return provider.getUniformVector3(name) }).filter(isDefined);
    if (values.length === 1) {
      return values[0];
    }
    else {
      return super.getUniformVector3(name);
    }
  }
  getUniformVector4(name: string): number[] {
    var values = this.providers.map(function(provider) { return provider.getUniformVector4(name) }).filter(isDefined);
    if (values.length === 1) {
      return values[0];
    }
    else {
      return super.getUniformVector4(name);
    }
  }
  getUniformMeta(): UniformMetaInfos {
    var uniforms: UniformMetaInfos = super.getUniformMeta();
    this.providers.forEach(function(provider: UniformProvider) {
      var metas = provider.getUniformMeta();
      for (var id in metas) {
        uniforms[id] = metas[id];
      }
    });
    return uniforms;
  }
}

export = MultiUniformProvider;
