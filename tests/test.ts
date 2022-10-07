import { test } from 'uvu';
import * as assert from 'uvu/assert';

import { isFloor, isWall, movePlayer, Player } from '../src/utilities'

const wall = { wall: true, symbol: '▓' }
const floor = { floor: true, symbol: '░' }
const player: Player = { symbol: '@', location: { x: 2, y: 2 } }
const tiles = [
    [wall, wall, wall],
    [wall, floor, floor],
    [wall, wall, wall]];

test('isWall', () => {
    assert.is(isWall(wall), true);
    assert.is(isWall(floor), false);
});

test('isFloor', () => {
    assert.is(isFloor(wall), false);
    assert.is(isFloor(floor), true);
});

test('move player to floor tile', () => {

});


test.run();