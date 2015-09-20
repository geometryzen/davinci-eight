import mustBeDefined = require('../checks/mustBeDefined');
import Symbolic = require('../core/Symbolic');

function vLightRequired(attributes: { [name: string]: {} }, uniforms: { [name: string]: {} }): boolean {
  mustBeDefined('attributes', attributes)
  mustBeDefined('uniforms', uniforms)
  return !!uniforms[Symbolic.UNIFORM_AMBIENT_LIGHT] || (!!uniforms[Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR] && !!uniforms[Symbolic.UNIFORM_DIRECTIONAL_LIGHT_COLOR]);
}

export = vLightRequired;
