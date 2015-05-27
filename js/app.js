var game = new Phaser.Game(800, 480, Phaser.AUTO, 'test', null, true, false);
var BasicGame = function (game) { };
BasicGame.Boot = function (game) { };
var isoGroup, cursorPos, cursor, player, x_point, button, music;

BasicGame.Boot.prototype =
{
  preload: function () {
    game.load.image('mute', 'images/mute-button.png');
    game.load.spritesheet('dude', 'images/walk-down-small.png', 50, 75);
    game.load.atlasJSONHash('tileset', 'images/fallout-tileset.png', 'images/fallout-tileset.json');
    game.load.audio('fo2-music', 'assets/khans.mp3');

    game.time.advancedTiming = true;

    // Add and enable the plug-in.
    game.plugins.add(new Phaser.Plugin.Isometric(game));
    game.physics.startSystem(Phaser.Plugin.Isometric.ISOARCADE);
    game.world.setBounds(0, 0, 800, 600);

    // This is used to set a game canvas-based offset for the 0, 0, 0 isometric coordinate - by default
    // this point would be at screen coordinates 0, 0 (top left) which is usually undesirable.
    game.iso.anchor.setTo(0.4, 0.1);
  },
  create: function () {
    // add music to the game, yay!
    music = game.add.audio('fo2-music');
    music.play();

    // Create an array of tiles
    var tileArray = [];
    tileArray[0] = 'dirt-tile.png';
    tileArray[1] = 'test-tile-broken-wall.png';
    tileArray[2] = 'test-tile-small.png';
    tileArray[3] = 'tile.png';

    var tiles = [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 3, 1, 1, 1, 1, 1],
    ];

    // Create a group for our tiles.
    isoGroup = game.add.group();
    game.iso.simpleSort(isoGroup);

    // Let's make a load of tiles on a grid.
    this.spawnTiles(tiles, tileArray);

    // Provide a 3D position for the cursor
    cursorPos = new Phaser.Plugin.Isometric.Point3();

    // create a player object
    player = game.add.isoSprite(32, 32, 20, 'dude', 0, isoGroup);
    player.anchor.set(0.5);
    game.physics.isoArcade.enable(player);
    player.body.collideWorldBounds = true;
    game.camera.follow(player);

    // player animations
    player.animations.add('down', [0,1,2,3,4,5,6,7], 8, true);

    // setup player controls
    this.cursors = game.input.keyboard.createCursorKeys();

    this.game.input.keyboard.addKeyCapture([
      Phaser.Keyboard.LEFT,
      Phaser.Keyboard.RIGHT,
      Phaser.Keyboard.UP,
      Phaser.Keyboard.DOWN,
      Phaser.Keyboard.SPACEBAR
    ]);

    var mute_button = game.add.button(30, 0, 'mute', this.actionOnClick, this);

    isoGroup.enableBody = true;
  },
  update: function () {
    
    // sorting elements (hopefully!)
    game.iso.simpleSort(isoGroup);

    // collision detection?
    game.physics.isoArcade.collide(isoGroup);

    // setup player speed
    var speed = 100;

    // player movement y (keyboard)
    if (this.cursors.up.isDown) {
      player.body.velocity.y = -speed;
    } else if (this.cursors.down.isDown) {
      player.body.velocity.y = speed;
      player.animations.play('down');
    } else {
      player.body.velocity.y = 0;
      player.animations.stop();
    }

    // player movement x (keyboard)
    if (this.cursors.left.isDown) {
      player.body.velocity.x = -speed;
    } else if (this.cursors.right.isDown) {
      player.body.velocity.x = speed;
    } else {
      player.body.velocity.x = 0;
    }

    if (game.input.mousePointer.isDown) {
      game.physics.arcade.moveToPointer(player, speed);
    }

    // Update the cursor position.
    // It's important to understand that screen-to-isometric projection means you have to specify a z position 
    // manually, as this cannot be easily determined from the 2D pointer position without extra trickery. 
    // By default, the z position is 0 if not set.
    game.iso.unproject(game.input.activePointer.position, cursorPos);

    // Loop through all tiles and test to see if the 3D position from above intersects with the automatically generated IsoSprite tile bounds.
    isoGroup.forEach(function (tile) {
      var inBounds = tile.isoBounds.containsXY(cursorPos.x, cursorPos.y);
      // If it does, do a little animation and tint change.
      if (!tile.selected && inBounds) {
          tile.selected = true;
          tile.tint = 0x86bfda;
      }
      // If not, revert back to how it was.
      else if (tile.selected && !inBounds) {
          tile.selected = false;
          tile.tint = 0xffffff;
      }
    });
  },
  render: function () {
    game.debug.text(game.time.fps || '--', 2, 14, "#a7aebe");
    game.debug.text(cursorPos.x, 2, 56, "#ffffff");
    game.debug.text(cursorPos.y, 2, 76, "#ffffff");
  },
  spawnTiles: function (tiles, tileArray) {
    var tile;

    for (var xx = 0, x_iter = 0; xx < 400; xx += 38, x_iter++) {
      for (var yy = 0, y_iter = 0; yy < 400; yy += 38, y_iter++) {
        // Create a tile using the new game.add.isoSprite factory method at the specified position.
        // The last parameter is the group you want to add it to (just like game.add.sprite)
        var tile_from_array = tiles[x_iter][y_iter];

        if (tile_from_array === 1) {
          var tile_height = 40;
        } else {
          var tile_height = 0;
        }

        tile = game.add.isoSprite(xx, yy, tile_height, 'tileset', tileArray[tile_from_array], isoGroup);
        tile.anchor.set(0.5, 0);
        game.physics.isoArcade.enable(tile);
        tile.body.immovable = true;
      }
    }
  },
  actionOnClick: function () {
    console.log("action click");
    music.mute =! music.mute;
  }
};

game.state.add('Boot', BasicGame.Boot);
game.state.start('Boot');
