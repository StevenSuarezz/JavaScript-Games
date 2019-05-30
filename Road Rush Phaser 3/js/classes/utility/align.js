class Align {
    
    static scaleToGameW(obj, per){
        obj.displayWidth = game.config.width * per;
        obj.scaleY = obj.scaleX;
    }

    static center(obj) {
        obj.x=game.config.width/2;
        obj.y
    }

}