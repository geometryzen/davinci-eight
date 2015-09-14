import Program = require('../core/Program');
import shaderProgram = require('../programs/shaderProgram');
import isDefined = require('../checks/isDefined');
import expectArg = require('../checks/expectArg');
import ContextManager = require('../core/ContextManager');

/**
 * @method programFromScripts
 * @param monitor {ContextManager}
 * @param vsId {string} The vertex shader script element identifier.
 * @param fsId {string} The fragment shader script element identifier.
 * @param $document {Document} The document containing the script elements.
 */
function programFromScripts(monitor: ContextManager, vsId: string, fsId: string, $document: Document, attribs: string[] = []): Program {
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
  return shaderProgram(monitor, vertexShader, fragmentShader, attribs);
}

export = programFromScripts;