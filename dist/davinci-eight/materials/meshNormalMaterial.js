define(["require", "exports", 'davinci-eight/core/material'], function (require, exports, material) {
    var meshNormalMaterial = function (spec) {
        var api = material(spec);
        return api;
    };
    return meshNormalMaterial;
});
