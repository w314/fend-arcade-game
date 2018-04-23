/** Class representing an enemy */
class Enemy {
  /**
   * @description Create an enemy.
   */
  constructor() {
    //xStart is the starting x position to draw enemies in their lane
    //it's set to -75 to make them apper gradually
    this.xStart = -75;
    this.x = this.xStart;
    //determine a random lane for the enemy
    this.y = this.randomLane();
    //determine a random speed for the enemy
    this.speed = this.randomSpeed();
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
    //if enemy has reached the end of it's lane
    if(this.x > game.canvasWidth) {
      //give x the starting value to send it back to the beginning of the lane
      this.x = this.xStart;
      //select a new random lane for the enemy to reappear in
      //just to make the game less predictable
      this.y = this.randomLane();
    } else {
      //otherwise just adjust x coordinate according to it's speed
      this.x += this.speed * dt;
    }
  }

  reset() {
    this.x = this.xStart;
    this.y = this.randomLane();
    this.speed = this.randomSpeed();
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

  /**
   * @description Checks for end of game
   */
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
          this.y = this.y > this.step * 4 ? this.y : this.y + this.step;
          break;
        case 'up':
          // this.y = this.y <= this.yPlayerWins ? this.y : this.y - this.step;
          this.y -= this.step;
          if(this.y <= this.yPlayerWins) {
            game.win();
          }

          break;
        case 'right':
          this.x = this.x > this.sideStep * 3 ? this.x : this.x + this.sideStep;
          break;
        case 'left' :
          this.x = this.x < this.sideStep ? this.x : this.x - this.sideStep;
      }
    }
  }
}


class Game {
  constructor(enemy = 4) {
    this.enemyNumber = enemy;
    // this.pausedEnemySpeeds = [];
    // this.initEnemySpeeds();
    // this.paused = false;
    this.gameOn = true;
    //set canvas variables
    this.canvasWidth = 505;
    this.blockHeigth = 83;
    //add click listener to end game modal new game button
    this.gameModalSetup();
  }

  gameModalSetup() {
    const gameModal = document.getElementsByClassName('game-modal')[0];
    const gameModalNewGame = document.getElementsByClassName('new-game')[0];
    //add event listener to game modal's new game button
    gameModalNewGame.addEventListener('click',
       () => {
         gameModal.classList.add('hidden');
         this.reset();
       }
     )

  }

  pause() {
    allEnemies.forEach(
      enemy => enemy.speed = 0
    )
    this.gameOn = false;
  }

  reset() {
    player.reset();
    allEnemies.forEach(
      enemy => enemy.reset()
    );
    this.gameOn = true;
  }

  showGameModal(type) {
    const gameModal = document.getElementsByClassName('game-modal')[0];
    const gameModalNewGame = document.getElementsByClassName('new-game')[0];
    const message = type === 'collision' ? 'Game Over' : 'Congratulation! You\'ve won!!';
    const messageElement = document.getElementsByClassName('message')[0];
    messageElement.innerText = message;
    gameModal.classList.remove('hidden');
    gameModal.classList.add(type);
    gameModalNewGame.focus();
  }

  collision() {
    this.pause();
    this.showGameModal('collision');
  }

  win() {
    this.pause();
    this.showGameModal('win');
  }
}


//intantiate game
const game = new Game(1);

//set enemy variables
const allEnemies = [];
// //instantiate enemies
// for(let i=0; i<4; i++) {
//   const enemy = new Enemy();
//   allEnemies.push(enemy);
// }

// TESTING TESTING TESTING
const enemy = new Enemy();
enemy.speed = 400;
allEnemies.push(enemy);

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
