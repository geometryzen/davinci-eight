import { GraphicsProgramSymbols } from '../core/GraphicsProgramSymbols';
/**
 * @hidden
 */
export function vColorRequired(attributes, uniforms) {
    return !!attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] || !!uniforms[GraphicsProgramSymbols.UNIFORM_COLOR];
}
