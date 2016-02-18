import G3 from '../math/G3';
import FacetVisitor from '../core/FacetVisitor';
import R3m from '../math/R3m';
import VectorE3 from '../math/VectorE3';
import Mat4R from '../math/Mat4R';
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

    const eye: R3m = new R3m()
    const look: R3m = new R3m()
    const up: R3m = R3m.copy(G3.e2)
    const viewMatrix: Mat4R = Mat4R.one()
    const viewMatrixName = isUndefined(options.viewMatrixName) ? GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX : options.viewMatrixName

    // Force an update of the view matrix.
    eye.modified = true
    look.modified = true
    up.modified = true

    const self: View = {
        setProperty(name: string, value: number[]): View {
            return self;
        },
        get eye(): R3m {
            return eye
        },
        set eye(value: R3m) {
            self.setEye(value)
        },
        /**
         * @method setEye
         * @param eye {R3m}
         * @return {View} `this` instance.
         */
        setEye(eye_: R3m): View {
            mustBeObject('eye', eye_)
            eye.x = mustBeNumber('eye.x', eye_.x)
            eye.y = mustBeNumber('eye.y', eye_.y)
            eye.z = mustBeNumber('eye.z', eye_.z)
            return self
        },
        get look(): R3m {
            return look
        },
        set look(value: R3m) {
            self.setLook(value)
        },
        setLook(value: VectorE3): View {
            mustBeObject('look', value)
            look.x = value.x
            look.y = value.y
            look.z = value.z
            return self
        },
        get up(): R3m {
            return up
        },
        set up(value: R3m) {
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
        get viewMatrix(): Mat4R {
            return viewMatrix
        },
        set viewMatrix(unused: Mat4R) {
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
