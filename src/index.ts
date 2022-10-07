import { Wall, Floor, Player, Tile, Level, isWall, movePlayer } from './map';

const createCanvas = (): HTMLCanvasElement => {
    var mycanvas = document.createElement("canvas");
    mycanvas.id = "game";
    document.body.appendChild(mycanvas);
    return mycanvas
}


const canvas = document.querySelector<HTMLCanvasElement>("#game") ?? createCanvas();
const width = canvas.width;
const height = canvas.height;
canvas.setAttribute('style', 'background-color:#000')
const ctx = canvas.getContext("2d");

const TILE_SIZE = 16;
const TILES_X = width / TILE_SIZE;
const TILES_Y = height / TILE_SIZE;

const wall: Wall = { wall: true, symbol: '▓' }
const floor: Floor = { floor: true, symbol: '░' }
const player: Player = { symbol: '@', location: { x: 2, y: 2 } }

const floorImg = new Image();
const wallImg = new Image();
const playerImg = new Image();
floorImg.src = 'assets/floor.png';
wallImg.src = 'assets/wall.png';
playerImg.src = 'assets/wall.png';



const createBlock2d = (w: number, h: number): Tile[][] => {
    let dungeon: Tile[][] = [];
    for (let i = 0; i < h; i++) {
        let line: Tile[] = [];
        for (let j = 0; j < w; j++) {
            if (i == 0 || i == w - 1) {
                line.push(wall);
            }
            else if (j == 0 || j == h - 1) {
                line.push(wall);
            }
            else { line.push(floor) }
        }
        dungeon.push(line);
    }
    return dungeon;
}



const drawTilesToCanvas = (tiles: Tile[][], w: number, h: number, tileSize: number) => {
    for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
            if (isWall(tiles[j][i])) {
                ctx?.drawImage(wallImg, j * tileSize, i * tileSize)
            }
            else {
                ctx?.drawImage(floorImg, j * tileSize, i * tileSize)
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
    drawTilesToCanvas(tiles, TILES_X, TILES_Y, TILE_SIZE);
    movePlayer(p, x, y, tiles);
    drawPlayer(p, TILE_SIZE);
}


let block2 = createBlock2d(TILES_X, TILES_Y);



const level: Level = {
    map: createBlock2d(TILES_X, TILES_Y),
}

window.onload = function () {
    drawTilesToCanvas(block2, TILES_X, TILES_Y, TILE_SIZE);
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