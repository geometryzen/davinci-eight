import Vector3 = require('../math/Vector3');
import Spinor3 = require('../math/Spinor3');
import Object3D = require('../core/Object3D');

/**
 * @return {Object3D} The constructed object.
 */
var functionalConstructorObject3D = function(): Object3D {

  var inner = new Object3D();

  var publicAPI: Object3D = {
    get position(): Vector3 {
      return inner.position;
    },
    set position(position: Vector3) {
      inner.position = position;
    },
    get attitude(): Spinor3 {
      return inner.attitude;
    },
    set attitude(attitude: Spinor3) {
      inner.attitude = attitude;
    },
    get parent() {
      return inner.parent;
    },
    get children() {
      return inner.children;
    },
    translateOnAxis(axis: Vector3, distance: number) {
      inner.translateOnAxis(axis, distance);
      return publicAPI;
    }
  };

  return publicAPI;
};

export = functionalConstructorObject3D;
