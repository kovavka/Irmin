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
            return `man${value}`
        }
        throw new Error(`${value} is incorrect value for man suit`)
    }

    private static getPinTile(value: number) {
        if (value > 0 && value < 10) {
            return `pin${value}`
        }
        throw new Error(`${value} is incorrect value for pin suit`)
    }


    private static getSouTile(value: number) {
        if (value > 0 && value < 10) {
            return `sou${value}`
        }
        throw new Error(`${value} is incorrect value for sou suit`)
    }

    private static getJihaiTile(value: number) {
        switch (value) {
            case 1:
                return 'jihaiHaku'
            case 2:
                return 'jihaiHatsu'
            case 3:
                return 'jihaiChun'
            case 4:
                return 'jihaiTon'
            case 5:
                return 'jihaiNan'
            case 6:
                return 'jihaiShaa'
            case 7:
                return 'jihaiPei'
            default:
                throw new Error(`${value} is incorrect value for jihai suit`)
        }
    }
}