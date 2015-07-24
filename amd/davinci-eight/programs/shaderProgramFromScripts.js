define(["require", "exports", '../programs/shaderProgram'], function (require, exports, shaderProgram) {
    /**
     * @method shaderProgramFromScripts
     * @param vsId {string} The vertex shader script element identifier.
     * @param fsId {string} The fragment shader script element identifier.
     * @param $document {Document} The document containing the script elements.
     */
    function shaderProgramFromScripts(vsId, fsId, $document) {
        if ($document === void 0) { $document = document; }
        function $(id) {
            return $document.getElementById(id);
        }
        return shaderProgram($(vsId).textContent, $(fsId).textContent);
    }
    return shaderProgramFromScripts;
});
