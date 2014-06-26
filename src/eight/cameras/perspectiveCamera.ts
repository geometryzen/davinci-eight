//
// perspectiveCamera.ts
//
// This functional constructor pattern illustrates the TypeScript way to extend a type using containment.
// It's not clear how we could do direct aggregation and remain type-safe when not using constructor functions.
//
import camera = require('eight/cameras/camera');

var perspectiveCamera = function(fov: number = 50, aspect: number = 1, near: number = 0.1, far: number = 2000) {

    var base = camera();

    var that = {
        // Delegate to the base camera.
        get position(): Euclidean3 {return base.position;},
        set position(position: Euclidean3) {base.position = position},
        get attitude(): Euclidean3 {return base.attitude;},
        set attitude(attitude: Euclidean3) {base.attitude = attitude},
        
        // Extensions
        get aspect(): number {return aspect;},
        set aspect(value: number) {aspect = value},
        
        updateProjectionMatrix: updateProjectionMatrix
    };

    var updateProjectionMatrix = function(): void {
        // FIXME
        // mat4.perspective(that.projectionMatrix, fov, aspect, near, far);
    };

    return that;
};

export =  perspectiveCamera;
