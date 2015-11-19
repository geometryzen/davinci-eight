import mustBeDefined = require('../checks/mustBeDefined');
import GraphicsProgramSymbols = require('../core/GraphicsProgramSymbols');

function vColorRequired(attributes: { [name: string]: {} }, uniforms: { [name: string]: {} }): boolean {
  return !!attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] || !!uniforms[GraphicsProgramSymbols.UNIFORM_COLOR];
}

export = vColorRequired;
