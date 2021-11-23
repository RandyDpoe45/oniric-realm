import RBF from 'rbf';

// let sigmoidShape = new RBF(
//     [[0.], [0.25], [0.5], [0.75], [1.]],
//     [-1., -0.89460678, -0.25, 0.51960678, 1.]
// );


interface ShapeRBF {
    domainB: number,
    domainE: number,
    rbf: RBF
}

let StarShape: ShapeRBF = {
    domainB: -Math.PI,
    domainE: Math.PI,
    rbf: new RBF(
        [
            [-3.14159265],
            [-2.51327412],
            [-1.88495559],
            [-1.25663706],
            [-0.62831853],
            [0.],
            [0.62831853],
            [1.25663706],
            [1.88495559],
            [2.51327412],
            [3.14159265]
        ],
        [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
    )
}

let DoubleIHeap: ShapeRBF = {
    domainB: -1,
    domainE: 1,
    rbf: new RBF(
        [
            [-1.],
            [-0.77777778],
            [-0.55555556],
            [-0.33333333],
            [-0.11111111],
            [0.11111111],
            [0.33333333],
            [0.55555556],
            [0.77777778],
            [1.]
        ],
        [-.5, -.75, -.5, 0, 0, 0, 0, .5, .75, .5]
    )
}

let DoubleHeap: ShapeRBF = {
    domainB: -1,
    domainE: 1,
    rbf: new RBF(
        [
            [-1.],
            [-0.77777778],
            [-0.55555556],
            [-0.33333333],
            [-0.11111111],
            [0.11111111],
            [0.33333333],
            [0.55555556],
            [0.77777778],
            [1.]
        ],
        [.5, .75, .5, 0, 0, 0, 0, .5, .75, .5]
    )
}

let SigmoidShape: ShapeRBF = {
    domainB: 0,
    domainE: 1,
    rbf: new RBF(
        [[0.], [0.25], [0.5], [0.75], [1.]],
        [-1., -0.89460678, -0.25, 0.51960678, 1.]
    )
}

let shapeList = [StarShape, DoubleHeap, DoubleIHeap, SigmoidShape]

class ShapeFunction {

    constructor(
        public xScaler: number,
        public yScaler: number,
        public angle: number,
        public rbf: ShapeRBF
    ) {
        this.angle = (this.angle * Math.PI) / 180;
    }
}

class RadialShapeFunction {

    constructor(
        public baseRadius: number,
        public rScaler: number,
        public angle: number,
        public rbf: ShapeRBF
    ) {
        this.angle = (this.angle * Math.PI) / 180;
    }
}
export { SigmoidShape, StarShape, DoubleHeap, DoubleIHeap, shapeList, ShapeFunction, ShapeRBF, RadialShapeFunction }
