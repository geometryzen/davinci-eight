define(["require", "exports", 'davinci-eight/math/e3ga/scalarE3', 'davinci-eight/math/e3ga/vectorE3'], function (require, exports, scalarE3, vectorE3) {
    var object3D = function () {
        var publicAPI = {
            position: vectorE3(0, 0, 0),
            attitude: scalarE3(1),
        };
        return publicAPI;
    };
    return object3D;
});
