import Phaser from 'phaser';
import { ShapeFunction } from '~/constants/ShapeRBFs';
import { LinearBehaviour } from '~/constants/TrajectoryRBFs';
import { BaseScene } from '../scenes/BaseScene';
import { GameElement } from './GameElement';
import { IShapeManager } from './IShapeManager';
import { ParticleOptions, PhysicsOptions, SpriteOptions } from './Types';
export class ShapeManager implements IShapeManager{

    shapeFunction: ShapeFunction;
    behaviour: undefined | LinearBehaviour;
    gameElementList: GameElement[] = [];
    nObjects: number;
    cosAngle: number;
    sinAngle: number;
    xPosition: number;
    yPosition: number;
    xBase: number;
    yBase: number;
    parent: BaseScene;
    lastTick: number = -1;
    lastXParam: number;
    lastYParam: number;
    moduleX: number = 1;
    moduleY: number = -1;
    partsModule: number = 1;
    platforms:undefined | Phaser.Physics.Arcade.Group | Phaser.Physics.Arcade.StaticGroup;

    constructor(
        parent: BaseScene,
        shapeFunction: ShapeFunction,
        behaviour: undefined | LinearBehaviour,
        nObjects: number,
        spriteOptions: SpriteOptions,
        xPosition: number,
        yPosition: number,
        particleOptions: ParticleOptions | undefined,
        physics: undefined| PhysicsOptions
    ) {
        this.shapeFunction = shapeFunction;
        this.behaviour = behaviour;
        this.nObjects = nObjects;
        this.cosAngle = Math.cos(this.shapeFunction.angle);
        this.sinAngle = Math.sin(this.shapeFunction.angle);
        this.parent = parent;
        this.xPosition = xPosition;
        this.yPosition = yPosition;
        this.xBase = this.xPosition;
        this.yBase = this.yPosition;
        this.lastXParam = 0;
        this.lastYParam = 0;
        if(physics?.isSolid){
            if(physics.isStatic){
                this.platforms = parent.physics.add.staticGroup();
            }else{
                this.platforms = parent.physics.add.group({collideWorldBounds: physics.collideWorldBounds});
            }
        }
        let deltaX = (this.shapeFunction.rbf.domainE - this.shapeFunction.rbf.domainB) / this.nObjects;
        for (let i = 0, currentX = this.shapeFunction.rbf.domainB; i < this.nObjects; i++, currentX += deltaX) {
            let x = this.shapeFunction.xScaler * currentX;
            let y = this.shapeFunction.yScaler * -1*this.shapeFunction.rbf.rbf([currentX]);
            let e = new GameElement(
                this.parent,
                spriteOptions.spriteScale[i % spriteOptions.spriteScale.length],
                this.xPosition + (x * this.cosAngle - y * this.sinAngle),
                this.yPosition + (x * this.sinAngle + y * this.cosAngle),
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
            if(physics?.isSolid && this.platforms){
                this.parent.physics.add.existing(e.gameObject,physics.isStatic);
                e.gameObject.setImmovable(physics.isStatic)
                this.platforms.add(e.gameObject);
                this.parent.physics.add.collider(e.gameObject, this.parent.player);
            }
        }
    }

    update() {
        if (this.behaviour) {
            let now = performance.now();
            if (this.lastTick === -1) {
                this.lastTick = now;
            }

            if (this.behaviour.shapeXTF) {
                let deltaTSX = (now - this.lastTick) / this.behaviour.xSpeed;
                if (this.lastXParam <= this.behaviour.shapeXTF.domainB) {
                    this.moduleX = 1;
                } else if (this.lastXParam >= this.behaviour.shapeXTF.domainE) {
                    this.moduleX = -1;
                }
                this.lastXParam += deltaTSX * this.moduleX;
                this.xPosition = this.xBase + this.behaviour.xScaler * this.behaviour.shapeXTF.rbf([this.lastXParam]);                
            }

            if(this.behaviour.shapeYTF){
                let deltaTSY = (now - this.lastTick) / this.behaviour.ySpeed;
                if (this.lastYParam <= this.behaviour.shapeYTF.domainB) {
                    this.moduleY = 1;
                } else if (this.lastYParam >= this.behaviour.shapeYTF.domainE) {
                    this.moduleY = -1;
                }
                this.lastYParam += deltaTSY * this.moduleY;
                this.yPosition = this.yBase + this.behaviour.yScaler * this.behaviour.shapeYTF.rbf([this.lastYParam]);
            }

            if(!this.behaviour.shapeXTF && !this.behaviour.shapeYTF){
                let deltaTSX = (now - this.lastTick) / this.behaviour.xSpeed;
                let deltaTSY = (now - this.lastTick) / this.behaviour.ySpeed;
                this.xPosition += this.behaviour.xScaler * deltaTSX;
                this.yPosition += this.behaviour.yScaler * deltaTSY;
            }

            let deltaX = (this.shapeFunction.rbf.domainE - this.shapeFunction.rbf.domainB) / this.nObjects;
            for (let i = 0, currentX = this.shapeFunction.rbf.domainB; i < this.nObjects; i++, currentX += deltaX) {
                let x = this.shapeFunction.xScaler * currentX;
                let y = this.shapeFunction.yScaler * -1*this.shapeFunction.rbf.rbf([currentX]);
                this.gameElementList[i].updatePositition(
                    this.xPosition + x,
                    this.yPosition + y
                );
            }
            this.lastTick = performance.now();
        }
    }
}