import DrawMode from '../../core/DrawMode'
import GraphicsProgramSymbols from '../../core/GraphicsProgramSymbols'
import GridTriangleStrip from './GridTriangleStrip'
import Vector2 from '../../math/Vector2'
import Vector3 from '../../math/Vector3'

describe("GridTriangleStrip", function() {

    describe("constructor", function() {
        describe("(0,0)", function() {

            var uSegments = 0
            var vSegments = 0
            var strip = new GridTriangleStrip(uSegments, vSegments)
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

            const uSegments = 1
            const vSegments = 1
            const strip = new GridTriangleStrip(uSegments, vSegments)
            strip.vertex(0, 0).attributes[GraphicsProgramSymbols.ATTRIBUTE_TEXTURE_COORD] = new Vector2([0, 0])
            strip.vertex(0, 1).attributes[GraphicsProgramSymbols.ATTRIBUTE_TEXTURE_COORD] = new Vector2([0, 1])
            strip.vertex(1, 0).attributes[GraphicsProgramSymbols.ATTRIBUTE_TEXTURE_COORD] = new Vector2([1, 0])
            strip.vertex(1, 1).attributes[GraphicsProgramSymbols.ATTRIBUTE_TEXTURE_COORD] = new Vector2([1, 1])
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

            describe("Primitive", function() {
                const primitive = strip.toPrimitive()
                it("should be a TRIANGLE_STRIP", function() {
                    expect(primitive.mode).toBe(DrawMode.TRIANGLE_STRIP)
                })
                describe("indices", function() {
                    const indices = primitive.indices
                    it("should contain 4 unique elements", function() {
                        expect(indices.length).toBe(4)
                        expect(indices[0]).toBe(0)
                        expect(indices[1]).toBe(2)
                        expect(indices[2]).toBe(1)
                        expect(indices[3]).toBe(3)
                    })
                })
                describe("attributes", function() {
                    const attributes = primitive.attributes
                    const coords = attributes[GraphicsProgramSymbols.ATTRIBUTE_TEXTURE_COORD]
                    const values = coords.values
                    it("should have size 2", function() {
                        expect(coords.size).toBe(2)
                    })
                    it("should contain the correct values", function() {
                        expect(values[0]).toBe(0)
                        expect(values[1]).toBe(1)
                        expect(values[2]).toBe(1)
                        expect(values[3]).toBe(1)
                        expect(values[4]).toBe(0)
                        expect(values[5]).toBe(0)
                        expect(values[6]).toBe(1)
                        expect(values[7]).toBe(0)
                    })
                })
            })

            it("should generate the correct VertexArray", function() {
                const vertex00 = strip.vertex(0, 0)
                vertex00.attributes[GraphicsProgramSymbols.ATTRIBUTE_POSITION] = new Vector3()

                // const arrays = strip.toVertexArrays()
                const vertex = strip.vertex(0, 0)
                expect(typeof vertex.attributes).toBe('object')
            })
        })

    })

})
