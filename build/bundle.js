(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var _a;
exports.__esModule = true;
var map_1 = require("./map");
var raycast_1 = require("./raycast");
var createCanvas = function () {
    var mycanvas = document.createElement("canvas");
    mycanvas.id = "game";
    document.body.appendChild(mycanvas);
    return mycanvas;
};
var invert = function (img) {
    if (ctx) {
        //ctx.drawImage(img, 0, 0);
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var data = imageData.data;
        console.log(data);
        for (var i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i]; // red
            data[i + 1] = 255 - data[i + 1]; // green
            data[i + 2] = 255 - data[i + 2]; // blue
        }
        ctx.putImageData(imageData, 0, 0);
    }
};
var canvas = (_a = document.querySelector("#game")) !== null && _a !== void 0 ? _a : createCanvas();
var width = canvas.width;
var height = canvas.height;
canvas.setAttribute('style', 'background-color:#000');
var ctx = canvas.getContext("2d");
var TILE_SIZE = 16;
var TILES_X = Math.round(width / TILE_SIZE);
var TILES_Y = Math.round(height / TILE_SIZE);
var player = { symbol: '@', location: { x: 2, y: 2 } };
//deepFreeze(player)
var floorImg = new Image();
var wallImg = new Image();
var playerImg = new Image();
floorImg.src = 'assets/floor.png';
wallImg.src = 'assets/wall.png';
playerImg.src = 'assets/character0.png';
var createBlock2d = function (w, h) {
    var dungeon = [];
    for (var i = 0; i < h; i++) {
        var line = [];
        for (var j = 0; j < w; j++) {
            if (i == 0 || i == w - 1) {
                line.push({ wall: true, visible: false, seen: false });
            }
            else if (j == 0 || j == h - 1) {
                line.push({ wall: true, visible: false, seen: false });
            }
            else {
                var rand = Math.random();
                if (rand < 0.05) {
                    line.push({ wall: true, visible: false, seen: false });
                }
                else {
                    line.push({ floor: true, visible: false, seen: false });
                }
            }
        }
        dungeon.push(line);
    }
    return dungeon;
};
var drawTilesToCanvas = function (tiles, w, h, tileSize) {
    for (var i = 0; i < h; i++) {
        for (var j = 0; j < w; j++) {
            if (tiles[j][i].visible == false) {
                if (ctx) {
                    ctx.fillStyle = '#000000';
                }
                ctx === null || ctx === void 0 ? void 0 : ctx.fillRect(j * 25, i * 25, 25, 25);
            }
            else {
                if ((0, map_1.isWall)(tiles[j][i])) {
                    ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(wallImg, j * tileSize, i * tileSize);
                }
                else {
                    ctx === null || ctx === void 0 ? void 0 : ctx.drawImage(floorImg, j * tileSize, i * tileSize);
                }
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
    (0, map_1.movePlayer)(p, x, y, tiles);
    tiles = (0, raycast_1.raycast)(p, tiles, 'dark');
    drawTilesToCanvas(tiles, TILES_X, TILES_Y, TILE_SIZE);
    drawPlayer(p, TILE_SIZE);
};
var block2 = createBlock2d(TILES_X, TILES_Y);
var level = {
    map: createBlock2d(TILES_X, TILES_Y)
};
document.onreadystatechange = function (e) {
    drawTilesToCanvas(block2, TILES_X, TILES_Y, TILE_SIZE);
    (0, raycast_1.raycast)(player, block2);
    drawPlayer(player, TILE_SIZE);
};
window.onload = function () {
    drawTilesToCanvas(block2, TILES_X, TILES_Y, TILE_SIZE);
    (0, raycast_1.raycast)(player, block2);
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

},{"./map":2,"./raycast":3}],2:[function(require,module,exports){
"use strict";
exports.__esModule = true;
exports.movePlayer = exports.isWall = exports.isFloor = void 0;
/**
 * Check if tile is of type Floor.
 * @example
 * isFloor(tile)
*/
function isFloor(x) {
    var is = ("floor" in x);
    return is;
}
exports.isFloor = isFloor;
/**
 * Check if tile is of type Wall.
 * @example
 * isWall(tile)
*/
function isWall(x) {
    var is = ("wall" in x);
    return is;
}
exports.isWall = isWall;
var movePlayer = function (player, x, y, tiles) {
    //deepFreeze(player)
    var n = player;
    var px = player.location.x + x;
    var py = player.location.y + y;
    if (isWall(tiles[px][py])) {
        return player;
    }
    else {
        player.location.x = px;
        player.location.y = py;
        return n;
    }
};
exports.movePlayer = movePlayer;

},{}],3:[function(require,module,exports){
"use strict";
// http://roguebasin.com/index.php/Raycasting_in_python
exports.__esModule = true;
exports.raycast = void 0;
var map_1 = require("./map");
var RAYS = 360;
var STEP = 3;
var RAD = 10;
// Tables of precalculated values of sin(x / (180 / pi)) and cos(x / (180 / pi))
var sintable = [
    0.00000, 0.01745, 0.03490, 0.05234, 0.06976, 0.08716, 0.10453,
    0.12187, 0.13917, 0.15643, 0.17365, 0.19081, 0.20791, 0.22495, 0.24192,
    0.25882, 0.27564, 0.29237, 0.30902, 0.32557, 0.34202, 0.35837, 0.37461,
    0.39073, 0.40674, 0.42262, 0.43837, 0.45399, 0.46947, 0.48481, 0.50000,
    0.51504, 0.52992, 0.54464, 0.55919, 0.57358, 0.58779, 0.60182, 0.61566,
    0.62932, 0.64279, 0.65606, 0.66913, 0.68200, 0.69466, 0.70711, 0.71934,
    0.73135, 0.74314, 0.75471, 0.76604, 0.77715, 0.78801, 0.79864, 0.80902,
    0.81915, 0.82904, 0.83867, 0.84805, 0.85717, 0.86603, 0.87462, 0.88295,
    0.89101, 0.89879, 0.90631, 0.91355, 0.92050, 0.92718, 0.93358, 0.93969,
    0.94552, 0.95106, 0.95630, 0.96126, 0.96593, 0.97030, 0.97437, 0.97815,
    0.98163, 0.98481, 0.98769, 0.99027, 0.99255, 0.99452, 0.99619, 0.99756,
    0.99863, 0.99939, 0.99985, 1.00000, 0.99985, 0.99939, 0.99863, 0.99756,
    0.99619, 0.99452, 0.99255, 0.99027, 0.98769, 0.98481, 0.98163, 0.97815,
    0.97437, 0.97030, 0.96593, 0.96126, 0.95630, 0.95106, 0.94552, 0.93969,
    0.93358, 0.92718, 0.92050, 0.91355, 0.90631, 0.89879, 0.89101, 0.88295,
    0.87462, 0.86603, 0.85717, 0.84805, 0.83867, 0.82904, 0.81915, 0.80902,
    0.79864, 0.78801, 0.77715, 0.76604, 0.75471, 0.74314, 0.73135, 0.71934,
    0.70711, 0.69466, 0.68200, 0.66913, 0.65606, 0.64279, 0.62932, 0.61566,
    0.60182, 0.58779, 0.57358, 0.55919, 0.54464, 0.52992, 0.51504, 0.50000,
    0.48481, 0.46947, 0.45399, 0.43837, 0.42262, 0.40674, 0.39073, 0.37461,
    0.35837, 0.34202, 0.32557, 0.30902, 0.29237, 0.27564, 0.25882, 0.24192,
    0.22495, 0.20791, 0.19081, 0.17365, 0.15643, 0.13917, 0.12187, 0.10453,
    0.08716, 0.06976, 0.05234, 0.03490, 0.01745, 0.00000, -0.01745, -0.03490,
    -0.05234, -0.06976, -0.08716, -0.10453, -0.12187, -0.13917, -0.15643,
    -0.17365, -0.19081, -0.20791, -0.22495, -0.24192, -0.25882, -0.27564,
    -0.29237, -0.30902, -0.32557, -0.34202, -0.35837, -0.37461, -0.39073,
    -0.40674, -0.42262, -0.43837, -0.45399, -0.46947, -0.48481, -0.50000,
    -0.51504, -0.52992, -0.54464, -0.55919, -0.57358, -0.58779, -0.60182,
    -0.61566, -0.62932, -0.64279, -0.65606, -0.66913, -0.68200, -0.69466,
    -0.70711, -0.71934, -0.73135, -0.74314, -0.75471, -0.76604, -0.77715,
    -0.78801, -0.79864, -0.80902, -0.81915, -0.82904, -0.83867, -0.84805,
    -0.85717, -0.86603, -0.87462, -0.88295, -0.89101, -0.89879, -0.90631,
    -0.91355, -0.92050, -0.92718, -0.93358, -0.93969, -0.94552, -0.95106,
    -0.95630, -0.96126, -0.96593, -0.97030, -0.97437, -0.97815, -0.98163,
    -0.98481, -0.98769, -0.99027, -0.99255, -0.99452, -0.99619, -0.99756,
    -0.99863, -0.99939, -0.99985, -1.00000, -0.99985, -0.99939, -0.99863,
    -0.99756, -0.99619, -0.99452, -0.99255, -0.99027, -0.98769, -0.98481,
    -0.98163, -0.97815, -0.97437, -0.97030, -0.96593, -0.96126, -0.95630,
    -0.95106, -0.94552, -0.93969, -0.93358, -0.92718, -0.92050, -0.91355,
    -0.90631, -0.89879, -0.89101, -0.88295, -0.87462, -0.86603, -0.85717,
    -0.84805, -0.83867, -0.82904, -0.81915, -0.80902, -0.79864, -0.78801,
    -0.77715, -0.76604, -0.75471, -0.74314, -0.73135, -0.71934, -0.70711,
    -0.69466, -0.68200, -0.66913, -0.65606, -0.64279, -0.62932, -0.61566,
    -0.60182, -0.58779, -0.57358, -0.55919, -0.54464, -0.52992, -0.51504,
    -0.50000, -0.48481, -0.46947, -0.45399, -0.43837, -0.42262, -0.40674,
    -0.39073, -0.37461, -0.35837, -0.34202, -0.32557, -0.30902, -0.29237,
    -0.27564, -0.25882, -0.24192, -0.22495, -0.20791, -0.19081, -0.17365,
    -0.15643, -0.13917, -0.12187, -0.10453, -0.08716, -0.06976, -0.05234,
    -0.03490, -0.01745, -0.00000
];
var costable = [
    1.00000, 0.99985, 0.99939, 0.99863, 0.99756, 0.99619, 0.99452,
    0.99255, 0.99027, 0.98769, 0.98481, 0.98163, 0.97815, 0.97437, 0.97030,
    0.96593, 0.96126, 0.95630, 0.95106, 0.94552, 0.93969, 0.93358, 0.92718,
    0.92050, 0.91355, 0.90631, 0.89879, 0.89101, 0.88295, 0.87462, 0.86603,
    0.85717, 0.84805, 0.83867, 0.82904, 0.81915, 0.80902, 0.79864, 0.78801,
    0.77715, 0.76604, 0.75471, 0.74314, 0.73135, 0.71934, 0.70711, 0.69466,
    0.68200, 0.66913, 0.65606, 0.64279, 0.62932, 0.61566, 0.60182, 0.58779,
    0.57358, 0.55919, 0.54464, 0.52992, 0.51504, 0.50000, 0.48481, 0.46947,
    0.45399, 0.43837, 0.42262, 0.40674, 0.39073, 0.37461, 0.35837, 0.34202,
    0.32557, 0.30902, 0.29237, 0.27564, 0.25882, 0.24192, 0.22495, 0.20791,
    0.19081, 0.17365, 0.15643, 0.13917, 0.12187, 0.10453, 0.08716, 0.06976,
    0.05234, 0.03490, 0.01745, 0.00000, -0.01745, -0.03490, -0.05234, -0.06976,
    -0.08716, -0.10453, -0.12187, -0.13917, -0.15643, -0.17365, -0.19081,
    -0.20791, -0.22495, -0.24192, -0.25882, -0.27564, -0.29237, -0.30902,
    -0.32557, -0.34202, -0.35837, -0.37461, -0.39073, -0.40674, -0.42262,
    -0.43837, -0.45399, -0.46947, -0.48481, -0.50000, -0.51504, -0.52992,
    -0.54464, -0.55919, -0.57358, -0.58779, -0.60182, -0.61566, -0.62932,
    -0.64279, -0.65606, -0.66913, -0.68200, -0.69466, -0.70711, -0.71934,
    -0.73135, -0.74314, -0.75471, -0.76604, -0.77715, -0.78801, -0.79864,
    -0.80902, -0.81915, -0.82904, -0.83867, -0.84805, -0.85717, -0.86603,
    -0.87462, -0.88295, -0.89101, -0.89879, -0.90631, -0.91355, -0.92050,
    -0.92718, -0.93358, -0.93969, -0.94552, -0.95106, -0.95630, -0.96126,
    -0.96593, -0.97030, -0.97437, -0.97815, -0.98163, -0.98481, -0.98769,
    -0.99027, -0.99255, -0.99452, -0.99619, -0.99756, -0.99863, -0.99939,
    -0.99985, -1.00000, -0.99985, -0.99939, -0.99863, -0.99756, -0.99619,
    -0.99452, -0.99255, -0.99027, -0.98769, -0.98481, -0.98163, -0.97815,
    -0.97437, -0.97030, -0.96593, -0.96126, -0.95630, -0.95106, -0.94552,
    -0.93969, -0.93358, -0.92718, -0.92050, -0.91355, -0.90631, -0.89879,
    -0.89101, -0.88295, -0.87462, -0.86603, -0.85717, -0.84805, -0.83867,
    -0.82904, -0.81915, -0.80902, -0.79864, -0.78801, -0.77715, -0.76604,
    -0.75471, -0.74314, -0.73135, -0.71934, -0.70711, -0.69466, -0.68200,
    -0.66913, -0.65606, -0.64279, -0.62932, -0.61566, -0.60182, -0.58779,
    -0.57358, -0.55919, -0.54464, -0.52992, -0.51504, -0.50000, -0.48481,
    -0.46947, -0.45399, -0.43837, -0.42262, -0.40674, -0.39073, -0.37461,
    -0.35837, -0.34202, -0.32557, -0.30902, -0.29237, -0.27564, -0.25882,
    -0.24192, -0.22495, -0.20791, -0.19081, -0.17365, -0.15643, -0.13917,
    -0.12187, -0.10453, -0.08716, -0.06976, -0.05234, -0.03490, -0.01745,
    -0.00000, 0.01745, 0.03490, 0.05234, 0.06976, 0.08716, 0.10453, 0.12187,
    0.13917, 0.15643, 0.17365, 0.19081, 0.20791, 0.22495, 0.24192, 0.25882,
    0.27564, 0.29237, 0.30902, 0.32557, 0.34202, 0.35837, 0.37461, 0.39073,
    0.40674, 0.42262, 0.43837, 0.45399, 0.46947, 0.48481, 0.50000, 0.51504,
    0.52992, 0.54464, 0.55919, 0.57358, 0.58779, 0.60182, 0.61566, 0.62932,
    0.64279, 0.65606, 0.66913, 0.68200, 0.69466, 0.70711, 0.71934, 0.73135,
    0.74314, 0.75471, 0.76604, 0.77715, 0.78801, 0.79864, 0.80902, 0.81915,
    0.82904, 0.83867, 0.84805, 0.85717, 0.86603, 0.87462, 0.88295, 0.89101,
    0.89879, 0.90631, 0.91355, 0.92050, 0.92718, 0.93358, 0.93969, 0.94552,
    0.95106, 0.95630, 0.96126, 0.96593, 0.97030, 0.97437, 0.97815, 0.98163,
    0.98481, 0.98769, 0.99027, 0.99255, 0.99452, 0.99619, 0.99756, 0.99863,
    0.99939, 0.99985, 1.00000
];
var raycast = function (p, tiles, mode) {
    switch (mode) {
        case 'fow':
            break;
        case 'dark':
            tiles.forEach(function (y) { return y.map(function (x) { return x.visible = false; }); });
            break;
    }
    ;
    for (var i = 0; i <= RAYS; i += STEP) {
        console.log(p.location.x, p.location.y);
        var ax = sintable[i];
        var ay = costable[i];
        var _x = p.location.x;
        var _y = p.location.y;
        for (var z = 0; z < RAD; z++) {
            _x += ax;
            _y += ay;
            // If ray is out of range
            if (_x < 0 || _y < 0 || _x > tiles.length || _y > tiles[0].length) {
                break;
            }
            // Stop ray if it hit a wall
            if ((0, map_1.isWall)(tiles[Math.round(_x)][Math.round(_y)])) {
                tiles[Math.round(_x)][Math.round(_y)].visible = true;
                break;
            }
            // Make tile visible
            tiles[Math.round(_x)][Math.round(_y)].visible = true;
        }
    }
    return tiles;
};
exports.raycast = raycast;

},{"./map":2}]},{},[1]);
