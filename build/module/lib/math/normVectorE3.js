/**
 * @hidden
 * @returns The Euclidean magnitude of the vector.
 */
export function normVectorE3(vector) {
    var x = vector.x;
    var y = vector.y;
    var z = vector.z;
    return Math.sqrt(x * x + y * y + z * z);
}
