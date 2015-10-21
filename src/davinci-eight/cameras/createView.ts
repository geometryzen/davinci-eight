import Euclidean3 = require('../math/Euclidean3')
import IFacetVisitor = require('../core/IFacetVisitor')
import MutableVectorE3 = require('../math/MutableVectorE3')
import VectorE3 = require('../math/VectorE3')
import MutableSpinorE3 = require('../math/MutableSpinorE3')
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
    let eye: MutableVectorE3 = new MutableVectorE3()
    let look: MutableVectorE3 = new MutableVectorE3()
    let up: MutableVectorE3 = MutableVectorE3.copy(Euclidean3.e2)
    let viewMatrix: Matrix4 = Matrix4.identity()
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
        get eye(): MutableVectorE3 {
            return eye
        },
        set eye(value: MutableVectorE3) {
            self.setEye(value)
        },
        /**
         * @method setEye
         * @param eye {MutableVectorE3}
         * @return {View} `this` instance.
         */
        setEye(eye_: MutableVectorE3): View {
            mustBeObject('eye', eye_)
            eye.x = mustBeNumber('eye.x', eye_.x)
            eye.y = mustBeNumber('eye.y', eye_.y)
            eye.z = mustBeNumber('eye.z', eye_.z)
            return self
        },
        get look(): MutableVectorE3 {
            return look
        },
        set look(value: MutableVectorE3) {
            self.setLook(value)
        },
        setLook(value: VectorE3): View {
            mustBeObject('look', value)
            look.x = value.x
            look.y = value.y
            look.z = value.z
            return self
        },
        get up(): MutableVectorE3 {
            return up
        },
        set up(value: MutableVectorE3) {
            self.setUp(value)
        },
        setUp(value: VectorE3): View {
            mustBeObject('up', value)
            up.x = value.x
            up.y = value.y
            up.z = value.z
            up.normalize()
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
