import { norm2 } from './math'
import { Displ, Point, Force } from './types'

export enum Axis {
    X = 0,
    Y = 1,
}

export class Node {
    private neighbors: Node[] = undefined
    private fixity_: [boolean, boolean] = [false, false]
    private force_: Force = [0, 0]
    private id_ = -1

    constructor(private p: Point, id = -1) {
        this.id_ = id
    }

    lock(axis: Axis, value: boolean) {
        this.fixity_[axis] = value
    }

    get id() {
        return this.id_
    }
    set id(i: number) {
        this.id_ = i
    }

    get fixity() {
        return this.fixity_
    }

    get position() {
        return this.p
    }

    get force() {
        console.error(
            'TODO: compute the forces du to (1) the circum-nodes and (2) the external forces',
        )
        return this.force_
    }

    setNeighbors(nodes: Node[]) {
        this.neighbors = nodes
    }

    setFixity(fixX: boolean, fixY: boolean) {
        this.fixity_[0] = fixX
        this.fixity_[1] = fixY
    }

    update(u: Displ, damp = 1): number {
        this.p[0] += u[0] * damp
        this.p[1] += u[1] * damp
        return norm2(u)
    }
}
