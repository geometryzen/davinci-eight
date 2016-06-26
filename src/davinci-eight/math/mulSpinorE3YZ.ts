import SpinorE3 from './SpinorE3'

export default function(R: SpinorE3, S: SpinorE3): number {
    return R.yz * S.a - R.zx * S.xy + R.xy * S.zx + R.a * S.yz
}
