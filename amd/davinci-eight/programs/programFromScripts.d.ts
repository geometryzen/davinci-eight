import IGraphicsProgram = require('../core/IGraphicsProgram');
import IContextMonitor = require('../core/IContextMonitor');
/**
 * Helper function for creating a <code>IGraphicsProgram</code> from HTML script element content.
 * Parameters:
 * monitors
 * vsId The vertex shader script element identifier.
 * fsId The fragment shader script element identifier.
 * domDocument The DOM document containing the script elements.
 * [attribs = []] The attribute indices (implied by order of the name in the array).
 */
declare function programFromScripts(monitors: IContextMonitor[], vsId: string, fsId: string, domDocument: Document, attribs?: string[]): IGraphicsProgram;
export = programFromScripts;
