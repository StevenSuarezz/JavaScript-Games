class SceneMain extends Phaser.Scene {
    constructor(){
        super("SceneMain");
    }
    preload(){
        this.load.image("road", "assets/road.jpg");
        this.load.image("cars", "assets/cars.png");
    }
    create(){
        var road = new Road({scene: this});
        road.x = game.config.width/2;
    }
    update(){
        
    }
}