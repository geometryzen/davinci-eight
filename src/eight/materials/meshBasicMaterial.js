define(["require", "exports", 'eight/core/material'], function(require, exports, material) {
    var meshBasicMaterial = function (spec) {
        var api = material(spec);

        return api;
    };

    
    return meshBasicMaterial;
});
