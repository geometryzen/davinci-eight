/// <reference path="./Material.d.ts" />
/// <reference path="../geometries/Geometry.d.ts" />
var material = function (spec) {
    var program;
    var publicAPI = {
        get attributes() {
            return [];
        },
        contextFree: function () {
        },
        contextGain: function () {
        },
        contextLoss: function () {
        },
        hasContext: function () {
            return !!program;
        },
        enableVertexAttributes: function (context) {
        },
        disableVertexAttributes: function (context) {
        },
        bindVertexAttributes: function (context) {
        },
        get program() { return program; },
        get programId() { return Math.random().toString(); },
        update: function (context, time, geometry) {
            // Nothing to do right now.
        }
    };
    return publicAPI;
};
module.exports = material;
