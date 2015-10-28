import GeometricE2 = require('../math/GeometricE2')

function compG2Set(m: GeometricE2, index: number, value: number): void {
    switch (index) {
        case 0:
            m.α = value
            break
        case 1:
            m.x = value
            break
        case 2:
            m.y = value
            break
        case 3:
            m.β = value
            break
        default:
            throw new Error("index => " + index)
    }
}

export = compG2Set