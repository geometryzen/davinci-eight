import ShaderProgram = require('../programs/ShaderProgram');
/**
 * @method shaderProgramFromScripts
 * @param vsId {string} The vertex shader script element identifier.
 * @param fsId {string} The fragment shader script element identifier.
 * @param $document {Document} The document containing the script elements.
 */
declare function shaderProgramFromScripts(vsId: string, fsId: string, $document?: Document): ShaderProgram;
export = shaderProgramFromScripts;
