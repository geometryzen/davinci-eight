var material = require('davinci-eight/materials/material');
var meshNormalMaterial = function (spec) {
    var publicAPI = material(spec);
    return publicAPI;
};
module.exports = meshNormalMaterial;
