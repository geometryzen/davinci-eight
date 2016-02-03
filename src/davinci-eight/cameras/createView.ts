import Euclidean3 from '../math/Euclidean3';
import FacetVisitor from '../core/FacetVisitor';
import R3 from '../math/R3';
import VectorE3 from '../math/VectorE3';
import Mat4R from '../math/Mat4R';
import mustBeNumber from '../checks/mustBeNumber';
import mustBeObject from '../checks/mustBeObject';
import View from '../cameras/View';
import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols';
import isUndefined from '../checks/isUndefined';
import computeViewMatrix from '../cameras/viewMatrix';

/**
 * @class createView
 * @constructor
 */
export default function createView(options?: { viewMatrixName?: string }): View {

    let refCount = 1
    let eye: R3 = new R3()
    let look: R3 = new R3()
    let up: R3 = R3.copy(Euclidean3.e2)
    let viewMatrix: Mat4R = Mat4R.one()
    let viewMatrixName = isUndefined(options.viewMatrixName) ? GraphicsProgramSymbols.UNIFORM_VIEW_MATRIX : options.viewMatrixName

    // Force an update of the view matrix.
    eye.modified = true
    look.modified = true
    up.modified = true

    const self: View = {
        addRef(): number {
            refCount++
            return refCount
        },
        release(): number {
            refCount--
            return refCount
        },
        get uuid(): string {
            return ""
        },
        getProperty(name: string): number[] {
            return void 0
        },
        setProperty(name: string, value: number[]): View {
            return self;
        },
        get eye(): R3 {
            return eye
        },
        set eye(value: R3) {
            self.setEye(value)
        },
        /**
         * @method setEye
         * @param eye {R3}
         * @return {View} `this` instance.
         */
        setEye(eye_: R3): View {
            mustBeObject('eye', eye_)
            eye.x = mustBeNumber('eye.x', eye_.x)
            eye.y = mustBeNumber('eye.y', eye_.y)
            eye.z = mustBeNumber('eye.z', eye_.z)
            return self
        },
        get look(): R3 {
            return look
        },
        set look(value: R3) {
            self.setLook(value)
        },
        setLook(value: VectorE3): View {
            mustBeObject('look', value)
            look.x = value.x
            look.y = value.y
            look.z = value.z
            return self
        },
        get up(): R3 {
            return up
        },
        set up(value: R3) {
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
        setUniforms(visitor: FacetVisitor, canvasId?: number) {
            if (eye.modified || look.modified || up.modified) {
                // TODO: view matrix would be better.
                computeViewMatrix(eye, look, up, viewMatrix)
                eye.modified = false
                look.modified = false
                up.modified = false
            }
            visitor.mat4(viewMatrixName, viewMatrix, false, canvasId)
        }
    }

    return self
}
