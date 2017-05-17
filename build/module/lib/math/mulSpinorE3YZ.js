export function mulSpinorE3YZ(R, S) {
    return R.yz * S.a - R.zx * S.xy + R.xy * S.zx + R.a * S.yz;
}
