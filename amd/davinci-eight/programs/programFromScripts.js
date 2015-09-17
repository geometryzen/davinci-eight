define(["require", "exports", '../programs/shaderProgram', '../checks/expectArg', '../scene/MonitorList'], function (require, exports, shaderProgram, expectArg, MonitorList) {
    // FIXME: Lists of scripts, using the type to distinguish vertex/fragment?
    // FIXME: Temporary rename simpleProgramFromScripts?
    /**
     * @method programFromScripts
     * @param monitors {ContextMonitor[]}
     * @param vsId {string} The vertex shader script element identifier.
     * @param fsId {string} The fragment shader script element identifier.
     * @param $document {Document} The document containing the script elements.
     */
    function programFromScripts(monitors, vsId, fsId, $document, attribs) {
        if (attribs === void 0) { attribs = []; }
        MonitorList.verify('monitors', monitors, function () { return "programFromScripts"; });
        expectArg('vsId', vsId).toBeString();
        expectArg('fsId', fsId).toBeString();
        expectArg('$document', $document).toBeObject();
        function $(id) {
            expectArg('id', id).toBeString();
            var element = $document.getElementById(id);
            if (element) {
                return element;
            }
            else {
                throw new Error(id + " is not a valid DOM element identifier.");
            }
        }
        var vertexShader = $(vsId).textContent;
        var fragmentShader = $(fsId).textContent;
        return shaderProgram(monitors, vertexShader, fragmentShader, attribs);
    }
    return programFromScripts;
});
