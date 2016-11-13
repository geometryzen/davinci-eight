import SpinorE3 from './SpinorE3';

export default function mulSpinorE3alpha(R: SpinorE3, S: SpinorE3): number {
    return - R.yz * S.yz - R.zx * S.zx - R.xy * S.xy + R.a * S.a;
}
