import {Settings, SettingsType} from '../types/Settings'

const DEFAULT_USE_TIMER_VALUE = true
const DEFAULT_INVERT_TILES_VALUE = true
const DEFAULT_HIDE_TILES_VALUE = true

export class SettingsStorage {
    // @ts-ignore
    private settings: Settings = {}

    private static _instance: SettingsStorage
    static get instance(): SettingsStorage {
        if (!this._instance) {
            this._instance = new SettingsStorage()
        }
        return this._instance
    }

    private constructor() {
        this.readSettings()
    }

    setSettings(settings: SettingsType) {
        for (let key in settings) {
            // @ts-ignore
            let value = settings[key]
            this.setItem(key, value)
        }

        this.readSettings()
    }

    getSettings(): Settings {
        return this.settings
    }

    getDefault(): Settings {
       return <Settings>{
            useTimer: DEFAULT_USE_TIMER_VALUE,
            invertTiles: DEFAULT_INVERT_TILES_VALUE,
            hideTiles: DEFAULT_HIDE_TILES_VALUE,
        }
    }

    private readSettings() {
        let hasVisited = this.getBoolValue('hasVisited', false)
        let useTimer = this.getBoolValue('useTimer', DEFAULT_USE_TIMER_VALUE)
        let invertTiles = this.getBoolValue('invertTiles', DEFAULT_INVERT_TILES_VALUE)
        let hideTiles = this.getBoolValue('hideTiles', DEFAULT_HIDE_TILES_VALUE)

        let defaultSettings = useTimer && invertTiles && hideTiles
        this.settings = <Settings>{
            hasVisited: hasVisited,
            defaultSettings: defaultSettings,
            useTimer: useTimer,
            invertTiles: invertTiles,
            hideTiles: hideTiles,
        }
    }

    private getValue(key: string) {
        return localStorage.getItem(key)
    }

    private getBoolValue(key: string, defaultValue: boolean): boolean {

        switch (this.getValue(key)) {
            case 'true':
                return true
            case 'false':
                return false
            default:
                return defaultValue
        }

    }

    private setItem(key: string, value: any) {
        return localStorage.setItem(key, value)
    }
}