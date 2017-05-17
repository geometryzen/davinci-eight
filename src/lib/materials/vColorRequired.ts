import { GraphicsProgramSymbols } from '../core/GraphicsProgramSymbols';

export function vColorRequired(attributes: { [name: string]: {} }, uniforms: { [name: string]: {} }): boolean {
    return !!attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] || !!uniforms[GraphicsProgramSymbols.UNIFORM_COLOR];
}
