export function mulSpinorE3alpha(R, S) {
    return -R.yz * S.yz - R.zx * S.zx - R.xy * S.xy + R.a * S.a;
}
