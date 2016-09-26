
///////////////////////////////////////////////////////////////////
// This file contains two solutions:
//
//   1. div-based solution
//   2. svg-based solution
//
// By default, solution 1 is active. To use solution 2, change the
// line of code near the end of this file.
///////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////
// Solution 1
///////////////////////////////////////////////////////////////////
var solutionOne = function() {

  ///////////////////////////////////////////////////////////////////
  // configuration variables

  var settings = {
    w: window.innerWidth,
    h: window.innerHeight,
    r: 15,
    n: 30,
    duration: 1500
  };

  var mouse = { x: settings.w / 2, y: settings.h / 2 };
  var score = 0;
  var highScore = 0;
  var collisionCount = 0;

  ///////////////////////////////////////////////////////////////////
  // helper functions

  var pixelize = function(number) { return number + 'px'; };

  var rand = function(n) { return Math.floor( Math.random() * n ); };
  var randX = function() { return pixelize( rand(settings.w - settings.r * 2) ); };
  var randY = function() { return pixelize( rand(settings.h - settings.r * 2) ); };

  var updateScore = function() {
    d3.select('.scoreboard .current span').text(score);
    d3.select('.scoreboard .highscore span').text(highScore);
    d3.select('.scoreboard .collisions span').text(collisionCount);
  };

  ///////////////////////////////////////////////////////////////////
  // Main game code

  // setup board
  var board = d3.select('.board').style({
    width: pixelize( settings.w ),
    height: pixelize( settings.h ),
  });

  // setup astroids
  var astroids = board.selectAll('.astroid')
    .data(d3.range(settings.n))
    .enter().append('div')
    .attr('class', 'astroid')
    .style({
      top: randY,
      left: randX,
      width: pixelize( settings.r * 2 ),
      height: pixelize( settings.r * 2 )
    });

  // setup player
  d3.select('.mouse').style({
    top: pixelize( mouse.y ),
    left: pixelize( mouse.x ),
    width: pixelize( settings.r * 3 ),
    height: pixelize( settings.r * 3 ),
    'border-radius': pixelize( settings.r * 2 )
  });

  // player mouse tracking
  board.on('mousemove', function() {
    var loc = d3.mouse(this);
    mouse = { x: loc[0], y: loc[1] };
    d3.select('.mouse').style({
      top: pixelize( mouse.y - settings.r ),
      left: pixelize( mouse.x - settings.r )
    });
  });

  // animation loop
  var move = function(element) {
    element.transition().duration(settings.duration).ease('cubic-in-out').style({
      top: randY,
      left: randX
    }).each('end', function() {
      move( d3.select(this) );
    });
  };
  move(astroids);

  // score ticker
  var scoreTicker = function() {
    score = score + 1;
    highScore = Math.max(score, highScore);
    updateScore();
  };
  setInterval(scoreTicker, 100);

  // collision detection
  var previousCollisionState = false;
  var detectCollisions = function() {

    var collision = false;

    astroids.each(function() {
      var cx = this.offsetLeft + settings.r;
      var cy = this.offsetTop + settings.r;
      // the magic of collision detection
      var x = cx - mouse.x;
      var y = cy - mouse.y;
      if (Math.sqrt(x * x + y * y) < settings.r * 2) {
        collision = true;
      }
    });

    if (collision) {
      score = 0;
      board.style('visibility', 'hidden');
      if (previousCollisionState !== collision) {
        collisionCount = collisionCount + 1;
      }
    } else {
      board.style('visibility', 'visible');
    }
    previousCollisionState = collision;
  };

  d3.timer(detectCollisions);
};

///////////////////////////////////////////////////////////////////
// Solution 2
///////////////////////////////////////////////////////////////////
var solutionTwo = function() {
  // Bare Minimum Requirements

  // REQ 1: Draw the Enemies in an svg element

  var h = window.innerHeight;
  var w = window.innerWidth;
  var randomX = function() { return Math.random () * w; };
  var randomY = function() { return Math.random () * h; };

  // Build svg container
  var container = d3
    .select('body')
    .append('svg')
    .attr({
      width: w,
      height: h
    });
  var enemyRadius = 15;

    // Build enemies
  var enemies = container
    .selectAll('circle')
    .data(d3.range(30))
    .enter()
    .append('circle')
    .attr({
      cx: randomX,
      cy: randomY,
      r: enemyRadius
    });

  // REQ 2: Make it so that enemies move to a new random location every second

  // with d3.each
  var move = function() {
    enemies
      .transition()
      .ease('linear')
      .duration(1000)
      .attr({
        cx: randomX,
        cy: randomY
      })
      .each('end', move);
  };
  move();

  // REQ 3: Make a differently-color dot to represent the player. Make it draggable.

  var playerRadius = 20;
  var player = container
    .append('circle')
    .attr({
      cx: w / 2,
      cy: h / 2,
      r: playerRadius,
      fill: 'blue'
    })
    // add drag behavior
    .call(d3.behavior
      .drag()
      .on('drag', function(d) {
        d3.select(this)
          .attr({
            cx: d3.event.x,
            cy: d3.event.y
          });
      }));

  // REQ 4: Detect when an enemy touches you.
  var detectCollision = function() {
    var collision = false;
    enemies.each(function() {
      var enemy = d3.select(this);
      var x = Math.abs(enemy.attr('cx') - player.attr('cx'));
      var y = Math.abs(enemy.attr('cy') - player.attr('cy'));
      var distance = Math.sqrt((x * x) + (y * y));
      if (distance <= enemyRadius + playerRadius) {
        collision = true;
      }
    });
    if (collision) {
      currentScore = 0;
      if (previousCollisionState !== collision) {
        collisionCount = collisionCount + 1;
      }
      collide();
    }
    previousCollisionState = collision;
  };

  var collide = function() {
    player.attr('fill', 'red');
    setTimeout(function() {
      player.attr('fill', 'blue');
    }, 0);
  };

  d3.timer(detectCollision);

  // REQ 5: Keep Track of User's score and display it
  var currentScore = 0;
  var hiScore = 0;
  var collisionCount = 0;
  var previousCollisionState = false;
  var updateScore = function() {
    currentScore++;
    hiScore = Math.max(hiScore, currentScore);
    d3.select('.current span').text(currentScore);
    d3.select('.highscore span').text(hiScore);
    d3.select('.collisions span').text(collisionCount);
  };

  setInterval(updateScore, 100);
};

///////////////////////////////////////////////////////////////////
// replace solutionOne with solutionTwo to see svg solution
solutionOne();