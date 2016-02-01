import IContextProvider from '../core/IContextProvider';
import IContextMonitor from '../core/IContextMonitor';
import IGraphicsProgram from '../core/IGraphicsProgram';
import GraphicsProgram from '../materials/GraphicsProgram';
import MonitorList from '../scene/MonitorList';
import mustSatisfy from '../checks/mustSatisfy';
import programFromScripts from '../programs/programFromScripts';

/**
 * @class HTMLScriptsGraphicsProgram
 * @extends GraphicsProgram
 */
export default class HTMLScriptsGraphicsProgram extends GraphicsProgram {

    /**
     * The identifiers of the HTML &lt;script&gt; tags containing the shader code.
     * @property scriptIds
     * @type {Array&lt;string&gt;}
     */
    public scriptIds: string[];

    /**
     * @property dom
     * @type {Document}
     */
    public dom: Document;

    /**
     * An ordered list of names of program attributes implicitly specifying the index bindings.
     * @property attributeBindings
     * @type {Array&lt;string&gt;}
     */
    public attributeBindings: string[] = [];

    /**
     * @class HTMLScriptsGraphicsProgram
     * @constructor
     * @param contexts {IContextMonitor[]}
     * @param scriptIds {string[]}
     * @param dom {Document}
     */
    constructor(scriptIds: string[] = [], dom: Document = document, monitors?: IContextMonitor[]) {
        super('HTMLScriptsGraphicsProgram', monitors);
        // For now, we limit the implementation to only a vertex shader and a fragment shader.
        mustSatisfy('scriptIds', scriptIds.length === 2, () => { return "scriptIds must be [vsId, fsId]"; });
        this.scriptIds = scriptIds.map(function(scriptId) { return scriptId });
        this.dom = dom;
    }

    /**
     * @method createGraphicsProgram
     * @return {IGraphicsProgram}
     * @protected
     */
    protected createGraphicsProgram(): IGraphicsProgram {
        let vsId = this.scriptIds[0]
        let fsId = this.scriptIds[1]
        return programFromScripts(this.monitors, vsId, fsId, this.dom, this.attributeBindings)
    }
}
