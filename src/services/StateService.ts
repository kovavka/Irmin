import {ScreenType} from "../types/ScreenType";
import {HandService} from './HandService'
import {Tile} from '../types/Tile'
import signals from 'signals';

export class StateService {
    private _currentScreen = ScreenType.RULES
    private showRules = false
    private timerTick = 0
    private timer = undefined
    private handService = new HandService()

    onChange: signals.Signal<() => {}> = new signals.Signal()

    private static _instance: StateService
    static get instance(): StateService {
        if (!this._instance) {
            this._instance = new StateService()
        }
        return this._instance
    }

    private constructor() {
        this.handService.generate()

        this.handService.nextTile()
        this.handService.dropFromHand(1)
        this.handService.nextTile()
        this.handService.dropFromHand(1)
        this.handService.nextTile()
        this.handService.dropFromHand(1)
        this.handService.nextTile()
        this.handService.dropFromHand(1)
        this.handService.nextTile()
        this.handService.dropFromHand(1)
        this.handService.nextTile()
        this.handService.dropFromHand(1)
        this.handService.nextTile()
        this.handService.dropFromHand(1)
        this.handService.nextTile()
        this.handService.dropFromHand(1)
    }

    nextScreen(screen: ScreenType) {
        this._currentScreen = ScreenType.SUCCESS
        this.onChange.dispatch()
    }

    get currentScreen(): ScreenType {
        return this._currentScreen
    }

    get hand(): Tile[] {
        return this.handService.getHand()
    }

    get discard(): Tile[] {
        return this.handService.getDiscard()
    }
}