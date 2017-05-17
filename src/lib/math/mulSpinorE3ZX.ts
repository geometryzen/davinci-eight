import { SpinorE3 } from './SpinorE3';

export function mulSpinorE3ZX(R: SpinorE3, S: SpinorE3): number {
    return R.yz * S.xy + R.zx * S.a - R.xy * S.yz + R.a * S.zx;
}
