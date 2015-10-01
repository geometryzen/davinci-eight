import IMaterial = require('../core/IMaterial');
import IContextMonitor = require('../core/IContextMonitor');
/**
 * @method programFromScripts
 * @param monitors {IContextMonitor[]}
 * @param vsId {string} The vertex shader script element identifier.
 * @param fsId {string} The fragment shader script element identifier.
 * @param $document {Document} The document containing the script elements.
 */
declare function programFromScripts(monitors: IContextMonitor[], vsId: string, fsId: string, $document: Document, attribs?: string[]): IMaterial;
export = programFromScripts;
