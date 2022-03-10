import { Serie } from "@youwol/dataframe"
import { Material, ModelBuilder } from ".."

const positions = Serie.create({array: [0,0,0, 1,0,0, 2,0,0, 0,1,0, 1,1,0, 2,1,0, 0,2,0, 1,2,0, 2,2,0], itemSize: 3})
const indices   = Serie.create({array: [0,1,4, 0,4,3, 1,2,5, 1,5,4, 3,4,7, 3,7,6, 4,5,8, 4,8,7], itemSize: 3})

test('fake test', () => {
    const builder = new ModelBuilder()
    builder.addPart(positions, indices, new Material(0.25, 1))

    const model = builder.model
})
