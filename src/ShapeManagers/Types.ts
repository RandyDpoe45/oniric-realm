export class ParticleOptions {
    constructor(
        public particleList: string[],
        public particleSpeed: number[],
        public particleScale: number[]
    ) {
    }
}

export class SpriteOptions {
    constructor(
        public spriteList: string[],
        public spriteScale: number[]
    ) {
    }
}

export class PhysicsOptions{
    constructor(
        public isSolid: boolean,
        public isStatic: boolean,
        public collideWorldBounds: boolean
    ){
    }
}