import {ScreenType} from "../types/ScreenType";
import {HandService} from './HandService'
import {Tile} from '../types/Tile'
import signals from 'signals';
import {TempaiService} from './TempaiService'
import {SettingsStorage} from './SettingsStorage'
import {Settings, SettingsType} from '../types/Settings'

const REMEMBER_INTERVAL = 60
const DROP_INTERVAL = 10

export class StateService {
    private handService = new HandService()
    private tempaiService = new TempaiService()
    private settingsStorage: SettingsStorage = SettingsStorage.instance

    private initialized = false
    // @ts-ignore
    private _currentScreen: ScreenType
    private previousScreen: ScreenType | undefined = undefined
    private showRules: boolean = false
    private _chooseTempai: boolean = false
    private _remainingTime: number = 0
    private timer: NodeJS.Timeout | undefined = undefined

    onChange: signals.Signal = new signals.Signal()
    onHandChanged: signals.Signal = new signals.Signal()
    onTimeChanged: signals.Signal = new signals.Signal()
    onChooseTempaiChanged: signals.Signal<boolean> = new signals.Signal()

    private static _instance: StateService
    static get instance(): StateService {
        if (!this._instance) {
            this._instance = new StateService()
        }
        return this._instance
    }

    private constructor() {
        this.setFirstScreen(this.getSettings().hasVisited ? ScreenType.MEMORIZING : ScreenType.RULES)
    }

    nextScreen() {
        switch (this._currentScreen) {
            case ScreenType.RULES:
                this.setSettings({
                    hasVisited: true
                })

                if (this.previousScreen) {
                    this.setScreen(this.previousScreen)
                    this.previousScreen = undefined
                } else {
                    this.handService.generate()
                    this.setScreen(ScreenType.MEMORIZING)
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

    private setFirstScreen(screen: ScreenType) {
        if (screen !== ScreenType.RULES && screen !== ScreenType.MEMORIZING) {
            throw new Error()
        }

        if (screen === ScreenType.RULES) {
            this._currentScreen = ScreenType.RULES
        } else {
            this._currentScreen = ScreenType.MEMORIZING
            this.handService.generate()
        }

        this.initialized = true
    }

    private setScreen(screen: ScreenType) {
        this._currentScreen = screen
        this.clear()

        this.onChange.dispatch()
    }

    setSettings(settings: SettingsType) {
        this.settingsStorage.setSettings(settings)
    }

    getSettings(): Settings {
        return this.settingsStorage.getSettings()
    }

    get hideTiles(): boolean {
        return this.getSettings().hideTiles
    }
    get useTimer(): boolean {
        return this.getSettings().useTimer
    }
    get invertTiles(): boolean {
        return this.getSettings().invertTiles
    }

    setTimer() {
        if (this.useTimer) {
            this.clearTimer()

            if (this._currentScreen === ScreenType.MEMORIZING) {
                this._remainingTime = REMEMBER_INTERVAL
            }
            if (this._currentScreen === ScreenType.PROCESSING) {
                this._remainingTime = DROP_INTERVAL
            }

            this.onTimeChanged.dispatch()
            this.timer = setTimeout(() => this.onTimerTick(), 1000)
        }
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
        setTimeout(() => {
            if (this.handService.hasTiles) {
                this.handService.nextTile()

                this.onHandChanged.dispatch()
                this.setTimer()
            } else {
                this.setScreen(ScreenType.FAIL)
            }
        }, 200)

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