import IContextMonitor = require('../core/IContextMonitor');
import IGraphicsProgram = require('../core/IGraphicsProgram');
import GraphicsProgram = require('../materials/GraphicsProgram');
/**
 * @class HTMLScriptsGraphicsProgram
 * @extends GraphicsProgram
 */
declare class HTMLScriptsGraphicsProgram extends GraphicsProgram {
    /**
     * The identifiers of the HTML &lt;script&gt; tags containing the shader code.
     * @property scriptIds
     * @type {Array&lt;string&gt;}
     */
    scriptIds: string[];
    /**
     * @property dom
     * @type {Document}
     */
    dom: Document;
    /**
     * An ordered list of names of program attributes implicitly specifying the index bindings.
     * @property attributeBindings
     * @type {Array&lt;string&gt;}
     */
    attributeBindings: string[];
    /**
     * @class HTMLScriptsGraphicsProgram
     * @constructor
     * @param contexts {IContextMonitor[]}
     * @param scriptIds {string[]}
     * @param dom {Document}
     */
    constructor(contexts: IContextMonitor[], scriptIds?: string[], dom?: Document);
    /**
     * @method createGraphicsProgram
     * @return {IGraphicsProgram}
     * @protected
     */
    protected createGraphicsProgram(): IGraphicsProgram;
}
export = HTMLScriptsGraphicsProgram;
