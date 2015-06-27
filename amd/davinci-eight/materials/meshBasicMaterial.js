define(["require", "exports", 'davinci-eight/materials/material'], function (require, exports, material) {
    var meshBasicMaterial = function (spec) {
        var publicAPI = material(spec);
        return publicAPI;
    };
    return meshBasicMaterial;
});
