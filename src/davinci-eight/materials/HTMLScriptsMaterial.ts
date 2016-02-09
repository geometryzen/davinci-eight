import mustBeObject from '../checks/mustBeObject';
import mustBeString from '../checks/mustBeString';
import Material from '../core/Material';

/**
 * @module EIGHT
 * @submodule materials
 */

function $(id: string, dom: Document): HTMLElement {
    const element = dom.getElementById(mustBeString('id', id))
    if (element) {
        return element;
    }
    else {
        throw new Error(id + " is not a valid DOM element identifier.");
    }
}

function vertexShader(scriptIds: string[], dom: Document): string {
    const vsId = scriptIds[0]
    mustBeString('vsId', vsId)
    mustBeObject('dom', dom)
    return $(vsId, dom).textContent;
}

function fragmentShader(scriptIds: string[], dom: Document): string {
    const fsId = scriptIds[1]
    mustBeString('fsId', fsId)
    mustBeObject('dom', dom)
    return $(fsId, dom).textContent;
}

/**
 * @class HTMLScriptsMaterial
 * @extends Material
 */
export default class HTMLScriptsMaterial extends Material {
    /**
     * @class HTMLScriptsMaterial
     * @constructor
     * @param scriptIds {string[]}
     * @param dom {Document}
     */
    constructor(scriptIds: string[] = [], dom: Document = document) {
        super(vertexShader(scriptIds, dom), fragmentShader(scriptIds, dom));
    }
}
