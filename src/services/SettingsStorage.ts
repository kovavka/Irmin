export interface Settings {
    hasVisited?: boolean
    hasTimer?: boolean
}

export class SettingsStorage {
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

    setSettings(settings: Settings) {
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
        this.settings = <Settings> {
            hasVisited: this.getBoolValue('hasVisited'),
            hasTimer: this.getBoolValue('hasTimer'),
        }
    }

    private getValue(key: string) {
        return localStorage.getItem(key)
    }

    private getBoolValue(key: string): boolean {
        return this.getValue(key) == 'true'
    }

    private setItem(key: string, value: any) {
        return localStorage.setItem(key, value)
    }

}