export function mulSpinorE3ZX(R, S) {
    return R.yz * S.xy + R.zx * S.a - R.xy * S.yz + R.a * S.zx;
}
