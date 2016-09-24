/* ideas: make LEVEL class where level equals the number of enemies
              after reaching certain score, you reach the next level === MORE ENEMIES
          POWERUPS --- invincibility === no collision detection
*/

var gameConfig = {
  width: 1500,
  height: 800,
  numEnemies: 50,
  interval: 2000,
  velocity: 1000,
  _score: 0,
  _collisions: 0,
  _highscore: 0
};


// helper functions --------------------------------
var randomX = function() {
  return (gameConfig.width - 80) * Math.random();
};

var randomY = function() {
  return (gameConfig.height - 80) * Math.random();
};


// constructor
var Coordinates = function() {
  this.x = randomX();
  this.y = randomY();
};

var randomCoords = function(num) {
  var results = [];
  for (var i = 0; i < num; i++) {
    results.push(new Coordinates());
  }
  return results;
};


// random enemy path generator
var enemyRoute = function(enemy) {
  enemy.data(randomCoords(gameConfig.numEnemies)) // new random location for enemy to go to
    .transition()
    .duration(gameConfig.velocity)
    .attr('cx', function(data) {
      return data.x;
    })
    .attr('cy', function(data) {
      return data.y;
    });
};


// d3 settings configuration ------------------------
var svg = d3.select('body').append('svg')
  .attr('width', gameConfig.width)
  .attr('height', gameConfig.height)
  .classed('svg', true);

// creates an array of Coordinates objects containing x & y property
var dataset = randomCoords(gameConfig.numEnemies);

var circles = svg.selectAll('circle')
  .data(dataset) // new spawn point created
  .enter()
  .append('circle');
  
circles
  .attr('cx', function(data) {
    return data.x;
  })
  .attr('cy', function(data) {
    return data.y;
  })
  .attr('r', 10)
  .classed('enemies', true);

var stopScore = function() {
  clearInterval(updateScore);
};

svg.on({
  'mouseenter': function(d) {
    d3.select(this).style('cursor', 'pointer');
    gameConfig._score = 0;
    gameConfig._highscore = 0;
  },
  'mouseleave': function(d) {
    d3.select(this).style('cursor', 'default');
    gameConfig._score = 0;
    gameConfig._collisions++;
  }
});

circles.on({
  'mouseover': function(e) {
    console.log('ENEMY TOUCHED ME');
    gameConfig._score = 0;
    gameConfig._collisions++;
  }
});

setInterval(enemyRoute.bind(this, circles), gameConfig.interval);
setInterval(function() {
  gameConfig._score++;
  d3.select('.current').text('Current score: ' + gameConfig._score);
}, 500);

var temp = gameConfig._collisions;
setInterval(function collisionChecker() {
  if (gameConfig._score > gameConfig._highscore) {
    gameConfig._highscore = gameConfig._score;
    d3.select('.highscore').text('High score: ' + gameConfig._highscore);
  }
  if (temp < gameConfig._collisions) {
    gameConfig._score = 0;
    d3.select('.collisions').text('Collisions: ' + gameConfig._collisions);
    temp = gameConfig._collisions;
  }
}, 10);
