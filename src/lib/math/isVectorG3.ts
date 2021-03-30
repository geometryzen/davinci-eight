import { GeometricE3 } from '../math/GeometricE3';

/**
 * @hidden
 */
export function isVectorG3(m: GeometricE3): boolean {
    return m.a === 0 && m.xy === 0 && m.yz === 0 && m.zx === 0 && m.b === 0;
}
