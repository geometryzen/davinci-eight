import Geometric3 from './Geometric3'
import R3 from './R3'
import Unit from './Unit'

describe("Geometric3", function() {

    describe("stress", function() {

        const stress = R3.vector(7, 11, 13, Unit.ONE)
        const position = Geometric3.vector(2, 3, 5)
        const chain = position.stress(stress)

        it("should piece-wise multiply grade 1 components", function() {
            expect(position.x).toBe(14)
            expect(position.y).toBe(33)
            expect(position.z).toBe(65)
        })
        it("should be chainable", function() {
            expect(chain === position).toBe(true)
        })
    })
})
