import { Tile, Wall, Floor } from './map';

const createBlock = (w: number, h: number, wall: Tile, floor: Tile): Tile[] => {
    let dungeon: Tile[] = [];
    for (let i = 0; i < w; i++) {
        for (let j = 0; j < h; j++) {
            if ((i == 0 || i == w - 1) || (j == 0 || j == h - 1)) {
                dungeon.push(wall);
            }
            else { dungeon.push(floor) }
        }
    }
    return dungeon;
}

export const printToConsole = (tiles: Tile[][], w: number, h: number): string => {
    let lines = '';
    for (let i = 0; i < h; i++) {
        let line = '';
        for (let j = 0; j < w; j++) {
            line = line.concat(tiles[i][j].symbol)
        }
        lines = lines + line + '\n';
    }
    return lines;
}