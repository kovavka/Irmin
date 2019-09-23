import {Settings, SettingsType} from '../types/Settings'

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

    private readSettings() {
        let hasVisited = this.getBoolValue('hasVisited', false)
        let useTimer = this.getBoolValue('useTimer', true)
        let invertTiles = this.getBoolValue('invertTiles', true)
        let hideTiles = this.getBoolValue('hideTiles', true)

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