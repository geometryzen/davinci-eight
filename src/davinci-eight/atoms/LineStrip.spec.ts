import BeginMode from '../core/BeginMode'
import LineStrip from './LineStrip'
import CoordsTransform1D from '../transforms/CoordsTransform1D'

describe("LineStrip", function() {
    // TODO: Should we support -1 like simplices as an empty LINE STRIP?
    describe("(0)", function() {
        const curve = new LineStrip(0)
        const vas = curve.toVertexArrays()
        it("uSegments should be 0", function() {
            expect(curve.uSegments).toBe(0)
        })
        it("uLength should be 1", function() {
            expect(curve.uLength).toBe(1)
        })
        describe("toVertexArrays", function() {
            it("drawMode should be LINE_STRIP", function() {
                expect(vas.drawMode).toBe(BeginMode.LINE_STRIP)
            })
        })
    })
    describe("(1)", function() {
        const curve = new LineStrip(1)
        curve.vertexTransform(new CoordsTransform1D(false))
        const vas = curve.toVertexArrays()
        it("uSegments should be 1", function() {
            expect(curve.uSegments).toBe(1)
        })
        it("uLength should be 2", function() {
            expect(curve.uLength).toBe(2)
        })
        describe("toVertexArrays", function() {
            it("drawMode should be LINE_STRIP", function() {
                expect(vas.drawMode).toBe(BeginMode.LINE_STRIP)
            })
        })
    })
    describe("(3)", function() {
        const curve = new LineStrip(4)
        curve.vertexTransform(new CoordsTransform1D(false))
        const vas = curve.toVertexArrays()
        it("uSegments should be 4", function() {
            expect(curve.uSegments).toBe(4)
        })
        it("uLength should be 5", function() {
            expect(curve.uLength).toBe(5)
        })
        describe("toVertexArrays", function() {
            it("drawMode should be LINE_STRIP", function() {
                expect(vas.drawMode).toBe(BeginMode.LINE_STRIP)
                expect(vas.indices.length).toBe(5)
                expect(vas.indices[0]).toBe(0)
                expect(vas.indices[1]).toBe(1)
                expect(vas.indices[2]).toBe(2)
                expect(vas.indices[3]).toBe(3)
                expect(vas.indices[4]).toBe(4)
                expect(vas.attributes.length).toBe(5)
                expect(vas.attributes[0]).toBe(0.00)
                expect(vas.attributes[1]).toBe(0.25)
                expect(vas.attributes[2]).toBe(0.50)
                expect(vas.attributes[3]).toBe(0.75)
                expect(vas.attributes[4]).toBe(1.00)
                expect(vas.stride).toBe(4)
                expect(vas.pointers.length).toBe(1)
                expect(vas.pointers[0].name).toBe('aCoords')
                expect(vas.pointers[0].size).toBe(1)
                expect(vas.pointers[0].normalized).toBe(true)
                expect(vas.pointers[0].offset).toBe(0)
            })
        })
    })
})
