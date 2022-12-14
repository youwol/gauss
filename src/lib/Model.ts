import { Part } from './Part'

export class Model {
    private parts_: Part[] = []

    get parts() {
        return this.parts_
    }

    addPart(part: Part) {
        this.parts_.push(part)
    }
}
