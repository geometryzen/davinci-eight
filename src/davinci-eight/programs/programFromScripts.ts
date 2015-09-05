import ShaderProgram = require('../core/ShaderProgram');
import shaderProgram = require('../programs/shaderProgram');
import isDefined = require('../checks/isDefined');
import expectArg = require('../checks/expectArg');

/**
 * @method programFromScripts
 * @param vsId {string} The vertex shader script element identifier.
 * @param fsId {string} The fragment shader script element identifier.
 * @param $document {Document} The document containing the script elements.
 */
function programFromScripts(vsId: string, fsId: string, $document: Document = document): ShaderProgram {
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
  return shaderProgram(vertexShader, fragmentShader);
}

export = programFromScripts;