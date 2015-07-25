define(["require", "exports", '../uniforms/MultiUniformProvider'], function (require, exports, MultiUniformProvider) {
    /**
     * @method uniforms
     */
    function uniforms(providers) {
        return new MultiUniformProvider(providers);
    }
    return uniforms;
});
