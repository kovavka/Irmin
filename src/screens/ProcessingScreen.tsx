import * as React from "react";
import {HandVisual} from '../components/HandVisual'
import {DiscardVisual} from '../components/DiscardVisual'
import {StateService} from '../services/StateService'
import {Footer} from '../components/Footer'

type ProcessingScreenState = {
    hideTiles: boolean
    useTimer: boolean
    invertTiles: boolean
    choose: boolean
    remainingTime: string
}

export class ProcessingScreen extends React.Component<any, ProcessingScreenState> {
    stateService: StateService = StateService.instance

    constructor(props: any) {
        super(props)

        this.state = {
            hideTiles:  this.stateService.hideTiles,
            useTimer:  this.stateService.useTimer,
            invertTiles:  this.stateService.invertTiles,
            choose: false,
            remainingTime: '0',
        }
    }

    componentDidMount(): void {
        this.stateService.onTimeChanged.add(this.onTimeChanged, this)
        this.stateService.setTimer()
        this.stateService.onChooseTempaiChanged.add(this.onChooseTempaiChanged, this)
    }

    componentWillUnmount(): void {
        this.stateService.onTimeChanged.remove(this.onTimeChanged, this)
        this.stateService.onChooseTempaiChanged.remove(this.onChooseTempaiChanged, this)
    }

    onTimeChanged() {
        this.setState({
            remainingTime: this.stateService.remainingTimeStr,
        })
    }

    onChooseTempaiChanged(value: boolean) {
        this.setState({
            choose: value
        })
    }

    onTempaiClick() {
        this.stateService.chooseTempai(!this.state.choose)
    }

    onGiveUpClick() {
        this.stateService.nextScreen()
    }

    render() {
        const {hideTiles, useTimer, invertTiles, choose, remainingTime} = this.state
        return (
            <div>
                <div className={'page-header'}>
                    <div className={'page-header__title'}>
                        {!choose && (
                            'Drop a tile'
                        )}
                        {choose && (
                            'Select tempai'
                        )}
                    </div>
                </div>
                <div className={'page-content'}>
                    <div className={'flex-container' + (useTimer ? ' flex-container--between' : ' flex-container--end')}>
                        {useTimer && (
                            <div className={'timer'}>
                                {remainingTime}
                            </div>
                        )}
                        <div className={'flat-btn flat-btn--blue' + (choose ? ' flat-btn--pressed' : '')} >
                            <div className={'flat-btn__caption'} onClick={() => this.onTempaiClick()}>Tempai!</div>
                        </div>
                    </div>
                    <HandVisual selectable={true} reverse={invertTiles} hiddenTiles={hideTiles}/>
                    <DiscardVisual/>
                    <div className={'flex-container flex-container--end'}>
                        <div className={'flat-btn flat-btn--red'} >
                            <div className={'flat-btn__caption'} onClick={() => this.onGiveUpClick()}>Give up</div>
                        </div>
                    </div>
                </div>
                <Footer/>
            </div>
        )
    }
}