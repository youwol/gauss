import { Model } from "./Model"

export class Seidel {
    private model: Model
    private eps: number
    private maxIter: number
    private damp: number

    constructor(
        {model, eps = 1e-7, maxIter = 200, damp=1}:
        {model: Model, eps?: number, maxIter?: number, damp?:number}
    ){
        this.model   = model
        this.eps     = eps
        this.maxIter = maxIter
        this.damp    = damp
    }

    run() {
        let eps = 1
        let iter = 0
        while (eps>this.eps || iter<this.maxIter) {
            let n = 0
            eps = 0
            this.model.parts.forEach( part => {
                n++
                part.triangles.forEach( t => {
                    t.nodes.forEach( (node, i) => {
                        eps += node.update( t.displFor(i), this.damp )
                    })
                })
            })
            eps /= n
            iter++

            if (iter%50) {
                console.log(`iter ${iter}:\t convergence = ${eps}`)
            }
        }
    }
}
