export function normVectorE3(vector: { x: number; y: number; z: number }): number {
    const x = vector.x;
    const y = vector.y;
    const z = vector.z;
    return Math.sqrt(x * x + y * y + z * z);
}
