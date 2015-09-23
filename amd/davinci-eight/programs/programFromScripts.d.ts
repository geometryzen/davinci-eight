import IMaterial = require('../core/IMaterial');
import ContextMonitor = require('../core/ContextMonitor');
/**
 * @method programFromScripts
 * @param monitors {ContextMonitor[]}
 * @param vsId {string} The vertex shader script element identifier.
 * @param fsId {string} The fragment shader script element identifier.
 * @param $document {Document} The document containing the script elements.
 */
declare function programFromScripts(monitors: ContextMonitor[], vsId: string, fsId: string, $document: Document, attribs?: string[]): IMaterial;
export = programFromScripts;
