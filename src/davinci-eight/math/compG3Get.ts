import GeometricE3 = require('../math/GeometricE3')

// GraphicsProgramSymbols constants for the coordinate indices into the data array.
// These are chosen to match those used by Euclidean3.
// TODO: The goal should be to protect the user from changes in ordering.
let COORD_W = 0
let COORD_X = 1
let COORD_Y = 2
let COORD_Z = 3
let COORD_XY = 4
let COORD_YZ = 5
let COORD_ZX = 6
let COORD_XYZ = 7

function gcompE3(m: GeometricE3, index: number): number {
    switch (index) {
        case COORD_W: {
            return m.α
        }
        case COORD_X: {
            return m.x
        }
        case COORD_Y: {
            return m.y
        }
        case COORD_Z: {
            return m.z
        }
        case COORD_XY: {
            return m.xy
        }
        case COORD_YZ: {
            return m.yz
        }
        case COORD_ZX: {
            return m.zx
        }
        case COORD_XYZ: {
            return m.β
        }
        default: {
            throw new Error("index => " + index)
        }
    }
}

export = gcompE3
