import GeometricE2 = require('../math/GeometricE2')

function compG2Get(m: GeometricE2, index: number): number {
    switch (index) {
        case 0: {
            return m.α
        }
        case 1: {
            return m.x
        }
        case 2: {
            return m.y
        }
        case 3: {
            return m.β
        }
        default: {
            throw new Error("index => " + index)
        }
    }
}

export = compG2Get
