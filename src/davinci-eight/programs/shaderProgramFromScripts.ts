import ShaderProgram = require('../core/ShaderProgram');
import shaderProgram = require('../programs/shaderProgram');

/**
 * @method shaderProgramFromScripts
 * @param vsId {string} The vertex shader script element identifier.
 * @param fsId {string} The fragment shader script element identifier.
 * @param $document {Document} The document containing the script elements.
 */
function shaderProgramFromScripts(vsId: string, fsId: string, $document: Document = document): ShaderProgram {
  function $(id: string): HTMLElement {
    return $document.getElementById(id);
  }
  return shaderProgram($(vsId).textContent, $(fsId).textContent);
}

export = shaderProgramFromScripts;