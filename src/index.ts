import { Wall, Floor, Player, Tile, Level, isWall, movePlayer } from './map';
import { raycast } from './raycast'
import { deepFreeze } from './utils'

const createCanvas = (): HTMLCanvasElement => {
    var mycanvas = document.createElement("canvas");
    mycanvas.id = "game";
    document.body.appendChild(mycanvas);
    return mycanvas
}

const invert = (img: HTMLImageElement) => {
    if (ctx) {
        //ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        console.log(data)
        for (let i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i]; // red
            data[i + 1] = 255 - data[i + 1]; // green
            data[i + 2] = 255 - data[i + 2]; // blue
        }
        ctx.putImageData(imageData, 0, 0);
    }
};


const canvas = document.querySelector<HTMLCanvasElement>("#game") ?? createCanvas();
const width = canvas.width;
const height = canvas.height;
canvas.setAttribute('style', 'background-color:#000')
const ctx = canvas.getContext("2d");

const TILE_SIZE = 16;
const TILES_X = Math.round(width / TILE_SIZE);
const TILES_Y = Math.round(height / TILE_SIZE);

const player: Player = { symbol: '@', location: { x: 2, y: 2 } }
//deepFreeze(player)

const floorImg = new Image();
const wallImg = new Image();
const playerImg = new Image();
floorImg.src = 'assets/floor.png';
wallImg.src = 'assets/wall.png';
playerImg.src = 'assets/character0.png';



const createBlock2d = (w: number, h: number): Tile[][] => {
    let dungeon: Tile[][] = [];
    for (let i = 0; i < h; i++) {
        let line: Tile[] = [];
        for (let j = 0; j < w; j++) {
            if (i == 0 || i == w - 1) {
                line.push({ wall: true, visible: false, seen: false });
            }
            else if (j == 0 || j == h - 1) {
                line.push({ wall: true, visible: false, seen: false });
            }
            else {
                let rand = Math.random();
                if (rand < 0.05) {
                    line.push({ wall: true, visible: false, seen: false });
                }
                else {
                    line.push({ floor: true, visible: false, seen: false })
                }
            }
        }
        dungeon.push(line);
    }
    return dungeon;
}



const drawTilesToCanvas = (tiles: Tile[][], w: number, h: number, tileSize: number) => {
    for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
            if (tiles[j][i].visible == false) {
                if (ctx) { ctx.fillStyle = '#000000' }
                ctx?.fillRect(j * 25, i * 25, 25, 25);
            }
            else {
                if (isWall(tiles[j][i])) {
                    ctx?.drawImage(wallImg, j * tileSize, i * tileSize)
                }
                else {
                    ctx?.drawImage(floorImg, j * tileSize, i * tileSize)
                }
            }
        }
    }
}

const drawPlayer = (player: Player, tileSize: number) => {
    ctx?.drawImage(playerImg, player.location.x * tileSize, player.location.y * tileSize)
}



const clearCanvas = () => {
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
}

const update = (tiles: Tile[][], p: Player, x: number, y: number) => {
    clearCanvas();
    movePlayer(p, x, y, tiles);
    tiles = raycast(p, tiles, 'dark');
    drawTilesToCanvas(tiles, TILES_X, TILES_Y, TILE_SIZE);
    drawPlayer(p, TILE_SIZE);
}


let block2 = createBlock2d(TILES_X, TILES_Y);



const level: Level = {
    map: createBlock2d(TILES_X, TILES_Y),
}

document.onreadystatechange = function (e) {
    drawTilesToCanvas(block2, TILES_X, TILES_Y, TILE_SIZE);
    raycast(player, block2);
    drawPlayer(player, TILE_SIZE);
};

window.onload = function () {
    drawTilesToCanvas(block2, TILES_X, TILES_Y, TILE_SIZE);
    raycast(player, block2);
    drawPlayer(player, TILE_SIZE);
}

document.addEventListener('keydown', (event) => {
    const keyName = event.key;
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
            console.log("TODO: inventory")
            break;
    }

}, false);