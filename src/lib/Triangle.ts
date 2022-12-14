import { Material } from './Material'
import { Node } from './Node'
import {
    invert,
    multMat,
    multVec,
    multVecForId,
    scaleMat,
    transpose,
} from './math'

// See, e.g., http://www.unm.edu/~bgreen/ME360/2D%20Triangular%20Elements.pdf page 15
export class Triangle {
    private nodes_: Node[] = []
    private material: Material = undefined
    private iKe: Array<Array<number>> = undefined

    constructor({
        p1,
        p2,
        p3,
        material,
    }: {
        p1: Node
        p2: Node
        p3: Node
        material: Material
    }) {
        this.nodes_.push(p1, p2, p3)
        this.material = material
        this.buildStiffness()
    }

    get nodes() {
        return this.nodes_
    }

    displFor(id: number) {
        const f = this.nodalForces()
        return multVecForId(id, this.iKe, f)
    }

    displ() {
        const f = this.nodalForces()
        return multVec(this.iKe, f)
    }

    private nodalForces() {
        const f = new Array(6).fill(undefined)
        f[0] = this.nodes_[0].force[0]
        f[1] = this.nodes_[0].force[1]
        f[2] = this.nodes_[1].force[0]
        f[3] = this.nodes_[1].force[1]
        f[4] = this.nodes_[2].force[0]
        f[5] = this.nodes_[2].force[1]
        return f
    }

    private buildStiffness() {
        const N = this.nodes_
        const x21 = N[1].position[0] - N[0].position[0]
        const x32 = N[2].position[0] - N[1].position[0]
        const x13 = N[0].position[0] - N[2].position[0]
        const y12 = N[0].position[1] - N[1].position[1]
        const y23 = N[1].position[1] - N[2].position[1]
        const y31 = N[2].position[1] - N[0].position[1]

        const detJ = x13 * y23 - y31 * x32
        const area = 0.5 * Math.abs(detJ)

        const B = [
            [y23, 0, y31, 0, y12, 0],
            [0, x32, 0, x13, 0, x21],
            [x32, y23, x13, y31, x21, y12],
        ]

        // console.log(N[0], N[1], N[2])
        // B.forEach( r => console.log(...r) )

        scaleMat(B, 1 / detJ)

        const Bt = transpose(B)

        const v = this.material.poisson
        const E = this.material.young
        const C = [
            [1, v, 0],
            [v, 1, 0],
            [0, 0, (1 - v) / 2],
        ]
        scaleMat(C, E / (1 - v ** 2))

        this.iKe = multMat(Bt, multMat(C, B))

        const thickness = 1
        scaleMat(this.iKe, area * thickness)

        // console.log(this.iKe)

        this.iKe = invert(this.iKe)
    }
}
