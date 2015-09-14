import Program = require('../core/Program');
import ContextManager = require('../core/ContextManager');
/**
 * @method programFromScripts
 * @param monitor {ContextManager}
 * @param vsId {string} The vertex shader script element identifier.
 * @param fsId {string} The fragment shader script element identifier.
 * @param $document {Document} The document containing the script elements.
 */
declare function programFromScripts(monitor: ContextManager, vsId: string, fsId: string, $document: Document, attribs?: string[]): Program;
export = programFromScripts;
