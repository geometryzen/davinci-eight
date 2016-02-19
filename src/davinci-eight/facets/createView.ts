import G3 from '../math/G3';
import FacetVisitor from '../core/FacetVisitor';
import Vector3 from '../math/Vector3';
import VectorE3 from '../math/VectorE3';
import Matrix4 from '../math/Matrix4';
import mustBeNumber from '../checks/mustBeNumber';
import mustBeObject from '../checks/mustBeObject';
import View from './View';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import isUndefined from '../checks/isUndefined';
import computeViewMatrix from './viewMatrix';
import readOnly from '../i18n/readOnly';

/**
 * @class createView
 * @constructor
 */
export default function createView(options?: { viewMatrixName?: string }): View {

    const eye: Vector3 = new Vector3()
    const look: Vector3 = new Vector3()
    const up: Vector3 = Vector3.copy(G3.e2)
    const viewMatrix: Matrix4 = Matrix4.one()
    const viewMatrixName = isUndefined(options.viewMatrixName) ? GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX : options.viewMatrixName

    // Force an update of the view matrix.
    eye.modified = true
    look.modified = true
    up.modified = true

    const self: View = {
        setProperty(name: string, value: number[]): View {
            return self;
        },
        get eye(): Vector3 {
            return eye
        },
        set eye(value: Vector3) {
            self.setEye(value)
        },
        /**
         * @method setEye
         * @param eye {Vector3}
         * @return {View} `this` instance.
         */
        setEye(eye_: Vector3): View {
            mustBeObject('eye', eye_)
            eye.x = mustBeNumber('eye.x', eye_.x)
            eye.y = mustBeNumber('eye.y', eye_.y)
            eye.z = mustBeNumber('eye.z', eye_.z)
            return self
        },
        get look(): Vector3 {
            return look
        },
        set look(value: Vector3) {
            self.setLook(value)
        },
        setLook(value: VectorE3): View {
            mustBeObject('look', value)
            look.x = value.x
            look.y = value.y
            look.z = value.z
            return self
        },
        get up(): Vector3 {
            return up
        },
        set up(value: Vector3) {
            self.setUp(value)
        },
        setUp(value: VectorE3): View {
            mustBeObject('up', value)
            up.x = value.x
            up.y = value.y
            up.z = value.z
            up.direction()
            return self
        },
        get viewMatrix(): Matrix4 {
            return viewMatrix
        },
        set viewMatrix(unused: Matrix4) {
            throw new Error(readOnly('viewMatrix').message)
        },
        setUniforms(visitor: FacetVisitor) {
            if (eye.modified || look.modified || up.modified) {
                // TODO: view matrix would be better.
                computeViewMatrix(eye, look, up, viewMatrix)
                eye.modified = false
                look.modified = false
                up.modified = false
            }
            visitor.mat4(viewMatrixName, viewMatrix, false)
        }
    }

    return self
}
