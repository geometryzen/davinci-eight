import { mustBeDefined } from "../checks/mustBeDefined";
import { GraphicsProgramSymbols } from "../core/GraphicsProgramSymbols";

/**
 * @hidden
 */
export function vCoordsRequired(attributes: { [name: string]: unknown }, uniforms: { [name: string]: unknown }): boolean {
    mustBeDefined("attributes", attributes);
    mustBeDefined("uniforms", uniforms);
    return !!attributes[GraphicsProgramSymbols.ATTRIBUTE_COORDS];
}
