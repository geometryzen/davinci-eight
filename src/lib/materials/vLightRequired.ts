import { mustBeDefined } from '../checks/mustBeDefined';
import { GraphicsProgramSymbols } from '../core/GraphicsProgramSymbols';

export function vLightRequired(attributes: { [name: string]: {} }, uniforms: { [name: string]: {} }): boolean {
    mustBeDefined('attributes', attributes);
    mustBeDefined('uniforms', uniforms);
    return !!uniforms[GraphicsProgramSymbols.UNIFORM_AMBIENT_LIGHT] || (!!uniforms[GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR] && !!uniforms[GraphicsProgramSymbols.UNIFORM_DIRECTIONAL_LIGHT_COLOR]);
}
