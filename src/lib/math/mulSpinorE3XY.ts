import { SpinorE3 } from './SpinorE3';

export function mulSpinorE3XY(R: SpinorE3, S: SpinorE3): number {
    return - R.yz * S.zx + R.zx * S.yz + R.xy * S.a + R.a * S.xy;
}
