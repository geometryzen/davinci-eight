define(["require", "exports", '../programs/shaderProgram', '../checks/expectArg'], function (require, exports, shaderProgram, expectArg) {
    /**
     * @method programFromScripts
     * @param monitor {RenderingContextMonitor}
     * @param vsId {string} The vertex shader script element identifier.
     * @param fsId {string} The fragment shader script element identifier.
     * @param $document {Document} The document containing the script elements.
     */
    function programFromScripts(monitor, vsId, fsId, $document, attribs) {
        if (attribs === void 0) { attribs = []; }
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
        return shaderProgram(monitor, vertexShader, fragmentShader, attribs);
    }
    return programFromScripts;
});
