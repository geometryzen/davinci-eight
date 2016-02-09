import GeometricE2 from '../math/GeometricE2';

export default function compG2Get(m: GeometricE2, index: number): number {
    switch (index) {
        case 0: {
            return m.α
        }
            break
        case 1: {
            return m.x
        }
            break
        case 2: {
            return m.y
        }
            break
        case 3: {
            return m.β
        }
            break
        default: {
            throw new Error("index => " + index)
        }
    }
}
