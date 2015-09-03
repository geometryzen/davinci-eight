import UniformMetaInfos = require('../core/UniformMetaInfos');
import Vector3 = require('../math/Vector3');
import Cartesian3 = require('../math/Cartesian3');
import Spinor3 = require('../math/Spinor3');
import Matrix4 = require('../math/Matrix4');
import View = require('../cameras/View');
import Symbolic = require('../core/Symbolic');
import DefaultUniformProvider = require('../core/DefaultUniformProvider');
import UniformMat4 = require('../uniforms/UniformMat4');
import expectArg = require('../checks/expectArg');
import isUndefined = require('../checks/isUndefined');
import isVariableName = require('../checks/isVariableName');
import computeViewMatrix = require('../cameras/viewMatrix');

/**
 * @class view
 * @constructor
 */
let view = function(options?: {viewMatrixName?: string}): View {

  options = options || {};

  let eye: Vector3 = new Vector3();
  let look: Vector3 = new Vector3();
  let up: Vector3 = Vector3.e2;
  let viewMatrix: Matrix4 = Matrix4.identity();
  let base = new UniformMat4(options.viewMatrixName, Symbolic.UNIFORM_VIEW_MATRIX);
  base.callback = function(): {transpose: boolean; matrix4: Float32Array} {
    if (eye.modified || look.modified || up.modified) {
      computeViewMatrix(eye, look, up, viewMatrix.elements);
      eye.modified = false;
      look.modified = false;
      up.modified = false;
    }
    return {transpose: false, matrix4: viewMatrix.elements};
  }

  // Force an update of the view matrix.
  eye.modified = true;
  look.modified = true;
  up.modified = true;

  let self: View = {
      get eye(): Vector3 {
        return eye;
      },
      set eye(value: Vector3) {
        self.setEye(value);
      },
      setEye(value: Vector3) {
        expectArg('eye', value).toBeObject();
        eye.x = value.x;
        eye.y = value.y;
        eye.z = value.z;
        return self;
      },
      get look(): Vector3 {
        return look;
      },
      set look(value: Vector3) {
        self.setLook(value);
      },
      setLook(value: Cartesian3): View {
        expectArg('look', value).toBeObject();
        look.x = value.x;
        look.y = value.y;
        look.z = value.z;
        return self;
      },
      get up(): Vector3 {
        return up;
      },
      set up(value: Vector3) {
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
      },
      getUniformData() {
        return base.getUniformData();
      }
  };

  return self;
};

export = view;
