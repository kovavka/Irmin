import {SuitType, Tile} from "../types/Tile";

export class TileService {
    static getSvg(tile: Tile) {
        switch (tile.suit) {
            case SuitType.MANZU:
                return this.getManTile(tile.value)
            case SuitType.PINZU:
                return this.getPinTile(tile.value)
            case SuitType.SOUZU:
                return this.getSouTile(tile.value)
            case SuitType.JIHAI:
                return this.getJihaiTile(tile.value)
        }
    }

    private static getManTile(value: number) {
        if (value > 0 && value < 10) {
            return require(`../img/man${value}.svg`)
        }
        throw new Error(`${value} is incorrect value for man suit`)
    }

    private static getPinTile(value: number) {
        if (value > 0 && value < 10) {
            return require(`../img/pin${value}.svg`)
        }
        throw new Error(`${value} is incorrect value for pin suit`)
    }


    private static getSouTile(value: number) {
        if (value > 0 && value < 10) {
            return require(`../img/sou${value}.svg`)
        }
        throw new Error(`${value} is incorrect value for sou suit`)
    }

    private static getJihaiTile(value: number) {
        switch (value) {
            case 1:
                return require(`../img/jihaiHaku.svg`)
            case 2:
                return require(`../img/jihaiHatsu.svg`)
            case 3:
                return require(`../img/jihaiChun.svg`)
            case 4:
                return require(`../img/jihaiTon.svg`)
            case 5:
                return require(`../img/jihaiNan.svg`)
            case 6:
                return require(`../img/jihaiShaa.svg`)
            case 7:
                return require(`../img/jihaiPei.svg`)
            default:
                throw new Error(`${value} is incorrect value for jihai suit`)
        }
    }
}