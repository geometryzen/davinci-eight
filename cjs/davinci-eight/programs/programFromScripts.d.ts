import ShaderProgram = require('../core/ShaderProgram');
import RenderingContextMonitor = require('../core/RenderingContextMonitor');
/**
 * @method programFromScripts
 * @param monitor {RenderingContextMonitor}
 * @param vsId {string} The vertex shader script element identifier.
 * @param fsId {string} The fragment shader script element identifier.
 * @param $document {Document} The document containing the script elements.
 */
declare function programFromScripts(monitor: RenderingContextMonitor, vsId: string, fsId: string, $document: Document, attribs?: string[]): ShaderProgram;
export = programFromScripts;
