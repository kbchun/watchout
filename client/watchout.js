var gameConfig = {
  width: 600,
  height: 500,
  numEnemies: 10,
  interval: 1000,
  velocity: 1500
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
  .attr('height', gameConfig.height); 

// creates an array of Coordinates objects containing x & y property
var dataset = randomCoords(gameConfig.numEnemies);

var enemies = svg.selectAll('circle')
  .data(dataset) // new spawn point created
  .enter()
  .append('circle');
  
enemies
  .attr('cx', function(data) {
    return data.x;
  })
  .attr('cy', function(data) {
    return data.y;
  })
  .attr('r', 10);


setInterval(enemyRoute.bind(this, enemies), gameConfig.interval);