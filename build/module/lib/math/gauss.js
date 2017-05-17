var abs = Math.abs;
function makeColumnVector(n, v) {
    var a = [];
    for (var i = 0; i < n; i++) {
        a.push(v);
    }
    return a;
}
function rowWithMaximumInColumn(A, column, N) {
    var biggest = abs(A[column][column]);
    var maxRow = column;
    for (var row = column + 1; row < N; row++) {
        if (abs(A[row][column]) > biggest) {
            biggest = abs(A[row][column]);
            maxRow = row;
        }
    }
    return maxRow;
}
function swapRows(A, i, j, N) {
    var colLength = N + 1;
    for (var column = i; column < colLength; column++) {
        var temp = A[j][column];
        A[j][column] = A[i][column];
        A[i][column] = temp;
    }
}
function makeZeroBelow(A, i, N) {
    for (var row = i + 1; row < N; row++) {
        var c = -A[row][i] / A[i][i];
        for (var column = i; column < N + 1; column++) {
            if (i === column) {
                A[row][column] = 0;
            }
            else {
                A[row][column] += c * A[i][column];
            }
        }
    }
}
function solve(A, N) {
    var x = makeColumnVector(N, 0);
    for (var i = N - 1; i > -1; i--) {
        x[i] = A[i][N] / A[i][i];
        for (var k = i - 1; k > -1; k--) {
            A[k][N] -= A[k][i] * x[i];
        }
    }
    return x;
}
/**
 * Gaussian elimination
 * Ax = b
 */
export function gauss(A, b) {
    var N = A.length;
    for (var i = 0; i < N; i++) {
        var Ai = A[i];
        var bi = b[i];
        Ai.push(bi);
    }
    for (var j = 0; j < N; j++) {
        swapRows(A, j, rowWithMaximumInColumn(A, j, N), N);
        makeZeroBelow(A, j, N);
    }
    return solve(A, N);
}
