import UniformProvider = require('../core/UniformProvider');
import MultiUniformProvider = require('../uniforms/MultiUniformProvider');

/**
 * @method uniforms
 */
function uniforms(providers: UniformProvider[]): UniformProvider {
  return new MultiUniformProvider(providers);
}

export = uniforms;