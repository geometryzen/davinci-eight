define(["require", "exports", 'eight/core/object3D'], function(require, exports, object3D) {
    var scene = function () {
        var kids = [];

        var base = object3D();

        var that = {
            get children() {
                return kids;
            },
            onContextGain: function (gl) {
                for (var i = 0, length = kids.length; i < length; i++) {
                    kids[i].onContextGain(gl);
                }
            },
            onContextLoss: function () {
                for (var i = 0, length = kids.length; i < length; i++) {
                    kids[i].onContextLoss();
                }
            },
            tearDown: function () {
                for (var i = 0, length = kids.length; i < length; i++) {
                    kids[i].tearDown();
                }
            },
            add: function (child) {
                kids.push(child);
            }
        };

        return that;
    };

    
    return scene;
});
