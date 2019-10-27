import * as React from "react";
import {HandVisual} from '../components/HandVisual'
import {DiscardVisual} from '../components/DiscardVisual'
import {StateService} from '../services/StateService'
import {Footer} from '../components/Footer'
import {ProcessingState} from "../types/ProcessingState";

type ProcessingScreenState = {
    hideTiles: boolean
    useTimer: boolean
    invertTiles: boolean
    canCall: boolean
    processingState: ProcessingState
    remainingTime: string
    remainingTiles: string
}

export class ProcessingScreen extends React.Component<any, ProcessingScreenState> {
    stateService: StateService = StateService.instance

    constructor(props: any) {
        super(props)

        this.state = {
            hideTiles: this.stateService.hideTiles,
            useTimer: this.stateService.useTimer,
            invertTiles: this.stateService.invertTiles,
            canCall: true,
            processingState: ProcessingState.PROCESSING,
            remainingTime: '0',
            remainingTiles: this.stateService.remainingTiles,
        }
    }

    componentDidMount(): void {
        this.stateService.onTimeChanged.add(this.onTimeChanged, this)
        this.stateService.setTimer()
        this.stateService.onProcessingStateChanged.add(this.onProcessingStateChanged, this)
        this.stateService.onHandChanged.add(this.onHandChanged, this)
    }

    componentWillUnmount(): void {
        this.stateService.onTimeChanged.remove(this.onTimeChanged, this)
        this.stateService.onProcessingStateChanged.remove(this.onProcessingStateChanged, this)
        this.stateService.onHandChanged.remove(this.onHandChanged, this)
    }

    onTimeChanged() {
        this.setState({
            remainingTime: this.stateService.remainingTimeStr,
        })
    }

    onProcessingStateChanged(processingState: ProcessingState) {
        this.setState({
            processingState: processingState
        })
    }

    onHandChanged() {
        this.setState({
            remainingTiles: this.stateService.remainingTiles,
            canCall: Number(this.stateService.remainingTiles) >= 1
        })
    }

    onTempaiClick() {
        this.stateService.chooseTempaiClicked()
    }

    onKanClick() {
        if (this.state.canCall) {
            this.stateService.chooseKanClicked()
        }
    }

    onGiveUpClick() {
        this.stateService.nextScreen()
    }

    render() {
        const {hideTiles, useTimer, invertTiles, canCall, processingState, remainingTime, remainingTiles} = this.state
        return (
            <div>
                <div className={'page-header'}>
                    <div className={'page-header__title'}>
                        {processingState === ProcessingState.PROCESSING && (
                            'Drop a tile'
                        )}
                        {processingState === ProcessingState.CHOOSE_TEMPAI && (
                            'Select tempai'
                        )}
                        {processingState === ProcessingState.CHOOSE_KAN && (
                            'Select kan'
                        )}
                    </div>
                </div>
                <div className='page-content'>
                    <div className={'flex-container' + (useTimer ? ' flex-container--between' : ' flex-container--end')}>
                        {useTimer && (
                            <div className={'timer'}>
                                {remainingTime}
                            </div>
                        )}
                        <div className={'flex-container flex-container--end flex-container--no-margin'}>
                            <div className={`flat-btn flat-btn--blue ${processingState === ProcessingState.CHOOSE_KAN ? 'flat-btn--pressed': ''} ${canCall ? '' : 'flat-btn--disabled'}`} >
                                <div className={'flat-btn__caption'} onClick={() => this.onKanClick()}>Kan!</div>
                            </div>
                            <div className={'flat-btn flat-btn--blue' + (processingState === ProcessingState.CHOOSE_TEMPAI ? ' flat-btn--pressed' : '')} >
                                <div className={'flat-btn__caption'} onClick={() => this.onTempaiClick()}>Tempai</div>
                            </div>
                        </div>
                    </div>
                    <HandVisual selectable={true} isOpenHand={false} reverse={invertTiles} hiddenTiles={hideTiles}/>
                    <div className='remaining-tiles'>x{remainingTiles}</div>
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