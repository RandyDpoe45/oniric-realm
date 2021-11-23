import RBF from 'rbf';
import { GameElement } from '../ShapeManagers/GameElement';
import { AssetData, BaseScene } from './BaseScene';

export default class GameScene extends BaseScene {


    constructor() {
        let playerConf = {
            walkSpeed: 300,
            jumpSpeed: -600
        }
        super(playerConf, "BaseWorld");
    }

    preload() {
        this.load.spritesheet("hero", "images/wspritesheet.png", { frameWidth: 60, frameHeight: 90 });
        let assetList = [
            new AssetData("coin", "https://i.imgur.com/wbKxhcd.png", false),
            new AssetData("evil-shroom", "https://i.imgur.com/KPO3fR9.png", false),
            new AssetData("brick", "https://i.imgur.com/pogC9x5.png", false),
            new AssetData("block", "https://i.imgur.com/M6rwarW.png", false),
            new AssetData("mario", "https://i.imgur.com/Wb1qfhK.png", false),
            new AssetData("mushroom", "https://i.imgur.com/0wMd92p.png", false),
            new AssetData("surprise", "https://i.imgur.com/gesQ1KP.png", false),
            new AssetData("unboxed", "https://i.imgur.com/bdrLpi6.png", false),
            new AssetData("pipe-top-left", "https://i.imgur.com/ReTPiWY.png", false),
            new AssetData("pipe-top-right", "https://i.imgur.com/hj2GK4n.png", false),
            new AssetData("pipe-bottom-left", "https://i.imgur.com/c1cYSbt.png", false),
            new AssetData("pipe-bottom-right", "https://i.imgur.com/nqQ79eI.png", false),
            new AssetData('diamond', 'http://labs.phaser.io/assets/sprites/blue_ball.png', false),
            new AssetData('cocktail', 'http://labs.phaser.io/assets/sprites/cocktail.png', false),
            new AssetData("blue-block", "https://i.imgur.com/fVscIbn.png", false),
            new AssetData("blue-brick", "https://i.imgur.com/3e5YRQd.png", false),
            new AssetData("blue-steel", "https://i.imgur.com/gqVoI2b.png", false),
            new AssetData("blue-evil-shroom", "https://i.imgur.com/SvV4ueD.png", false),
            new AssetData("blue-surprise", "https://i.imgur.com/RMqCc1G.png", false),
            //Particles
            new AssetData('gold', 'images/gold.png', true),
            new AssetData('red', 'images/red.png', true),
            new AssetData('green', 'images/green.png', true),
            new AssetData('green-orb', 'images/green-orb.png', true),
            new AssetData('blue', 'images/blue.png', true),
            // new AssetData('blue-flare', 'images/blue-flare.png', true),
            new AssetData('flash', "images/muzzleflash1.png", true),
            new AssetData('flash2', "images/muzzleflash2.png", true),
            new AssetData('flash3', "images/muzzleflash3.png", true),
            new AssetData('flash4', "images/muzzleflash4.png", true),
            new AssetData('flash5', "images/muzzleflash6.png", true),
            new AssetData('fire', "images/fire3.png", true),
            new AssetData('smoke', "images/white-smoke.png", true),
            new AssetData('dark-smoke', 'images/lit-smoke.png', true),
            new AssetData('snowflake', 'images/snowflake.png', true),
            new AssetData('sparkle', 'images/sparkle.png', true),
            new AssetData('green-leaf', 'images/leaf1.png', true),
            new AssetData('yellow-leaf', 'images/leaf2.png', true),
            new AssetData('bubble', 'images/bubble.png', true),
            new AssetData('plasma', "images/plasmaball1.png", true),
            new AssetData('butterfly', "images/butterfly.png", true)
        ];
        this.loadAssets(assetList);

        this.sceneWidth = this.game.config.width;
        this.sceneHeight = this.game.config.height;
    }

    create() {
        this.buildPlayer();
        this.buildController();
        this.buildBoundaries('blue-block')
        this.buildFactories(5, 5);
        this.buildShapeManagers(15, 10);
    }

    update() {
        this.cameras.main.x = -this.player.x + innerWidth / 3;
        this.cameras.main.y = -this.player.y + innerHeight / 2;
        for (let x of this.shapeManagerList) {
            x.update();
        }
        if (this.cursor.left.isDown) {
            if (!this.player.body.touching.down) {
                this.player.anims.play('fall', true);
                this.player.setVelocityX(-this.playerConf.walkSpeed);
                this.player.flipX = true;
            } else {
                this.player.setVelocityX(-this.playerConf.walkSpeed);
                this.player.anims.play('movement', true)
                this.player.flipX = true;
            }
        }
        else if (this.cursor.right.isDown) {
            if (!this.player.body.touching.down) {
                this.player.anims.play('fall', true);
                this.player.setVelocityX(this.playerConf.walkSpeed);
                this.player.flipX = false;
            } else {
                this.player.setVelocityX(this.playerConf.walkSpeed);
                this.player.anims.play('movement', true);
                this.player.flipX = false;
            }
        } else if (this.cursor.up.isDown) {
            this.player.setVelocityY(this.playerConf.jumpSpeed);
            this.player.anims.play('jump', true);
        } else {
            if (!this.player.body.touching.down) {
                this.player.anims.play('fall', true);
            } else {
                this.player.setVelocityX(0);
                this.player.anims.play('center', true)
            }
        }
    }



}
