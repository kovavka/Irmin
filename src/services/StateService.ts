import {ScreenType} from "../types/ScreenType";
import {HandService} from './HandService'
import {Tile} from '../types/Tile'
import signals from 'signals';
import {TempaiService} from './TempaiService'

export class StateService {
    private handService = new HandService()
    private tempaiService = new TempaiService()

    private initialized = false
    private _currentScreen: ScreenType = ScreenType.RULES
    private previousScreen: ScreenType | undefined = undefined
    private showRules: boolean = false
    private _chooseTempai: boolean = false
    private _remainingTime: number = 0
    private timer: NodeJS.Timeout | undefined = undefined
    // private _debug: boolean = false

    private _rememberInterval: number = 60
    private _dropInterval: number = 10

    onChange: signals.Signal = new signals.Signal()
    onHandChanged: signals.Signal = new signals.Signal()
    onTimeChanged: signals.Signal = new signals.Signal()
    onChooseTempaiChanged: signals.Signal<boolean> = new signals.Signal()
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
                if(!this.initialized) {
                    this.initialized = true
                    this.setScreen(ScreenType.MEMORIZING)
                } else {
                    if (this.previousScreen) {
                        this.setScreen(this.previousScreen)
                        this.previousScreen = undefined
                    } else {
                        this.handService.generate()
                        this.setScreen(ScreenType.MEMORIZING)
                    }
                }
                break
            case ScreenType.MEMORIZING:
                this.handService.nextTile()
                this.setScreen(ScreenType.PROCESSING)
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
            case ScreenType.ABOUT:
                if (this.previousScreen) {
                    this.setScreen(this.previousScreen)
                    this.previousScreen = undefined
                } else {
                    this.handService.generate()
                    this.setScreen(ScreenType.MEMORIZING)
                }
                break
            case ScreenType.SETTINGS:
                this.handService.generate()
                this.setScreen(ScreenType.MEMORIZING)
                break
        }
    }

    private setScreen(screen: ScreenType) {
        this._currentScreen = screen
        this.clear()

        this.onChange.dispatch()
    }

    setTimer() {
        this.clearTimer()

        if (this._currentScreen === ScreenType.MEMORIZING) {
            this._remainingTime = this._rememberInterval
        }
        if (this._currentScreen === ScreenType.PROCESSING) {
            this._remainingTime = this._dropInterval
        }

        this.onTimeChanged.dispatch()
        this.timer = setTimeout(() => this.onTimerTick(), 1000)
    }

    onTimerTick() {
        if (this._remainingTime !== 0) {
            this._remainingTime--
            this.onTimeChanged.dispatch()
            this.timer = setTimeout(() => this.onTimerTick(), 1000)
        } else {
            this.clearTimer()
            if (this._currentScreen === ScreenType.MEMORIZING) {
                this.nextScreen()
            } else if (this._currentScreen === ScreenType.PROCESSING) {
                if (this.tsumo) {
                    this.dropTile(this.tsumo)
                }
                this.chooseTempai(false)
            }
        }
    }

    private clearTimer() {
        if (this.timer) {
            clearTimeout(this.timer)
            this.timer = undefined
        }
    }

    private clear() {
        this.showRules = false
        this._chooseTempai = false
        this.clearTimer()
        this._remainingTime = 0
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
            this.setTimer()
        } else {
            this.setScreen(ScreenType.FAIL)
        }
    }

    chooseTempai(value: boolean) {
        this._chooseTempai = value
        this.onChooseTempaiChanged.dispatch(value)
    }


    openRules() {
        this.clearTimer()
        this.previousScreen = this.currentScreen
        this.setScreen(ScreenType.RULES)
    }

    openSettings() {
        this.clear()
        this.setScreen(ScreenType.SETTINGS)
    }

    openAbout() {
        this.clearTimer()
        this.previousScreen = this.currentScreen
        this.setScreen(ScreenType.ABOUT)
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

    get remainingTimeStr(): string {
        let sec = this._remainingTime % 60
        let min = Math.round((this._remainingTime - sec) / 60)

        let secStr = sec > 9 ? sec : '0' + sec
        return `${min} : ${secStr}`
    }
}