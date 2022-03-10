import { Serie } from "@youwol/dataframe"
import { Material, ModelBuilder } from ".."

const positions = Serie.create({array: [3,0,0, 3,2,0, 0,2,0, 0,0,0], itemSize: 3})
const indices   = Serie.create({array: [0,1,3, 1,2,3], itemSize: 3})

test('fake test', () => {
    const builder = new ModelBuilder()
    builder.addPart(positions, indices, new Material(0.25, 30e6))

    const model = builder.model
})
