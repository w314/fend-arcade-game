/** Class representing an enemy */
class Enemy {
  /**
   * @description Create an enemy.
   */
  constructor() {
    //xStart is the starting x position to draw enemies in their lane
    //it's set to -75 to make them apper gradually
    this.xStart = -75;
    //set the speed and the x & y coordinates of the enemy
    this.reset()
    //set enemy image
    this.sprite = 'images/enemy-bug.png';
  }

  /**
   * @description Update the enemy's position.
   * @param {number} dt - time delta between ticks
   */
  update(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    //if game is not fozen move eneimes
    if(game.gameOn) {
      //if enemy has reached the end of it's lane
      if(this.x > game.canvasWidth) {
        //give x the starting value to send it back to the beginning of the lane
        this.x = this.xStart;
        //select a new random lane for the enemy to reappear in
        //just to make the game less predictable
        this.y = this.randomLane();
        // FOR TESTING PURPOSES ONLY
        if(testing) {
          this.y = lane;
        }
      } else {
        //otherwise just adjust x coordinate according to it's speed
        this.x += this.speed * dt;
      }
    }
  }

  /**
   * @description Set enemies parameters to start a new game
   */
  reset() {
    this.x = this.xStart;
    //determine a random lane for the enemy
    this.y = this.randomLane();
    //determine a random speed for the enemy
    this.speed = this.randomSpeed();
    // FOR TESTING PURPOSES ONLY
    if(testing) {
      this.y = lane;
      this.speed = speed;
    }
  }

  /**
   * @description Draws the enemy on the screen.
   */
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  /**
   * @description Determines random lane for the enemy.
   * @return {number} The y coordinate of the enemy.
   */
  randomLane() {
    const yCenter = 60;
    return Math.floor(Math.random() * 3) * 83 + yCenter;
  }

  /**
   * @description Determines random lane for the enemy.
   * @return {number} The speed of the enemy.
   */
  randomSpeed() {
    const min = 50;
    const max = 400;
    return Math.floor(Math.random() * (max-min)) + min;
  }
}


/** Class representing a player */
class Player {

  /**
   * @description Creates a player.
   */
  constructor() {
    //set the image for the player
    this.sprite = 'images/char-boy.png';
    //set step length on the x axis
    this.sideStep = game.canvasWidth / 5;
    //set step length on the y axis
    this.step = game.blockHeigth;
    //set starting x coordinate for player
    //place player in the middle block
    //two sideSteps to the right from the left edge of the canvas
    this.xStart = 2 * this.sideStep;
    //set starting y coordinate for player
    //set player in the first row, 5 steps down form top of the canvas
    //adjust its y position by 20px, so it appears not exactly at the bottom of the last raw
    //store the adjustment in yPlayerWins variable to use it to determine
    //if player has reached the water in later functions
    this.yPlayerWins = 20;
    this.yStart = 5 * this.step - this.yPlayerWins;
    //set player x & y coordinates to starting position
    this.reset();
  }

  /**
   * @description Sets player x & y coordinates to starting position
   */
  reset() {
    this.x = this.xStart;
    this.y = this.yStart;
  }

  // HAS NO FUNCTION, LEFT HERE AS THE ENGINE CALLS IT
  update() {
  }

  /**
   * @description Draws the player on the screen.
   */
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  /**
   * @description Sets new x & y coordinates of player after a step taken
   * @param {string}  key direction of player movement
   */
  handleInput(key) {
    //only react to keys if the game is on
    if(game.gameOn) {
      //in each case check if player has reached the end of the canvas
      //if it did, do not change the coordinates, leave player where it was
      //if there is room to move, move player to the direction requested
      switch(key) {
        case 'down':
          //if player has room to move down take a step down
          this.y = this.y > this.step * 4 ? this.y : this.y + this.step;
          break;
        case 'up':
          //take a setp up
          this.y -= this.step;
          //if player has reached the water call game's win funtion
          if(this.y <= this.yPlayerWins) {
            game.win();
          }
          break;
        case 'right':
          //if player has room to move, take a step to the right
          this.x = this.x > this.sideStep * 3 ? this.x : this.x + this.sideStep;
          break;
        case 'left' :
          //if player has room to move, take a step to the left
          this.x = this.x < this.sideStep ? this.x : this.x - this.sideStep;
      }
    }
  }
}


/** Class representing a game */
class Game {

  /**
   * @description Creates a game.
   * @param {number} enemy - number of enemies in the game, default set to 4
   */
  constructor(enemy = 4) {
    //set number of enemies in the game
    this.enemyNumber = enemy;
    //declare value to show if the game is active, currently under play
    //not over (due to either collision or win)
    //Player class uses it freeze player in handleInput function
    //Enemy class uses it to freeze enemies in update function
    this.gameOn = true;
    //set canvas variables
    //width of canvas, used by Player class to determine the length of steps on the x axis
    this.canvasWidth = 505;
    //height of blocks, used by Player class to determine the length of steps on the y axis
    this.blockHeigth = 83;
    //add click listener to end game modal & new game button
    this.gameModalSetup();
  }

  /**
   * @description Instantiates the eneimes
   * @return {array} array of all the enemy object in the game
   */
  initEnemies() {
    //declare array to hold enemy objects
    const allEnemies = [];
    //instantiate enemies
    for(let i=0; i<this.enemyNumber; i++) {
      const enemy = new Enemy();
      allEnemies.push(enemy);
    }
    return allEnemies;
  }

  /**
   * @description Sets up the game modal
   */
  gameModalSetup() {
    //declare variable for game modal
    const gameModal = document.getElementsByClassName('game-modal')[0];
    //declare variable for the new game button on the game modal
    const gameModalNewGame = document.getElementsByClassName('new-game')[0];
    //add event listener to game modal's new game button
    gameModalNewGame.addEventListener('click',
       () => {
         //hide game modal
         gameModal.classList.add('hidden');
         //remove classes showing type of game modal
         gameModal.classList.remove('collision');
         gameModal.classList.remove('win');
         //restart game
         this.reset();
       }
     )
  }

  /**
   * @description Resets game to starting position
   */
  reset() {
    //reset player to staring position
    player.reset();
    //reset enemies to starting position
    allEnemies.forEach(
      enemy => enemy.reset()
    );
    //set gameOn to true to unfreeze the game
    this.gameOn = true;
  }

  /**
   * @description Make game modal appear with correct messag and style
   * @param {String} type - determines if modal is needed for collision or win
   */
  showGameModal(type) {
    //variable for game modal
    const gameModal = document.getElementsByClassName('game-modal')[0];
    //variable for game modal's new game button
    const gameModalNewGame = document.getElementsByClassName('new-game')[0];
    //set message variable based on type
    const message = type === 'collision' ? 'Game Over!' : 'Congratulation! You\'ve won!!';
    //add message to game modal
    const messageElement = document.getElementsByClassName('message')[0];
    messageElement.innerText = message;
    //make game modal appear
    gameModal.classList.remove('hidden');
    //choose style for game modal
    gameModal.classList.add(type);
    //add focus to new game button
    gameModalNewGame.focus();
  }

  collision() {
    //freeze game
    this.gameOn = false;
    //show 'collsion type' game modal
    this.showGameModal('collision');
  }

  win() {
    //freeze game
    this.gameOn = false;
    //show 'win type' game modal
    this.showGameModal('win');
  }
}


//set number of enemies
let enemyNumber = 5;

//VARIBALES FOR TESTING ONLY
const testing = false;
const lane = 2 * 83 + 60;
const speed = 500;
if(testing) {
  enemyNumber = 1;
}

//intantiate game
const game = new Game(enemyNumber);

//set enemy variable
const allEnemies = game.initEnemies();

//instantiate player
const player = new Player();

// create event listener for key presses
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    //call palyer's handleInput method to handle the key pressed
    player.handleInput(allowedKeys[e.keyCode]);
});
