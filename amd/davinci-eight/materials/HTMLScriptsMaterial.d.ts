import ContextMonitor = require('../core/ContextMonitor');
import IProgram = require('../core/IProgram');
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
     * @return {IProgram}
     */
    createProgram(): IProgram;
}
export = HTMLScriptsMaterial;
