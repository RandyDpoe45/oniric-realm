import { RadialShapeFunction, ShapeFunction, shapeList, StarShape } from "../constants/ShapeRBFs";
import { LinearBehaviour, NormalBehaviour, SpiralBehaviour, SwarmBehaviour, trajectoryFunctionsList } from "../constants/TrajectoryRBFs";
import { BaseScene } from "../scenes/BaseScene";
import { CircularShapeManager } from "./CircularShapeManager";
import { ShapeManager } from "./ShapeManager";
import { ParticleOptions, PhysicsOptions, SpriteOptions } from "./Types";

abstract class Factory {

    public widthOffset: number = 0;
    public heightOffset: number = 0;

    constructor(
        public width: number,
        public height: number,
        public parent: BaseScene,
        public maxNObjects: number,
        public spriteList: string[],
        public particleList: string[] | undefined,
        widthOffset: number | undefined,
        heightOffset: number | undefined
    ) {
        if (widthOffset) {
            this.widthOffset = widthOffset;
        }
        if (heightOffset) {
            this.heightOffset = heightOffset;
        }
    }

    abstract generateShape();
    abstract generateBehaviour();

    public abstract buildRandomShapeManager();

    generatePosition(): number[] {
        let x = Math.random() * (this.width / 2);
        let y = Math.random() * (this.height / 2);
        return [this.widthOffset + x, this.heightOffset + y];
    }

    generateSpriteOptions(): SpriteOptions {
        let numberOfSprites = Math.floor(Math.random() * this.spriteList.length) + 1;
        let numberOfScales = Math.floor(Math.random() * numberOfSprites) + 1;
        let spriteList: string[] = [];
        let scaleList: number[] = [];
        for (let i = 0; i < numberOfSprites; i++) {
            spriteList.push(this.spriteList[Math.floor(Math.random() * this.spriteList.length)]);
        }

        for (let i = 0; i < numberOfScales; i++) {
            scaleList.push(Math.random() * 2 + 1);
        }

        let spriteOptions = new SpriteOptions(spriteList, scaleList);
        return spriteOptions;
    }

    generateNObjects(): number {
        return Math.floor(Math.random() * this.maxNObjects);
    }

    generateParticleOptions(baseSpeed: number): ParticleOptions | undefined {
        if (!this.particleList) {
            return undefined;
        }

        let particleList: string[] = [];
        let particleSpeedList: number[] = [];
        let particleScaleList: number[] = [];

        let numberOfParticles = Math.floor(Math.random() * this.particleList.length) + 1;
        let numberOfScales = Math.floor(Math.random() * numberOfParticles) + 1;
        let numberOfSpeeds = Math.floor(Math.random() * numberOfParticles) + 1;

        for (let i = 0; i < numberOfParticles; i++) {
            particleList.push(this.particleList[Math.floor(Math.random() * this.particleList.length)]);
        }

        for (let i = 0; i < numberOfScales; i++) {
            particleScaleList.push(1 + Math.random() * 2);
        }

        for (let i = 0; i < numberOfSpeeds; i++) {
            particleSpeedList.push(baseSpeed + Math.random() * baseSpeed);
        }
        let particleOptions = new ParticleOptions(particleList, particleSpeedList, particleScaleList);
        return particleOptions;
    }


}

export class CircularShapeFactory extends Factory {

    public buildRandomShapeManager() {
        let position = this.generatePosition();
        return new CircularShapeManager(
            this.parent,
            this.generateShape(),
            this.generateBehaviour(),
            this.generateNObjects(),
            this.generateSpriteOptions(),
            position[0],
            position[1],
            this.generateParticleOptions(50)
        );
    }

    generateShape() {
        let angle = Math.random() > 0.5 ? Math.random() * 360 : 0;
        let rScaler = 150 + Math.random() * 200;
        let baseRadius = 0.2;
        return new RadialShapeFunction(
            baseRadius,
            rScaler,
            angle,
            shapeList[Math.floor(Math.random() * shapeList.length)]
        )
    }

    generateBehaviour() {
        let prob = Math.random();
        let xScaler = 100 + Math.random() * 0;
        let yScaler = 300 + Math.random() * 0;
        let rFunc = trajectoryFunctionsList[Math.floor(Math.random() * trajectoryFunctionsList.length)];
        let xFunc = Math.random() < 0.5 ? trajectoryFunctionsList[Math.floor(Math.random() * trajectoryFunctionsList.length)] : undefined;
        let yFunc = Math.random() < 0.5 ? trajectoryFunctionsList[Math.floor(Math.random() * trajectoryFunctionsList.length)] : undefined;
        let xSScaler = 700 //Math.random() * 1000;
        let ySScaler = 100 //Math.random() * 400;
        let rSpeed = 10000;
        let xSpeed = Math.random() * 100000;
        let ySpeed = Math.random() * 100000;
        if (prob > 0.7) {
            return new SwarmBehaviour(
                xScaler,
                yScaler,
                rFunc,
                rSpeed,
                xFunc,
                yFunc,
                xSpeed,
                ySpeed,
                xSScaler,
                ySScaler
            );
        } else if (prob > 0.4) {
            return new SpiralBehaviour(
                xScaler,
                yScaler,
                rFunc,
                rSpeed,
                xFunc,
                yFunc,
                xSpeed,
                ySpeed,
                xSScaler,
                ySScaler
            );
        } else {
            return new NormalBehaviour(
                xScaler,
                yScaler,
                rFunc,
                rSpeed,
                xFunc,
                yFunc,
                xSpeed,
                ySpeed,
                xSScaler,
                ySScaler
            );
        }
    }

}

export class NormalShapeFactory extends Factory {


    buildRandomShapeManager(): ShapeManager {
        let position = this.generatePosition();
        let shape = this.generateShape();
        let behaviour = this.generateBehaviour();
        let nObjects = this.generateNObjects();
        let spriteOptions = this.generateSpriteOptions();
        let particleOptions = this.generateParticleOptions(100);
        let physicsOptions = this.generatePhysicsOptions();
        let sm = new ShapeManager(
            this.parent,
            shape,
            behaviour,
            nObjects,
            spriteOptions,
            position[0],
            position[1],
            particleOptions,
            physicsOptions
        );

        return sm;
    }



    generateShape(): ShapeFunction {
        let angle = Math.random() > 0.5 ? Math.random() * 360 : 0;
        let xScaler = (Math.random() + 0.2) * this.width;
        let yScaler = (Math.random() + 0.2) * this.height;

        let shapeFunction = new ShapeFunction(xScaler, yScaler, angle, shapeList[Math.floor(Math.random() * shapeList.length)]);
        return shapeFunction;
    }

    generateBehaviour(): undefined | LinearBehaviour {
        if (Math.random() > 0.6) {
            let xScaler = Math.random() * (this.width - this.width / 3);
            let yScaler = Math.random() * (this.height - this.height / 4);
            let xSpeed = Math.random() * 100000;
            let ySpeed = Math.random() * 100000;
            if (Math.random() < 0.5) {
                return new LinearBehaviour(
                    xScaler,
                    yScaler,
                    xSpeed,
                    ySpeed,
                    trajectoryFunctionsList[Math.floor(Math.random() * trajectoryFunctionsList.length)],
                    trajectoryFunctionsList[Math.floor(Math.random() * trajectoryFunctionsList.length)]
                );
            } else {
                return new LinearBehaviour(
                    xScaler,
                    yScaler,
                    xSpeed,
                    ySpeed
                );
            }
        } else {
            return undefined;
        }
    }

    generatePhysicsOptions(): PhysicsOptions {
        let physicsOptions = new PhysicsOptions(
            Math.random() > 0.5,
            Math.random() > 0.3,
            Math.random() > 0.5
        );
        return physicsOptions;
    }

}

