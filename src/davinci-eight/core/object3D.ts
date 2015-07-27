import Vector3 = require('../math/Vector3');
import Spinor3 = require('../math/Spinor3');
import Node3D = require('../core/Node3D');

/**
 * @return {Node3D} The constructed object.
 */
var object3D = function(): Node3D {

  var position = new Vector3();
  var attitude = new Spinor3();
  var scale = new Vector3([1, 1, 1]);
  var parent: Node3D = null;
  var children: Node3D[] = [];

  var publicAPI: Node3D = {
    get position(): Vector3 {
      return position;
    },
    set position(value: Vector3) {
      position = value;
    },
    get attitude(): Spinor3 {
      return attitude;
    },
    set attitude(value: Spinor3) {
      attitude = value;
    },
    get scale(): Vector3 {
      return scale;
    },
    set scale(value: Vector3) {
      scale = value;
    },
    get parent() {
      return parent;
    },
    get children() {
      return children;
    },
    translateOnAxis(axis: Vector3, distance: number) {
      throw new Error('Not Implemented');
      return publicAPI;
    }
  };

  return publicAPI;
};

export = object3D;
