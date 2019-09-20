import * as React from 'react'
import {StateService} from '../services/StateService'
import {ScreenType} from '../types/ScreenType'
import {RulesScreen} from './RulesScreen'
import {MemorizingScreen} from './MemorizingScreen'
import {ProcessingScreen} from './ProcessingScreen'
import {SuccessScreen} from './SuccessScreen'
import {FailScreen} from './FailScreen'
import {AboutScreen} from './AboutScreen'
import {SettingsScreen} from './SettingsScreen'

type MainState = {
    currentScreen: ScreenType
}

export class Main extends React.Component<any, MainState> {
    stateService: StateService = StateService.instance

    constructor(props: any) {
        super(props)

        this.state = {
            currentScreen: this.stateService.currentScreen
        }
    }

    componentDidMount(): void {
        this.stateService.onChange.add(this.updateState, this)
    }

    componentWillUnmount(): void {
        this.stateService.onChange.remove(this.updateState, this)
    }

    updateState() {
        this.setState({
            currentScreen: this.stateService.currentScreen
        })
    }

    render() {
        const currentScreen = this.stateService.currentScreen
        return (
            <div className="App">
                {currentScreen === ScreenType.RULES && (
                    <RulesScreen/>
                )}
                {currentScreen === ScreenType.MEMORIZING && (
                    <MemorizingScreen/>
                )}
                {currentScreen === ScreenType.PROCESSING && (
                    <ProcessingScreen/>
                )}
                {currentScreen === ScreenType.SUCCESS && (
                    <SuccessScreen/>
                )}
                {currentScreen === ScreenType.FAIL && (
                    <FailScreen/>
                )}
                {currentScreen === ScreenType.ABOUT && (
                    <AboutScreen/>
                )}
                {currentScreen === ScreenType.SETTINGS && (
                    <SettingsScreen/>
                )}
            </div>
        )
    }
}