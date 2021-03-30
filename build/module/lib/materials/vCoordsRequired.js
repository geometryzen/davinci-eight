import { mustBeDefined } from '../checks/mustBeDefined';
import { GraphicsProgramSymbols } from '../core/GraphicsProgramSymbols';
/**
 * @hidden
 */
export function vCoordsRequired(attributes, uniforms) {
    mustBeDefined('attributes', attributes);
    mustBeDefined('uniforms', uniforms);
    return !!attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS];
}
