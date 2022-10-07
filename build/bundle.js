(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var _a;
exports.__esModule = true;
var utilities_1 = require("./utilities");
var createCanvas = function () {
    var mycanvas = document.createElement("canvas");
    mycanvas.id = "game";
    document.body.appendChild(mycanvas);
    return mycanvas;
};
var canvas = (_a = document.querySelector("#game")) !== null && _a !== void 0 ? _a : createCanvas();
var width = canvas.width;
var height = canvas.height;
canvas.setAttribute('style', 'background-color:#000');
var ctx = canvas.getContext("2d");
var TILE_SIZE = 16;
var TILES_X = width / TILE_SIZE;
var TILES_Y = height / TILE_SIZE;
var wall = { wall: true, symbol: '▓' };
var floor = { floor: true, symbol: '░' };
var player = { symbol: '@', location: { x: 2, y: 2 } };
var floorImg = new Image();
var wallImg = new Image();
var playerImg = new Image();
floorImg.src = 'assets/floor.png';
wallImg.src = 'assets/wall.png';
playerImg.src = 'assets/wall.png';
var createBlock2d = function (w, h) {
    var dungeon = [];
    for (var i = 0; i < h; i++) {
        var line = [];
        for (var j = 0; j < w; j++) {
            if (i == 0 || i == w - 1) {
                line.push(wall);
            }
            else if (j == 0 || j == h - 1) {
                line.push(wall);
            }
            else {
                line.push(floor);
            }
        }
        dungeon.push(line);
    }
    return dungeon;
};
var drawTilesToCanvas = function (tiles, w, h, tileSize) {
    for (var i = 0; i < h; i++) {
        for (var j = 0; j < w; j++) {
            if ((0, utilities_1.isWall)(tiles[j][i])) {
                ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(wallImg, j * tileSize, i * tileSize);
            }
            else {
                ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(floorImg, j * tileSize, i * tileSize);
            }
        }
    }
};
var drawPlayer = function (player, tileSize) {
    ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(playerImg, player.location.x * tileSize, player.location.y * tileSize);
};
var clearCanvas = function () {
    ctx === null || ctx === void 0 ? void 0 : ctx.clearRect(0, 0, canvas.width, canvas.height);
};
var update = function (tiles, p, x, y) {
    clearCanvas();
    drawTilesToCanvas(tiles, TILES_X, TILES_Y, TILE_SIZE);
    (0, utilities_1.movePlayer)(p, x, y, tiles);
    drawPlayer(p, TILE_SIZE);
};
var block2 = createBlock2d(TILES_X, TILES_Y);
var level = {
    map: createBlock2d(TILES_X, TILES_Y)
};
window.onload = function () {
    drawTilesToCanvas(block2, TILES_X, TILES_Y, TILE_SIZE);
    drawPlayer(player, TILE_SIZE);
};
document.addEventListener('keydown', function (event) {
    var keyName = event.key;
    switch (keyName) {
        case 'w':
            update(block2, player, 0, -1);
            break;
        case 'a':
            update(block2, player, -1, 0);
            break;
        case 's':
            update(block2, player, 0, 1);
            break;
        case 'd':
            update(block2, player, 1, 0);
            break;
        case 'i':
            console.log("TODO: inventory");
            break;
    }
}, false);

},{"./utilities":2}],2:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.movePlayer = exports.isWall = exports.isFloor = void 0;
function isFloor(x) {
    var is = ("floor" in x);
    return is;
}
exports.isFloor = isFloor;
/*
export function isW(x: Tile): boolean {
    let is = (x === wall)
    return is
}
*/
/**
 * Check if tile is of type Wall.
 * @example
 * console.log(isWall(tile))
*/
function isWall(x) {
    var is = ("wall" in x);
    return is;
}
exports.isWall = isWall;
var movePlayer = function (player, x, y, tiles) {
    var n = player;
    var px = player.location.x + x;
    var py = player.location.y + y;
    if (isWall(tiles[px][py])) {
        return player;
    }
    else {
        n.location.x = px;
        n.location.y = py;
        return n;
    }
};
exports.movePlayer = movePlayer;

},{}]},{},[1]);
