var game = new Phaser.Game(640, 360, Phaser.AUTO);

var GameState = {
    preload: function () {
        this.load.image('background', 'images/background.png');
        this.load.image('arrow', 'images/arrow.png');

        this.load.spritesheet('chicken', 'images/chicken_spritesheet.png', 131, 200, 3);
        this.load.spritesheet('horse', 'images/horse_spritesheet.png', 212, 200, 3);
        this.load.spritesheet('pig', 'images/pig_spritesheet.png', 297, 200, 3);
        this.load.spritesheet('sheep', 'images/sheep_spritesheet.png', 244, 200, 3);

        this.load.audio('chicken_sound', ['sounds/chicken.ogg', 'sounds/chicken.mp3']);
        this.load.audio('horse_sound', ['sounds/horse.ogg', 'sounds/horse.mp3']);
        this.load.audio('pig_sound', ['sounds/pig.ogg', 'sounds/pig.mp3']);
        this.load.audio('sheep_sound', ['sounds/sheep.ogg', 'sounds/sheep.mp3']);
    },
    create: function () {

        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        this.background = this.game.add.sprite(0,0, 'background');

        var animalData = [
            {key: 'chicken', text: 'CHICKEN', audio: 'chicken_sound'},
            {key: 'horse', text: 'HORSE', audio: 'horse_sound'},
            {key: 'pig', text: 'PIG', audio: 'pig_sound'},
            {key: 'sheep', text: 'SHEEP', audio: 'sheep_sound'}
        ];

        this.animals = this.game.add.group();

        animalData.forEach(function (element) {
            var animal = this.animals.create(-1000, this.game.world.centerY, element.key, 0);
            animal.anchor.setTo(0.5);
            animal.customParams = {text: element.text, sound: this.game.add.audio(element.audio)};
            animal.animations.add('animate', [0, 1, 2, 1, 0, 1], 3, false);
            animal.inputEnabled = true;
            animal.input.pixelPerfectClick = true;
            animal.events.onInputDown.add(this.animateAnimal, this);
        }.bind(this));

        this.currentAnimal = this.animals.next();
        this.currentAnimal.position.set(this.game.world.centerX, this.game.world.centerY);

        this.showText(this.currentAnimal);

        this.rightArrow = this.game.add.sprite(580, this.game.world.centerY, 'arrow');
        this.rightArrow.anchor.setTo(0.5);
        this.rightArrow.customParams = {direction: 1};

        this.leftArrow = this.game.add.sprite(60, this.game.world.centerY, 'arrow');
        this.leftArrow.anchor.setTo(0.5);
        this.leftArrow.scale.setTo(-1, 1);
        this.leftArrow.customParams = {direction: -1};

        this.leftArrow.inputEnabled = true;
        this.leftArrow.input.pixelPerfectClick = true;
        this.leftArrow.events.onInputDown.add(this.switchAnimal, this);

        this.rightArrow.inputEnabled = true;
        this.rightArrow.input.pixelPerfectClick = true;
        this.rightArrow.events.onInputDown.add(this.switchAnimal, this);
    },
    update: function () {
        // this.animals.rotation += 0.01;
    },
    switchAnimal: function (sprite, event) {
        if(this.isMoving) {
            return false;
        }

        this.isMoving = true;
        this.animalText.visible = false;
        var newAnimal, endX;

        if(sprite.customParams.direction > 0) {
            newAnimal = this.animals.next();
            newAnimal.x = -newAnimal.width / 2;
            endX = this.game.world.width + this.currentAnimal.width / 2;
        } else {
            newAnimal = this.animals.previous();
            newAnimal.x = this.game.world.width + newAnimal.width / 2;
            endX = -this.currentAnimal.width / 2;
        }

        var newAnimalMovement = game.add.tween(newAnimal);
        newAnimalMovement.to({x: this.game.world.centerX}, 1000);
        newAnimalMovement.onComplete.add(function () {
            this.isMoving = false;
            this.showText(newAnimal);
        }, this);
        newAnimalMovement.start();

        var currentAnimalMovement = game.add.tween(this.currentAnimal);
        currentAnimalMovement.to({x: endX}, 1000);
        currentAnimalMovement.onComplete.add(function () {
            this.isMoving = false;
            this.showText(newAnimal);
        }, this);
        currentAnimalMovement.start();

        this.currentAnimal = newAnimal;
    },
    animateAnimal: function (sprite, event) {
        sprite.play('animate');
        sprite.customParams.sound.play();
    },
    showText: function (animal) {
        if(!this.animalText) {
            var style = {
                font: 'bold 30pt Arial',
                fill: "red",
                align: "center"
            };
            this.animalText = this.game.add.text(this.game.width / 2, this.game.height * 0.85, '', style);
            this.animalText.anchor.setTo(0.5);
        }

        this.animalText.setText(animal.customParams.text);
        this.animalText.visible = true;
    }
};

game.state.add('GameState', GameState);
game.state.start('GameState');