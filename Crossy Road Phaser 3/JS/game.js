// Creates a new phaser scene
let gameScene = new Phaser.Scene("Game");

// Initiate scene parameters
gameScene.init = function(){
    this.playerSpeed = 3;

    this.enemyMinSpeed = 2;
    this.enemyMaxSpeed = 4.5;
    this.enemyMinY = 80;
    this.enemyMaxY = 280;

    this.isTerminating = false;
}

// Loads the assets
gameScene.preload = function(){
    this.load.image("background", "assets/background.png");
    this.load.image("player", "assets/player.png");
    this.load.image("enemy", "assets/dragon.png");
    this.load.image("goal", "assets/treasure.png");
};

// Called once after the preload ends
gameScene.create = function(){
    // Create the sprites
    let bg = this.add.sprite(0, 0, "background");
    // Changes the position of the sprite to the middle of the screen
    bg.setPosition(config.width/2, config.height/2);

    this.player = this.add.sprite(50, 180, "player");
    this.player.setScale(0.5); 

    this.goal = this.add.sprite(config.width-80, config.height/2, "goal");
    this.goal.setScale(0.6);

    this.enemies = this.add.group({
        key: "enemy",
        repeat: 5,
        setXY: {
            x: 90,
            y: 100,
            stepX: 85,
            stepY: 20
        }
    });

    Phaser.Actions.ScaleXY(this.enemies.getChildren(), -0.5,-0.5);

    Phaser.Actions.Call(this.enemies.getChildren(), function(enemy){
        enemy.flipX = true;

        let dir = Math.random() < 0.5 ? 1 : -1;
        let speed = this.enemyMinSpeed + Math.random() * (this.enemyMaxSpeed - this.enemyMinSpeed);
        enemy.speed = dir * speed;

    }, this);



};

// Update function called 60 times a second
gameScene.update = function(){

    if(this.isTerminating){
        return;
    }

    // Check for active input
    if(this.input.activePointer.isDown){
        // Player walks forward
        this.player.x += this.playerSpeed;
    }

    let playerRect = this.player.getBounds();
    let treasureRect = this.goal.getBounds();

    if(Phaser.Geom.Intersects.RectangleToRectangle(playerRect, treasureRect)){
        this.gameOver();
        return;
    }



    let enemies = this.enemies.getChildren();
    let numEnemies = enemies.length;

    for(let i = 0; i < numEnemies; i++){
        // Enemy movement
        enemies[i].y += enemies[i].speed;
        if(enemies[i].speed < 0 && enemies[i].y <= this.enemyMinY){
            enemies[i].speed *= -1;
        }

        if(enemies[i].speed > 0 && enemies[i].y >= this.enemyMaxY){
            enemies[i].speed *= -1;
        }

       
        let enemyRect = enemies[i].getBounds();
    
        if(Phaser.Geom.Intersects.RectangleToRectangle(playerRect, enemyRect)){
            this.gameOver();
            return;
        }
    }


};

gameScene.gameOver = function(){
    this.isTerminating = true;
    this.cameras.main.shake(500);
    this.cameras.main.on("camerashakecomplete", function(camera,effect){
        this.cameras.main.fade(500);
    }, this);

    this.cameras.main.on("camerafadeoutcomplete", function(camera, effect){
        this.scene.restart();
    }, this);
};

// Sets the configuration of the game
let config = {
    type: Phaser.AUTO, // Phaser will use WebGL if possible, if not it will use canvas
    width: 640,
    height: 360,
    scene: [gameScene]
};

// Creates a new game passing the configuration
let game = new Phaser.Game(config);

