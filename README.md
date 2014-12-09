# Phaser Ruby Starter Kit

## Dependencies

- Git (on OS X install via homebrew)
- Ruby 2.1.2 (we recommend using RVM)

## Installation

1) Clone this repository, e.g. `git clone https://github.com/ardell/phaser-starter-kit.git penguin-wars` where "penguin-wars" is the folder you want to build your game in.
1) `cd penguin-wars` again, where "penguin-wars" is the directory where you cloned the starter kit into.
1) `bundle` This installs ruby dependencies, such as your web server.

## Building your game

You'll build your game in the `public` directory. We've started you out with Phaser's [Hello World Example](http://phaser.io/getting-started-js6.php) so all you should have to do is start building. `public/index.html` is the page that will be served at `/`, `images`, javascripts (`js`), and stylesheets (`css`) each have their own directory within `public`. Mostly you'll be working in `public/js/app.js`.

## Running your game

Within your game directory, run `foreman start`, then go to `http://localhost:5000` in your browser.

