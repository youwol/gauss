import { Triangle } from "./Triangle"

export class Part {
    private triangles_: Triangle[] = []

    constructor(triangles: Triangle[]) {
        this.triangles_ = triangles
    }

    get triangles() {return this.triangles_}
}