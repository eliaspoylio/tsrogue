import { deepFreeze } from "./utils"

export type Level = {
    map: Tile[][],
}
export type Point = {
    x: number
    y: number
}

export type Tile = Wall | Floor

export type Wall = {
    wall: boolean
    symbol?: string
} & Visible & Seen

export type Floor = {
    floor: boolean
    symbol?: string
} & Visible & Seen

export type Player = {
    symbol?: string
    location: Point
}

interface Visible { visible?: boolean }
interface Seen { seen?: boolean }

/** 
 * Check if tile is of type Floor.
 * @example
 * isFloor(tile)
*/
export function isFloor(x: Tile): x is Floor {
    let is = ("floor" in x)
    return is
}

/** 
 * Check if tile is of type Wall.
 * @example
 * isWall(tile)
*/
export function isWall(x: Tile): x is Wall {
    let is = ("wall" in x)
    return is;
}

export const movePlayer = (player: Player, x: number, y: number, tiles: any[][]): Player => {
    //deepFreeze(player)
    let n = player;
    let px = player.location.x + x;
    let py = player.location.y + y;
    if (isWall(tiles[px][py])) {
        return player;
    }
    else {
        player.location.x = px;
        player.location.y = py;
        return n;
    }
}
