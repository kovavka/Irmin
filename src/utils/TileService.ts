import man1 from '../img/man1.svg';
import man2 from '../img/man2.svg';
import man3 from '../img/man3.svg';
import man4 from '../img/man4.svg';
import man5 from '../img/man5.svg';
import man6 from '../img/man6.svg';
import man7 from '../img/man7.svg';
import man8 from '../img/man8.svg';
import man9 from '../img/man9.svg';

import pin1 from '../img/pin1.svg';
import pin2 from '../img/pin2.svg';
import pin3 from '../img/pin3.svg';
import pin4 from '../img/pin4.svg';
import pin5 from '../img/pin5.svg';
import pin6 from '../img/pin6.svg';
import pin7 from '../img/pin7.svg';
import pin8 from '../img/pin8.svg';
import pin9 from '../img/pin9.svg';

import sou1 from '../img/sou1.svg';
import sou2 from '../img/sou2.svg';
import sou3 from '../img/sou3.svg';
import sou4 from '../img/sou4.svg';
import sou5 from '../img/sou5.svg';
import sou6 from '../img/sou6.svg';
import sou7 from '../img/sou7.svg';
import sou8 from '../img/sou8.svg';
import sou9 from '../img/sou9.svg';

import jihaiChun from '../img/jihaiChun.svg';
import jihaiHaku from '../img/jihaiHaku.svg';
import jihaiHatsu from '../img/jihaiHatsu.svg';
import jihaiTon from '../img/jihaiTon.svg';
import jihaiNan from '../img/jihaiNan.svg';
import jihaiShaa from '../img/jihaiShaa.svg';
import jihaiPei from '../img/jihaiPei.svg';
import {SuitType, Tile} from "../models/Tile";

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
        switch (value) {
            case 1:
                return man1
            case 2:
                return man2
            case 3:
                return man3
            case 4:
                return man4
            case 5:
                return man5
            case 6:
                return man6
            case 7:
                return man7
            case 8:
                return man8
            case 9:
                return man9
            default:
                throw new Error()
        }
    }

    private static getPinTile(value: number) {
        switch (value) {
            case 1:
                return pin1
            case 2:
                return pin2
            case 3:
                return pin3
            case 4:
                return pin4
            case 5:
                return pin5
            case 6:
                return pin6
            case 7:
                return pin7
            case 8:
                return pin8
            case 9:
                return pin9
            default:
                throw new Error()
        }
    }

    private static getSouTile(value: number) {
        switch (value) {
            case 1:
                return sou1
            case 2:
                return sou2
            case 3:
                return sou3
            case 4:
                return sou4
            case 5:
                return sou5
            case 6:
                return sou6
            case 7:
                return sou7
            case 8:
                return sou8
            case 9:
                return sou9
            default:
                throw new Error()
        }
    }

    private static getJihaiTile(value: number) {
        switch (value) {
            case 1:
                return jihaiHaku
            case 2:
                return jihaiHatsu
            case 3:
                return jihaiChun
            case 4:
                return jihaiTon
            case 5:
                return jihaiNan
            case 6:
                return jihaiShaa
            case 7:
                return jihaiPei
            default:
                throw new Error()
        }
    }
}