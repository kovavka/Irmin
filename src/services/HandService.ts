import {SuitType, Tile} from "../types/Tile";
import {WallGenerator} from "./WallGenerator";

export class HandService {
    private wall: Tile[] = []
    private hand: Tile[] = []
    private discard: Tile[] = []
    private tsumo: Tile | undefined

    generate(): Tile[]  {
        let wall = WallGenerator.generate()

        this.hand = wall.slice(0,13).sort(this.sortHandler)
        this.wall = wall.slice(13)
        this.discard = []

        return this.getHand()
    }

    getHand(): Tile[] {
        return this.hand.slice(0)
    }

    getDiscard(): Tile[] {
        return this.discard.slice(0)
    }

    getStr(): string {
        let hand = ''

        let man = this.hand.filter(x => x.suit === SuitType.MANZU)
        if (man.length) {
            hand += man.map(x => x.value).join('') + 'm'
        }

        let pin = this.hand.filter(x => x.suit === SuitType.PINZU)
        if (pin.length) {
            hand += pin.map(x => x.value).join('') + 'p'
        }

        let sou = this.hand.filter(x => x.suit === SuitType.SOUZU)
        if (sou.length) {
            hand += sou.map(x => x.value).join('') + 's'
        }

        let honors = this.hand.filter(x => x.suit === SuitType.JIHAI)
        if (honors.length) {
            hand += honors.map(x => x.value).join('') + 'z'
        }

        return hand
    }

    nextTile(): Tile {
        let tile = this.wall[0]
        this.wall = this.wall.slice(1)
        this.tsumo = tile
        return tile
    }

    dropTsumo(): Tile[] {
        if (this.tsumo) {
            this.discard.push(this.tsumo)
            this.tsumo = undefined
        }

        return this.getHand()
    }

    dropFromHand(index: number): Tile[] {
        if (this.tsumo) {
            let tile = this.hand[index]
            this.discard.push(tile)

            this.hand.splice(index, 1)
            this.hand.push(this.tsumo)
            this.hand = this.hand.sort(this.sortHandler)

            this.tsumo = undefined
        }

        return this.getHand()
    }

    private sortHandler(a: Tile, b: Tile) {
        if (a.suit === b.suit)
            return a.suit - b.suit

        return a.value - b.value
    }
}