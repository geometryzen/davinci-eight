import Euclidean3 = require('../math/Euclidean3')
import IFacetVisitor = require('../core/IFacetVisitor')
import R3 = require('../math/R3')
import VectorE3 = require('../math/VectorE3')
import SpinG3 = require('../math/SpinG3')
import Matrix4 = require('../math/Matrix4')
import mustBeNumber = require('../checks/mustBeNumber')
import mustBeObject = require('../checks/mustBeObject')
import View = require('../cameras/View')
import Symbolic = require('../core/Symbolic')
import isUndefined = require('../checks/isUndefined')
import isVariableName = require('../checks/isVariableName')
import computeViewMatrix = require('../cameras/viewMatrix')

/**
 * @class createView
 * @constructor
 */
let createView = function(options?: { viewMatrixName?: string }): View {

    let refCount = 1
    let eye: R3 = new R3()
    let look: R3 = new R3()
    let up: R3 = R3.copy(Euclidean3.e2)
    let viewMatrix: Matrix4 = Matrix4.one()
    let viewMatrixName = isUndefined(options.viewMatrixName) ? Symbolic.UNIFORM_VIEW_MATRIX : options.viewMatrixName

    // Force an update of the view matrix.
    eye.modified = true
    look.modified = true
    up.modified = true

    let self: View = {
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
        setProperty(name: string, value: number[]): void {
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
        setUniforms(visitor: IFacetVisitor, canvasId: number) {
            if (eye.modified || look.modified || up.modified) {
                // TODO: view matrix would be better.
                computeViewMatrix(eye, look, up, viewMatrix)
                eye.modified = false
                look.modified = false
                up.modified = false
            }
            visitor.uniformMatrix4(viewMatrixName, false, viewMatrix, canvasId)
        }
    }

    return self
}

export = createView
