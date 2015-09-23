import ContextMonitor = require('../core/ContextMonitor');
import IMaterial = require('../core/IMaterial');
import Material = require('../materials/Material');
/**
 * @class HTMLScriptsMaterial
 * @extends Material
 */
declare class HTMLScriptsMaterial extends Material {
    scriptIds: string[];
    dom: Document;
    attributeBindings: string[];
    /**
     * @class HTMLScriptsMaterial
     * @constructor
     * @param contexts {ContextMonitor[]}
     * @param scriptIds {string[]}
     * @param dom {Document}
     */
    constructor(contexts: ContextMonitor[], scriptIds?: string[], dom?: Document);
    /**
     * @method createProgram
     * @return {IMaterial}
     */
    createProgram(): IMaterial;
}
export = HTMLScriptsMaterial;
