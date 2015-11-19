define(["require", "exports", '../programs/createGraphicsProgram', '../scene/MonitorList', '../checks/mustBeObject', '../checks/mustBeString'], function (require, exports, createGraphicsProgram, MonitorList, mustBeObject, mustBeString) {
    // FIXME: Lists of scripts, using the type to distinguish vertex/fragment?
    /**
     * Helper function for creating a <code>IGraphicsProgram</code> from HTML script element content.
     * Parameters:
     * monitors
     * vsId The vertex shader script element identifier.
     * fsId The fragment shader script element identifier.
     * domDocument The DOM document containing the script elements.
     * [attribs = []] The attribute indices (implied by order of the name in the array).
     */
    function programFromScripts(monitors, vsId, fsId, domDocument, attribs) {
        if (attribs === void 0) { attribs = []; }
        MonitorList.verify('monitors', monitors, function () { return "programFromScripts"; });
        mustBeString('vsId', vsId);
        mustBeString('fsId', fsId);
        // We have used a special  
        mustBeObject('domDocument', domDocument);
        // shortcut function for getElementById, capturing the domDocument parameter value (argument value).
        function $(id) {
            var element = domDocument.getElementById(mustBeString('id', id));
            if (element) {
                return element;
            }
            else {
                throw new Error(id + " is not a valid DOM element identifier.");
            }
        }
        var vertexShader = $(vsId).textContent;
        var fragmentShader = $(fsId).textContent;
        return createGraphicsProgram(monitors, vertexShader, fragmentShader, attribs);
    }
    return programFromScripts;
});
