/////////////////////
// Global variables
/////////////////////

// Score -- not used in thie version
var score = 0;

// Flags to identify which message to show
var initialMessage = true;
var succeeded = false;
var collision = false;
var resetGame = false;

// Enemies our player must avoid
var Enemy = function(row) {
	// Variables applied to each of our instances go here,
	// we've provided one for you to get started
	// The image/sprite for our enemies, this uses
	// a helper we've provided to easily load images
	this.sprite = 'images/enemy-bug.png';
	this.row = row;

	// Use the random number to decide the y position
	this.x = Math.floor(Math.random() * CONFIG.num_cols) * CONFIG.cell_x;
	this.y = this.row * CONFIG.cell_y + CONFIG.init_y_adj_enemy;

	// Use a random number to decide the speed
	this.speed = Math.floor(Math.random() * (CONFIG.max_speed - CONFIG.min_speed) + CONFIG.min_speed);

};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
	// You should multiply any movement by the dt parameter
	// which will ensure the game runs at the same speed for
	// all computers.
	// Increase the CONFIG.cell_x position using a random number
	this.x = this.x + this.speed * dt;

	// If it reached to the right edge, go back to the left edge
	if (this.x > CONFIG.num_cols * CONFIG.cell_x) {
		this.x = -1 * CONFIG.cell_x;
	}

	// Check if player is in the center of the same cell as the enemy
	if (
		player
		&& (this.x + CONFIG.cell_x * 0.25) <= player.x && player.x <= (this.x + CONFIG.cell_x * 0.75)
		&& (this.y + CONFIG.cell_y * 0.25) <= player.y && player.y <= (this.y + CONFIG.cell_y * 0.75)
	){
		// If it is, set the collision flag to true
		collision = true;
	}

};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.reset = function() {

	// Recalculate the position
	this.x = Math.floor(Math.random() * CONFIG.num_cols) * CONFIG.cell_x;
	this.y = this.row * CONFIG.cell_y + CONFIG.init_y_adj_enemy;

	// Use a random number to decide the speed
	this.speed = Math.floor(Math.random() * CONFIG.max_speed + CONFIG.min_speed);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(sprite) {

	// Set the sprite
	if (!sprite) {
		// Use boy as the default sprite
		this.sprite = CONFIG.player_sprites.boy;
	} else {
		this.sprite = sprite;
	}

	// Set the start position
	this.INIT_X = 2 * CONFIG.cell_x;
	this.INIT_Y = 5 * CONFIG.cell_y;

	this.x = this.INIT_X;
	this.y = this.INIT_Y;
};

Player.prototype.update = function(dt) {

	// If the player gets to the water, set the succeeded flag to true
	if (this.y <= 0){
		succeeded = true;
	}
};

Player.prototype.handleInput = function(dir) {

	// Move the Player based on the keyboard input
	// as long as the Player is within the grid
	if (dir === "left" && this.x > 0) {
		this.x = this.x - CONFIG.cell_x;
	} else if (dir == "right" && this.x < CONFIG.cell_x * (CONFIG.num_cols - 1)) {
		this.x = this.x + CONFIG.cell_x;
	} else if (dir == "up" && this.y > 0) {
		this.y = this.y - CONFIG.cell_y;
	} else if (dir == "down" && this.y < CONFIG.cell_y * CONFIG.num_rows) {
		this.y = this.y + CONFIG.cell_y;
	}
}

Player.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.reset = function() {
	// Reset the position
	this.x = this.INIT_X;
	this.y = this.INIT_Y;
}

// Instantiate the Enemies
var allEnemies = [];

for (var i = 0; i < CONFIG.num_stones; i++) {
	for (var j = 0; j < Math.floor(Math.random() * CONFIG.max_enemies + 1); j++){
		allEnemies.push(new Enemy(i));
	}
}

// Instantiate the Player
var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
	var allowedKeys = {
		32: 'space',
		37: 'left',
		38: 'up',
		39: 'right',
		40: 'down'
	};

	// When the space bar is pressed, (re)start the game
	if (allowedKeys[e.keyCode] === 'space') {
		initialMessage = false;
		if (succeeded || collision){
			resetGame = true;
		}
	}

	// Move the player only when the message is not shown
	if (!initialMessage && !succeeded && !collision) {
		player.handleInput(allowedKeys[e.keyCode]);
	}
});
