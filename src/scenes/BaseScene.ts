import { IShapeManager } from "../ShapeManagers/IShapeManager";
import { CircularShapeFactory, NormalShapeFactory } from "../ShapeManagers/ShapeManagerFactory";
import _ from 'underscore';

export class BaseScene extends Phaser.Scene {

    public player;
    public sceneWidth;
    public sceneHeight;
    public playerConf;
    public cursor;
    public platforms: undefined | Phaser.Physics.Arcade.StaticGroup;
    public shapeManagerList: IShapeManager[] = [];
    public smFactoryList: NormalShapeFactory[] = [];
    public csmFactoryList: CircularShapeFactory[] = [];
    public partileList: string[] = [];
    public spriteList: string[] = [];

    constructor(playerConf: any, sceneName: string) {
        super(sceneName);
        this.playerConf = playerConf;
    }

    buildPlayer() {
        this.player = this.physics.add.sprite(40, 90, "hero", 0);
        this.player.setBounce(0.2)
        this.player.setCollideWorldBounds(true);
        this.player.setGravityY(1000);
        this.anims.create({
            key: 'movement',
            frames: this.anims.generateFrameNumbers('hero', {
                start: 1, end: 6
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "jump",
            frames: this.anims.generateFrameNames('hero', {
                start: 7, end: 7
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "fall",
            frames: this.anims.generateFrameNames('hero', {
                start: 11, end: 11
            }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'center',
            frames: this.anims.generateFrameNumbers('hero', {
                start: 0, end: 0
            }),
            frameRate: 10,
            repeat: -1
        });
    }

    buildController() {
        this.cursor = this.input.keyboard.createCursorKeys();
    }

    buildBoundaries(assetName: string) {
        this.physics.world.setBounds(0, 0, this.sceneWidth, this.sceneHeight);

        this.platforms = this.physics.add.staticGroup();
        let x = [
            [20, 0, 2 * this.sceneWidth, 20],
            [0, 20, 20, 2 * this.sceneHeight],
            [0, this.sceneHeight, 2 * this.sceneWidth, 20],
            [this.sceneWidth, 0, 20, 2 * this.sceneHeight]
        ]
        for (let i = 0; i < 4; i++) {
            let ground = this.add.tileSprite(x[i][0], x[i][1], x[i][2], x[i][3], assetName);
            this.physics.add.existing(ground, true);
            this.platforms.add(ground);
            this.physics.add.collider(ground, this.player);
        }
    }

    loadAssets(data: AssetData[]) {
        for (let x of data) {
            this.load.image(x.name, x.url);
            if (x.isParticle) {
                this.partileList.push(x.name);
            } else {
                this.spriteList.push(x.name);
            }
        }
    }

    buildFactories(nRegular, nCircular){
        for(let i = 0 ; i < nRegular ; i++){
            let width = (Math.random() + 0.2) * this.sceneWidth / 3;
            let height = (Math.random() + 0.2) * this.sceneHeight / 3;
            let widthOffset = (Math.random() + Math.random()) * this.sceneWidth / 3;
            let heightOffset = (Math.random() + Math.random()) * this.sceneHeight / 3;
            let nObjects = Math.floor((Math.random() + 0.2) * 50);
            let assets = _.sample(this.spriteList, 6);
            let particles = Math.random() > 0.7 ? _.sample(this.partileList, 5) : undefined;
            let x = new NormalShapeFactory(
                width,
                height,
                this,
                nObjects,
                assets,
                particles,
                widthOffset,
                heightOffset
            )
            this.smFactoryList.push(x);
        }
        for(let i = 0 ; i < nCircular ; i++){
            let width = (Math.random() + 0.2) * this.sceneWidth / 3;
            let height = (Math.random() + 0.2) * this.sceneHeight / 3;
            let widthOffset = (Math.random() + Math.random()) * this.sceneWidth / 2;
            let heightOffset = (Math.random() + Math.random()) * this.sceneHeight / 2;
            let nObjects = Math.floor((Math.random() + 0.2) * 20);
            let assets = _.sample(this.spriteList, 6);
            let particles = Math.random() > 0.10 ? _.sample(this.partileList, 5) : undefined;
            let x = new CircularShapeFactory(
                width,
                height,
                this,
                nObjects,
                assets,
                particles,
                widthOffset,
                heightOffset
            )
            this.csmFactoryList.push(x);
        }
    }

    buildShapeManagers(nRegularShapes, nCircularShapes) {
        for (let i = 0; i < nRegularShapes; i++) {
            let smf = this.smFactoryList[i % this.smFactoryList.length].buildRandomShapeManager();
            this.shapeManagerList.push(smf);
        }
        for (let i = 0; i < nCircularShapes; i++) {
            let smf = this.csmFactoryList[i % this.csmFactoryList.length].buildRandomShapeManager();
            this.shapeManagerList.push(smf);
        }
        
    }
}

export class AssetData {
    constructor(
        public name: string,
        public url: string,
        public isParticle: boolean
    ) {

    }
}