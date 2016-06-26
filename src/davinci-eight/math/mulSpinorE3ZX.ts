import SpinorE3 from './SpinorE3'

export default function(R: SpinorE3, S: SpinorE3): number {
    return R.yz * S.xy + R.zx * S.a - R.xy * S.yz + R.a * S.zx
}
