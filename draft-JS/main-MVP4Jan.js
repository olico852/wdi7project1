console.log('JS loaded');

var gameCourt = document.getElementById('gameCourt')
var frameHeight = parseInt($('#gameCourt').css('height')) // jQuery gives height as a string i.e. XYpx. parseInt here would remove everything else
var frameWidth = parseInt($('#gameCourt').css('width'))
var framePadding = parseInt($('#gameCourt').css('padding')) // 5px
var paddleHeight = parseInt($('#paddle1').css('height'))
var paddleWidth = parseInt($('#paddle1').css('width'))
var paddle1YDistance = 0  // paddle 1 y distance moved
var paddle2YDistance = 0 // paddle 2 y distance moved
var p1score = 0
var p2score = 0
var wasSpaceBarPressed = false
var areThereSprites = false
var animationloop // rAF global var
var sprites = [] // sprite catridge...
var spriteCount = 0
console.log('Sprite count at start of game: ' + spriteCount)


// dynamic net position
$('#net').css({'top': 0 , 'left': (frameWidth / 2 + framePadding)})
$('#paddle1').css({'top': (frameHeight/2 - paddleHeight/2 - framePadding), 'left': framePadding}) // sets y = 0 to middle of frameHeight
$('#paddle2').css({'top': (frameHeight/2 - paddleHeight/2 - framePadding), 'left': frameWidth - framePadding - paddleWidth})

//paddle controls, condition, start button
// $(document).keydown(function(e) {
//   var keycode = e.which
//   if (keycode === 87) { // w key
//     paddle1YDistance -= 30
//     if ($('#paddle1').position().top > framePadding) {
//       $('#paddle1').css('top', frameHeight/2 - paddleHeight/2 - framePadding + paddle1YDistance)
//     }
//     else {
//       paddle1YDistance -= 0
//       $('#paddle1').position().top = framePadding
//     }
//   } else if (keycode === 83) { // s key
//     paddle1YDistance += 30;
//     if ($('#paddle1').position().top < frameHeight - framePadding - paddleHeight) {
//       $('#paddle1').css('top', frameHeight/2 - paddleHeight/2 - framePadding + paddle1YDistance)
//     } else {
//       paddle1YDistance += 0
//       $('#paddle1').position().top = frameHeight - framePadding - paddleHeight
//     }
//   } else if (keycode === 38) { // up arrow key
//     paddle2YDistance -= 30;
//     if ($('#paddle2').position().top > framePadding) {
//       $('#paddle2').css('top', frameHeight/2 - paddleHeight/2 - framePadding + paddle2YDistance)
//     } else {
//       paddle2YDistance -= 0
//       $('#paddle1').position().top = framePadding
//     }
//   } else if (keycode === 40) { // down arrow key
//     paddle2YDistance += 30;
//     if ($('#paddle2').position().top < frameHeight - framePadding - paddleHeight) {
//       $('#paddle2').css('top', frameHeight/2 - paddleHeight/2 - framePadding + paddle2YDistance)
//     } else {
//       paddle2YDistance += 0
//       $('#paddle2').position().top = frameHeight - framePadding - paddleHeight
//     }
//   } else if (keycode === 32) { // space bar
//     toggle(wasSpaceBarPressed)
//   }
// })

$(document).on('keydown', whatKey)


function whatKey(e) {
  keycode = e.which
  if (keycode === 87) {
  }
  if (keycode === 83) {
  }
  if (keycode === 38) {
  }
  if (keycode === 40) {
  }
  if (keycode === 32) {
    toggle(wasSpaceBarPressed)
  }
}


// function whatKey(e) {
//   keycode = e.which
//   if (keycode === 87) {
//     paddle1YDistance -= 30
//     if ($('#paddle1').position().top > framePadding) {
//       $('#paddle1').css('top', frameHeight/2 - paddleHeight/2 - framePadding + paddle1YDistance)
//     }
//     else {
//       paddle1YDistance -= 0
//       $('#paddle1').position().top = framePadding
//     }
//   }
//   if (keycode === 83) {
//     paddle1YDistance += 30;
//     if ($('#paddle1').position().top < frameHeight - framePadding - paddleHeight) {
//       $('#paddle1').css('top', frameHeight/2 - paddleHeight/2 - framePadding + paddle1YDistance)
//     } else {
//       paddle1YDistance += 0
//       $('#paddle1').position().top = frameHeight - framePadding - paddleHeight
//     }
//   }
//   if (keycode === 38) {
//     paddle2YDistance -= 30;
//     if ($('#paddle2').position().top > framePadding) {
//       $('#paddle2').css('top', frameHeight/2 - paddleHeight/2 - framePadding + paddle2YDistance)
//     } else {
//       paddle2YDistance -= 0
//       $('#paddle1').position().top = framePadding
//     }
//   }
//   if (keycode === 40) {
//     paddle2YDistance += 30;
//     if ($('#paddle2').position().top < frameHeight - framePadding - paddleHeight) {
//       $('#paddle2').css('top', frameHeight/2 - paddleHeight/2 - framePadding + paddle2YDistance)
//     } else {
//       paddle2YDistance += 0
//       $('#paddle2').position().top = frameHeight - framePadding - paddleHeight
//     }
//   }
//   if (keycode === 32) {
//     toggle(wasSpaceBarPressed)
//   }
// }

// prevents users came launching more balls during level 1 game play
var toggle = function () {
  if (wasSpaceBarPressed === false) {
    reset()
    return (wasSpaceBarPressed = true)
  }
  if (!wasSpaceBarPressed) {
    return
  }
}

// deletes sprite once it exits frameWidth
function destroySprite () {
  if (!this) { // check that it's refering to the item created
    return
  } else {
    this.parent.removeChild(this.element)
  }
}

// sprite constructor
function SpriteCreate (parentElement) {
	// function references
	this.reposition = repositionSprite;
	this.frame = changeSpriteFrame;
	this.destroy = destroySprite;
	this.parent = gameCourt // parent of sprite
	this.element = document.createElement("div"); // create a DOM sprite div
	this.element.className = 'sprite';
	this.style = this.element.style; // refers to css .sprite style
	// starting position at center of net
  this.x = (frameWidth / 2 + framePadding) - spritesheetFrameWidth / 2
  this.y = (frameHeight / 2 + framePadding) - spritesheetFrameHeight / 2
  this.reposition()
  // below 2 lines provide new sprite with a random speed, direction and angle (currently: 90 deg)
	this.xSpeed = Math.round(Math.random() * 7 + 4) * randomDir()
	this.ySpeed = Math.round(Math.random() * 7 + 4) * randomDir()
	// random spritesheet frame
	this.frame(spriteCount)
	// put it into the game window
	this.parent.appendChild(this.element)
}

// Spritesheet specs: all sprite frames stored in this spritesheet.
var spritesheetWidth = 77;
var spritesheetHeight = 76;
var spritesheetFrameWidth = 25.6;
var spritesheetFrameHeight = 25.3;
var spritesheetXFrames = spritesheetWidth / spritesheetFrameWidth
var spritesheetYFrames = spritesheetHeight / spritesheetFrameHeight
var spritesheetFrames = spritesheetXFrames * spritesheetYFrames;

function changeSpriteFrame(num) {
	if (!this) {
    return;
  } else {
	this.style.backgroundPosition =
		(-1 * (num % spritesheetXFrames) * spritesheetFrameWidth) + 'px ' +
		(-1 * (Math.round(num / spritesheetXFrames) % spritesheetYFrames) * spritesheetFrameHeight) + 'px';
  }
}

// this determines starting position of Sprites and displays the coordinates of ball trajectory...
function repositionSprite () {
  if (!this) {
    return
  } else { // sprites coordinates take y = 0 at top of gameCourt
	   this.style.top = this.y + 'px'
     this.style.left = this.x + 'px'
     // replace jQuery $('this').css({'top': this.y, 'left': this.x})
  }
}

function randomizer () {
  var x = Math.floor(Math.random() * 10 + 1)
  return x
}

function randomDir () {
  if (randomizer() > 5) {
    return 1
  } else {
    return -1
  }
}

function animateSprites () {
  for (var i = 0; i < spriteCount; i++) {
    sprites[i].x += sprites[i].xSpeed // sprite[i].x = x + xSpeed
    sprites[i].y += sprites[i].ySpeed
	  // bounce at top and bottom
    if ((sprites[i].y <= 0) || (sprites[i].y >= (frameHeight - spritesheetFrameHeight))) {
  		sprites[i].ySpeed = -1 * sprites[i].ySpeed
    } //bounce upon contact with paddle 1
    if ((sprites[i].x > $('#paddle1').position().left)) {
      if ((sprites[i].x < $('#paddle1').position().left + paddleWidth)) { // to prevent sprite from getting trapped between frame and paddle1
        if (sprites[i].y > $('#paddle1').position().top - framePadding) { // a little height so that ball can bounce at end of paddle
          if (sprites[i].y < ($('#paddle1').position().top + paddleHeight) + framePadding) {
            sprites[i].ySpeed = sprites[i].ySpeed
            sprites[i].xSpeed = -1 * sprites[i].xSpeed
          }
        }
      } // bounce upon contact with paddle 2
    }
    if (sprites[i].x > ($('#paddle2').position().left - spritesheetFrameWidth)) {
      if (sprites[i].x < $('#paddle2').position().left - spritesheetFrameWidth + paddleWidth) {
        if (sprites[i].y > $('#paddle2').position().top - framePadding) {
          if (sprites[i].y < ($('#paddle2').position().top + paddleHeight + framePadding)) {
            sprites[i].ySpeed = sprites[i].ySpeed
            sprites[i].xSpeed = -1 * sprites[i].xSpeed
          }
        }
      } // if sprite > +/- frameWidth
    }
    if (sprites[i].x <= 0) { // Player 2 scores!
      console.log(i);
      sprites[spriteCount - 1].destroy()
      spriteCount--
      // if (spriteCount === 0) { // rAF stop only when spriteCount = 0
      //   window.cancelAnimationFrame(animationloop)
      //   areThereSprites = false
      // }
      p2score++
      $('#gamestatus').text('P1: ' + p1score + '  P2: ' + p2score)
      isGameOver()
      console.log('sprite left' + spriteCount)
      wasSpaceBarPressed = false
      return
    }
    if (sprites[i].x >= frameWidth) { // Player 1 scores!
      sprites[spriteCount - 1].destroy()
      spriteCount--
      // if (spriteCount === 0) {
      //   window.cancelAnimationFrame(animationloop)
      //   areThereSprites = false
      // }
      p1score++
      $('#gamestatus').text('P1: ' + p1score + '  P2: ' + p2score)
      isGameOver()
      console.log('sprite left' + spriteCount)
      wasSpaceBarPressed = false
      return
    } else {
      sprites[i].reposition()
    }
  }
}


function animate () {
  if (keycode === 87) {
    if ($('#paddle1').position().top > framePadding) {
      paddle1YDistance -= 5;
      $('#paddle1').css('top', frameHeight/2 - paddleHeight/2 - framePadding + paddle1YDistance)
    }
    else {
      paddle1YDistance -= 0
      $('#paddle1').position().top = framePadding
    }
  }
  if (keycode === 83) {
    if ($('#paddle1').position().top < frameHeight - framePadding - paddleHeight) {
      paddle1YDistance += 5;
      $('#paddle1').css('top', frameHeight/2 - paddleHeight/2 - framePadding + paddle1YDistance)
    } else {
      paddle1YDistance += 0
      $('#paddle1').position().top = frameHeight - framePadding - paddleHeight
    }
  }
  if (keycode === 38) {
    if ($('#paddle2').position().top > framePadding) {
      paddle2YDistance -= 5;
      $('#paddle2').css('top', frameHeight/2 - paddleHeight/2 - framePadding + paddle2YDistance)
    } else {
      paddle2YDistance -= 0
      $('#paddle1').position().top = framePadding
    }
  }
  if (keycode === 40) {
    if ($('#paddle2').position().top < frameHeight - framePadding - paddleHeight) {
      paddle2YDistance += 5;
      $('#paddle2').css('top', frameHeight/2 - paddleHeight/2 - framePadding + paddle2YDistance)
    } else {
      paddle2YDistance += 0
      $('#paddle2').position().top = frameHeight - framePadding - paddleHeight
    }
  }
  animationloop = window.requestAnimationFrame(animate)
  areThereSprites = true
  animateSprites()
}

function isGameOver() { // updates message board... this is hard coded ...
  if (p1score === 5 || p2score === 5) {
    // window.cancelAnimationFrame(animationloop)
    // areThereSprites = false
    if (p1score === 5) {
      $('#gamestatus').text('P1 has won!')
    }
    if (p2score === 5) {
      $('#gamestatus').text('P2 has won!')
    }
    return true
  } else {
    return false
  }
}

function reset () {
  if (isGameOver === true) {
    return
  } else {
    $('#gamestatus').text('P1: ' + p1score + '  P2: ' + p2score)
    sprites[spriteCount] = new SpriteCreate()
    spriteCount++
    console.log('number of sprite added:' + spriteCount)
    if (areThereSprites === false) { // this starts rAF
      animate()
    }
    if (areThereSprites === true) { // prevents multiple rAF calls with creation of new sprites
      ;
    }
  }
}

// LEVEL 2 OF GAME when either player wins and continues to play, call this function. SetInterval (maybeAddSprite, every 20 secs? )
function maybeAddSprite () {
  if (randomizer() > 8) {
    sprites[spriteCount] = new SpriteCreate() // reset() should work here...
    spriteCount++
  } else {
    return false
  }
}

var minSpriteCount = 40 // utilise this to prevent too many sprites from flooding the screen but or release for crazy mode

// function paddle1Collision () {
//   if (this.x > (paddle1distanceX + paddleWidth)) {
//     console.log('paddle1 no collision');
//     return false
//   }
//   if (this.x < (paddle1distanceX + paddleWidth)) {
//     if ((this.y > paddle1YDistance) && (this.y < (paddle1YDistance + paddleHeight))) {
//       return true
//       console.log('paddleY contact range: ' + paddle1YDistance + ' - ' + (paddle1YDistance - paddleHeight));
//       console.log('ball contact coordinates: ' + this.x + ', ' + this.y);
//     }
//     console.log('paddle1 no collision');
//   return false
//   }
// }

// testing variables for engineering
// this.xSpeed = Math.round(Math.random() * 2 +1) * -1
// this.ySpeed = Math.round(Math.random() * 2 ) * randomDir()



// function checkFPS () {
//   currentTimestamp = Date.now()
//   elapsedMs = currentTimestamp - previousTimestamp
//   var targetFramerateInterval = 1000 / targetFramerate
//   if ((elapsedMs > targetFramerateInterval)) {
//     previousTimestamp = currentTimestamp - (elapsedMs % targetFramerateInterval)
//     return
//   }
//   if (currentFPS < targetFramerate) {
//     previousTimestamp = currentTimestamp + (elapsedMs % targetFramerateInterval)
//     return
//   }
// }
