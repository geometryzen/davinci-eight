import { GeometricE3 } from '../math/GeometricE3';

export function isScalarG3(m: GeometricE3): boolean {
    return m.x === 0 && m.y === 0 && m.z === 0 && m.xy === 0 && m.yz === 0 && m.zx === 0 && m.b === 0;
}
