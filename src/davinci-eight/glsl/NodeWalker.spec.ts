import NodeWalker from './NodeWalker'
import DebugNodeEventHandler from './DebugNodeEventHandler'
import DefaultNodeEventHandler from './DefaultNodeEventHandler'
import parse from './parse'

const vertexShader = [
    "attribute vec3 aVertexPosition, aVertexThing;",
    "attribute vec3 aVertexColor;",
    "attribute vec3 aVertexNormal;",
    "",
    "uniform mat4 uMVMatrix;",
    "uniform mat3 uNormalMatrix;",
    "uniform mat4 uPMatrix;",
    "",
    "varying highp vec4 vColor;",
    "varying highp vec3 vLight;",
    "",
    "void main(void) {",
    "  gl_Position = aVertexPosition;",
    "}"
].join("")

describe("NodeWalker", function() {
    it("constructor", function() {
        const walker = new NodeWalker()
        const handler = new DefaultNodeEventHandler()
        const program = parse(vertexShader)
        walker.walk(program, handler)
        expect(1).toBe(1)
    })
})
