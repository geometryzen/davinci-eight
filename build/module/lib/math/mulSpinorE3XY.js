export function mulSpinorE3XY(R, S) {
    return -R.yz * S.zx + R.zx * S.yz + R.xy * S.a + R.a * S.xy;
}
