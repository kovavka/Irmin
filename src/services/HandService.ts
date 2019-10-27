import {DiscardTile, SuitType, Tile} from '../types/Tile'
import {WallGenerator} from "./WallGenerator";

export class HandService {
    private wall: Tile[] = []
    private deadWall: Tile[] = []
    private hand: Tile[] = []
    private discard: DiscardTile[] = []
    private tsumo: Tile | undefined
    private kanTiles: Tile[] = []
    private sortTiles: boolean = false

    generate(sortTiles: boolean): Tile[]  {
        this.sortTiles = sortTiles
        let wall = WallGenerator.generate()

        this.hand = wall.slice(0,13)
        this.trySortHand()

        this.wall = wall.slice(13)
        this.deadWall = wall.slice(30)
        console.log(this.deadWall.length)
        this.discard = []
        this.kanTiles = []
        this.tsumo = undefined

        return this.getHand()
    }

    getHand(): Tile[] {
        return this.hand.slice(0)
    }

    getTsumo(): Tile | undefined {
        return this.tsumo
    }

    getKanTiles(): Tile[] {
        return this.kanTiles.slice(0)
    }

    get remainingTiles(): number {
        return this.wall.length
    }

    getDiscard(): DiscardTile[] {
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
            let discardTile = <DiscardTile>{
                suit: this.tsumo.suit,
                value: this.tsumo.value,
                tsumogiri: true,
            }

            this.discard.push(discardTile)
            this.tsumo = undefined
        }

        return this.getHand()
    }

    dropFromHand(index: number): Tile[] {
        if (this.tsumo) {
            let tile = this.hand[index]
            let discardTile = <DiscardTile>{
                suit: tile.suit,
                value: tile.value,
                tsumogiri: false,
            }
            this.discard.push(discardTile)

            this.hand.splice(index, 1)
            this.hand.unshift(this.tsumo)
            this.trySortHand()

            this.tsumo = undefined
        }

        return this.getHand()
    }

    tryCallKan(index: number): boolean {
        if (!this.tsumo) {
            return false
        }

        let allTiles = this.hand.slice().concat(this.tsumo)
        let tile = index === -1 ? this.tsumo : this.hand[index]

        let count = allTiles.filter(x => x.value === tile.value && x.suit === tile.suit).length
        if (count !== 4) {
            return false
        }

        this.kanTiles.unshift(tile)
        this.hand = allTiles.filter(x => x.value !== tile.value || x.suit !== tile.suit)

        this.tsumo = this.deadWall[0]
        this.deadWall = this.deadWall.slice(1)

        return true
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