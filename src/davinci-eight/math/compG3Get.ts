import GeometricE3 from '../math/GeometricE3';

// GraphicsProgramSymbols constants for the coordinate indices into the data array.
// These are chosen to match those used by G3.
// TODO: The goal should be to protect the user from changes in ordering.
const COORD_W = 0
const COORD_X = 1
const COORD_Y = 2
const COORD_Z = 3
const COORD_XY = 4
const COORD_YZ = 5
const COORD_ZX = 6
const COORD_XYZ = 7

export default function gcompE3(m: GeometricE3, index: number): number {
    switch (index) {
        case COORD_W: {
            return m.α
        }
        break
        case COORD_X: {
            return m.x
        }
        break
        case COORD_Y: {
            return m.y
        }
        break
        case COORD_Z: {
            return m.z
        }
        break
        case COORD_XY: {
            return m.xy
        }
        break
        case COORD_YZ: {
            return m.yz
        }
        break
        case COORD_ZX: {
            return m.zx
        }
        break
        case COORD_XYZ: {
            return m.β
        }
        break
        default: {
            throw new Error("index => " + index)
        }
    }
}
