import shaderProgram = require('../programs/shaderProgram');
import IProgram = require('../core/IProgram');
import isDefined = require('../checks/isDefined');
import expectArg = require('../checks/expectArg');
import ContextMonitor = require('../core/ContextMonitor');
import MonitorList = require('../scene/MonitorList');

// FIXME: Lists of scripts, using the type to distinguish vertex/fragment?
// FIXME: Temporary rename simpleProgramFromScripts?

/**
 * @method programFromScripts
 * @param monitors {ContextMonitor[]}
 * @param vsId {string} The vertex shader script element identifier.
 * @param fsId {string} The fragment shader script element identifier.
 * @param $document {Document} The document containing the script elements.
 */
function programFromScripts(monitors: ContextMonitor[], vsId: string, fsId: string, $document: Document, attribs: string[] = []): IProgram {
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
  return shaderProgram(monitors, vertexShader, fragmentShader, attribs);
}

export = programFromScripts;