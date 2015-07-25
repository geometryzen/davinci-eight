var MultiUniformProvider = require('../uniforms/MultiUniformProvider');
/**
 * @method uniforms
 */
function uniforms(providers) {
    return new MultiUniformProvider(providers);
}
module.exports = uniforms;
