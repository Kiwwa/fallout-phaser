window.onload = function() {

  var game = new Phaser.Game(480, 260, Phaser.AUTO, 'test', null, true, false);

  var BasicGame = function (game) { };

  BasicGame.Boot = function (game) { };

  var isoGroup, isoGroup2, tilesMap, tilesMap2;
  var TILE_SIZE = 33;

  BasicGame.Boot.prototype =
  {
      preload: function () {
          game.load.image('tile_floor', 'assets/rust-sprites/tile_floor.png');
          game.load.image('alt_robot', 'assets/rust-sprites/enemy_resized.png');
          game.load.image('switch', 'assets/rust-sprites/tile_power_supply.png');
          game.load.image('block', 'assets/rust-sprites/tile_block.png');

          game.time.advancedTiming = true;

          game.plugins.add(new Phaser.Plugin.Isometric(game));
          game.iso.anchor.setTo(0.5, 0.25);
      },

      create: function () {

        // the floor
          isoGroup = game.add.group();
          this.spawnTiles();

          // elements on top of the floor (red switch, blue blocks and the bot)
          isoGroup2 = game.add.group();
          this.spawnTiles2();

          // -26 is to center the bot in the middle of a floor tile
          this.bot = game.add.isoSprite(
            TILE_SIZE * 3 - 26,
            TILE_SIZE * 5 - 26,
            0, 'alt_robot', 0, isoGroup2
          );
          this.bot.anchor.set(0.5, 1);

          game.iso.topologicalSort(isoGroup2);
      },

      update: function () {
          game.iso.topologicalSort(isoGroup2);
      },

      render: function () {
          game.debug.text(game.time.fps || '--', 2, 14, "#a7aebe");
      },

      spawnTiles: function () {

        tilesMap = [
          [0,0,0,0,0,0],
          [0,0,0,0,0,0],
          [0,0,0,0,0,0],
          [0,0,0,0,0,0],
          [0,0,0,0,0,0],
          [0,0,0,0,0,0],
        ];

          var tile;

          for (var j = 0; j < tilesMap.length; j++) {
              for (var i = 0; i < tilesMap[j].length; i++) {

                  if(tilesMap[j][i] == 0) {
                       tile = game.add.isoSprite(i * TILE_SIZE, j * TILE_SIZE, 0, 'tile_floor', 0, isoGroup);
            }

            tile.anchor.set(0.5, 1);
              }
          }
      },

      spawnTiles2: function () {

        // 2nd layer, on top of the first one (height +16px)
        var HEIGHT = 16;
        tilesMap2 = [
          [0,0,0,0,0,0],
          [0,5,0,6,0,0],
          [0,5,0,0,0,0],
          [0,5,5,5,5,0],
          [0,0,0,0,0,0],
          [0,0,5,0,0,0],
        ];

        var tile;

          for (var j = 0; j < tilesMap2.length; j++) {
              for (var i = 0; i < tilesMap2[j].length; i++) {
                  if(tilesMap2[j][i] == 5) { 
                    tile = game.add.isoSprite(i * TILE_SIZE, j * TILE_SIZE, HEIGHT, 'switch', 0, isoGroup2);
            }
                  if(tilesMap2[j][i] == 6) {
                    tile = game.add.isoSprite(i * TILE_SIZE, j * TILE_SIZE, HEIGHT, 'block', 0, isoGroup2);
            }
            if(tile) tile.anchor.set(0.5, 1);
              }
          }
      },
  };

  game.state.add('Boot', BasicGame.Boot);
  game.state.start('Boot');
};
