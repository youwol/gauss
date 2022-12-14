import { Surface } from '@youwol/geometry'
import { Serie } from '@youwol/dataframe'
import { Triangle, Node, Material, Part, Model } from '.'

export class ModelBuilder {
    private model_: Model = undefined

    constructor() {
        this.model_ = new Model()
    }

    /**
     * Get the constructed model
     */
    get model() {
        return this.model_
    }

    /**
     * Add a new part in the model
     * @param positions the node positions
     * @param indices  the indices of the triangles
     * @param material the material
     */
    addPart(positions: Serie, indices: Serie, material: Material) {
        const s = Surface.create(positions, indices)

        // Do the nodes
        const nodes: Node[] = []
        const nodeMap = new Map<number, Node>()
        s.forEachNode((node) => {
            const n = new Node(node.pos, node.id)
            // console.log(node.pos)
            nodes.push(n)
            nodeMap.set(node.id, n)
        })

        // Do the triangles
        const triangles: Triangle[] = []
        s.forEachFace((face) => {
            const nodes: Node[] = []
            face.nodes.forEach((n) => {
                nodes.push(nodeMap.get(n.id))
            })
            if (nodes.length === 3) {
                triangles.push(
                    new Triangle({
                        p1: nodes[0],
                        p2: nodes[1],
                        p3: nodes[2],
                        material,
                    }),
                )
            }
        })

        // Do the part
        const part = new Part(triangles)

        // Do the neighbors
        // s.forEachNode( node => {
        //     const neighbors: Node[] = []
        //     nodesAroundNode(node, n => neighbors.push(nodeMap.get(n.id)) )
        //     node.setNeighbors(neighbors)
        // })

        // Done
        this.model_.addPart(part)
    }
}
