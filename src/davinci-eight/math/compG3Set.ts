import GeometricE3 from '../math/GeometricE3';

let COORD_W = 0
let COORD_X = 1
let COORD_Y = 2
let COORD_Z = 3
let COORD_XY = 4
let COORD_YZ = 5
let COORD_ZX = 6
let COORD_XYZ = 7

export default function compG3Set(m: GeometricE3, index: number, value: number): void {
    switch (index) {
        case COORD_W:
            m.α = value
            break
        case COORD_X:
            m.x = value
            break
        case COORD_Y:
            m.y = value
            break
        case COORD_Z:
            m.z = value
            break
        case COORD_XY:
            m.xy = value
            break
        case COORD_YZ:
            m.yz = value
            break
        case COORD_ZX:
            m.zx = value
            break
        case COORD_XYZ:
            m.β = value
            break
        default:
            throw new Error("index => " + index)
    }
}
