const abs = Math.abs;

function makeColumnVector(n: number, v: number): number[] {
    const a: number[] = [];
    for (let i = 0; i < n; i++) {
        a.push(v);
    }
    return a;
}

function rowWithMaximumInColumn(A: number[][], column: number, N: number): number {
    let biggest = abs(A[column][column]);
    let maxRow = column;
    for (let row = column + 1; row < N; row++) {
        if (abs(A[row][column]) > biggest) {
            biggest = abs(A[row][column]);
            maxRow = row;
        }
    }
    return maxRow;
}

function swapRows(A: number[][], i: number, j: number, N: number) {
    const colLength = N + 1;
    for (let column = i; column < colLength; column++) {
        const temp = A[j][column];
        A[j][column] = A[i][column];
        A[i][column] = temp;
    }
}

function makeZeroBelow(A: number[][], i: number, N: number): void {
    for (let row = i + 1; row < N; row++) {
        const c = -A[row][i] / A[i][i];
        for (let column = i; column < N + 1; column++) {
            if (i === column) {
                A[row][column] = 0;
            }
            else {
                A[row][column] += c * A[i][column];
            }
        }
    }
}

function solve(A: number[][], N: number) {
    const x = makeColumnVector(N, 0);
    for (let i = N - 1; i > -1; i--) {
        x[i] = A[i][N] / A[i][i];
        for (let k = i - 1; k > -1; k--) {
            A[k][N] -= A[k][i] * x[i];
        }
    }
    return x;
}


/**
 * Gaussian elimination
 * Ax = b
 */
export function gauss(A: number[][], b: number[]): number[] {

    const N = A.length;

    for (let i = 0; i < N; i++) {
        const Ai = A[i];
        const bi = b[i];
        Ai.push(bi);
    }

    for (let j = 0; j < N; j++) {
        swapRows(A, j, rowWithMaximumInColumn(A, j, N), N);
        makeZeroBelow(A, j, N);
    }

    return solve(A, N);
}
