import Phaser from 'phaser';

export class GameElement {

    positionX;
    positionY;
    gameObject;
    direction;
    parent;

    constructor(
        parent: Phaser.Scene,
        scale: number,
        positionX: number,
        positionY: number,
        sprite: string,
        withPhysics? : boolean
    ) {
        this.positionX = positionX;
        this.positionY = positionY;
        // if(withPhysics){
            this.gameObject = parent.physics.add.image(
                this.positionX,
                this.positionY,
                sprite
            );
        // }else{
        //     this.gameObject = parent.add.image(
        //         this.positionX,
        //         this.positionY,
        //         sprite
        //     );
        // }
        
        this.gameObject.setScale(scale);
    }

    updatePositition(xPos, yPos) {
        this.gameObject.setPosition(xPos,yPos);
    }


}