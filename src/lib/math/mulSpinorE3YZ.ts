import { SpinorE3 } from './SpinorE3';

export function mulSpinorE3YZ(R: SpinorE3, S: SpinorE3): number {
    return R.yz * S.a - R.zx * S.xy + R.xy * S.zx + R.a * S.yz;
}
