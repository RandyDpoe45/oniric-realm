import { RadialShapeFunction } from '~/constants/ShapeRBFs';
import { CircularBehaviour } from '~/constants/TrajectoryRBFs';
import { BaseScene } from '~/scenes/BaseScene';
import { GameElement } from './GameElement';
import { IShapeManager } from './IShapeManager';
import { ParticleOptions, SpriteOptions } from './Types';
export class CircularShapeManager implements IShapeManager{

    shapeFunction: RadialShapeFunction;
    behaviour: CircularBehaviour | undefined;
    gameElementList: GameElement[] = [];
    nObjects: number;
    xBase: number;
    yBase: number;
    xPosition: number;
    yPosition: number;
    parent: BaseScene;
    lastTick: number = -1;
    lastXParam: number;
    lastYParam: number;
    lastXpartParam: number;
    lastAngle: number;
    moduleX: number = 1;
    moduleY: number = -1;
    partsModule: number = 1;

    constructor(
        parent: BaseScene,
        shapeFunction: RadialShapeFunction,
        behaviour: CircularBehaviour | undefined,
        nObjects: number,
        spriteOptions: SpriteOptions,
        xPosition: number,
        yPosition: number,
        particleOptions: ParticleOptions | undefined
    ) {
        this.shapeFunction = shapeFunction;
        this.behaviour = behaviour;
        this.nObjects = nObjects;
        this.parent = parent;
        this.xPosition = xPosition;
        this.xBase = xPosition;
        this.yBase = yPosition;
        this.yPosition = yPosition;
        this.lastXParam = this.shapeFunction.rbf.domainB;
        this.lastYParam = 0.5;
        this.lastAngle = 0;
        this.lastXpartParam = 0;

        let baseAngle = this.shapeFunction.angle;
        let deltaAngle = (this.shapeFunction.rbf.domainE - this.shapeFunction.rbf.domainB) / this.nObjects;
        for (let i = 0, currentAngle = this.shapeFunction.rbf.domainB; i < this.nObjects; i++, currentAngle += deltaAngle) {
            let x = 0;
            let y = this.shapeFunction.rScaler * (this.shapeFunction.baseRadius + this.shapeFunction.rbf.rbf([currentAngle]) * 1);
            let cosAngle = Math.cos(currentAngle + baseAngle);
            let sinAngle = Math.sin(currentAngle + baseAngle);
            let e = new GameElement(
                this.parent,
                spriteOptions.spriteScale[i % spriteOptions.spriteScale.length],
                this.xPosition + (x * cosAngle - y * sinAngle),
                this.yPosition + (x * sinAngle + y * cosAngle),
                spriteOptions.spriteList[i % spriteOptions.spriteList.length]
            );
            if (particleOptions) {
                const particles = this.parent.add.particles(
                    particleOptions.particleList[i % particleOptions.particleList.length]
                );
                const emitter = particles.createEmitter({
                    speed: particleOptions.particleSpeed[i % particleOptions.particleSpeed.length],
                    scale: { start: particleOptions.particleScale[i % particleOptions.particleScale.length], end: 0 },
                    blendMode: 'ADD'
                });
                emitter.startFollow(e.gameObject);
            }
            this.gameElementList.push(e);
        }
    }

    update() {
        if (this.behaviour && this.behaviour.partsTF) {
            let regfactor = this.behaviour.partSpeed;
            let now = performance.now();
            if (this.lastTick === -1) {
                this.lastTick = now;
            }
            let deltaT = (now - this.lastTick) / regfactor ;

            if (this.behaviour.shapeXTF) {
                let deltaTSX = (now - this.lastTick) / this.behaviour.shapeXSpeed;
                if (this.lastXParam <= this.behaviour.shapeXTF.domainB) {
                    this.moduleX = 1;
                } else if (this.lastXParam >= this.behaviour.shapeXTF.domainE) {
                    this.moduleX = -1;
                }
                this.lastXParam += deltaTSX * this.moduleX;
                this.xPosition = this.xBase + this.behaviour.sXScaler * this.behaviour.shapeXTF.rbf([this.lastXParam]);                
            }

            if(this.behaviour.shapeYTF){
                let deltaTSY = (now - this.lastTick) / this.behaviour.shapeYSpeed;
                if (this.lastYParam <= this.behaviour.shapeYTF.domainB) {
                    this.moduleY = 1;
                } else if (this.lastYParam >= this.behaviour.shapeYTF.domainE) {
                    this.moduleY = -1;
                }
                this.lastYParam += deltaTSY * this.moduleY;
                this.yPosition = this.yBase + this.behaviour.sYScaler * this.behaviour.shapeYTF.rbf([this.lastYParam]);
            }

            if (this.lastXpartParam <= this.behaviour.partsTF.domainB) {
                this.partsModule = 1;
            } else if (this.lastXpartParam >= this.behaviour.partsTF.domainE) {
                this.partsModule = -1;
            }
            this.lastXpartParam += deltaT * this.partsModule;
            this.lastAngle += deltaT * 2 * Math.PI;
            let baseAngle = this.shapeFunction.angle;
            let baseOffset = this.behaviour.partsTF.rbf([this.lastXpartParam]) * 1;
            let deltaAngle = (this.shapeFunction.rbf.domainE - this.shapeFunction.rbf.domainB) / this.nObjects;

            if (this.behaviour.behaviourName === "swarm") {
                let cosAngle = Math.cos(this.lastAngle);
                let sinAngle = Math.sin(this.lastAngle);
                for (let i = 0; i < this.nObjects; i++) {
                    let x = this.gameElementList[i].positionX - this.xPosition;
                    let y = this.gameElementList[i].positionY - this.yPosition;
                    x = this.xPosition + (x * cosAngle - y * sinAngle) + this.behaviour.xScaler * baseOffset;
                    y = this.yPosition + (x * sinAngle + y * cosAngle) + this.behaviour.yScaler * baseOffset;
                    this.gameElementList[i].updatePositition(x, y);
                }
            } else if (this.behaviour.behaviourName === "spiral") {
                for (let i = 0, currentAngle = this.shapeFunction.rbf.domainB; i < this.nObjects; i++, currentAngle += deltaAngle) {
                    let cosAngle = Math.cos(currentAngle + this.lastAngle + baseAngle);
                    let sinAngle = Math.sin(currentAngle + this.lastAngle + baseAngle);
                    let x = this.behaviour.yScaler * baseOffset * cosAngle;
                    let y = this.behaviour.yScaler * (baseOffset * sinAngle + this.shapeFunction.baseRadius + this.shapeFunction.rbf.rbf([currentAngle]) * 1);
                    this.gameElementList[i].updatePositition(
                        this.xPosition + (x * cosAngle - y * sinAngle),
                        this.yPosition + (x * sinAngle + y * cosAngle)
                    );
                }
            } else if (this.behaviour.behaviourName === "normal") {
                for (let i = 0, currentAngle = this.shapeFunction.rbf.domainB; i < this.nObjects; i++, currentAngle += deltaAngle) {
                    let cosAngle = Math.cos(currentAngle + this.lastAngle + baseAngle);
                    let sinAngle = Math.sin(currentAngle + this.lastAngle + baseAngle);
                    let x = 0;
                    let y = this.behaviour.yScaler * (baseOffset + this.shapeFunction.baseRadius + this.shapeFunction.rbf.rbf([currentAngle]) * 1);
                    this.gameElementList[i].updatePositition(
                        this.xPosition + (x * cosAngle - y * sinAngle),
                        this.yPosition + (x * sinAngle + y * cosAngle)
                    );
                }
            }

            this.lastTick = performance.now();
            if (this.lastAngle >= 2 * Math.PI) {
                this.lastAngle = 0;
            }
        }
    }
}

