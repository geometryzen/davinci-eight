import GraphicsProgramSymbols from '../core/GraphicsProgramSymbols'
import TriangleStrip from './TriangleStrip'
import Vector3 from '../math/Vector3'

describe("TriangleStrip", function() {

    describe("constructor", function() {
        describe("(0,0)", function() {

            var uSegments = 0
            var vSegments = 0
            var strip = new TriangleStrip(uSegments, vSegments)
            it("should have correct uSegments", function() {
                expect(strip.uSegments).toBe(uSegments)
            })
            it("should have correct vSegments", function() {
                expect(strip.vSegments).toBe(vSegments)
            })
            it("should have correct uLength", function() {
                expect(strip.uLength).toBe(uSegments + 1)
            })
            it("should have correct vLength", function() {
                expect(strip.vLength).toBe(vSegments + 1)
            })
            it("should generate the correct VertexArray", function() {
                // var arrays = strip.toVertexArrays()
                var vertex = strip.vertex(0, 0)
                expect(typeof vertex.attributes).toBe('object')
            })
        })
        describe("(1,1)", function() {

            var uSegments = 1
            var vSegments = 1
            var strip = new TriangleStrip(uSegments, vSegments)
            it("should have correct uSegments", function() {
                expect(strip.uSegments).toBe(uSegments)
            })
            it("should have correct vSegments", function() {
                expect(strip.vSegments).toBe(vSegments)
            })
            it("should have correct uLength", function() {
                expect(strip.uLength).toBe(uSegments + 1)
            })
            it("should have correct vLength", function() {
                expect(strip.vLength).toBe(vSegments + 1)
            })
            it("should generate the correct VertexArray", function() {
                var vertex00 = strip.vertex(0, 0)
                vertex00.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = new Vector3()

                // var arrays = strip.toVertexArrays()
                var vertex = strip.vertex(0, 0)
                expect(typeof vertex.attributes).toBe('object')
            })
        })

    })

})
