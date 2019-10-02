import {SuitType, Tile} from "../types/Tile";
import {WallGenerator} from "./WallGenerator";

export class HandService {
    private wall: Tile[] = []
    private hand: Tile[] = []
    private discard: Tile[] = []
    private tsumo: Tile | undefined
    private sortTiles: boolean = false

    generate(sortTiles: boolean): Tile[]  {
        this.sortTiles = sortTiles
        let wall = WallGenerator.generate()

        this.hand = wall.slice(0,13)
        this.trySortHand()

        this.wall = wall.slice(13)
        this.discard = []
        this.tsumo = undefined

        return this.getHand()
    }

    getHand(): Tile[] {
        return this.hand.slice(0)
    }

    getTsumo(): Tile | undefined {
        return this.tsumo
    }

    get remainingTiles(): number {
        return this.wall.length
    }

    getDiscard(): Tile[] {
        return this.discard.slice(0)
    }

    get hasTiles(): boolean {
        return !!this.wall.length
    }

    getStr(): string {
        let sorted = this.hand.slice(0).sort(this.sortHandler)
        let hand = ''

        let man = sorted.filter(x => x.suit === SuitType.MANZU)
        if (man.length) {
            hand += man.map(x => x.value).join('') + 'm'
        }

        let pin = sorted.filter(x => x.suit === SuitType.PINZU)
        if (pin.length) {
            hand += pin.map(x => x.value).join('') + 'p'
        }

        let sou = sorted.filter(x => x.suit === SuitType.SOUZU)
        if (sou.length) {
            hand += sou.map(x => x.value).join('') + 's'
        }

        let honors = sorted.filter(x => x.suit === SuitType.JIHAI)
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
            this.hand.unshift(this.tsumo)
            this.trySortHand()

            this.tsumo = undefined
        }

        return this.getHand()
    }

    dropTile(tile: Tile): Tile[] {
        if (this.tsumo) {
            if (this.tsumo.suit === tile.suit && this.tsumo.value === tile.value) {
                this.tsumo = undefined
                this.discard.push(tile)
            } else {
                let index = this.hand.findIndex(x => x.suit == tile.suit && x.value == tile.value)
                if (index !== -1) {
                    this.discard.push(tile)

                    this.hand.splice(index, 1)
                    this.hand.unshift(this.tsumo)
                    this.trySortHand()

                    this.tsumo = undefined
                }
            }
        }

        return this.getHand()
    }

    private trySortHand() {
        if (this.sortTiles) {
            this.hand.sort(this.sortHandler)
        }
    }

    private sortHandler(a: Tile, b: Tile) {
        if (a.suit === b.suit)
            return a.value - b.value

        return a.suit - b.suit
    }
}