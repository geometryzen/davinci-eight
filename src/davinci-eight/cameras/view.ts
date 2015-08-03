import UniformMetaInfos = require('../core/UniformMetaInfos');
import object3D = require('../core/object3D');
import Vector3 = require('../math/Vector3');
import Cartesian3 = require('../math/Cartesian3');
import Spinor3 = require('../math/Spinor3');
import Matrix4 = require('../math/Matrix4');
import View = require('../cameras/View');
import Symbolic = require('../core/Symbolic');
import DefaultUniformProvider = require('../uniforms/DefaultUniformProvider');
import UniformMat4 = require('../uniforms/UniformMat4');
import expectArg = require('../checks/expectArg');
import isUndefined = require('../checks/isUndefined');
import isVariableName = require('../checks/isVariableName');

/**
 * @class view
 * @constructor
 */
let view = function(options?: {viewMatrixName?: string}): View {

  options = options || {};
  let viewMatrixName: string = expectArg('options.viewMatrixName', isUndefined(options.viewMatrixName) ? Symbolic.UNIFORM_VIEW_MATRIX : options.viewMatrixName).toBeString().value;
  expectArg('viewMatrixName', viewMatrixName).toSatisfy(isVariableName(viewMatrixName),"viewMatrixName must be a variable name");

  let eye: Vector3 = new Vector3();
  let look: Vector3 = new Vector3();
  let up: Vector3 = Vector3.e2;
  let viewMatrix: Matrix4 = Matrix4.create();
  let base = new UniformMat4(viewMatrixName, Symbolic.UNIFORM_VIEW_MATRIX);
  base.callback = function(): {transpose: boolean; matrix4: Float32Array} {
    if (eye.modified || look.modified || up.modified) {
      updateViewMatrix();
      eye.modified = false;
      look.modified = false;
      up.modified = false;
    }
    return {transpose: false, matrix4: viewMatrix.elements};
  }

  function updateViewMatrix() {
    let n = new Vector3().subVectors(eye, look);
    if (n.x === 0 && n.y === 0 && n.z === 0) {
      // View direction is ambiguous.
        n.z = 1;
    }
    else {
      n.normalize();
    }
    let u = new Vector3().crossVectors(up, n);
    let v = new Vector3().crossVectors(n, u);
    let d = new Vector3([eye.dot(u), eye.dot(v), eye.dot(n)]).multiplyScalar(-1);
    let m = viewMatrix.elements;
    m[0] = u.x;  m[4] = u.y; m[8]  = u.z; m[12] = d.x;
    m[1] = v.x;  m[5] = v.y; m[9]  = v.z; m[13] = d.y;
    m[2] = n.x;  m[6] = n.y; m[10] = n.z; m[14] = d.z;
    m[3] = 0;    m[7] = 0;   m[11] = 0;   m[15] = 1;
  }

  // Force an update of the view matrix.
  eye.modified = true;
  look.modified = true;
  up.modified = true;

  let self: View = {
      get eye(): Cartesian3 {
        return eye;
      },
      set eye(value: Cartesian3) {
        self.setEye(value);
      },
      setEye(value: Cartesian3) {
        expectArg('eye', value).toBeObject();
        eye.x = value.x;
        eye.y = value.y;
        eye.z = value.z;
        return self;
      },
      get look(): Cartesian3 {
        return look;
      },
      set look(value: Cartesian3) {
        self.setLook(value);
      },
      setLook(value: Cartesian3): View {
        expectArg('look', value).toBeObject();
        look.x = value.x;
        look.y = value.y;
        look.z = value.z;
        return self;
      },
      get up(): Cartesian3 {
        return up;
      },
      set up(value: Cartesian3) {
        self.setUp(value);
      },
      setUp(value: Cartesian3): View {
        expectArg('up', value).toBeObject();
        up.x = value.x;
        up.y = value.y;
        up.z = value.z;
        up.normalize();
        return self;
      },
      getUniformFloat(name: string) {
        return base.getUniformFloat(name);
      },
      getUniformMatrix2(name: string) {
        return base.getUniformMatrix2(name);
      },
      getUniformMatrix3(name: string) {
        return base.getUniformMatrix3(name);
      },
      getUniformMatrix4(name: string) {
        return base.getUniformMatrix4(name);
      },
      getUniformVector2(name: string) {
        return base.getUniformVector2(name);
      },
      getUniformVector3(name: string) {
        return base.getUniformVector3(name);
      },
      getUniformVector4(name: string) {
        return base.getUniformVector4(name);
      },
      getUniformMeta() {
        return base.getUniformMeta();
      }
  };

  return self;
};

export = view;
