import {ScreenType} from "../types/ScreenType";
import {HandService} from './HandService'
import {Tile} from '../types/Tile'
import signals from 'signals';

export class StateService {
    private _currentScreen = ScreenType.RULES
    private showRules: boolean = false
    private timerTick = 0
    private timer = undefined
    // private _debug: boolean = false
    private handService = new HandService()

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
                this._currentScreen = ScreenType.MEMORIZING
                break
            case ScreenType.MEMORIZING:
                this._currentScreen = ScreenType.PROCESSING
                this.handService.nextTile()
                break
            case ScreenType.PROCESSING:
                this._currentScreen = ScreenType.FAIL
                // this._currentScreen = ScreenType.SUCCESS
                break
            case ScreenType.FAIL:
                this._currentScreen = ScreenType.MEMORIZING
                break
            case ScreenType.SUCCESS:
                this._currentScreen = ScreenType.MEMORIZING
                break
        }

        this.onChange.dispatch()
        // this.onHandChanged.dispatch()
    }

    dropTile(tile: Tile) {
        this.handService.dropTile(tile)
        this.handService.nextTile()
        this.onHandChanged.dispatch()
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