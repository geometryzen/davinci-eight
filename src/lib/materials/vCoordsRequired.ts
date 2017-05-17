import { mustBeDefined } from '../checks/mustBeDefined';
import { GraphicsProgramSymbols } from '../core/GraphicsProgramSymbols';

export function vCoordsRequired(attributes: { [name: string]: {} }, uniforms: { [name: string]: {} }): boolean {
    mustBeDefined('attributes', attributes);
    mustBeDefined('uniforms', uniforms);
    return !!attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS];
}
