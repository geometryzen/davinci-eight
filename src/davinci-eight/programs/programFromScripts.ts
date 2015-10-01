import createMaterial = require('../programs/createMaterial');
import IMaterial = require('../core/IMaterial');
import isDefined = require('../checks/isDefined');
import expectArg = require('../checks/expectArg');
import IContextMonitor = require('../core/IContextMonitor');
import MonitorList = require('../scene/MonitorList');

// FIXME: Lists of scripts, using the type to distinguish vertex/fragment?
// FIXME: Temporary rename simpleProgramFromScripts?

/**
 * @method programFromScripts
 * @param monitors {IContextMonitor[]}
 * @param vsId {string} The vertex shader script element identifier.
 * @param fsId {string} The fragment shader script element identifier.
 * @param $document {Document} The document containing the script elements.
 */
function programFromScripts(monitors: IContextMonitor[], vsId: string, fsId: string, $document: Document, attribs: string[] = []): IMaterial {
  MonitorList.verify('monitors', monitors, () => { return "programFromScripts";});
  expectArg('vsId', vsId).toBeString();
  expectArg('fsId', fsId).toBeString();
  expectArg('$document', $document).toBeObject();

  function $(id: string): HTMLElement {
    expectArg('id', id).toBeString();
    let element = $document.getElementById(id);
    if (element) {
      return element;
    }
    else {
      throw new Error(id + " is not a valid DOM element identifier.");
    }
  }
  let vertexShader: string = $(vsId).textContent;
  let fragmentShader: string = $(fsId).textContent;
  return createMaterial(monitors, vertexShader, fragmentShader, attribs);
}

export = programFromScripts;