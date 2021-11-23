import RBF from 'rbf';


interface TrajectoryFunction {
    readonly domainB: number,
    readonly domainE: number,
    readonly rbf: RBF
}

let StarTrajectory: TrajectoryFunction = {
    domainB: 0,
    domainE: 2 * Math.PI,
    rbf: new RBF(
        [
            [0.],
            [0.62831853],
            [1.25663706],
            [1.88495559],
            [2.51327412],
            [3.14159265],
            [3.76991118],
            [4.39822972],
            [5.02654825],
            [5.65486678],
            [6.28318531]
        ],
        [0, 1, 0, -1, 0, 1, 0, -1, 0, 1, 0]
    )
}

let RidgeTrajectory: TrajectoryFunction = {
    domainB: 0,
    domainE: 1,
    rbf: new RBF(
        [
            [0.],
            [0.5],
            [1]
        ],
        [0, 1, 0]
    )
}

let SigmoidTrajectory: TrajectoryFunction = {
    domainB: 0,
    domainE: 1,
    rbf: new RBF(
        [
            [0.],
            [0.25],
            [0.5],
            [0.75],
            [1.]
        ],
        [-1., -0.89460678, -0.25, 0.51960678, 1.]
    )
}

let trajectoryFunctionsList = [StarTrajectory, RidgeTrajectory, SigmoidTrajectory]

class CircularBehaviour {
    public readonly behaviourName: string | undefined;
    public xScaler: number | any;
    public yScaler: number | any;
    public partSpeed: number | any;
    public partsTF: TrajectoryFunction;
    public sXScaler: number | any;
    public sYScaler: number | any;
    public shapeXSpeed: number | any;
    public shapeYSpeed: number | any;
    public shapeXTF: TrajectoryFunction | undefined;
    public shapeYTF: TrajectoryFunction | undefined;


    public constructor(
        xScaler: undefined | number,
        yScaler: undefined | number,
        partsTF: undefined | TrajectoryFunction,
        partSpeed: undefined | number
    );
    public constructor(
        xScaler: number,
        yScaler: number,
        partsTF: undefined | TrajectoryFunction,
        partSpeed: number,
        shapeXTF: undefined | TrajectoryFunction,
        shapeYTF: undefined | TrajectoryFunction,
        shapeXSpeed: number,
        shapeYSpeed: number,
        sXScaler: number,
        sYScaler: number
    );

    public constructor(...args: Array<any>) {
        if (args.length === 4) {
            this.xScaler = args[0];
            this.yScaler = args[1];
            this.partsTF = args[2];
            this.partSpeed = args[3];
            this.shapeXTF = undefined;
            this.sXScaler = undefined;
            this.shapeXSpeed = undefined;
            this.sYScaler = undefined;
        } else if (args.length === 10) {
            this.xScaler = args[0];
            this.yScaler = args[1];
            this.partsTF = args[2];
            this.partSpeed = args[3];
            this.shapeXTF = args[4];
            this.shapeYTF = args[5];
            this.shapeXSpeed = args[6];
            this.shapeYSpeed = args[7];
            this.sXScaler = args[8];
            this.sYScaler = args[9];

        } else {
            throw new Error('Minimum number of dimmensions is 4.');
        }
    }
}

class LinearBehaviour {

    public readonly behaviourName: string = 'linear';

    public constructor(
        public xScaler: number,
        public yScaler: number,
        public xSpeed: number,
        public ySpeed: number,
        public shapeXTF?: undefined | TrajectoryFunction,
        public shapeYTF?: undefined | TrajectoryFunction
    ) {

    }

}

class SwarmBehaviour extends CircularBehaviour {

    public readonly behaviourName: string = 'swarm';
}

class SpiralBehaviour extends CircularBehaviour {

    public readonly behaviourName: string = 'spiral';
}

class NormalBehaviour extends CircularBehaviour {

    public readonly behaviourName: string = 'normal';
}

export {
    RidgeTrajectory,
    SigmoidTrajectory,
    StarTrajectory,
    trajectoryFunctionsList,
    TrajectoryFunction,
    CircularBehaviour,
    SwarmBehaviour,
    SpiralBehaviour,
    NormalBehaviour,
    LinearBehaviour
}