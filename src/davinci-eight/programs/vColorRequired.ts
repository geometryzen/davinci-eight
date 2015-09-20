import mustBeDefined = require('../checks/mustBeDefined');
import Symbolic = require('../core/Symbolic');

function vColorRequired(attributes: { [name: string]: {} }, uniforms: { [name: string]: {} }): boolean {
  return !!attributes[Symbolic.ATTRIBUTE_COLOR] || !!uniforms[Symbolic.UNIFORM_COLOR];
}

export = vColorRequired;
