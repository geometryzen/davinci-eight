define(["require", "exports", 'davinci-eight/materials/material'], function (require, exports, material) {
    var meshNormalMaterial = function (spec) {
        var publicAPI = material(spec);
        return publicAPI;
    };
    return meshNormalMaterial;
});
