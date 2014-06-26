import material = require('eight/core/material');

var meshNormalMaterial = function(spec) {
    var api = material(spec);

    return api;
};

export = meshNormalMaterial;
