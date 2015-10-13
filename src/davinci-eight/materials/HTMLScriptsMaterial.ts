import IContextProvider = require('../core/IContextProvider');
import IContextMonitor = require('../core/IContextMonitor');
import IMaterial = require('../core/IMaterial');
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
 * @class HTMLScriptsMaterial
 * @extends Material
 */
class HTMLScriptsMaterial extends Material {
  public scriptIds: string[];
  public dom: Document;
  public attributeBindings: string[] = [];
  /**
   * @class HTMLScriptsMaterial
   * @constructor
   * @param contexts {IContextMonitor[]}
   * @param scriptIds {string[]}
   * @param dom {Document}
   */
  constructor(contexts: IContextMonitor[], scriptIds: string[] = [], dom: Document = document) {
    super(contexts, CLASS_NAME);
    // For now, we limit the implementation to only a vertex shader and a fragment shader.
    mustSatisfy('scriptIds', scriptIds.length === 2, () => { return "scriptIds must be [vsId, fsId]";});
    this.scriptIds = scriptIds.map(function(scriptId) { return scriptId });
    this.dom = dom;
  }
  /**
   * @method createMaterial
   * @return {IMaterial}
   */
  createMaterial(): IMaterial {
    let vsId = this.scriptIds[0];
    let fsId = this.scriptIds[1];
    return programFromScripts(this.monitors, vsId, fsId, this.dom, this.attributeBindings);
  }
}

export = HTMLScriptsMaterial;
