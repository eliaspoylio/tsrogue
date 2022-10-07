export type Level = {
    map: Tile[][],
}
export type Point = {
    x: number
    y: number
}

export type Tile =
    | Wall
    | Floor

export type Wall = {
    wall: boolean
    symbol: string
}
export type Floor = {
    floor: boolean
    symbol: string
}
export type Player = {
    symbol: string
    location: Point
}

export function isFloor(x: Tile): x is Floor {
    let is = ("floor" in x)
    return is
}

/*
export function isW(x: Tile): boolean {
    let is = (x === wall)
    return is
}
*/

/** 
 * Check if tile is of type Wall.
 * @example
 * isWall(tile)
*/
export function isWall(x: Tile): x is Wall {
    let is = ("wall" in x)
    return is;
}

export const movePlayer = (player: Player, x: number, y: number, tiles: Tile[][]): Player => {
    let n = player
    let px = player.location.x + x;
    let py = player.location.y + y;
    if (isWall(tiles[px][py])) {
        return player;
    }
    else {
        n.location.x = px;
        n.location.y = py;
        return n;
    }
}
