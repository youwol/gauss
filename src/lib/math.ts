import { Displ, Vectord } from './types'

export function norm2(u: Displ) {
    return u[0] ** 2 + u[1] ** 2
}

export function scaleMat(m: Array<Array<number>>, a: number) {
    for (let i = 0; i < m.length; ++i) {
        for (let j = 0; j < m[i].length; ++j) {
            m[i][j] *= a
        }
    }
}

export function transpose(m: Array<Array<number>>) {
    const n1 = m.length
    const n2 = m[0].length

    const r = new Array<Array<number>>(n2)
    for (let j = 0; j < n2; ++j) {
        r[j] = new Array<number>(n1)
    }

    for (let i = 0; i < n1; ++i) {
        for (let j = 0; j < n2; ++j) {
            r[j][i] = m[i][j]
        }
    }

    return r
}

export function multVec(A: Array<Array<number>>, b: Array<number>): Vectord {
    const aNumRows = A.length
    const aNumCols = A[0].length
    const s = new Array(aNumRows)

    for (let r = 0; r < aNumRows; ++r) {
        s[r] = 0
        for (let c = 0; c < aNumCols; ++c) {
            s[r] += A[r][c] * b[c]
        }
    }

    return s
}

export function multVecForId(
    id: number,
    A: Array<Array<number>>,
    b: Array<number>,
): Displ {
    // const aNumRows = A.length
    const aNumCols = A[0].length
    const s: Displ = [0, 0]

    for (let r = id; r < id + 2; ++r) {
        const k = r - id
        s[k] = 0
        for (let c = 0; c < aNumCols; ++c) {
            s[k] += A[r][c] * b[c]
        }
    }

    return s
}

export function multMat(A: Array<Array<number>>, B: Array<Array<number>>) {
    const aNumRows = A.length
    const aNumCols = A[0].length
    const bNumCols = B[0].length
    const m = new Array(aNumRows)

    for (let r = 0; r < aNumRows; ++r) {
        m[r] = new Array(bNumCols)
        for (let c = 0; c < bNumCols; ++c) {
            m[r][c] = 0
            for (let i = 0; i < aNumCols; ++i) {
                m[r][c] += A[r][i] * B[i][c]
            }
        }
    }

    return m
}

export function invert(A: Array<Array<number>>): Array<Array<number>> {
    // Now, needs to invert Ke since Ke.u = f with u unknown
    const m1 = new Matrix(A)
    const m2 = m1.inverse()
    return m2.rows
}

// ------------------------------------------------------

const withoutElementAtIndex = (arr, index) => [
    ...arr.slice(0, index),
    ...arr.slice(index + 1),
]
const sum = (arr) => arr.reduce((acc, value) => acc + value, 0)

// Excerpt from https://github.com/RodionChachura/linear-algebra
class Matrix {
    rows: Array<Array<number>>

    // args: ([0,0,0,0], ..., [0,0,0,0])
    constructor(rows: Array<Array<number>>) {
        this.rows = rows
    }

    columns() {
        return this.rows[0].map((_, i) => this.rows.map((r) => r[i]))
    }
    componentWiseOperation(func: (a: number, b: number) => number, { rows }) {
        const newRows = rows.map((row, i) =>
            row.map((element, j) => func(this.rows[i][j], element)),
        )
        return new Matrix(newRows)
    }
    scaleBy(number) {
        const newRows = this.rows.map((row) =>
            row.map((element) => element * number),
        )
        return new Matrix(newRows)
    }
    transpose() {
        return new Matrix(this.columns())
    }
    determinant() {
        if (this.rows.length !== this.rows[0].length) {
            throw new Error(
                'Only matrices with the same number of rows and columns are supported.',
            )
        }
        if (this.rows.length === 2) {
            return (
                this.rows[0][0] * this.rows[1][1] -
                this.rows[0][1] * this.rows[1][0]
            )
        }

        const parts = this.rows[0].map((coef, index) => {
            const matrixRows = this.rows
                .slice(1)
                .map((row) => [...row.slice(0, index), ...row.slice(index + 1)])
            const matrix = new Matrix(matrixRows)
            const result = coef * matrix.determinant()
            return index % 2 === 0 ? result : -result
        })

        return sum(parts)
    }
    map(func) {
        return new Matrix(
            this.rows.map((row, i) =>
                row.map((element, j) => func(element, i, j)),
            ),
        )
    }
    minor(i, j) {
        const newRows = withoutElementAtIndex(this.rows, i).map((row) =>
            withoutElementAtIndex(row, j),
        )

        const matrix = new Matrix(newRows)
        return matrix.determinant()
    }
    cofactor(i, j) {
        const sign = Math.pow(-1, i + j)
        const minor = this.minor(i, j)
        return sign * minor
    }
    adjugate() {
        return this.map((_, i, j) => this.cofactor(i, j)).transpose()
    }
    inverse() {
        const determinant = this.determinant()
        if (determinant === 0) {
            throw new Error('Determinant is zero.')
        }
        const adjugate = this.adjugate()
        return adjugate.scaleBy(1 / determinant)
    }
}
