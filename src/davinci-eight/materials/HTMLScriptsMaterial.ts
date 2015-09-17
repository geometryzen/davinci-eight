import ContextManager = require('../core/ContextManager');
import ContextMonitor = require('../core/ContextMonitor');
import IProgram = require('../core/IProgram');
import Material = require('../materials/Material');
import MonitorList = require('../scene/MonitorList');
import mustSatisfy = require('../checks/mustSatisfy');
import programFromScripts = require('../programs/programFromScripts');

/**
 * Name used for reference count monitoring and logging.
 */
let CLASS_NAME = 'HTMLScriptsMaterial';

function nameBuilder(): string {
  return CLASS_NAME;
}

/**
 * @module EIGHT
 * @class HTMLScriptsMaterial
 * @extends Material
 */
class HTMLScriptsMaterial extends Material {
  public scriptIds: string[];
  public dom: Document;
  public attributeBindings: string[] = [];
  /**
   * @constructor
   * @param contexts {ContextMonitor[]}
   * @param scriptIds {string[]}
   * @param dom {Document}
   */
  constructor(contexts: ContextMonitor[], scriptIds: string[] = [], dom: Document = document) {
    super(contexts, CLASS_NAME);
    // For now, we limit the implementation to only a vertex shader and a fragment shader.
    mustSatisfy('scriptIds', scriptIds.length === 2, () => { return "scriptIds must be [vsId, fsId]";});
    this.scriptIds = scriptIds.map(function(scriptId) { return scriptId });
    this.dom = dom;
  }
  createProgram(): IProgram {
    let vsId = this.scriptIds[0];
    let fsId = this.scriptIds[1];
    return programFromScripts(this.monitors, vsId, fsId, this.dom, this.attributeBindings);
  }
}

export = HTMLScriptsMaterial;
