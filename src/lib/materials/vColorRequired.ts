import { GraphicsProgramSymbols } from '../core/GraphicsProgramSymbols';

/**
 * @hidden
 */
export function vColorRequired(attributes: { [name: string]: unknown }, uniforms: { [name: string]: unknown }): boolean {
    return !!attributes[GraphicsProgramSymbols.ATTRIBUTE_COLOR] || !!uniforms[GraphicsProgramSymbols.UNIFORM_COLOR];
}
