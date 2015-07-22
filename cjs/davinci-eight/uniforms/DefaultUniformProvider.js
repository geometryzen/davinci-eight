/**
 * @class DefaultUniformProvider
 */
var DefaultUniformProvider = (function () {
    /**
     * @class DefaultUniformProvider
     * @constructor
     */
    function DefaultUniformProvider() {
    }
    /**
     * @method getUniformMatrix3
     */
    DefaultUniformProvider.prototype.getUniformMatrix3 = function (name) {
        return;
    };
    /**
     * @method getUniformMatrix4
     */
    DefaultUniformProvider.prototype.getUniformMatrix4 = function (name) {
        return;
    };
    /**
     * @method getUniformVector3
     */
    DefaultUniformProvider.prototype.getUniformVector3 = function (name) {
        return;
    };
    /**
     * @method getUniformVector4
     */
    DefaultUniformProvider.prototype.getUniformVector4 = function (name) {
        return;
    };
    /**
     *
     * @method getUniformMetaInfos
     * @return An empty object that derived class may modify.
     */
    DefaultUniformProvider.prototype.getUniformMetaInfos = function () {
        var uniforms = {};
        return uniforms;
    };
    return DefaultUniformProvider;
})();
module.exports = DefaultUniformProvider;
