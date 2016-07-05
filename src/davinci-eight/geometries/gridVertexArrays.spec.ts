import BeginMode from '../core/BeginMode'
import GridGeometryOptions from './GridGeometryOptions'
import gridVertexArrays from './gridVertexArrays'

describe("gridVertexArrays", function() {
    describe("defaults", function() {
        const options: GridGeometryOptions = {}
        const vas = gridVertexArrays(options)
        it("should be POINTS", function() {
            expect(vas.drawMode).toBe(BeginMode.LINES)
        })
    })
    describe("(0, 0)", function() {
        const options: GridGeometryOptions = {}
        options.drawMode = BeginMode.POINTS
        options.uSegments = 0
        options.vSegments = 0
        const vas = gridVertexArrays(options)
        it("should be POINTS", function() {
            expect(vas.drawMode).toBe(BeginMode.POINTS)
        })
    })
    describe("(0, 1)", function() {
        const options: GridGeometryOptions = {}
        options.drawMode = BeginMode.POINTS
        options.uSegments = 0
        options.vSegments = 1
        const vas = gridVertexArrays(options)
        it("should be POINTS", function() {
            expect(vas.drawMode).toBe(BeginMode.POINTS)
        })
    })
    describe("(1, 0)", function() {
        const options: GridGeometryOptions = {}
        options.drawMode = BeginMode.POINTS
        options.uSegments = 1
        options.vSegments = 0
        const vas = gridVertexArrays(options)
        it("should be POINTS", function() {
            expect(vas.drawMode).toBe(BeginMode.POINTS)
        })
    })
    describe("(1, 1)", function() {
        describe("POINTS", function() {
            const options: GridGeometryOptions = {}
            options.drawMode = BeginMode.POINTS
            options.uSegments = 1
            options.vSegments = 1
            const vas = gridVertexArrays(options)
            it("should be POINTS", function() {
                expect(vas.drawMode).toBe(BeginMode.POINTS)
            })
            it("should have correct arrays", function() {
                expect(vas.indices.length).toBe(4)
                expect(vas.attributes.length).toBe(4 * (3 + 3))
            })
        })
        describe("LINES", function() {
            const options: GridGeometryOptions = {}
            options.drawMode = BeginMode.LINES
            options.uSegments = 1
            options.vSegments = 1
            const vas = gridVertexArrays(options)
            it("should be LINES", function() {
                expect(vas.drawMode).toBe(BeginMode.LINES)
            })
            it("should have correct index arays", function() {
                expect(vas.indices.length).toBe(8)
            })
            xit("should have correct attribute arays", function() {
                expect(vas.attributes.length).toBe(4 * (3 + 3))
            })
        })
        describe("drawMode undefined", function() {
            const options: GridGeometryOptions = {}
            options.uSegments = 1
            options.vSegments = 1
            const vas = gridVertexArrays(options)
            it("should be LINES", function() {
                expect(vas.drawMode).toBe(BeginMode.LINES)
            })
            it("should have correct index arays", function() {
                expect(vas.indices.length).toBe(8)
            })
            xit("should have correct attribute arays", function() {
                expect(vas.attributes.length).toBe(4 * (3 + 3))
            })
        })
    })
})
