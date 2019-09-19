import {ScreenType} from "../types/ScreenType";
import {HandService} from './HandService'
import {Tile} from '../types/Tile'
import signals from 'signals';
import {TempaiService} from './TempaiService'

export class StateService {
    private _currentScreen = ScreenType.RULES
    private showRules: boolean = false
    private _chooseTempai: boolean = false
    private timerTick = 0
    private timer = undefined
    // private _debug: boolean = false
    private handService = new HandService()
    private tempaiService = new TempaiService()

    onChange: signals.Signal = new signals.Signal()
    onHandChanged: signals.Signal = new signals.Signal()
    // onDebugChanged: signals.Signal<boolean> = new signals.Signal()

    private static _instance: StateService
    static get instance(): StateService {
        if (!this._instance) {
            this._instance = new StateService()
        }
        return this._instance
    }

    private constructor() {
        this.handService.generate()
    }

    nextScreen() {
        switch (this._currentScreen) {
            case ScreenType.RULES:
                this.setScreen(ScreenType.MEMORIZING)
                break
            case ScreenType.MEMORIZING:
                this.setScreen(ScreenType.PROCESSING)
                this.handService.nextTile()
                break
            case ScreenType.PROCESSING:
                this.setScreen(ScreenType.FAIL)
                break
            case ScreenType.FAIL:
                this.handService.generate()
                this.setScreen(ScreenType.MEMORIZING)
                break
            case ScreenType.SUCCESS:
                this.handService.generate()
                this.setScreen(ScreenType.MEMORIZING)
                break
        }
    }

    private setScreen(screen: ScreenType) {
        this._currentScreen = screen
        if (screen === ScreenType.MEMORIZING) {
            this.clear()
        }

        this.onChange.dispatch()
    }

    private clear() {
        this.showRules = false
        this._chooseTempai = false
    }

    selectTile(tile: Tile) {
        if (!this._chooseTempai) {
            this.dropTile(tile)
        } else {
            this.handService.dropTile(tile)
            this.checkTempai()
        }
    }

    checkTempai() {
        let str = this.handService.getStr()
        if (this.tempaiService.hasTempai(str)) {
            this.setScreen(ScreenType.SUCCESS)
        } else {
            this.setScreen(ScreenType.FAIL)
        }
    }

    dropTile(tile: Tile) {
        this.handService.dropTile(tile)

        if (this.handService.hasTiles) {
            this.handService.nextTile()
            this.onHandChanged.dispatch()
        } else {
            this.setScreen(ScreenType.FAIL)
        }
    }

    chooseTempai(value: boolean) {
        this._chooseTempai = value
    }

    // get debug(): boolean {
    //     return this._debug
    // }

    // debug(value: boolean) {
    //     this._debug = value
    //     this.onDebugChanged.dispatch()
    // }

    get currentScreen(): ScreenType {
        return this._currentScreen
    }

    get hand(): Tile[] {
        return this.handService.getHand()
    }

    get tsumo(): Tile | undefined {
        return this.handService.getTsumo()
    }

    get discard(): Tile[] {
        return this.handService.getDiscard()
    }
}