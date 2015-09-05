import ShaderProgram = require('../core/ShaderProgram');
/**
 * @method programFromScripts
 * @param vsId {string} The vertex shader script element identifier.
 * @param fsId {string} The fragment shader script element identifier.
 * @param $document {Document} The document containing the script elements.
 */
declare function programFromScripts(vsId: string, fsId: string, $document?: Document): ShaderProgram;
export = programFromScripts;
