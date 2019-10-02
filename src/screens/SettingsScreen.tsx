import * as React from 'react'
import {StateService} from '../services/StateService'
import {NewGameBtn} from '../components/NewGameBtn'
import {Switch} from '../components/Switch'
import {SettingsType} from '../types/Settings'

type SettingsScreenState = {
    defaultSettings: boolean
    useTimer: boolean
    sortTiles: boolean
    invertTiles: boolean
    hideTiles: boolean
}

export class SettingsScreen extends React.Component<any, SettingsScreenState> {
    stateService: StateService = StateService.instance

    constructor(props: any) {
        super(props)

        let settings = this.stateService.getSettings()
        this.state = {
            defaultSettings: settings.defaultSettings,
            useTimer: settings.useTimer,
            sortTiles: settings.sortTiles,
            invertTiles: settings.invertTiles,
            hideTiles: settings.hideTiles,
        }
    }

    onDefaultSettingsClick() {
        let newValue = !this.state.defaultSettings
        if (newValue) {
            let settings =  this.stateService.getDefault()
            settings.defaultSettings = newValue
            this.setState(settings)
            this.setValue(settings)
        } else {
            this.setState({
                defaultSettings: newValue
            })
        }
    }

    onUseTimerClick() {
        if (!this.state.defaultSettings) {
            let item = {
                useTimer: !this.state.useTimer
            }
            this.setState(item)
            this.setValue(item)
        }
    }

    onSortTilesClick() {
        if (!this.state.defaultSettings) {
            let item = {
                sortTiles: !this.state.sortTiles
            }
            this.setState(item)
            this.setValue(item)
        }
    }

    onInvertTilesClick() {
        if (!this.state.defaultSettings) {
            let item = {
                invertTiles: !this.state.invertTiles
            }
            this.setState(item)
            this.setValue(item)
        }
    }

    onHideTilesClick() {
        if (!this.state.defaultSettings) {
            let item = {
                hideTiles: !this.state.hideTiles
            }
            this.setState(item)
            this.setValue(item)
        }
    }

    private setValue(settings: SettingsType) {
        this.stateService.setSettings(settings)
    }

    render() {
        const {defaultSettings, useTimer, sortTiles, invertTiles, hideTiles} = this.state
        return (
            <div className='rules'>
                <div className='page-header'>
                    <div className='page-header__title'>
                        Settings
                    </div>
                </div>
                <div className='page-content settings'>
                    <div className='flex-container'>
                        <Switch
                            switched={defaultSettings}
                            onToggle={() => this.onDefaultSettingsClick()}
                        />
                        <div>Default settings</div>
                    </div>
                    <div className={'settings__options' + (defaultSettings ? ' settings__options--disabled' : '')}>
                        <div className='flex-container flex-container--margin-m'>
                            <Switch
                                switched={useTimer}
                                onToggle={() => this.onUseTimerClick()}
                            />
                            <div>Use timer</div>
                        </div>
                        <div className='flex-container flex-container--margin-m'>
                            <Switch
                                switched={sortTiles}
                                onToggle={() => this.onSortTilesClick()}
                            />
                            <div>Sort tiles</div>
                        </div>
                        <div className='flex-container flex-container--margin-m'>
                            <Switch
                                switched={invertTiles}
                                onToggle={() => this.onInvertTilesClick()}
                            />
                            <div>Invert tiles</div>
                        </div>
                        <div className='flex-container flex-container--margin-m'>
                            <Switch
                                switched={hideTiles}
                                onToggle={() => this.onHideTilesClick()}
                            />
                            <div>Hide tiles</div>
                        </div>
                    </div>
                    <div className='flex-container flex-container--end'>
                        <NewGameBtn/>
                    </div>
                </div>
            </div>
        )
    }
}