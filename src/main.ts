import Phaser from 'phaser'
import ExampleScene from './scenes/ExampleScene';

import GameScene from './scenes/GameScene';

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.WEBGL,
	width: innerWidth * 3,
	height: innerHeight * 3,
	backgroundColor: "#000000",
	physics: {
		default: 'arcade',
		arcade: {

		}
	},
	scene: [GameScene]
}

export default new Phaser.Game(config)

