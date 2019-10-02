import {Settings, SettingsType} from '../types/Settings'

const DEFAULT_USE_TIMER_VALUE = true
const DEFAULT_REMEMBER_TIME_VALUE = 60
const DEFAULT_DROP_TIME_VALUE = 20
const DEFAULT_SORT_TILES_VALUE = true
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
            rememberTime: DEFAULT_REMEMBER_TIME_VALUE,
            dropTime: DEFAULT_DROP_TIME_VALUE,
            sortTiles: DEFAULT_SORT_TILES_VALUE,
            invertTiles: DEFAULT_INVERT_TILES_VALUE,
            hideTiles: DEFAULT_HIDE_TILES_VALUE,
        }
    }

    private readSettings() {
        let hasVisited = this.getBoolValue('hasVisited', false)
        let useTimer = this.getBoolValue('useTimer', DEFAULT_USE_TIMER_VALUE)
        let rememberTime = this.getIntValue('rememberTime', DEFAULT_REMEMBER_TIME_VALUE)
        let dropTime = this.getIntValue('dropTime', DEFAULT_DROP_TIME_VALUE)
        let sortTiles = this.getBoolValue('sortTiles', DEFAULT_SORT_TILES_VALUE)
        let invertTiles = this.getBoolValue('invertTiles', DEFAULT_INVERT_TILES_VALUE)
        let hideTiles = this.getBoolValue('hideTiles', DEFAULT_HIDE_TILES_VALUE)


        let settings = <Settings>{
            useTimer: useTimer,
            rememberTime: rememberTime,
            dropTime: dropTime,
            sortTiles: sortTiles,
            invertTiles: invertTiles,
            hideTiles: hideTiles,
        }

        let defaultSettings = this.isDefault(settings)
        settings.defaultSettings = defaultSettings
        settings.hasVisited = hasVisited
        this.settings = settings
    }

    private isDefault(settings: Settings): boolean {
        let defaultSettings = this.getDefault()

        for (let key in settings) {
            // @ts-ignore
            if (defaultSettings[key] != settings[key]) {
                return false
            }
        }

        return true
    }

    private getValue(key: string): string | null {
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

    private getIntValue(key: string, defaultValue: number): number {
        let value = this.getValue(key)
        if (value === null) {
            return defaultValue
        }

        let intValue = Number.parseInt(value)
        return Number.isSafeInteger(intValue) ? intValue : defaultValue
    }

    private setItem(key: string, value: any) {
        return localStorage.setItem(key, value)
    }
}